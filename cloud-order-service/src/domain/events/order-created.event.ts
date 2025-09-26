import { OrderItem } from "../models/order-item.entity";

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: number,
    public readonly restaurantId: number,
    public readonly userId: number,
    public readonly items: OrderItem[],   
    public readonly status: string,
    public readonly createdAt: Date,
  ) {}
}