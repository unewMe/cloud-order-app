import { Injectable, Logger } from '@nestjs/common';
import { FeedbackDomainService } from '../../domain/services/feedback.domain.service';
import { UpdateFeedbackDto } from '../../domain/models/update-feedback.dto';
import { CreateFeedbackDto } from 'src/domain/models/create-feedback.dto';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger('FeedbackService');

  constructor(private readonly feedbackDomainService: FeedbackDomainService) {}

  async createFeedback(createFeedbackDto: CreateFeedbackDto) {
    const { order_id, user_id } = createFeedbackDto;
    this.logger.log(`Creating feedback for order ${order_id} and user ${user_id}`);
    return this.feedbackDomainService.createFeedback(createFeedbackDto);
  }

  async updateFeedback(updateFeedbackDto: UpdateFeedbackDto) {
    this.logger.log(`Updating feedback for order ${updateFeedbackDto.order_id} with rating: ${updateFeedbackDto.rating}`);
    return this.feedbackDomainService.updateFeedback(updateFeedbackDto);
  }
}
