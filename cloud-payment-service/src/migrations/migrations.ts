// src/migrations/migrate-payments.ts
import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Brak zmiennej środowiskowej PG_CONNECTION_STRING w pliku .env');
}

const migrationSql = `
-- Utworzenie schematu dla Payment Service, jeśli jeszcze nie istnieje:
CREATE SCHEMA IF NOT EXISTS payment_service;

-- Ustawienie uprawnień na schemacie:
GRANT USAGE ON SCHEMA payment_service TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA payment_service TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA payment_service TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA payment_service TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payment_service GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payment_service GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA payment_service GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Utworzenie tabeli 'payments' w schemacie 'payment_service':
CREATE TABLE IF NOT EXISTS payment_service.payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  restaurant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

async function runPaymentMigrations() {
  const client = new Client({ connectionString });
  const logger = new Logger('PaymentMigrationsLogger');
  try {
    await client.connect();
    logger.log('Connected to Supabase PostgreSQL for Payment Migrations');
    await client.query(migrationSql);
    logger.log('Payment migration executed successfully');
  } catch (err) {
    logger.error('Payment migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runPaymentMigrations().then(() => process.exit(0));
}

export { runPaymentMigrations };
