# CLAUDE.md — Profile Explorer Project Guidelines

## Project Overview

Full-stack home assignment: a Node + TypeScript backend and Vue 3 frontend that displays and persists
random user profiles from randomuser.me. The primary evaluation criterion is **judgment** — every
technical choice must be defensible.

---

## Git Workflow — Mandatory

- **Never push directly to `main`.** All work goes through feature branches and PRs.
- **One branch per task.** Before starting any task, create a branch:
  ```bash
  git checkout -b feat/<task-name>   # e.g. feat/scaffold-monorepo, feat/screen-1-random-list
  ```
- **Open a PR when the task is complete.** The user reviews and merges; Claude does not merge.
- Branch naming: `feat/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`.
- Commit messages: imperative present tense, one line (`add profile list view`, `fix CORS header`).

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Vue 3 + Vite + TypeScript + Composition API | Required; Vite for fast dev |
| State | Pinia | Vue 3 standard; defend over Vuex in DECISIONS.md |
| Routing | Vue Router | 4 screens + profile origin tracking |
| HTTP (FE) | axios | Consistent error handling, interceptors |
| Styling | **SCSS + BEM + CSS custom properties + logical properties** | Scalable, designer-grade, BiDi-ready; see Styling System below |
| i18n | **vue-i18n v9** | Runtime language switching (Hebrew / English); see i18n System below |
| Backend | Node + TypeScript + Express | Thin API surface, minimal overhead |
| Persistence | SQLite via `better-sqlite3` | Local file, no daemon, zero-config; defend in DECISIONS.md |
| Shared types | `backend-services/libs/core` | Unified Profile type between client and server |

---

## Environment Variables

Both sides use `.env` files. Never commit secrets. Always provide a `.env.example`.

### Backend — `backend-services/profiles-service/.env`
```
PORT=3000
DB_PATH=./data/profiles.db
CORS_ORIGIN=http://localhost:5173
```

### Frontend — `frontend-application/profiles-app/.env`
```
VITE_API_BASE_URL=http://localhost:3000
```

Rules:
- All frontend env vars must be prefixed `VITE_` (Vite requirement).
- Access via `import.meta.env.VITE_API_BASE_URL` — never hardcode URLs.
- Access via `process.env.PORT` on the backend.
- Both repos ship a `.env.example` with all keys filled with safe defaults.
- `.env` files are git-ignored; `.env.example` files are committed.

---

## Styling System — SCSS + BEM + Design Tokens

The UI must look **modern and polished**, as if a designer was involved. Achieve this through a
consistent design system, not ad-hoc styles.

### File structure inside `frontend-application/profiles-app/src/styles/`
```
styles/
├─ _tokens.scss        # ALL design tokens as CSS custom properties + SCSS vars
├─ _reset.scss         # minimal CSS reset (box-sizing, margin, font)
├─ _typography.scss    # font imports, heading/body scale
├─ _mixins.scss        # respond-to(), flex-center(), truncate(), etc.
├─ _animations.scss    # shared keyframes (fade-in, skeleton-pulse, slide-up)
└─ main.scss           # imports all partials (entry point, imported in main.ts)
```

### Design tokens (`_tokens.scss`)
Define every visual constant here — nothing is magic-numbered in components.
```scss
// Color palette
:root {
  --color-primary:        #6366f1;   // indigo-500
  --color-primary-hover:  #4f46e5;   // indigo-600
  --color-primary-light:  #e0e7ff;   // indigo-100
  --color-surface:        #ffffff;
  --color-surface-raised: #f8fafc;
  --color-surface-overlay:#f1f5f9;
  --color-border:         #e2e8f0;
  --color-text-primary:   #0f172a;
  --color-text-secondary: #64748b;
  --color-text-muted:     #94a3b8;
  --color-error:          #ef4444;
  --color-success:        #22c55e;

  // Spacing scale (4px base)
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  // Typography
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-xs:   12px;
  --font-size-sm:   14px;
  --font-size-base: 16px;
  --font-size-lg:   18px;
  --font-size-xl:   20px;
  --font-size-2xl:  24px;
  --font-size-3xl:  30px;
  --font-weight-normal:   400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;
  --line-height-tight:    1.25;
  --line-height-normal:   1.5;

  // Borders & Radius
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-full: 9999px;

  // Shadows
  --shadow-sm: 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,.12);

  // Transitions
  --transition-fast:   150ms ease;
  --transition-normal: 250ms ease;

  // Layout
  --container-max: 960px;
  --header-height: 64px;
}
```

