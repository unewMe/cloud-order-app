// src/domain/commands/process-order.command.ts
export class ProcessOrderCommand {
    constructor(
      public readonly restaurantId: number,
      public readonly orderId: number,
      public readonly userId: number,
    ) {}
  }
  