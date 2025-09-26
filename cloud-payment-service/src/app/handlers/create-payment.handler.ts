import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../../domain/commands/create-payment.command';
import { PaymentService } from '../services/payment.service';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(private readonly paymentService: PaymentService) {}

  async execute(command: CreatePaymentCommand) {
    const { createPaymentDto } = command;
    return this.paymentService.createPayment(createPaymentDto);
  }
}
