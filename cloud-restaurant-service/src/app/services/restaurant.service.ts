// src/app/services/restaurant.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RestaurantDomainService } from '../../domain/services/restaurant.domain.service';
import { CreateRestaurantDto } from 'src/domain/models/create-restaurant.dto';
import { Restaurant } from 'src/domain/models/restaurant.entity';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger('RestaurantService');

  constructor(
    private readonly restaurantDomainService: RestaurantDomainService,
  ) {}

  async processOrder(restaurantId: number, orderId: number) {
    // Wyszukaj restaurację
    const restaurant =
      await this.restaurantDomainService.findRestaurant(restaurantId);
    if (!restaurant) {
      throw new Error(`Restaurant with id ${restaurantId} not found`);
    }
    this.logger.log(
      `Found restaurant: ${restaurant.name} for order ${orderId}`,
    );

    // Utwórz przetworzone zamówienie ze statusem "pending"
    const processedOrder =
      await this.restaurantDomainService.createProcessedOrder(
        restaurantId,
        orderId,
      );
    this.logger.log(
      `Processed order created with id ${processedOrder.id} and status: ${processedOrder.status}`,
    );

    // W kolejnym kroku (np. po pewnym czasie lub innym warunku) zaktualizuj status na "finished"
    // Dla uproszczenia wywołamy to od razu:
    const updatedOrder =
      await this.restaurantDomainService.updateProcessedOrder(
        processedOrder.id,
        'finished',
      );
    this.logger.log(
      `Processed order updated with id ${updatedOrder.id} new status: ${updatedOrder.status}`,
    );
    return updatedOrder;
  }

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    this.logger.log(
      `Creating restaurant with name: ${createRestaurantDto.name}`,
    );
    const restaurant =
      await this.restaurantDomainService.createRestaurant(createRestaurantDto);
    this.logger.log(`Restaurant created with id: ${restaurant.id}`);
    return restaurant;
  }
}
