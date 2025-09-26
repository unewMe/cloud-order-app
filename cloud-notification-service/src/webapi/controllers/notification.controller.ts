import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNotificationDto } from '../../domain/models/create-notification.dto';
import { CreateNotificationCommand } from '../../domain/commands/create-notification.command';
import { GetNotificationsQuery } from '../../domain/queries/get-notifications.query';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.commandBus.execute(new CreateNotificationCommand(createNotificationDto));
  }

  @Get()
  async findAll(@Query('status') status: string) {
    return this.queryBus.execute(new GetNotificationsQuery(status));
  }
}
