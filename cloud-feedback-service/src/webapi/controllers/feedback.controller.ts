import { Controller, Patch, Body, Get, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateFeedbackDto } from '../../domain/models/update-feedback.dto';
import { UpdateFeedbackCommand } from '../../domain/commands/update-feedback.command';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Patch()
  async update(@Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.commandBus.execute(new UpdateFeedbackCommand(updateFeedbackDto));
  }
  
}
