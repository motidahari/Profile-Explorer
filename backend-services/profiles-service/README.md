# Profiles Service (NestJS)

Backend API for Profile Explorer — **NestJS + TypeORM + PostgreSQL**.

## Prerequisites
- Node.js 20+
- Docker (for the local PostgreSQL instance)

## Install
```bash
npm install
```

## Environment
Copy `.env.example` to `.env`:
```
PORT=3000
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_USER=profiles
DB_PASSWORD=profiles
DB_NAME=profiles
DB_SYNCHRONIZE=true
RANDOMUSER_API_URL=https://randomuser.me/api
RANDOM_PROFILE_COUNT=10
```

## Database
Start PostgreSQL via Docker Compose:
```bash
npm run db:up      # docker compose up -d
npm run db:down    # stop and remove containers
```
With `DB_SYNCHRONIZE=true`, TypeORM creates the schema from the entities on boot (dev only —
use migrations in production).

## Run
```bash
npm run dev        # watch mode
npm run build      # compile
npm run start:prod
```

## Structure
The `profiles` domain is split by responsibility. `ProfilesService` lives in its own `service/`
folder and is injected into the controller via NestJS DI (not co-located with it):
```
src/profiles/
├─ profiles.controller.ts    # endpoints, pipes, status codes
├─ profiles.module.ts        # DI wiring
├─ service/                  # ProfilesService — business logic
├─ dao/                      # ProfilesDao — TypeORM repository wrapper
├─ domain/                   # Profile @Entity
├─ domain-model/             # ProfileModel
├─ dto/                      # Create/Update DTOs (class-validator)
├─ enum/                     # Gender enum
└─ providers/                # random-profile provider (randomuser.me)
```

## API
| Method | Path | Purpose | Status |
|--------|------|---------|--------|
| GET | /health | Health check | 200 |
| GET | /profiles | List saved profiles | 200 |
| GET | /profiles/random | Fetch random profiles from randomuser.me | 200 |
| POST | /profiles | Save a profile | 201 / 409 if duplicate |
| PUT | /profiles/:id | Update name | 200 / 404 |
| DELETE | /profiles/:id | Delete a profile | 204 / 404 |
