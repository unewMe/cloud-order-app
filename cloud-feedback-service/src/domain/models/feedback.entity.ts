export class Feedback {
    constructor(
      public feedback_id: number,
      public order_id: number,
      public user_id: number,
      public feedback_message: string,
      public rating: number | null,
      public created_at: Date,
      public updated_at: Date,
    ) {}
  }
  