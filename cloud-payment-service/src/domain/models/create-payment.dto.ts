export class CreatePaymentDto {
    readonly order_id: number;
    readonly restaurant_id: number;
    readonly user_id: number;
    readonly amount: number;
  }
  