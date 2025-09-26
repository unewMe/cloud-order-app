import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runNotificationsMigrations } from './migrations/migrations';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { NotifyEvent } from './domain/events/notify.event';

async function bootstrap() {
  await runNotificationsMigrations();

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('AppLogger');

  const microserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.CLOUDAMQP_URL || ''],
      queue: NotifyEvent.name,
      queueOptions: {
        durable: false,
      },
    },
  };

  app.connectMicroservice(microserviceOptions);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);

  logger.log('App is running on: http://localhost:3000');
  logger.log(`Microservice is running on: ${microserviceOptions.options.urls[0]}`);
}
bootstrap();
