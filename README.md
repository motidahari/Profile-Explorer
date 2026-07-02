# Profile Explorer

A full-stack application that fetches random user profiles from [randomuser.me](https://randomuser.me),
displays them in a filterable list, and lets you save, edit, and delete profiles that are persisted
in a PostgreSQL database. The project is a monorepo with two self-contained applications: a
**NestJS + TypeORM backend** (`backend-services/profiles-service`, port 3000) and a
**Vue 3 + Vite + Pinia frontend** (`frontend-application/profiles-app`, port 5173).

- **Backend** — Node + TypeScript + **NestJS**, TypeORM over **PostgreSQL** (run locally via Docker Compose).
- **Frontend** — **Vue 3** + Vite + TypeScript (Composition API), Pinia, Vue Router, vue-i18n (Hebrew/English + RTL).

---

## Repository Layout

```
profile-explorer/
├─ backend-services/
│  ├─ profiles-service/             # the NestJS API (self-contained, owns its types)
│  └─ libs/core/                    # shared libs (@libs/shared: BaseDao, validators, exceptions)
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

See [backend-services/profiles-service/README.md](./backend-services/profiles-service/README.md) for backend-only details.

### 2. `profiles-app` — Frontend SPA (Vue 3)
`frontend-application/profiles-app` · **http://localhost:5173**

The Vue 3 single-page app: Home, Random List, Saved Profiles, and Profile Detail screens. Uses Pinia
for state, Vue Router for navigation, axios for HTTP, and vue-i18n for runtime Hebrew/English switching
with RTL support. The API base URL comes from `VITE_API_BASE_URL`. It owns a frontend copy of the
`Profile` type that mirrors the API.

See [frontend-application/profiles-app/README.md](./frontend-application/profiles-app/README.md) for frontend-only details.

### `postgres` — Database (Docker)
Postgres 16 (alpine) via `backend-services/profiles-service/docker-compose.yml` · **localhost:5432**

Local PostgreSQL instance started by the backend (`npm run db:up`). With `DB_SYNCHRONIZE=true`, TypeORM
creates the schema from the entities on boot (dev only — use migrations in production).

---

## Prerequisites

| Tool | Minimum version | Purpose |
|------|-----------------|---------|
| Node.js | 20 | Backend and frontend runtime / toolchain |
| npm | 10 (bundled with Node 20) | Package management |
| Docker | any recent version | Runs the local PostgreSQL 16 database |

---

## Running the project

### Option A — one command from the repo root

```bash
# Install all dependencies, build shared libs, start Postgres, and run both apps
npm run dev
```

Both servers start concurrently. The backend is ready at `http://localhost:3000`; the frontend at
`http://localhost:5173`.

To stop Postgres when you are done:

```bash
npm run down
```

### Option B — run each app independently

**Backend** (port 3000)

```bash
cd backend-services/profiles-service
cp .env.example .env       # first time only
npm install
npm run db:up              # starts PostgreSQL via Docker Compose
npm run dev                # NestJS watch mode
```

**Frontend** (port 5173)

```bash
cd frontend-application/profiles-app
cp .env.example .env       # first time only
npm install
npm run dev                # Vite dev server
```

---

## Environment variables

Both apps read from `.env` files (git-ignored). Each ships a committed `.env.example` with safe defaults —
copy it to `.env` the first time (shown in the run steps above).

### Backend — `backend-services/profiles-service/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the NestJS server listens on |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin (Vite dev server) |
| `DB_HOST` | `localhost` | Postgres host |
| `DB_PORT` | `5432` | Postgres port |
| `DB_USER` | `profiles` | Postgres user |
| `DB_PASSWORD` | `profiles` | Postgres password |
| `DB_NAME` | `profiles` | Postgres database name |
| `DB_SYNCHRONIZE` | `true` | TypeORM schema sync — **disable in production** |
| `RANDOMUSER_API_URL` | `https://randomuser.me/api` | Upstream random-user provider URL |
| `RANDOM_PROFILE_COUNT` | `10` | Number of profiles returned by `GET /profiles/random` |

### Frontend — `frontend-application/profiles-app/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Base URL of the backend API |

- All frontend env vars must be prefixed `VITE_` and are read via `import.meta.env` — never hardcode URLs.
- The backend reads config via NestJS `ConfigService` — never `process.env` directly in providers.

---

## API surface

| Method | Path | Success | Error | Description |
|--------|------|---------|-------|-------------|
| `GET` | `/health` | 200 | — | Health check |
| `GET` | `/profiles` | 200 | — | Return all saved profiles, newest first |
| `GET` | `/profiles/random` | 200 | 503 | Fetch `RANDOM_PROFILE_COUNT` profiles from randomuser.me |
| `POST` | `/profiles` | 201 | 400 / 409 | Save a new profile; 409 if the id already exists |
| `PUT` | `/profiles/:id` | 200 | 400 / 404 | Update a saved profile's first/last name |
| `DELETE` | `/profiles/:id` | 204 | 404 | Delete a saved profile |

All `:id` params are validated with `ParseUUIDPipe`. Request bodies are validated with
`class-validator` via a global `ValidationPipe`.

---

## Further reading

- [DECISIONS.md](./DECISIONS.md) — architectural decisions, RTL approach, corners cut, and the optimistic-update extension
- [AI_USAGE.md](./AI_USAGE.md) — honest disclosure of AI tooling used during development
- [backend-services/profiles-service/README.md](./backend-services/profiles-service/README.md) — backend prerequisites, scripts, and API detail
- [frontend-application/profiles-app/README.md](./frontend-application/profiles-app/README.md) — frontend setup and screens
