// src/webapi/controllers/order.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from '../../domain/models/create-order.dto';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';
import { GetAllOrdersQuery } from '../../domain/queries/get-all-orders.query';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(createOrderDto));
  }

  @Get()
  async findAll() {
    return this.queryBus.execute(new GetAllOrdersQuery());
  }
}
