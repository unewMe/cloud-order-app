// src/app/services/order.service.ts
import { Injectable } from '@nestjs/common';
import { OrderDomainService } from '../../domain/services/order.domain.service';
import { CreateOrderDto } from '../../domain/models/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderDomainService: OrderDomainService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.orderDomainService.createOrder(createOrderDto);
  }

  async findAllOrders() {
    return this.orderDomainService.findAllOrders();
  }
}
