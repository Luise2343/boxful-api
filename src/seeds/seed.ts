import { connectMongo, disconnectMongo } from '../db/mongo';
import { UserModel } from '../models/user.model';
import { OrderModel } from '../models/order.model';
import { env } from '../config/env';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

async function run() {
  await connectMongo();

  // Asegurar índices
  await UserModel.init();
  await OrderModel.init();

  // Admin
  const email = env.seedAdminEmail;
  const pass = env.seedAdminPassword;
  const passwordHash = await bcrypt.hash(pass, 10);
  await UserModel.updateOne(
    { email },
    { $setOnInsert: { email, passwordHash, createdAt: new Date() } },
    { upsert: true }
  );
  console.log(`[seed] admin ready -> ${email}`);

  // Órdenes dummy (10–25)
  const count = await OrderModel.countDocuments();
  if (count === 0) {
    const n = faker.number.int({ min: 12, max: 22 });
    const statuses = ['PENDING','IN_PROGRESS','DELIVERED','CANCELLED'] as const;

    const orders = Array.from({ length: n }).map(() => {
      const pkgCount = faker.number.int({ min: 1, max: 3 });
      const pkgs = Array.from({ length: pkgCount }).map(() => ({
        description: faker.commerce.productName(),
        weight: Number(faker.number.float({ min: 0.2, max: 20, multipleOf: 0.1 }).toFixed(1)),
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
        status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })],
        packages: pkgs,
        createdAt: faker.date.recent({ days: 60 }),
      };
    });

    await OrderModel.insertMany(orders);
    console.log(`[seed] inserted ${orders.length} orders`);
  } else {
    console.log(`[seed] orders already present: ${count}`);
  }

  await disconnectMongo();
}

run().catch(async (err) => {
  console.error(err);
  await disconnectMongo();
  process.exit(1);
});
