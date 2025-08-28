import * as dotenv from 'dotenv';
dotenv.config();
  
export const env = {
  mongoUri: process.env.MONGO_URI || 'mongodb://root:root@localhost:27017/boxful?authSource=admin',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin#1234',
};
