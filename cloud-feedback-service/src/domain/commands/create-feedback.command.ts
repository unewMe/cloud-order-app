import { CreateFeedbackDto } from "../models/create-feedback.dto";

export class CreateFeedbackCommand {
  constructor(public readonly createFeedbackDto: CreateFeedbackDto) {}
}