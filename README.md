# Profile Explorer

A full-stack app that fetches random user profiles from [randomuser.me](https://randomuser.me),
lets you browse them, and persists the ones you save to a real PostgreSQL database.

- **Backend** — Node + TypeScript + **NestJS**, TypeORM over **PostgreSQL** (run locally via Docker Compose).
- **Frontend** — **Vue 3** + Vite + TypeScript (Composition API), Pinia, Vue Router, vue-i18n (Hebrew/English + RTL).

Each app is **self-contained** — its own `package.json`, `tsconfig`, ESLint/Prettier. Install and run
them independently.

---

## Repository Layout

```
profile-explorer/
├─ backend-services/
│  └─ profiles-service/             # the NestJS API (self-contained, owns its types)
│
└─ frontend-application/
   └─ profiles-app/                 # the Vue 3 SPA (self-contained)
```

---

## Services

### 1. `profiles-service` — Backend API (NestJS)
`backend-services/profiles-service` · **http://localhost:3000**

The REST API. Fetches random profiles from randomuser.me and persists saved profiles to PostgreSQL
via TypeORM. Config (port, CORS origin, DB credentials, provider settings) is read from `.env` through
NestJS `ConfigService`. The service owns its own domain types — there is no shared types library.

Internal structure of the `profiles` domain:

```
src/profiles/
├─ profiles.controller.ts    # HTTP endpoints (routing, pipes, status codes)
├─ profiles.module.ts        # DI wiring (controller, service, DAO, providers)
├─ service/                  # business logic — ProfilesService (duplicate 409 / missing 404)
├─ dao/                      # ProfilesDao — wraps the TypeORM repository
├─ domain/                   # Profile @Entity (DB table shape)
├─ domain-model/             # ProfileModel (domain object)
├─ dto/                      # Create/Update DTOs (class-validator)
├─ enum/                     # Gender enum
└─ providers/                # random-profile provider abstraction + randomuser.me implementation
```

> **Note:** `ProfilesService` lives in its own `service/` folder — it is wired into the controller
> through NestJS dependency injection, not co-located with it.

**Endpoints**

| Method | Path | Purpose | Status |
|--------|------|---------|--------|
| `GET` | `/health` | Health check | 200 |
| `GET` | `/profiles` | List saved profiles | 200 |
| `GET` | `/profiles/random` | Fetch random profiles from randomuser.me | 200 |
| `POST` | `/profiles` | Save a profile | 201 / 409 if duplicate |
| `PUT` | `/profiles/:id` | Update a saved profile's name | 200 / 404 |
| `DELETE` | `/profiles/:id` | Delete a saved profile | 204 / 404 |

See `backend-services/profiles-service/README.md` for backend-only details.

### 2. `profiles-app` — Frontend SPA (Vue 3)
`frontend-application/profiles-app` · **http://localhost:5173**

The Vue 3 single-page app: Home, Random List, Saved Profiles, and Profile Detail screens. Uses Pinia
for state, Vue Router for navigation, axios for HTTP, and vue-i18n for runtime Hebrew/English switching
with RTL support. The API base URL comes from `VITE_API_BASE_URL`. It owns a frontend copy of the
`Profile` type that mirrors the API.

See `frontend-application/profiles-app/README.md` for frontend-only details.

### `postgres` — Database (Docker)
Postgres 16 (alpine) via `backend-services/profiles-service/docker-compose.yml` · **localhost:5432**

Local PostgreSQL instance started by the backend (`npm run db:up`). With `DB_SYNCHRONIZE=true`, TypeORM
creates the schema from the entities on boot (dev only — use migrations in production).

---

## Prerequisites

- **Node.js 20+**
- **Docker** (for the local PostgreSQL instance)

---

## Environment Variables

Both apps read from `.env` files (git-ignored). Each ships a committed `.env.example` with safe defaults —
copy it to `.env` the first time (shown in the run steps below).

**Backend** (`backend-services/profiles-service/.env`):

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

**Frontend** (`frontend-application/profiles-app/.env`):

```
VITE_API_BASE_URL=http://localhost:3000
```

- All frontend env vars must be prefixed `VITE_` and are read via `import.meta.env` — never hardcode URLs.
- The backend reads config via NestJS `ConfigService` — never `process.env` directly in providers.

---

## Running the Project

Each app is self-contained — install and run them independently, in two terminals.

```bash
# --- Backend (port 3000) ---
cd backend-services/profiles-service
cp .env.example .env          # first time only
npm install
npm run db:up                 # start PostgreSQL (Docker Compose)
npm run dev                   # watch mode → http://localhost:3000

# --- Frontend (port 5173) ---
cd frontend-application/profiles-app
cp .env.example .env          # first time only
npm install
npm run dev                   # Vite dev server → http://localhost:5173
```

Stop the database when you're done:

```bash
cd backend-services/profiles-service
npm run db:down
```

---

## Documentation

- `DECISIONS.md` — key technical decisions and trade-offs.
- `AI_USAGE.md` — disclosure of AI tooling used.
- `backend-services/profiles-service/README.md` — backend setup and API reference.
- `frontend-application/profiles-app/README.md` — frontend setup and screens.
