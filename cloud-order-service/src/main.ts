// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runMigrations } from './migrations/migrate';
import { Transport } from '@nestjs/microservices';
import { OrderCreatedEvent } from './domain/events/order-created.event';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  await runMigrations();

  const app = await NestFactory.create(AppModule);

  const logger = new Logger('AppLogger')

  // const microserviceOptions = {
  //   transport: Transport.RMQ,
  //     options: {
  //       urls: [process.env.CLOUDAMQP_URL || ''],
  //       queue: OrderCreatedEvent.name,
  //       queueOptions: {
  //         durable: false,
  //       },
  //     },
  // };
  
  // app.connectMicroservice(microserviceOptions);
  
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
  
  logger.log('Microservice is listening');
  logger.log('App is running on: http://localhost:3020');
  logger.log('Microservice is running on: amqp://localhost:5672');
}
bootstrap();
