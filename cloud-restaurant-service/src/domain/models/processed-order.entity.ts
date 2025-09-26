// src/domain/models/processed-order.entity.ts
export class ProcessedOrder {
    constructor(
      public id: number,
      public restaurant_id: number,
      public order_id: number,
      public status: string, // 'pending' lub 'finished'
      public created_at: Date,
      public updated_at: Date,
    ) {}
  }
  