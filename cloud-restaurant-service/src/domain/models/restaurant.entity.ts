// src/domain/models/restaurant.entity.ts
export class Restaurant {
    constructor(
      public id: number,
      public name: string,
      public address: string,
      public phone: string,
      public created_at: Date,
      public updated_at: Date,
    ) {}
  }
  