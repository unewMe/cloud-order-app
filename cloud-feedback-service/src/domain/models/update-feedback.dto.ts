export class UpdateFeedbackDto {
    readonly order_id: number;
    readonly rating: number;
    readonly feedback_message?: string;
  }
  