### BEM naming convention
Every component's `<style lang="scss" scoped>` uses BEM:
```scss
// Block
.profile-card { ... }

// Element
.profile-card__avatar { ... }
.profile-card__name   { ... }
.profile-card__meta   { ... }

// Modifier
.profile-card--saved  { ... }
.profile-card--active { ... }
```

Rules:
- **Block** = the component name, kebab-case.
- **Element** = `__` separator.
- **Modifier** = `--` separator.
- No nesting deeper than Block > Element (never `.profile-card__meta__label`).
- Use `&__element` and `&--modifier` SCSS nesting for DRY syntax.
- Never use utility classes or inline styles — always BEM.

### Responsive breakpoints (defined in `_mixins.scss`)
```scss
$breakpoints: (
  'sm':  576px,
  'md':  768px,
  'lg':  1024px,
  'xl':  1280px,
);

@mixin respond-to($bp) {
  @media (min-width: map-get($breakpoints, $bp)) { @content; }
}
```

Usage in components:
```scss
.profile-list {
  display: grid;
  grid-template-columns: 1fr;

  @include respond-to('md') { grid-template-columns: 1fr 1fr; }
  @include respond-to('lg') { grid-template-columns: 1fr 1fr 1fr; }
}
```

The app must be **fully usable on mobile (320px) through desktop (1440px)**. Test all four screens at
`375px`, `768px`, and `1280px` viewport widths.

---

## i18n System — vue-i18n v9 + Runtime Language Switching

The app supports **Hebrew (he) and English (en)** with a language toggle visible on every screen.
Switching language flips both the UI text and the document direction (`dir` attribute on `<html>`).

### File structure inside `frontend-application/profiles-app/src/locales/`
```
locales/
├─ en.json    # English — default
└─ he.json    # Hebrew — RTL
```

### Key structure (flat namespaced keys)
```json
// en.json
{
  "nav.fetch":              "Fetch",
  "nav.history":            "History",
  "nav.back":               "Back",
  "profile.gender":         "Gender",
  "profile.name":           "Name",
  "profile.age":            "Age",
  "profile.address":        "Address",
  "profile.contact":        "Contact",
  "profile.email":          "Email",
  "profile.phone":          "Phone",
  "action.save":            "Save",
  "action.delete":          "Delete",
  "action.update":          "Update",
  "action.fetch":           "Fetch",
  "state.loading":          "Loading…",
  "state.empty":            "No profiles found",
  "state.error":            "Something went wrong",
  "state.retry":            "Retry",
  "filter.placeholder":     "Filter by name or country…"
}
```
```json
// he.json — same keys, Hebrew values
{
  "nav.fetch":              "טען",
  "nav.history":            "היסטוריה",
  "nav.back":               "חזרה",
  "profile.gender":         "מגדר",
  "profile.name":           "שם",
  "profile.age":            "גיל",
  "profile.address":        "כתובת",
  "profile.contact":        "איש קשר",
  "profile.email":          "אימייל",
  "profile.phone":          "טלפון",
  "action.save":            "שמור",
  "action.delete":          "מחק",
  "action.update":          "עדכן",
  "action.fetch":           "טען",
  "state.loading":          "טוען…",
  "state.empty":            "לא נמצאו פרופילים",
  "state.error":            "משהו השתבש",
  "state.retry":            "נסה שוב",
  "filter.placeholder":     "סינון לפי שם או מדינה…"
}
```

### Setup in `main.ts`
```ts
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import he from './locales/he.json'

const i18n = createI18n({
  legacy: false,          // Composition API mode
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, he },
})
```

### Language switching + `dir` attribute
Create a `useLocale` composable in `src/shared/composables/useLocale.ts`:
```ts
const LOCALE_KEY = 'app-locale'

export function useLocale() {
  const { locale } = useI18n()

  function setLocale(lang: 'en' | 'he') {
    locale.value = lang
    localStorage.setItem(LOCALE_KEY, lang)
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }

  return { locale, setLocale }
}
```

Initialise from storage in `main.ts` **before** mounting the app:
```ts
const savedLocale = (localStorage.getItem('app-locale') ?? 'en') as 'en' | 'he'
const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, he },
})
document.documentElement.setAttribute('dir', savedLocale === 'he' ? 'rtl' : 'ltr')
document.documentElement.setAttribute('lang', savedLocale)
```

