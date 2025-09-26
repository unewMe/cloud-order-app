// src/app/handlers/get-all-orders.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllOrdersQuery } from '../../domain/queries/get-all-orders.query';
import { OrderService } from '../services/order.service';

@QueryHandler(GetAllOrdersQuery)
export class GetAllOrdersHandler implements IQueryHandler<GetAllOrdersQuery> {
  constructor(private readonly orderService: OrderService) {}

  async execute(query: GetAllOrdersQuery) {
    return this.orderService.findAllOrders();
  }
}
