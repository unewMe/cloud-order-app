// src/app/handlers/process-order.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessOrderCommand } from '../../domain/commands/process-order.command';
import { RestaurantService } from '../services/restaurant.service';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCompletedEvent } from 'src/domain/events/order-completed.event';
import { NotifyEvent } from 'src/domain/events/notify.event';

@CommandHandler(ProcessOrderCommand)
export class ProcessOrderHandler
  implements ICommandHandler<ProcessOrderCommand>
{
  private readonly logger = new Logger(ProcessOrderHandler.name);
  constructor(
    private readonly restaurantService: RestaurantService,
    @Inject('ORDER_COMPLETED') private readonly eventBus: ClientProxy,
    @Inject('NOTIFY_EVENT') private readonly notifyEvent: ClientProxy,
  ) {}

  async execute(command: ProcessOrderCommand) {
    const { restaurantId, orderId, userId } = command;
    const processedOrder = await this.restaurantService.processOrder(
      restaurantId,
      orderId,
    );

    // Emit the event to the message broker
    this.eventBus.emit(
      OrderCompletedEvent.name,
      new OrderCompletedEvent(restaurantId, orderId, userId),
    );

    this.logger.log(
      `Order ${orderId} processed successfully for restaurant ${restaurantId}`,
    );

    // Notify the user about the order processing
    this.notifyEvent.emit(NotifyEvent.name, new NotifyEvent(restaurantId, `Order ${orderId} has been processed successfully.`));

    return processedOrder;
  }
}
