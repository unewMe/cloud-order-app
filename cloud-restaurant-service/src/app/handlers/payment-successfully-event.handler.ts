// src/app/handlers/payment-successfully-event.handler.ts
import { EventsHandler, IEventHandler, CommandBus } from '@nestjs/cqrs';
import { PaymentSuccessfullyEvent } from '../../domain/events/payment-successfully.event';
import { ProcessOrderCommand } from '../../domain/commands/process-order.command';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class PaymentSuccessfullyEventHandler
  implements IEventHandler<PaymentSuccessfullyEvent>
{
  private readonly logger = new Logger(PaymentSuccessfullyEventHandler.name);
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(PaymentSuccessfullyEvent.name)
  async handle(event: PaymentSuccessfullyEvent): Promise<void> {
    this.logger.log(
      `Received PaymentSuccessfullyEvent for order ${event.orderId} (restaurant ${event.restaurantId})`,
    );

    await this.commandBus.execute(
      new ProcessOrderCommand(event.restaurantId, event.orderId, event.userId),
    );
  }
}
