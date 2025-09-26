import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentDto } from '../../domain/models/create-payment.dto';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { GetAllPaymentsQuery } from '../../domain/queries/get-all-payments.query';
import { UpdatePaymentDto } from '../../domain/models/update-payment.dto';
import { UpdatePaymentCommand } from '../../domain/commands/update-payment.command';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.commandBus.execute(new CreatePaymentCommand(createPaymentDto));
  }

  @Get()
  async findAll() {
    return this.queryBus.execute(new GetAllPaymentsQuery());
  }

  @Patch('update')
  async update(@Body() updatePaymentDto: UpdatePaymentDto) {
    return this.commandBus.execute(new UpdatePaymentCommand(updatePaymentDto));
  }
}
