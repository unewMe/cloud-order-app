// src/domain/events/payment-successfully.event.ts
export class PaymentSuccessfullyEvent {
    constructor(
      public readonly paymentId: number,
      public readonly orderId: number,
      public readonly restaurantId: number,
      public readonly userId: number,
      public readonly amount: number,
      public readonly updatedAt: Date,
    ) {}
  }
  