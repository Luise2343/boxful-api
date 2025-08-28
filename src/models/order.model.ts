import { Schema, model } from 'mongoose';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';

const pkgSchema = new Schema({
  description: { type: String, required: true, trim: true },
  weight: { type: Number, required: true, min: 0 },
  dimensions: {
    l: { type: Number, required: true, min: 0 },
    w: { type: Number, required: true, min: 0 },
    h: { type: Number, required: true, min: 0 },
  },
}, { _id: false });

export interface IOrder {
  customerName: string;
  customerPhone: string;
  address: string;
  status: OrderStatus;
  packages: Array<{
    description: string;
    weight: number;
    dimensions: { l: number; w: number; h: number; };
  }>;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  status: { type: String, enum: ['PENDING','IN_PROGRESS','DELIVERED','CANCELLED'], default: 'PENDING' },
  packages: { type: [pkgSchema], validate: (v: unknown[]) => Array.isArray(v) && v.length > 0 },
  createdAt: { type: Date, default: () => new Date() },
});

// Índice por createdAt para listados recientes
orderSchema.index({ createdAt: -1 });

export const OrderModel = model<IOrder>('Order', orderSchema);
