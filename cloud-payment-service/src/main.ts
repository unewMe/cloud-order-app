import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runPaymentMigrations } from './migrations/migrations';
import { Transport } from '@nestjs/microservices';
import { OrderCreatedEvent } from './domain/events/order-created.event';

async function bootstrap() {

  await runPaymentMigrations();

  const app = await NestFactory.create(AppModule);

  const microserviceOptions = {
    transport: Transport.RMQ,
      options: {
        urls: [process.env.CLOUDAMQP_URL || ''],
        queue: OrderCreatedEvent.name,
        queueOptions: {
          durable: false,
        },
      },
  };
  
  app.connectMicroservice(microserviceOptions);

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
