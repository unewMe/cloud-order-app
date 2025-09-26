import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../domain/commands/create-notification.command';
import { CreateNotificationDto } from '../../domain/models/create-notification.dto';
import { NotifyEvent } from 'src/domain/events/notify.event';

@Controller()
export class NotifyEventHandler {
  private readonly logger = new Logger(NotifyEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(NotifyEvent.name)
  async handleNotifyEvent(@Payload() data: any) {
    const { user_id, message } = data;
    this.logger.log(`Received NotifyEvent for user ${user_id} with message: "${message}"`);

    const createNotificationDto: CreateNotificationDto = { user_id, message };

    await this.commandBus.execute(new CreateNotificationCommand(createNotificationDto));
  }
}