- The language switcher is part of `AppLayout.vue` (always visible in the header).
- Switching language immediately re-renders all `t('...')` calls without a page reload.
- The selected language survives page refresh via `localStorage`.
- The `dir` attribute on `<html>` drives all CSS logical properties automatically.

### Usage in components
```vue
<script setup lang="ts">
const { t } = useI18n()
</script>
<template>
  <label>{{ t('profile.gender') }}</label>
</template>
```

---

## CSS Logical Properties — BiDi-First Layout

**Never use directional physical properties** (`margin-left`, `padding-right`, `text-align: left`,
`border-left`, `right: 0`) in any component style. Use CSS logical properties exclusively.
They automatically flip when the `dir` attribute changes.

| Physical (forbidden) | Logical (required) |
|---------------------|--------------------|
| `margin-left`       | `margin-inline-start` |
| `margin-right`      | `margin-inline-end` |
| `padding-left`      | `padding-inline-start` |
| `padding-right`     | `padding-inline-end` |
| `text-align: left`  | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `border-left`       | `border-inline-start` |
| `border-right`      | `border-inline-end` |
| `left: 0`           | `inset-inline-start: 0` |
| `right: 0`          | `inset-inline-end: 0` |
| `float: left`       | `float: inline-start` |

Physical properties that are **allowed** (direction-neutral):
- `margin-top` / `margin-bottom` → `margin-block-start` / `margin-block-end` (use logical)
- `padding-top` / `padding-bottom` → `padding-block-start` / `padding-block-end` (use logical)
- `width`, `height`, `display`, `position`, `z-index`, `opacity`, `color`, `background` — all fine.

### SCSS mixin helpers (add to `_mixins.scss`)
```scss
@mixin space-inline($start, $end: $start) {
  margin-inline-start: $start;
  margin-inline-end:   $end;
}

@mixin pad-inline($start, $end: $start) {
  padding-inline-start: $start;
  padding-inline-end:   $end;
}
```

### LTR-locked data fields (Screen 3 exception)
Fields whose **content** is always Latin/LTR (email, phone, street number, the editable name input)
must be locked regardless of page direction:
```vue
<input dir="ltr" v-model="profile.email" />
```
Apply `direction: ltr; unicode-bidi: isolate;` via a `.app-input--ltr` BEM modifier.

---

## Shared Components

Reusable, design-system-level components live in `frontend-application/profiles-app/src/shared/components/`.
They are stateless and receive everything via props. They must never import from `features/`.

### Required shared components (build these first, before any screen)

| Component | Props | Purpose |
|-----------|-------|---------|
| `AppButton.vue` | `variant: 'primary'\|'secondary'\|'danger'\|'ghost'`, `size: 'sm'\|'md'\|'lg'`, `loading: boolean`, `disabled: boolean` | Single source of truth for all buttons |
| `AppInput.vue` | `modelValue`, `label`, `placeholder`, `error`, `dir: 'ltr'\|'rtl'\|'auto'` | Text input with label + error state; `dir="ltr"` locks LTR data fields in RTL layout |
| `AppLanguageSwitcher.vue` | — | Toggle between `en` / `he`; calls `useLocale().setLocale()`; lives in `AppLayout` header |
| `AppBadge.vue` | `label`, `variant: 'neutral'\|'success'\|'error'\|'info'` | Status / gender / country pill |
| `AppAvatar.vue` | `src`, `alt`, `size: 'sm'\|'md'\|'lg'` | Circular profile image with fallback |
| `AppSpinner.vue` | `size: 'sm'\|'md'\|'lg'` | Loading indicator |
| `AppSkeleton.vue` | `width`, `height`, `variant: 'text'\|'circle'\|'rect'` | Loading skeleton |
| `AppEmptyState.vue` | `title`, `description`, `icon?` | Empty list / no results state |
| `AppErrorState.vue` | `message`, `onRetry?` | Error display with optional retry |
| `AppCard.vue` | `elevated: boolean`, `hoverable: boolean` | Surface card container |

Rules for shared components:
- All emit `update:modelValue` for two-way binding (Vue 3 pattern).
- All are typed with `defineProps<{...}>()` — no runtime `PropType` in shared components.
- Styles use BEM with the `app-` prefix (e.g. `.app-button`, `.app-button--primary`).
- Export from `src/shared/components/index.ts` barrel.

