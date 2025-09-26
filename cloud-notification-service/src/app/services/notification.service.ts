import { Injectable, Logger } from '@nestjs/common';
import { NotificationDomainService } from '../../domain/services/notification.domain.service';
import { CreateNotificationDto } from '../../domain/models/create-notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger('NotificationService');

  constructor(private readonly notificationDomainService: NotificationDomainService) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const { user_id, message } = createNotificationDto;
    this.logger.log(`Creating notification for user ${user_id} with message: "${message}"`);
    return this.notificationDomainService.createNotification(user_id, message);
  }

  async getNotificationsByStatus(status: string) {
    return this.notificationDomainService.getNotificationsByStatus(status);
  }
}
