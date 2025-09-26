import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../domain/commands/create-notification.command';
import { NotificationService } from '../services/notification.service';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(private readonly notificationService: NotificationService) {}

  async execute(command: CreateNotificationCommand) {
    const { createNotificationDto } = command;
    return this.notificationService.createNotification(createNotificationDto);
  }
}
