// src/domain/services/restaurant.domain.service.ts
import { Injectable } from '@nestjs/common';
import { Restaurant } from '../models/restaurant.entity';
import { ProcessedOrder } from '../models/processed-order.entity';
import { supabase } from '../../supabase/supabase.client';
import { CreateRestaurantDto } from '../models/create-restaurant.dto';

@Injectable()
export class RestaurantDomainService {
  private restaurantTable = 'restaurants';
  private processedOrderTable = 'processed_orders';
  private schema = 'restaurant_service';

  async findRestaurant(restaurantId: number): Promise<Restaurant> {
    const { data, error } = await supabase
      .from(`${this.restaurantTable}`)
      .select('*')
      .eq('id', restaurantId)
      .single();
    if (error || !data) {
      throw new Error(`Restaurant not found: ${error?.message}`);
    }
    return new Restaurant(
      data.id,
      data.name,
      data.address,
      data.phone,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  async createProcessedOrder(restaurantId: number, orderId: number): Promise<ProcessedOrder> {
    const { data, error } = await supabase
      .from(`${this.processedOrderTable}`)
      .upsert([{ restaurant_id: restaurantId, order_id: orderId, status: 'pending' }])
      .select();
    if (error || !data || data.length === 0) {
      throw new Error(`Error creating processed order: ${error?.message ?? 'No data returned'}`);
    }
    const record = data[0];
    return new ProcessedOrder(
      record.id,
      record.restaurant_id,
      record.order_id,
      record.status,
      new Date(record.created_at),
      new Date(record.updated_at)
    );
  }

  async updateProcessedOrder(processedOrderId: number, newStatus: string): Promise<ProcessedOrder> {
    const { data, error } = await supabase
      .from(`${this.processedOrderTable}`)
      .update({ status: newStatus })
      .eq('id', processedOrderId)
      .select();
    if (error || !data || data.length === 0) {
      throw new Error(`Error updating processed order: ${error?.message ?? 'No data returned'}`);
    }
    const record = data[0];
    return new ProcessedOrder(
      record.id,
      record.restaurant_id,
      record.order_id,
      record.status,
      new Date(record.created_at),
      new Date(record.updated_at)
    );
  }

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const { name, address, phone } = createRestaurantDto;
    const { data, error } = await supabase
      .from(`${this.restaurantTable}`)
      .upsert([{ name, address, phone }])
      .select();
  
    if (error || !data || data.length === 0) {
      throw new Error(`Error creating restaurant: ${error?.message ?? 'No data returned'}`);
    }
  
    const record = data[0];
    return new Restaurant(
      record.id,
      record.name,
      record.address,
      record.phone,
      new Date(record.created_at),
      new Date(record.updated_at)
    );
  }

}
