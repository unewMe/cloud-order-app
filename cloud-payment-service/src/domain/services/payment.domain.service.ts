import { Injectable } from '@nestjs/common';
import { Payment } from '../models/payment.entity';
import { supabase } from '../../supabase/supabase.client';
import { CreatePaymentDto } from '../models/create-payment.dto';

@Injectable()
export class PaymentDomainService {
  private table = 'payments';

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { order_id, restaurant_id, user_id, amount } = createPaymentDto;
    const { data, error } = await supabase
      .from(this.table)
      .upsert([{ order_id, restaurant_id, user_id, amount, status: 'pending' }])
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(
        `Error creating payment: ${error?.message ?? 'No data returned'}`,
      );
    }
    const record = data[0];
    return new Payment(
      record.id,
      record.order_id,
      record.restaurant_id,
      record.user_id,
      record.amount,
      record.status,
      new Date(record.created_at),
      new Date(record.updated_at),
    );
  }

  async findAllPayments(): Promise<Payment[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error || !data) {
      throw new Error(`Error fetching payments: ${error?.message}`);
    }
    return data.map(
      (record: any) =>
        new Payment(
          record.id,
          record.order_id,
          record.restaurant_id,
          record.user_id,
          record.amount,
          record.status,
          new Date(record.created_at),
          new Date(record.updated_at),
        ),
    );
  }

  async updatePayment(paymentId: number, paid: boolean): Promise<Payment> {
    const newStatus = paid ? 'paid' : 'failed';
    const { data, error } = await supabase
      .from(this.table)
      .update({ status: newStatus })
      .eq('id', paymentId)
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(
        `Error updating payment: ${error?.message ?? 'No data returned'}`,
      );
    }
    const updatedPayment = data[0];
    return new Payment(
      updatedPayment.id,
      updatedPayment.order_id,
      updatedPayment.restaurant_id,
      updatedPayment.user_id,
      updatedPayment.amount,
      updatedPayment.status,
      new Date(updatedPayment.created_at),
      new Date(updatedPayment.updated_at),
    );
  }
}