---

## Repository Structure

```
profile-explorer/
├─ backend-services/
│  ├─ profiles-service/
│  │  ├─ .env                    # git-ignored
│  │  ├─ .env.example            # committed
│  │  └─ src/
│  │     ├─ profiles/
│  │     │  ├─ domain-model/     # Profile model + validation
│  │     │  ├─ dao/              # SQLite persistence layer
│  │     │  ├─ service/          # business logic
│  │     │  ├─ dto/              # request/response DTOs
│  │     │  ├─ enum/             # error codes
│  │     │  └─ exception/        # domain errors
│  │     ├─ infrastructure/      # error middleware, CORS
│  │     ├─ health/              # GET /health
│  │     └─ common/
│  └─ libs/core/                 # shared types (Profile, CreateProfileDto, etc.)
│
├─ frontend-application/
│  └─ profiles-app/
│     ├─ .env                    # git-ignored
│     ├─ .env.example            # committed
│     └─ src/
│        ├─ features/profiles/
│        │  ├─ views/            # HomeView, RandomListView, SavedListView, ProfileDetailView
│        │  ├─ components/       # ProfileRow, ProfileCard, FilterBar (feature-specific)
│        │  ├─ stores/           # useProfilesStore (Pinia)
│        │  ├─ services/         # randomUserApi.ts, profilesApi.ts
│        │  ├─ types/            # local re-exports from libs/core
│        │  └─ composables/      # useFilter, useProfileOrigin
│        ├─ core/                # router, config, http (axios instance)
│        ├─ shared/
│        │  ├─ components/       # AppButton, AppInput, AppCard, AppAvatar… (index.ts barrel)
│        │  ├─ composables/      # useDebounce, useAsync, etc.
│        │  └─ utils/
│        ├─ layouts/             # AppLayout.vue (header + slot)
│        ├─ locales/             # en.json + he.json — all UI strings; runtime language switch
│        └─ styles/
│           ├─ _tokens.scss
│           ├─ _reset.scss
│           ├─ _typography.scss
│           ├─ _mixins.scss
│           ├─ _animations.scss
│           └─ main.scss
│
├─ package.json                  # npm workspaces
├─ tsconfig.base.json
├─ eslint.config.mjs
├─ CLAUDE.md
├─ SPEC.md
├─ DECISIONS.md
├─ AI_USAGE.md
└─ README.md
```

---

## API Surface (Backend)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Health check |
| `GET` | `/profiles` | Return all saved profiles |
| `POST` | `/profiles` | Save a new profile |
| `PUT` | `/profiles/:id` | Update a saved profile's name |
| `DELETE` | `/profiles/:id` | Delete a saved profile |

Rules: consistent error handling, correct HTTP status codes, request body validation, no auth required.

---

## Screen Checklist

- [ ] **Screen 0 — Home**: two buttons (`Fetch` → Screen 1, `History` → Screen 2)
- [ ] **Screen 1 — Random List**: 10 users from randomuser.me; thumbnail, name, gender, country, phone, email; filter by name + country; click row → Screen 3
- [ ] **Screen 2 — Saved Profiles**: identical layout to Screen 1; data from backend
- [ ] **Screen 3 — Profile Detail**: large image, gender, editable name, age + year of birth, address, contact; 4 buttons with origin-conditional logic
- [ ] **BiDi (Screen 3)**: RTL layout with Hebrew labels; LTR data for email, phone, street, name `<input dir="ltr">`
- [ ] **Backend**: 4 endpoints + SQLite + error handling + shared types
- [ ] **CORS** configured between client (`:5173`) and server (`:3000`)
- [ ] **Stable identifier**: use `login.uuid` from randomuser.me as the profile `id`
- [ ] **Duplicate prevention**: `POST /profiles` returns `409` if `id` already exists
- [ ] **Loading / Error / Empty states** on every data-fetching screen (use `AppSpinner`, `AppSkeleton`, `AppEmptyState`, `AppErrorState`)
- [ ] **Profile origin tracking**: `source: 'api' | 'db'` tracked through routing
- [ ] **Responsive**: tested at 375px, 768px, 1280px
- [ ] **One extension** implemented and documented in DECISIONS.md

---

## Implicit Requirements (Read the Spec Twice)

