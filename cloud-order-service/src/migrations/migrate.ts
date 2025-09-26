// src/migrations/migrate.ts
import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Brak zmiennej środowiskowej PG_CONNECTION_STRING w pliku .env');
}

const migrationSql = `
-- Utworzenie schematu dla Order Service, jeśli jeszcze nie istnieje:
CREATE SCHEMA IF NOT EXISTS order_service;

-- Ustawienie uprawnień na schemacie:
GRANT USAGE ON SCHEMA order_service TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA order_service TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA order_service TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA order_service TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA order_service GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA order_service GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA order_service GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Utworzenie tabeli 'orders' w schemacie 'order_service':
CREATE TABLE IF NOT EXISTS order_service.orders (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  items JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

async function runMigrations() {
  const client = new Client({ connectionString });
  const logger = new Logger('MigrationsLogger');
  try {
    await client.connect();
    logger.log('Connected to Supabase PostgreSQL');

    await client.query(migrationSql);
    logger.log('Migration executed successfully');
  } catch (err) {
    logger.error('Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runMigrations().then(() => process.exit(0));
}

export { runMigrations };
