import { CommandBus } from '@nestjs/cqrs';
import { OrderCreatedEvent } from '../../domain/events/order-created.event';
import { CreatePaymentDto } from '../../domain/models/create-payment.dto';
import { EventPattern } from '@nestjs/microservices';
import { Controller, Logger } from '@nestjs/common';
import { CreatePaymentCommand } from 'src/domain/commands/create-payment.command';

@Controller()
export class PaymentOrderCreatedEventHandler {
  private readonly logger = new Logger(PaymentOrderCreatedEventHandler.name);
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @EventPattern(OrderCreatedEvent.name)
  async handle(event: OrderCreatedEvent): Promise<void> {
    // Zakładamy, że event.items to tablica obiektów { name: string, price: number }
    const totalAmount = event.items.reduce((sum, item) => sum + item.price, 0);

    this.logger.log(`PaymentOrderCreatedEventHandler: Creating payment for order ${event.orderId} with total amount ${totalAmount}`);

    //use command bus to create payment
    const createPaymentDto: CreatePaymentDto = {
      order_id: event.orderId,
      restaurant_id: event.restaurantId,
      user_id: event.userId,
      amount: totalAmount,
    };
    const payment = await this.commandBus.execute(new CreatePaymentCommand(createPaymentDto));
    this.logger.log(`Payment created: ${payment.id}`);
  }
}
