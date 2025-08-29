import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';

@Schema({ _id: false })
class Dimensions {
  @Prop({ required: true, min: 0 }) l!: number;
  @Prop({ required: true, min: 0 }) w!: number;
  @Prop({ required: true, min: 0 }) h!: number;
}
const DimensionsSchema = SchemaFactory.createForClass(Dimensions);

@Schema({ _id: false })
class Package {
  @Prop({ required: true, trim: true }) description!: string;
  @Prop({ required: true, min: 0 }) weight!: number;
  @Prop({ type: DimensionsSchema, required: true }) dimensions!: Dimensions;
}
const PackageSchema = SchemaFactory.createForClass(Package);

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Order {
  @Prop({ required: true, trim: true }) customerName!: string;
  @Prop({ required: true, trim: true }) customerPhone!: string;
  @Prop({ required: true, trim: true }) address!: string;
  @Prop({ required: true, enum: ['PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'], default: 'PENDING' })
  status!: OrderStatus;
  @Prop({ type: [PackageSchema], validate: (v: unknown[]) => Array.isArray(v) && v.length > 0 })
  packages!: Package[];
  readonly createdAt!: Date;
}
export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });
