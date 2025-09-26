// src/webapi/modules/order.module.ts
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../../app/services/order.service';
import { OrderDomainService } from '../../domain/services/order.domain.service';
import { CreateOrderHandler } from '../../app/handlers/create-order.handler';
import { GetAllOrdersHandler } from '../../app/handlers/get-all-orders.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { ConfigModule } from '@nestjs/config';
import { NotifyEvent } from 'src/domain/events/notify.event';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'ORDER_CREATED',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.CLOUDAMQP_URL || ''],
          queue: OrderCreatedEvent.name,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ClientsModule.register([
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
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderDomainService,
    CreateOrderHandler,
    GetAllOrdersHandler,
  ],
})
export class OrderModule {}
