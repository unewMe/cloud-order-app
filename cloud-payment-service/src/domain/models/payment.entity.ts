export class Payment {
    constructor(
      public id: number,
      public order_id: number,
      public restaurant_id: number,
      public user_id: number,
      public amount: number,
      public status: string,
      public created_at: Date,
      public updated_at: Date,
    ) {}
  }
  