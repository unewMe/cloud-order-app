export class OrderCompletedEvent {
  constructor(
    public readonly restaurantId: number,
    public readonly orderId: number,
    public readonly userId: number,
  ) {}
}
