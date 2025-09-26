// src/domain/commands/create-order.command.ts
import { CreateOrderDto } from '../models/create-order.dto';

export class CreateOrderCommand {
  constructor(public readonly createOrderDto: CreateOrderDto) {}
}
