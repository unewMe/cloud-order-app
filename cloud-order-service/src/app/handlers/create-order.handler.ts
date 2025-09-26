import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../../domain/commands/create-order.command';
import { OrderService } from '../services/order.service';
import { OrderCreatedEvent } from '../../domain/events/order-created.event';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotifyEvent } from 'src/domain/events/notify.event';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  private readonly logger = new Logger(CreateOrderHandler.name);
  constructor(
    private readonly orderService: OrderService,
    @Inject('ORDER_CREATED') private readonly eventBus: ClientProxy,
    @Inject('NOTIFY_EVENT') private readonly notifyEvent: ClientProxy,
  ) {}

  async execute(command: CreateOrderCommand) {
    const { createOrderDto } = command;
    const order = await this.orderService.createOrder(createOrderDto);

    console.log('Order created:', order);

    const event = new OrderCreatedEvent(
      order.id,
      order.restaurant_id,
      order.user_id,
      order.items,
      order.status,
      order.created_at,
    );

    this.eventBus.emit(OrderCreatedEvent.name, event);

    this.logger.log(`Published event: ${event}`);

    this.notifyEvent.emit(
      NotifyEvent.name,
      new NotifyEvent(order.user_id, 'Your order has been created'),
    );

    this.logger.log(`Published notification for user id: ${order.user_id}`);

    return order;
  }
}
