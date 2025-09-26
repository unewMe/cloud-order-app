# Cloud Order App — Microservices Demo

This repository contains a small microservices example system for an e-commerce order flow. It demonstrates event-driven communication between services using RabbitMQ (AMQP), Supabase (Postgres + auth/storage), and NestJS (TypeScript). The main purpose is to illustrate a modular, CQRS-friendly architecture across multiple services.

# Services included

- cloud-order-service — receives order requests and creates orders. Publishes OrderCreated events.
- cloud-payment-service — creates and updates payments in response to OrderCreated events; publishes PaymentSuccessful events when a payment succeeds.
- cloud-restaurant-service — processes orders after payment confirmation and publishes OrderCompleted events.
- cloud-notification-service — listens to Notify events and delivers messages to users (e.g., email, push, SMS adapters can be added).
- cloud-feedback-service — suggests users give feedback after order completion and stores submitted feedback.

# Architecture overview

The services communicate using an event-driven approach. Key flows (from the included DPMN diagram):

1. User submits order -> Order Service creates order and publishes OrderCreated event.
2. Payment Service listens for OrderCreated, creates a payment, and publishes PaymentSuccessful or Notify events depending on payment result.
3. Restaurant Service listens for PaymentSuccessful, processes the order, and publishes OrderCompleted and/or Notify events.
4. Notification Service listens for Notify events and delivers messages to users.
5. Feedback Service listens for OrderCompleted events, suggests feedback to users, and stores user feedback.

# Diagram

A DPMN-style flow diagram is provided in the repository as an attachment to explain the flow between services. It shows lanes for User, OrderService, PaymentService, Pool, RestaurantService, NotificationService, FeedbackService with event publications and conditional flows for payment success/failure.

[![Diagram](https://i.imgur.com/41eYm75.png)](https://i.imgur.com)

# Tech stack

- Node.js + TypeScript
- NestJS v11 (framework for services and microservice support)
- AMQP (RabbitMQ) via `amqplib` and `amqp-connection-manager` for event messaging
- Supabase client (`@supabase/supabase-js`) for interacting with Postgres / auth
- PostgreSQL (`pg` client)
- CQRS helpers via `@nestjs/cqrs`
- Jest for tests
- ESLint + Prettier for linting/formatting

# Repository layout

Each service is a separate folder with its own package.json and NestJS project layout. Typical files per service:

- `src/` — source code
- `test/` — e2e tests configuration
- `package.json` — scripts (build/start/test)
- `.env.example` — environment variable examples (per-service)

# How to run (development)

Prerequisites:

- Node.js (18+ recommended)
- pnpm or npm (pnpm is used in the monorepo — `pnpm install` recommended)
- RabbitMQ server accessible to services (default AMQP URL used via env)
- Supabase or Postgres instance (connection string via env)

Basic steps (one-off):

1. Install dependencies for each service (from repository root you can run per-service):

```bash
# example for one service
cd cloud-order-service
pnpm install
```

2. Copy `.env.example` to `.env` in each service and update credentials (Supabase URL/Key, Postgres, AMQP):

```bash
cp .env.example .env
# edit .env to match your environment
```

3. Start RabbitMQ and Postgres (or use Supabase + hosted RabbitMQ). Example using Docker (optional):

```bash
# optional: run RabbitMQ and Postgres locally
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
```

4. Start each service (in separate terminals) in dev mode:

```bash
cd cloud-order-service
pnpm start:dev

cd ../cloud-payment-service
pnpm start:dev

# ...repeat for the other services
```

Per-service quick commands

- Build: pnpm run build
- Start (dev): pnpm run start:dev
- Start (prod): pnpm run start:prod
- Test: pnpm run test

# Environment variables

Each service contains a `.env.example` file with required variables. Common env variables you should expect to set:

- PORT — HTTP port
- AMQP_URL — RabbitMQ connection string (e.g., amqp://user:pass@host:5672)
- SUPABASE_URL — Supabase project URL
- SUPABASE_KEY — Supabase API key
- DATABASE_URL or PG connection details — Postgres connection string

Example `.env.example` (services in this repository use these exact keys):

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PG_CONNECTION_STRING=postgresql://postgres:password@localhost:5432/postgres
CLOUDAMQP_URL=amqps://user:password@rabbitmq.cloudamqp.com/vhost
PORT=3000
```

Per-service quickstart notes

Each service is self-contained. From the service folder, common commands are:

- Install dependencies: `pnpm install` (or `npm install`)
- Start in development: `pnpm run start:dev`
- Build: `pnpm run build`
- Run tests: `pnpm run test`

Example (start all main services in separate terminals):

```bash
# order service
cd cloud-order-service
cp .env.example .env
pnpm install
pnpm run start:dev

# payment service
cd ../cloud-payment-service
cp .env.example .env
pnpm install
pnpm run start:dev

# restaurant service
cd ../cloud-restaurant-service
cp .env.example .env
pnpm install
pnpm run start:dev

# notification service
cd ../cloud-notification-service
cp .env.example .env
pnpm install
pnpm run start:dev

# feedback service
cd ../cloud-feedback-service
cp .env.example .env
pnpm install
pnpm run start:dev
```
