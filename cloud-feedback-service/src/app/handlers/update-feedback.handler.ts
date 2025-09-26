import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFeedbackCommand } from '../../domain/commands/update-feedback.command';
import { FeedbackService } from '../services/feedback.service';

@CommandHandler(UpdateFeedbackCommand)
export class UpdateFeedbackHandler implements ICommandHandler<UpdateFeedbackCommand> {
  constructor(private readonly feedbackService: FeedbackService) {}

  async execute(command: UpdateFeedbackCommand) {
    const { updateFeedbackDto } = command;
    return this.feedbackService.updateFeedback(updateFeedbackDto);
  }
}
