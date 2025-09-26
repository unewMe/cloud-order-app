import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../../app/services/payment.service';
import { PaymentDomainService } from '../../domain/services/payment.domain.service';
import { CreatePaymentHandler } from '../../app/handlers/create-payment.handler';
import { GetAllPaymentsHandler } from '../../app/handlers/get-all-payments.handler';
import { PaymentOrderCreatedEventHandler } from '../../app/handlers/payment-order-created.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentSuccessfullyEvent } from 'src/domain/events/payment-successfully.event';
import { UpdatePaymentHandler } from 'src/app/handlers/update-payment.handler';
import { NotifyEvent } from 'src/domain/events/notify.event';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
    ClientsModule.register([
      {
        name: 'PAYMENT_SUCCESSFULLY',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.CLOUDAMQP_URL || ''],
          queue: PaymentSuccessfullyEvent.name,
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
  controllers: [PaymentController, PaymentOrderCreatedEventHandler],
  providers: [
    PaymentService,
    PaymentDomainService,
    CreatePaymentHandler,
    GetAllPaymentsHandler,
    UpdatePaymentHandler,
  ],
})
export class PaymentModule {}
