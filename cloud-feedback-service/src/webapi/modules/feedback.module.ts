import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FeedbackController } from '../controllers/feedback.controller';
import { FeedbackService } from '../../app/services/feedback.service';
import { FeedbackDomainService } from '../../domain/services/feedback.domain.service';
import { UpdateFeedbackHandler } from '../../app/handlers/update-feedback.handler';
import { CreateFeedbackHandler } from '../../app/handlers/create-feedback.handler';
import { OrderCompletedHandler } from 'src/app/handlers/order-completed.handler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
  ],
  controllers: [FeedbackController, OrderCompletedHandler],
  providers: [
    FeedbackService,
    FeedbackDomainService,
    UpdateFeedbackHandler,
    CreateFeedbackHandler,
  ],
})
export class FeedbackModule {}
