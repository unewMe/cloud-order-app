export class Notification {
    constructor(
      public notify_id: number,
      public user_id: number,
      public message: string,
      public status: string,
      public created_at: Date,
      public updated_at: Date,
    ) {}
  }
  