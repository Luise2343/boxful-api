// src/seeds/seed.ts
import { connectMongo, disconnectMongo } from '../db/mongo';
import { UserModel } from '../models/user.model';
import { OrderModel } from '../models/order.model';
import { env } from '../config/env';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

async function ensureAdmin() {
  const email = env.seedAdminEmail;
  const pass = env.seedAdminPassword;
  const passwordHash = await bcrypt.hash(pass, 10);

  await UserModel.updateOne(
    { email: email.toLowerCase() },
    { $setOnInsert: { email: email.toLowerCase(), passwordHash, createdAt: new Date() } },
    { upsert: true }
  );

  console.log(`[seed] admin ready -> ${email}`);
}

async function seedOrders() {
  // Asegura índices para que no fallen upserts/unique
  await UserModel.init();
  await OrderModel.init();

  // Rellena department/municipality si faltan en órdenes existentes (migración rápida)
  const patched = await OrderModel.updateMany(
    { $or: [{ department: { $exists: false } }, { municipality: { $exists: false } }] },
    { $set: { department: 'San Salvador', municipality: 'San Salvador' } }
  );
  if (patched.modifiedCount) {
    console.log(`[seed] patched ${patched.modifiedCount} existing orders with department/municipality`);
  }

  const existing = await OrderModel.countDocuments();
  if (existing > 0) {
    console.log(`[seed] orders already present: ${existing}`);
    return;
  }

  const n = faker.number.int({ min: 12, max: 22 });
  const statuses = ['PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'] as const;

  const orders = Array.from({ length: n }).map(() => {
    const pkgCount = faker.number.int({ min: 1, max: 3 });
    const pkgs = Array.from({ length: pkgCount }).map(() => ({
      description: faker.commerce.productName(),
      weight: Number(
        faker.number.float({ min: 0.2, max: 20, multipleOf: 0.1 }).toFixed(1)
      ),
      dimensions: {
        l: faker.number.int({ min: 10, max: 60 }),
        w: faker.number.int({ min: 10, max: 60 }),
        h: faker.number.int({ min: 5, max: 60 }),
      },
    }));

    return {
      customerName: faker.person.fullName(),
      customerPhone: faker.phone.number(),
      address: faker.location.streetAddress(),

      // NUEVO: ubicación
      department: faker.location.state(),  // p. ej., "San Salvador"
      municipality: faker.location.city(), // p. ej., "Soyapango"

      status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })],
      packages: pkgs,
      createdAt: faker.date.recent({ days: 60 }),
    };
  });

  await OrderModel.insertMany(orders);
  console.log(`[seed] inserted ${orders.length} orders`);
}

async function run() {
  await connectMongo();

  try {
    await ensureAdmin();
    await seedOrders();
  } finally {
    await disconnectMongo();
  }
}

run().catch(async (err) => {
  console.error(err);
  try {
    await disconnectMongo();
  } catch {}
  process.exit(1);
});
