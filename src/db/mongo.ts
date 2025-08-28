import mongoose from 'mongoose';
import { env } from '../config/env';

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.mongoUri);
  console.log('[mongo] connected');
}

export async function disconnectMongo() {
  await mongoose.disconnect();
  console.log('[mongo] disconnected');
}