1. **Unified data model** — map randomuser.me response fields to the shared `Profile` type explicitly.
2. **Stable identifier** — `login.uuid` from randomuser.me; backend generates none of its own.
3. **Duplicate prevention** — `409 Conflict` on duplicate save.
4. **Profile origin** — track `source: 'api' | 'db'` through routing so Screen 3 knows which buttons to show.
5. **Update in-memory** — if a profile is not yet saved, `Update` patches the in-memory Pinia state only.
6. **CORS** — backend must allow requests from the Vite dev server origin (from `.env`).
7. **Loading / Error / Empty states** — required on Screens 1, 2, and 3.
8. **BiDi input direction** — name `<input>` on Screen 3 must have `dir="ltr"` for correct caret behavior.

---

## Deliverables Checklist

- [ ] `README.md` (root) — overview + how to run both sides
- [ ] `backend-services/profiles-service/README.md` — prerequisites, install, run, env vars
- [ ] `backend-services/profiles-service/.env.example`
- [ ] `frontend-application/profiles-app/README.md` — prerequisites, install, run, env vars
- [ ] `frontend-application/profiles-app/.env.example`
- [ ] `DECISIONS.md` — 3 real decisions + RTL approach + deliberate corners cut + extension
- [ ] `AI_USAGE.md` — honest disclosure of AI tools used
- [ ] One extension implemented (~30 min budget)

---

## Agent Selection Guide

Use the agents in `.claude/agents/` for every task. Pick by task type:

### Planning & Architecture
| Situation | Agent |
|-----------|-------|
| Designing the monorepo structure, workspace config, shared types | `backend-architect` |
| Designing frontend routing, store shape, component hierarchy | `frontend-architect` |
| Designing shared component API (props, emits, slots) | `frontend-architect` |
| Designing API contracts (request/response DTOs, status codes) | `rap-api-specialist` |
| Full technical blueprint needed before implementation | `rap-architect` |

### Backend Implementation
| Situation | Agent |
|-----------|-------|
| Scaffolding a new backend domain (model, DAO, service, DTOs, exceptions) | `backend-developer` + skill `backend-scaffolding-domains` |
| Adding route handlers and Express middleware | `backend-developer` + skill `backend-creating-service-handlers` |
| Any backend implementation task | `backend-developer` |
| Writing unit tests for backend services | `backend-qa-tester` + skill `backend-writing-unit-tests` |
| Writing integration/API tests | `backend-qa-tester` + skill `backend-writing-integration-tests` |
| Reviewing backend code for conventions | `backend-code-standards-reviewer` |

### Frontend Implementation
| Situation | Agent |
|-----------|-------|
| Building shared components (`AppButton`, `AppInput`, `AppCard`, etc.) | `frontend-developer` + skill `frontend-creating-vue-components` + skill `frontend-design` |
| Creating feature Vue components (screens, rows, cards) | `frontend-developer` + skill `frontend-creating-vue-components` |
| Building the SCSS design system (`_tokens.scss`, `_mixins.scss`) | `frontend-developer` + skill `frontend-design` |
| Creating Pinia stores | `frontend-developer` + skill `frontend-creating-pinia-stores` |
| Creating composables (`useFilter`, `useProfileOrigin`, `useDebounce`) | `frontend-developer` + skill `frontend-creating-composables` |
| Adding Hebrew i18n labels | `frontend-developer` + skill `frontend-managing-i18n-translations` |
| UI polish, responsive layout, visual design | `frontend-developer` + skill `frontend-design` |
| Any frontend implementation task | `frontend-developer` |
| Writing frontend unit tests | `frontend-qa-tester` + skill `frontend-scaffolding-unit-tests` |
| Writing Playwright page tests | `frontend-qa-tester` + skill `frontend-writing-page-tests` |
| Reviewing frontend code for conventions | `frontend-code-standards-reviewer` |

### Cross-Cutting
| Situation | Agent |
|-----------|-------|
| Performance or DB query optimization | `rap-performance-auditor` |
| Security review of an endpoint or store | `rap-security-specialist` |
| Architecture improvement across the codebase | skill `improve-codebase-architecture` |

### General Rule
- Always read the relevant conventions skill first: `backend-applying-conventions` for any backend task,
  `frontend-applying-conventions` for any frontend task.
- When building any UI, always use `frontend-design` skill to ensure the output looks polished.
- Spawn agents via the `Agent` tool — do not try to do large multi-file implementation inline.

---

## Quality Standards

