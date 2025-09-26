import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFeedbackCommand } from '../../domain/commands/update-feedback.command';
import { FeedbackService } from '../services/feedback.service';
import { CreateFeedbackCommand } from 'src/domain/commands/create-feedback.command';

@CommandHandler(CreateFeedbackCommand)
export class CreateFeedbackHandler implements ICommandHandler<CreateFeedbackCommand> {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(command: CreateFeedbackCommand) {
    const { createFeedbackDto } = command;
    return this.feedbackService.createFeedback(createFeedbackDto);
  }
}
