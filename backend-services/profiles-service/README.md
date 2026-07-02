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

## API
| Method | Path | Purpose | Status |
|--------|------|---------|--------|
| GET | /health | Health check | 200 |
| GET | /profiles | List saved profiles | 200 |
| POST | /profiles | Save a profile | 201 / 409 if duplicate |
| PUT | /profiles/:id | Update name | 200 / 404 |
| DELETE | /profiles/:id | Delete a profile | 204 / 404 |
