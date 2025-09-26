// src/webapi/modules/restaurant.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RestaurantController } from '../controllers/restaurant.controller';
import { RestaurantService } from '../../app/services/restaurant.service';
import { RestaurantDomainService } from '../../domain/services/restaurant.domain.service';
import { ProcessOrderHandler } from '../../app/handlers/process-order.handler';
import { PaymentSuccessfullyEventHandler } from '../../app/handlers/payment-successfully-event.handler';
import { CreateRestaurantHandler } from 'src/app/handlers/create-restaurant.handler';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderCompletedEvent } from 'src/domain/events/order-completed.event';
import { NotifyEvent } from 'src/domain/events/notify.event';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule,
    ClientsModule.register([
      {
        name: 'ORDER_COMPLETED',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.CLOUDAMQP_URL || ''],
          queue: OrderCompletedEvent.name,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'NOTIFY_EVENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.CLOUDAMQP_URL || ''],
          queue: NotifyEvent.name,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    
  ],
  controllers: [RestaurantController, PaymentSuccessfullyEventHandler],
  providers: [
    RestaurantService,
    RestaurantDomainService,
    ProcessOrderHandler,
    CreateRestaurantHandler,
  ],
})
export class RestaurantModule {}
