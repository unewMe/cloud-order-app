export class CreateFeedbackDto {
  readonly order_id: number;
  readonly user_id: number;
  readonly feedback_message: string;
  readonly rating: number | null;
}