import { Injectable } from '@nestjs/common';
import { PaymentDomainService } from '../../domain/services/payment.domain.service';
import { CreatePaymentDto } from '../../domain/models/create-payment.dto';
import { UpdatePaymentDto } from 'src/domain/models/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentDomainService: PaymentDomainService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return this.paymentDomainService.createPayment(createPaymentDto);
  }

  async findAllPayments() {
    return this.paymentDomainService.findAllPayments();
  }

  async updatePayment(updatePaymentDto: UpdatePaymentDto) {
    const { paymentId, paid } = updatePaymentDto;
    return this.paymentDomainService.updatePayment(paymentId, paid);
  }

}
