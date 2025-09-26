import { UpdateFeedbackDto } from '../models/update-feedback.dto';

export class UpdateFeedbackCommand {
  constructor(public readonly updateFeedbackDto: UpdateFeedbackDto) {}
}
