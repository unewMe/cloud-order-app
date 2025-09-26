import { CreatePaymentDto } from '../models/create-payment.dto';

export class CreatePaymentCommand {
  constructor(public readonly createPaymentDto: CreatePaymentDto) {}
}
