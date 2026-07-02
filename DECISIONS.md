# DECISIONS.md

## 1. Single combined filter input, debounced 250 ms

**Choice:** Screens 1 and 2 share one input that matches across `firstName`, `lastName`, and `country`
at once (`useFilter.ts`), gated behind a 250 ms debounce so the `computed` does not re-run per keystroke.

**Tradeoff:** Users can't pin one axis and vary the other (e.g. lock a country, then narrow by name) —
two inputs would give that at the cost of a wider composable API. 250 ms is the lowest debounce that
stays imperceptible while cutting re-runs ~80 % on sustained typing.

**In production:** push filtering to the backend (`GET /profiles?q=…`) over a Postgres `tsvector` index,
with separate optional `name`/`country` params for programmatic clients.

## 2. PostgreSQL + TypeORM over SQLite or a JSON file

**Choice:** A real Postgres 16 instance via `docker-compose`. TypeORM maps the `Profile` entity keyed on
the `login.uuid` from randomuser.me and manages `created_at`/`updated_at`. `DB_SYNCHRONIZE=true` keeps
first-run setup to one `npm run db:up`.

**Tradeoff:** Postgres needs Docker; SQLite/JSON would run with zero tooling. `DB_SYNCHRONIZE` also alters
columns on schema change — unsafe on real data. Justified by environment parity: SQLite diverges from
Postgres on UUID collation, timestamp precision, and write locking, so local tests can miss real bugs.

**In production:** disable `DB_SYNCHRONIZE`, commit TypeORM migrations, add a `(country, first_name,
last_name)` index for server-side filtering, and target managed Postgres behind a pooler.

## 3. Domain model with invariant-enforcing setters, below the DTOs

**Choice:** `ProfileModel` uses private fields and setter guards (UUID, email, age 0–150, year 1900–present)
that throw a typed `ValidationException`. A second validation layer beneath the `class-validator` DTOs, so
an invalid model can't be constructed from any call site.

**Tradeoff:** Verbose (~130 lines) and largely redundant for pure CRUD, where the DTO already rejects bad
input; it also duplicates rules (`@IsEnum` vs `isValidEnum`). It earns its weight when a model is built from
multiple origins (HTTP, DB row, queue event) needing one canonical invariant check.

**In production:** extract predicates into a shared `ProfileValidator` imported by both the DTO decorators
and the setters, removing the duplication.

## RTL / LTR approach (Screen 3)

`useLocale` writes `dir`/`lang` to `<html>` and persists to `localStorage`; `main.ts` applies it before
mount, so there's no flash of wrong direction. Every component uses **CSS logical properties**
(`padding-inline`, `inset-inline-start`, …), so flipping `dir` mirrors the whole layout with no `.rtl`
overrides. Labels come from vue-i18n `t()` keys (`he.json`/`en.json`). Latin-origin data — email, phone,
street, and the name `<input>` — carries `dir="ltr"` plus a `.gi-input--ltr` modifier
(`direction: ltr; unicode-bidi: isolate`) so ordering and caret stay left-anchored in RTL.

## Corners cut

- **No auth** — out of scope; prod: JWT + a NestJS `AuthGuard` on mutations.
- **`DB_SYNCHRONIZE=true`** — zero-config for reviewers; prod: migrations, flag off.
- **Unsaved-profile edits patch Pinia only** — no backend record exists; prod: persist drafts to
  `sessionStorage` or show a "pending save" affordance.
- **No pagination / caching** — 10-item fetches; prod: cursor pagination + `Cache-Control`/SWR.
- **Images served from randomuser.me CDN** — prod: proxy through a controlled origin.

## Extension

**Optimistic updates with rollback** on save, delete, and update-name. The store snapshots the affected
list, applies the change immediately, awaits the API, and restores the snapshot on failure (surfaced as a
toast). Chosen over auto-retry (unsafe on destructive actions) and extra skeletons (fetches already show
them; mutations should feel instant). Next hour: attach an **undo** action to the delete toast so a profile
can be recovered within the dismissal window without a confirmation round-trip.
