import { UpdatePaymentDto } from '../models/update-payment.dto';

export class UpdatePaymentCommand {
  constructor(public readonly updatePaymentDto: UpdatePaymentDto) {}
}
