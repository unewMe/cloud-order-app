// src/migrations/migrate-restaurants.ts
import { Logger } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.PG_CONNECTION_STRING;
if (!connectionString) {
  throw new Error('Brak zmiennej środowiskowej PG_CONNECTION_STRING w pliku .env');
}

const migrationSql = `
-- Utworzenie schematu dla Restaurant Service, jeśli jeszcze nie istnieje:
CREATE SCHEMA IF NOT EXISTS restaurant_service;

-- Ustawienie uprawnień na schemacie:
GRANT USAGE ON SCHEMA restaurant_service TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA restaurant_service TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA restaurant_service TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA restaurant_service TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA restaurant_service GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA restaurant_service GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA restaurant_service GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Utworzenie tabeli 'restaurants':
CREATE TABLE IF NOT EXISTS restaurant_service.restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Utworzenie tabeli 'processed_orders' z kluczem obcym do tabeli 'restaurants':
CREATE TABLE IF NOT EXISTS restaurant_service.processed_orders (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_restaurant
    FOREIGN KEY (restaurant_id)
    REFERENCES restaurant_service.restaurants(id)
    ON DELETE CASCADE
);
`;

async function runRestaurantMigrations() {
  const client = new Client({ connectionString });
  const logger = new Logger('RestaurantMigrationsLogger');
  try {
    await client.connect();
    logger.log('Connected to Supabase PostgreSQL for Restaurant Service');
    await client.query(migrationSql);
    logger.log('Restaurant migration executed successfully');
  } catch (err) {
    logger.error('Restaurant migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  runRestaurantMigrations().then(() => process.exit(0));
}

export { runRestaurantMigrations };
