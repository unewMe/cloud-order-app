// src/migrations/migrate-notifications.ts
import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Brak zmiennej środowiskowej PG_CONNECTION_STRING w pliku .env');
}

const migrationSql = `
-- Utworzenie schematu dla Notification Service, jeśli jeszcze nie istnieje:
CREATE SCHEMA IF NOT EXISTS notification_service;

-- Ustawienie uprawnień na schemacie:
GRANT USAGE ON SCHEMA notification_service TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA notification_service TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA notification_service TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA notification_service TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA notification_service GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA notification_service GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA notification_service GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Utworzenie tabeli 'notifications' w schemacie 'notification_service':
CREATE TABLE IF NOT EXISTS notification_service.notifications (
  notify_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

async function runNotificationsMigrations() {
  const client = new Client({ connectionString });
  const logger = new Logger('NotificationMigrationsLogger');
  try {
    await client.connect();
    logger.log('Connected to Supabase PostgreSQL for Notifications');
    await client.query(migrationSql);
    logger.log('Notification migration executed successfully');
  } catch (err) {
    logger.error('Notification migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runNotificationsMigrations().then(() => process.exit(0));
}

export { runNotificationsMigrations };
