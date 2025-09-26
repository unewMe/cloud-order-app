// src/domain/services/order.domain.service.ts
import { Injectable } from '@nestjs/common';
import { Order } from '../models/order.entity';
import { OrderItem } from '../models/order-item.entity';
import { supabase } from '../../supabase/supabase.client';
import { CreateOrderDto } from '../models/create-order.dto';

@Injectable()
export class OrderDomainService {
  private table = 'orders';

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { restaurantId, userId , items } = createOrderDto;
    const { data, error } = await supabase
      .from(this.table)
      .upsert({ restaurant_id: restaurantId, user_id: userId, items, status: 'created' })
      .select();

    console.log('Data:', data);

    if (error || !data || data.length === 0) {
      throw new Error(
        `Error creating order: ${error?.message ?? 'No data returned'}`,
      );
    }

    const createdOrder = data[0];

    return new Order(
      createdOrder.id,
      createdOrder.restaurant_id,
      createdOrder.user_id,
      createdOrder.items,
      createdOrder.status,
      new Date(createdOrder.created_at),
      new Date(createdOrder.updated_at),
    );
  }

  async findAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*');
    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
    return data.map(
      (order: any) =>
        new Order(
          order.id,
          order.restaurant_id,
          order.user_id,
          order.items,
          order.status,
          new Date(order.created_at),
          new Date(order.updated_at),
        ),
    );
  }
}
