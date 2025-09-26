import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Brak zmiennej środowiskowej PG_CONNECTION_STRING w pliku .env');
}

const migrationSql = `
-- Utworzenie schematu dla Feedback Service, jeśli jeszcze nie istnieje:
CREATE SCHEMA IF NOT EXISTS feedback_service;

-- Ustawienie uprawnień na schemacie:
GRANT USAGE ON SCHEMA feedback_service TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA feedback_service TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA feedback_service TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA feedback_service TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA feedback_service GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA feedback_service GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA feedback_service GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Utworzenie tabeli 'feedbacks' w schemacie 'feedback_service':
CREATE TABLE IF NOT EXISTS feedback_service.feedbacks (
  feedback_id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  feedback_message TEXT DEFAULT '',
  rating INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

async function runFeedbackMigrations() {
  const client = new Client({ connectionString });
  const logger = new Logger('FeedbackMigrationsLogger');
  try {
    await client.connect();
    logger.log('Connected to Supabase PostgreSQL for Feedback Service');
    await client.query(migrationSql);
    logger.log('Feedback migration executed successfully');
  } catch (err) {
    logger.error('Feedback migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runFeedbackMigrations().then(() => process.exit(0));
}

export { runFeedbackMigrations };
