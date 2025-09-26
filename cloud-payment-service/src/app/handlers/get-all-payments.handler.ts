import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPaymentsQuery } from '../../domain/queries/get-all-payments.query';
import { PaymentService } from '../services/payment.service';

@QueryHandler(GetAllPaymentsQuery)
export class GetAllPaymentsHandler implements IQueryHandler<GetAllPaymentsQuery> {
  constructor(private readonly paymentService: PaymentService) {}

  async execute(query: GetAllPaymentsQuery) {
    return this.paymentService.findAllPayments();
  }
}
