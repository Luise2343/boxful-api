import { Schema, model } from 'mongoose';

const pkgSchema = new Schema({
  description: { type: String, required: true, trim: true },
  weight: { type: Number, required: true, min: 0 },
  dimensions: {
    l: { type: Number, required: true, min: 0 },
    w: { type: Number, required: true, min: 0 },
    h: { type: Number, required: true, min: 0 },
  },
}, { _id: false });

const orderSchema = new Schema({
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },

  // NUEVO
  department: { type: String, required: true, trim: true },
  municipality: { type: String, required: true, trim: true },

  status: { type: String, enum: ['PENDING','IN_PROGRESS','DELIVERED','CANCELLED'], default: 'PENDING' },
  packages: { type: [pkgSchema], validate: (v: unknown[]) => Array.isArray(v) && v.length > 0 },
  createdAt: { type: Date, default: () => new Date() },
});
orderSchema.index({ createdAt: -1 });

export const OrderModel = model('Order', orderSchema);