- **TypeScript strict mode** everywhere — no `any`, no implicit returns.
- **No bare `catch` blocks** — all errors are typed and re-thrown as domain exceptions or HTTP responses.
- **Correct HTTP status codes**: `200`, `201`, `204`, `400`, `404`, `409`, `500`.
- **No comments explaining what code does** — only comments for non-obvious WHY.
- **All styles in SCSS + BEM** — no inline styles, no plain CSS files, no utility-class frameworks.
- **CSS logical properties only** — never `margin-left/right`, `padding-left/right`, `text-align: left/right`, `border-left/right`. Use `inline-start/end` equivalents everywhere.
- **All user-facing text via `t('key')`** — never hardcode strings in templates; add keys to both `en.json` and `he.json` simultaneously.
- **All env vars via `.env`** — no hardcoded URLs, ports, or secrets anywhere in the code.
- **Shared components** used everywhere applicable — never re-implement a button, input, or spinner.
- **No `console.log` in committed code** — use a logger utility on the backend.
- Every screen must handle loading, error, and empty states (use the shared state components).
- Every screen must be responsive and tested at mobile / tablet / desktop widths.

---

## Task Sequence (Suggested Order)

Each item below = one branch + one PR.

1. `chore/scaffold-monorepo` — `package.json` workspaces, `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc`, `.gitignore`, `.env.example` files, root `README.md`
2. `feat/shared-types` — `libs/core`: `Profile` type, `CreateProfileDto`, `UpdateProfileDto`
3. `feat/scss-design-system` — `_tokens.scss`, `_reset.scss`, `_typography.scss`, `_mixins.scss` (incl. logical property helpers), `_animations.scss`, `main.scss`; import Inter font
4. `feat/i18n-setup` — install `vue-i18n`, create `en.json` + `he.json` with all keys, wire into `main.ts` (read saved locale from `localStorage` before mount, set `dir`/`lang` on `<html>`), create `useLocale` composable (`setLocale` writes to `localStorage`), add `AppLanguageSwitcher` to `AppLayout` header
5. `feat/shared-components` — `AppButton`, `AppInput` (with `--ltr` modifier), `AppCard`, `AppAvatar`, `AppBadge`, `AppSpinner`, `AppSkeleton`, `AppEmptyState`, `AppErrorState`; barrel export; all styles use logical properties
5. `feat/backend-profiles-service` — Express app, SQLite DAO, service, all 4 endpoints, CORS (from `.env`), health check, error middleware
6. `feat/frontend-router-and-store` — Vue Router (4 routes + profile origin param), Pinia store skeleton, axios instance (base URL from `.env`)
7. `feat/screen-0-home` — `HomeView` with Fetch and History buttons using `AppButton`
8. `feat/screen-1-random-list` — randomuser.me fetch, `ProfileRow` component using shared components, `useFilter` composable, responsive grid
9. `feat/screen-2-saved-profiles` — `SavedListView` backed by `GET /profiles`, reusing `ProfileRow`
10. `feat/screen-3-profile-detail` — `ProfileDetailView` with all fields using `AppInput`/`AppButton`, 4 buttons with origin logic, responsive layout
11. `feat/screen-3-bidi` — all labels use `t('...')` keys, RTL layout via `dir` on `<html>`, `dir="ltr"` + `.app-input--ltr` on data inputs; verify logical properties flip correctly
12. `feat/extension` — chosen extension (document in DECISIONS.md)
13. `docs/decisions-and-readme` — finalize `DECISIONS.md`, `AI_USAGE.md`, all `README.md` files

---

## DECISIONS.md Template (fill as you build)

```markdown
# DECISIONS.md

## 1. [Decision title]
**Choice:** …
**Tradeoff:** …
**In production I would:** …

## 2. [Decision title]
…

## 3. [Decision title]
…

## RTL/LTR Approach (Screen 3)
…

## Corners Cut
…

## Extension
(100 words or fewer) What I added, why I picked it over alternatives, what I'd build next.
```

---

## Running the Project (Quick Reference)

```bash
# Install all workspaces
npm install

# Copy env files (first time only)
cp backend-services/profiles-service/.env.example backend-services/profiles-service/.env
cp frontend-application/profiles-app/.env.example frontend-application/profiles-app/.env

# Backend (port 3000)
cd backend-services/profiles-service && npm run dev

# Frontend (port 5173)
cd frontend-application/profiles-app && npm run dev
```
