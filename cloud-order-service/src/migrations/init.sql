-- src/migrations/init.sql

-- Utworzenie schematu dla Order Service, jeśli jeszcze nie istnieje:
CREATE SCHEMA IF NOT EXISTS order_service;

-- Utworzenie tabeli 'orders' w schemacie 'order_service':
CREATE TABLE IF NOT EXISTS order_service.orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
