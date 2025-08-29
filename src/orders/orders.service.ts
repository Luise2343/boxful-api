import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrdersDto } from './dto/list-orders.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) {}
  create(dto: CreateOrderDto) { return this.orderModel.create(dto); }
  async list(q: ListOrdersDto) {
    const { page = 1, limit = 10, status, search } = q;
    const filter: any = {};
    if (status) filter.status = status;
    if (search?.trim()) {
      const rx = new RegExp(search.trim(), 'i');
      filter.$or = [{ customerName: rx }, { customerPhone: rx }];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.orderModel.countDocuments(filter),
    ]);
    return { items, page, limit, total, pages: Math.ceil(total / limit) };
  }
}
