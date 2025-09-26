import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePaymentCommand } from '../../domain/commands/update-payment.command';
import { PaymentService } from '../services/payment.service';
import { PaymentSuccessfullyEvent } from '../../domain/events/payment-successfully.event';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotifyEvent } from 'src/domain/events/notify.event';

@CommandHandler(UpdatePaymentCommand)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentCommand>
{
  private readonly logger = new Logger(UpdatePaymentHandler.name);
  constructor(
    private readonly paymentService: PaymentService,
    @Inject('PAYMENT_SUCCESSFULLY') private readonly eventBus: ClientProxy,
    @Inject('NOTIFY_EVENT') private readonly notifyEvent: ClientProxy,
  ) {}

  async execute(command: UpdatePaymentCommand) {
    const { updatePaymentDto } = command;
    const payment = await this.paymentService.updatePayment(updatePaymentDto);

    // Jeśli status został ustawiony na "paid", emitujemy event PaymentSuccessfullyEvent.
    if (payment.status === 'paid') {
      this.eventBus.emit(
        PaymentSuccessfullyEvent.name,
        new PaymentSuccessfullyEvent(
          payment.id,
          payment.order_id,
          payment.restaurant_id,
          payment.user_id,
          payment.amount,
          payment.updated_at,
        ),
      );
      this.logger.log(`Published event: ${PaymentSuccessfullyEvent.name}`);
      this.notifyEvent.emit(
        NotifyEvent.name,
        new NotifyEvent(
          payment.user_id,
          `Your payment with ID ${payment.id} has been successfully processed.`,
        ),
      );
      this.logger.log(`Notification sent to user: ${payment.user_id}`);
    } else if (payment.status === 'failed') {
      this.logger.log(`Payment cannot be processed: ${payment.status}`);
      this.notifyEvent.emit(
        NotifyEvent.name,
        new NotifyEvent(
          payment.user_id,
          `Your payment with ID ${payment.id} cannot be processed.`,
        ),
      );
    }

    return payment;
  }
}
