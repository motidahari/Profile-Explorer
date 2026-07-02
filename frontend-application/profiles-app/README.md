# Profiles App (Vue 3)

Frontend for Profile Explorer — **Vue 3 + Vite + TypeScript** (Composition API), Pinia, Vue Router,
axios, and vue-i18n (Hebrew/English with runtime RTL switching).

## Prerequisites
- Node.js 20+
- A running backend (`profiles-service`) at the URL in `VITE_API_BASE_URL`.

## Install
```bash
npm install
```

## Environment
Copy `.env.example` to `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
```
All frontend env vars must be prefixed `VITE_` and are read via `import.meta.env` — never hardcode URLs.

## Run
```bash
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # type-check + production build
npm run preview    # preview the production build
```

## Test / Lint / Format
```bash
npm test           # unit (Vitest) + page (Playwright)
npm run lint
npm run format
```

## Screens
- **Home** — entry with Fetch and History actions.
- **Random List** — 10 users fetched from the backend's randomuser.me proxy; filter by name/country.
- **Saved Profiles** — profiles persisted in the backend (`GET /profiles`).
- **Profile Detail** — full profile with editable name and origin-aware actions; RTL-ready.
