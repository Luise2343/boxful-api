import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const UserModel = model<IUser>('User', userSchema);
