export class PaymentCreatedEvent {
    constructor(
      public readonly paymentId: number,
      public readonly orderId: number,
      public readonly amount: number,
      public readonly status: string,
      public readonly createdAt: Date,
    ) {}
}
  