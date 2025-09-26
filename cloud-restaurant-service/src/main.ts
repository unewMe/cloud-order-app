import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { PaymentSuccessfullyEvent } from './domain/events/payment-successfully.event';
import { runRestaurantMigrations } from './migrations/migrations';

async function bootstrap() {
  
  await runRestaurantMigrations();

  const app = await NestFactory.create(AppModule);

  const microserviceOptions = {
    transport: Transport.RMQ,
      options: {
        urls: [process.env.CLOUDAMQP_URL || ''],
        queue: PaymentSuccessfullyEvent.name,
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
