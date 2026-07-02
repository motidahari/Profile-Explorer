# Profile Explorer

A full-stack application that fetches random user profiles from [randomuser.me](https://randomuser.me),
displays them in a filterable list, and lets you save, edit, and delete profiles that are persisted
in a PostgreSQL database. The project is a monorepo with two self-contained applications: a
**NestJS + TypeORM backend** (`backend-services/profiles-service`, port 3000) and a
**Vue 3 + Vite + Pinia frontend** (`frontend-application/profiles-app`, port 5173).

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
