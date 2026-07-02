# DECISIONS.md

## 1. Single combined filter input with 250 ms debounce

**Choice:** Screens 1 and 2 use one `<input>` that searches across `firstName`, `lastName`, and
`country` simultaneously. The `useFilter` composable (`src/features/profiles/composables/useFilter.ts`)
gates the `computed` behind a 250 ms `setTimeout` so the filter does not re-run on every keystroke.

**Tradeoff:** Power users cannot fix one axis and change the other independently (e.g. filter by
country first, then narrow by name within that result). A query like "john ca" still matches
"John Smith, Canada" — the combined field handles the common case — but two separate inputs would
give finer control at the cost of a more complex component and composable API. 250 ms was chosen
as the lowest debounce that is imperceptible to a typing user while cutting computed re-runs by
roughly 80 % on a sustained keystroke sequence.

**In production I would:** delegate filtering to the backend via a debounced query string
(`GET /profiles?q=john+ca`), back it with a Postgres `tsvector` index over name and country, and
expose separate optional `name` and `country` params for programmatic clients.

---

## 2. PostgreSQL + TypeORM + Docker Compose over SQLite or a JSON file

**Choice:** The backend runs a real Postgres 16 instance managed by `docker-compose.yml`. TypeORM
maps the `Profile` entity with `@PrimaryColumn('uuid')` — the stable `login.uuid` from
randomuser.me — and handles `created_at` / `updated_at` automatically. `DB_SYNCHRONIZE=true`
reduces first-run setup to a single `npm run db:up`.

**Tradeoff:** Postgres requires Docker; `better-sqlite3` or a flat JSON file would work with zero
extra tooling for a demo of this size. The chosen stack also carries a migration risk: when
`DB_SYNCHRONIZE` is enabled TypeORM will attempt to alter columns on schema changes, which is
destructive on real data. The justification is environment parity — SQLite semantics diverge from
Postgres in enough edge cases (UUID primary-key collation, timestamp precision, concurrent write
locking) that local tests on SQLite can miss bugs that only appear in production.

**In production I would:** disable `DB_SYNCHRONIZE` and check TypeORM migration files into the
repo (`typeorm migration:generate` on every schema change), add a composite index on
`(country, first_name, last_name)` for the planned server-side filter query, and target a managed
Postgres service (RDS / Cloud SQL) behind a connection pool (pgBouncer or RDS Proxy).

---

## 3. Domain model with invariant-enforcing setters over DTO-only validation

**Choice:** `ProfileModel` (`src/profiles/domain-model/profile.model.ts`) uses private backing
fields and setter guards: every assignment validates its value — UUID format, email regex, age
range 0–150, year of birth 1900–present — and throws a typed `ValidationException` on failure.
This is a second, independent validation layer that sits below the `class-validator` DTOs. It
means an invalid `ProfileModel` cannot be constructed regardless of call site.

**Tradeoff:** The pattern is verbose — thirteen fields × getter + setter + backing field is
~130 lines for what is otherwise a simple data bag. For a pure CRUD service the benefit is small;
the DTO boundary already rejects bad input before `new ProfileModel(dto)` is called. The pattern
pays its weight when the model is constructed from multiple origins (HTTP body, database row,
message queue event) and you want one canonical invariant check that does not depend on where
the data entered the system. There is also a current duplication cost: `@IsEnum(Gender)` in the
DTO and `isValidEnum(value, Gender)` in the setter express the same rule in two places.

**In production I would:** keep the domain model pattern but extract validation predicates into a
shared `ProfileValidator` so both the DTO decorators and the setter guards import the same rule,
eliminating the duplication. I would also add a `toJSON()` snapshot test to guard against
accidental field omissions in the serialised response.

---

## RTL / LTR Approach (Screen 3)

The app switches between English (LTR) and Hebrew (RTL) at runtime without a page reload.

**Direction signalling:** `useLocale` writes `dir="rtl"|"ltr"` and `lang="he"|"en"` to `<html>`
on every language change and persists the choice in `localStorage`. `main.ts` reads that value
before mounting the app so the correct `dir` is already set before the first paint — no flash of
wrong-direction content.

**Layout:** Every component uses CSS logical properties exclusively (`padding-inline-start`,
`margin-inline-end`, `border-inline-start`, `inset-inline-start`). Because logical properties
resolve against the element's computed writing direction, no `.rtl` override class or media query
is needed — flipping `dir` on `<html>` is sufficient to mirror the entire layout.

**Labels:** All user-facing strings are accessed via `t('key')` from vue-i18n v9 (Composition API
mode, `legacy: false`). The locale files use nested objects (`en.json` / `he.json`) so keys are
grouped by domain: `t('profile.email')`, `t('action.save')`, etc. Both files are updated
simultaneously whenever a new key is added.

**LTR-locked data fields:** Email, phone, street address, and the editable name `<input>` carry
`dir="ltr"` inline and a `.gi-input--ltr` BEM modifier (`direction: ltr; unicode-bidi: isolate`)
so the text cursor and character ordering stay left-anchored regardless of the page direction.
This prevents Latin-alphabet content from being mirrored when the page is in RTL mode.

---

## Corners Cut

| Cut | Why | Production fix |
|-----|-----|----------------|
| No authentication | Scope is UI + persistence demo, not security | JWT (e.g. Auth0) with a NestJS `AuthGuard` on every mutation endpoint |
| `DB_SYNCHRONIZE=true` | Zero-config for reviewers | TypeORM migration files; flag disabled in staging and production |
| In-memory update for unsaved profiles | An unsaved profile has no backend record; patching Pinia is sufficient for the demo session | Persist draft edits in `sessionStorage`, or surface a "pending save" visual affordance |
| No pagination | 10 profiles per fetch; full list on `GET /profiles` | Cursor-based pagination on the backend; virtual scroll or infinite scroll on the frontend |
| Images from randomuser.me CDN | Avoids a storage service within demo scope | Proxy through an edge CDN; store `pictureUrl` pointing at a controlled origin |
| No request deduplication or stale-while-revalidate | Single-user demo with small data | HTTP `Cache-Control` headers on `GET /profiles`; SWR strategy in the Pinia store |

---

## Extension

**Optimistic updates with rollback** on the three mutating store actions (save, delete, update
name). The Pinia store snapshots the affected list, applies the change immediately, then awaits
the API call. If the call fails the snapshot is restored and the error is surfaced as a toast.
This was preferred over a retry mechanism (auto-retry on destructive actions is unsafe) and over
additional skeleton states (data fetches already show skeletons; mutations should feel instant).
Next step with another hour: attach an undo action to the delete toast so users can recover a
profile within a short dismissal window without a round-trip confirmation dialog.
