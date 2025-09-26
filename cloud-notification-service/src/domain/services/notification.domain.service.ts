import { Injectable } from '@nestjs/common';
import { Notification } from '../models/notification.entity';
import { supabase } from '../../supabase/supabase.client';

@Injectable()
export class NotificationDomainService {
  private table = 'notifications';
  private schema = 'notification_service';

  async createNotification(user_id: number, message: string): Promise<Notification> {
    const { data, error } = await supabase
      .from(`${this.table}`)
      .upsert([{ user_id, message, status: 'sent' }])
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(`Error creating notification: ${error?.message ?? 'No data returned'}`);
    }
    const record = data[0];
    return new Notification(
      record.notify_id,
      record.user_id,
      record.message,
      record.status,
      new Date(record.created_at),
      new Date(record.updated_at),
    );
  }

  async getNotificationsByStatus(status: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from(`${this.table}`)
      .select('*')
      .eq('status', status);
    if (error || !data) {
      throw new Error(`Error fetching notifications: ${error?.message}`);
    }
    return data.map(
      (record: any) =>
        new Notification(
          record.notify_id,
          record.user_id,
          record.message,
          record.status,
          new Date(record.created_at),
          new Date(record.updated_at),
        ),
    );
  }
}
