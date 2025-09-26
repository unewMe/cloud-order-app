import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../../app/services/notification.service';
import { NotificationDomainService } from '../../domain/services/notification.domain.service';
import { CreateNotificationHandler } from '../../app/handlers/create-notification.handler';
import { GetNotificationsHandler } from '../../app/handlers/get-notifications.handler';
import { NotifyEventHandler } from 'src/app/handlers/notify-event.handler';

@Module({
  imports: [CqrsModule],
  controllers: [NotificationController, NotifyEventHandler],
  providers: [
    NotificationService,
    NotificationDomainService,
    CreateNotificationHandler,
    GetNotificationsHandler,
  ],
})
export class NotificationModule {}
