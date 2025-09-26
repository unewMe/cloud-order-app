import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { FeedbackService } from '../services/feedback.service';
import { OrderCompletedEvent } from 'src/domain/events/order-completed.event';
import { CreateFeedbackCommand } from 'src/domain/commands/create-feedback.command';
import { CreateFeedbackDto } from 'src/domain/models/create-feedback.dto';

@Controller()
export class OrderCompletedHandler {
  private readonly logger = new Logger(OrderCompletedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(OrderCompletedEvent.name)
  async handle(@Payload() event: OrderCompletedEvent): Promise<void> {

    this.logger.log(`Received OrderCreatedEvent for order ${event.orderId} and user ${event.userId}`);

    // Call the command bus to create feedback

    const createFeedbackDto: CreateFeedbackDto= {
        order_id: event.orderId,
        user_id: event.userId,
        feedback_message: '',
        rating: null,
    }

    await this.commandBus.execute(
      new CreateFeedbackCommand(createFeedbackDto),
    );

  }
}
