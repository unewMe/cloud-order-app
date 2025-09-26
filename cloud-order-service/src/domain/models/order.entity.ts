import { OrderItem } from "./order-item.entity";

export class Order {
  constructor(
    public id: number,
    public restaurant_id: number,
    public user_id: number, 
    public items: OrderItem[],
    public status: string = 'created',
    public created_at: Date,
    public updated_at: Date,
  ) {}
}