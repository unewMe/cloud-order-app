import { OrderItem } from './order-item.entity';

export class CreateOrderDto {
  readonly items: OrderItem[];
  readonly restaurantId: number;
  readonly userId: number;
}