import { CreateNotificationDto } from '../models/create-notification.dto';

export class CreateNotificationCommand {
  constructor(public readonly createNotificationDto: CreateNotificationDto) {}
}
