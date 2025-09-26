import { Injectable } from '@nestjs/common';
import { Feedback } from '../models/feedback.entity';
import { supabase } from '../../supabase/supabase.client';
import { UpdateFeedbackDto } from '../models/update-feedback.dto';
import { CreateFeedbackDto } from '../models/create-feedback.dto';

@Injectable()
export class FeedbackDomainService {
  private table = 'feedbacks';
  private schema = 'feedback_service';

  async createFeedback(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const { order_id, user_id, feedback_message, rating } = createFeedbackDto;
    const { data, error } = await supabase
      .from(`${this.table}`)
      .upsert([{ order_id, user_id, feedback_message, rating }])
      .select();
      
    if (error || !data || data.length === 0) {
      throw new Error(`Error creating feedback: ${error?.message ?? 'No data returned'}`);
    }
    const record = data[0];
    return new Feedback(
      record.feedback_id,
      record.order_id,
      record.user_id,
      record.feedback_message,
      record.rating,
      new Date(record.created_at),
      new Date(record.updated_at)
    );
  }

  async updateFeedback(updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const { order_id, rating, feedback_message } = updateFeedbackDto;
    const updateData: any = { rating };
    if (feedback_message !== undefined) {
      updateData.feedback_message = feedback_message;
    }
    const { data, error } = await supabase
      .from(`${this.table}`)
      .update(updateData)
      .eq('order_id', order_id)
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(`Error updating feedback: ${error?.message ?? 'No data returned'}`);
    }
    const record = data[0];
    return new Feedback(
      record.feedback_id,
      record.order_id,
      record.user_id,
      record.feedback_message,
      record.rating,
      new Date(record.created_at),
      new Date(record.updated_at)
    );
  }
}
