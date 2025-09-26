import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotificationsQuery } from '../../domain/queries/get-notifications.query';
import { NotificationService } from '../services/notification.service';

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<GetNotificationsQuery> {
  constructor(private readonly notificationService: NotificationService) {}

  async execute(query: GetNotificationsQuery) {
    return this.notificationService.getNotificationsByStatus(query.status);
  }
}
