import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { runFeedbackMigrations } from './migrations/migrations';
import { OrderCompletedEvent } from './domain/events/order-completed.event';

async function bootstrap() {
  
  await runFeedbackMigrations();

  const app = await NestFactory.create(AppModule);

  const microserviceOptions = {
    transport: Transport.RMQ,
      options: {
        urls: [process.env.CLOUDAMQP_URL || ''],
        queue: OrderCompletedEvent.name,
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
