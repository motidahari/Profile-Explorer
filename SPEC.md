# Project Specification — Full Stack Home Assignment (Vue + Node)

> This document captures **all** requirements from the assignment (Full Stack Action Item Test v3.2 — Vue), including both explicit and implicit requirements ("Read the spec twice. There are implicit requirements"). It serves as the guiding document for development and as the basis for `DECISIONS.md`, `AI_USAGE.md`, and `README.md`.

---

## 1. Overview (Introduction)

A small full-stack application that displays random user profiles and lets the user persist a subset of them.

| Topic | Requirement |
|-------|-------------|
| Backend | Node + TypeScript |
| Frontend | Vue 3 (Composition API preferred) |
| Time budget | ~4 hours |
| Submission | Public Git repo (preferred) or zip without `node_modules` |
| 3rd-party libraries | Any SDK/library allowed — **must be ready to defend the choice** |

Data source: **https://randomuser.me/** — fetch a list of **10 people**.

---

## 2. Evaluation Criteria (descending weight)

1. **Judgment** — the decisions I made and how I defend them in `DECISIONS.md`.
2. **Code quality** — clarity, structure, error handling, types.
3. **Working software** — it runs, all flows work end-to-end.
4. **Communication** — README, AI_USAGE.md, DECISIONS.md.
5. **Vue/Node fluency** — idiomatic use of the frameworks.

> Guiding principle: *"A polished half-built app beats a feature-complete mess."* — a smaller, polished app is preferred over a feature-complete one with bugs.

---

## 3. Frontend — Client Task (Vue 3)

- A Vue 3 app that displays random people and lets the user persist a subset of them.
- Fetch 10 people from randomuser.me.
- **State management** — my choice (Pinia recommended). **Must defend the choice.**

### Screen 0 — Home
Two buttons:
- **Fetch** → navigates to Screen 1 (Random User API).
- **History** → navigates to Screen 2 (saved users from the backend).

### Screen 1 — Random List
List view. Each row shows:
- Thumbnail
- Name (title + first + last)
- Gender
- Country
- Phone
- Email

Plus:
- **Filter by name and country** — my call how (one input / two inputs / debounced / instant). **Must document the choice** in DECISIONS.md.
- Clicking a row opens **Screen 3**.

### Screen 2 — Saved Profiles
- Identical to Screen 1, but **the data comes from the backend** (not randomuser.me).

### Screen 3 — Profile Detail
Opened from Screen 1 or Screen 2. Displays:
- Large image
- Gender
- **Editable Name field**
- Age + year of birth
- Address: street number + name, city, state
- Contact: email, phone

**Four buttons:**

| Button | When shown / behavior |
|--------|-----------------------|
| **Save** | Only when the profile came from Screen 1 (not yet in the DB). Persists to backend. |
| **Delete** | Only when the profile came from Screen 2 (already in the DB). Removes from backend. |
| **Update** | Name field is editable. If the profile is saved → update the backend. If not saved → update the in-memory list on Screen 1. |
| **Back** | Navigates back. |

> Implicit requirement: Save/Delete visibility depends on the profile's origin — the state must track the **origin/status** of the profile (came from API vs. saved in DB).

### Bidirectional Text (BiDi) requirement — Screen 3
- **Overall RTL layout**: labels ("Gender", "Name", "Address", etc.) rendered in **Hebrew**.
- **LTR data** inside the layout: email, phone, street number, and the editable Latin name field must remain **visually LTR** and behave correctly while editing.
- The decision on direction handling for `<input>` elements, form alignment, and button treatment — my call.
- The goal: **BiDi awareness**, not pixel-perfect typography.
- **Must document the approach** in DECISIONS.md.

---

## 4. Backend — Server Task (Node + TypeScript)

- Node + TypeScript.
- **Persistence layer is my choice** (SQLite / Postgres / JSON file / in-memory) — **must defend the choice**.
- **Minimum viable API surface** — no full REST maturity, auth, or RBAC required.
- **No authentication required.**
- A thin solution is fine; a sloppy one is not. Even with only 3–4 endpoints, we want to see **proper software design**.

### API endpoints (derived from the flows — minimum required)
| Endpoint | Purpose | Used by |
|----------|---------|---------|
| `GET /profiles` | Return all saved profiles | Screen 2 |
| `POST /profiles` | Save a new profile | Screen 3 (Save) |
| `PUT /profiles/:id` | Update a saved profile (name) | Screen 3 (Update) |
| `DELETE /profiles/:id` | Delete a saved profile | Screen 3 (Delete) |

> Implicit requirements: consistent error handling, correct status codes, request body validation, and shared types between client/server where possible.

---

## 5. Required Deliverables (all must be submitted)

### 5.1 Working code
- Clear separation between **Client** and **Server** (two folders or two repos).
- Each side with a `README.md` containing:
  - Prerequisites (Node version, etc.)
  - Install + run instructions
  - Environment variables

### 5.2 DECISIONS.md (max 1 page)
- **3 specific decisions** I made + the tradeoff for each (genuinely interesting decisions, not "I chose Vue 3 because the spec said so").
- Examples of the kind: filter in the store vs. local state; SQLite vs. JSON file; 200ms debounce.
- Must also include:
  - The approach to the RTL/LTR requirement on Screen 3.
  - **Corners I cut deliberately** and what I'd do in production.
  - **My extension** — what I added, why, and what I'd do next.

### 5.3 AI_USAGE.md (short)
- List of AI tools used and roughly what for. One paragraph is enough. Honest disclosure only.

### 5.4 One extension of my choice (~30 min of the budget) — **the most important part**
- After implementing the spec, add one thing not asked for that improves the product.
- Example options: optimistic updates, retry on failure, loading skeleton, accessibility pass, keyboard nav, error boundaries, tests for one critical path.
- Document in DECISIONS.md in **100 words or fewer**: what I added, why I picked it over others, and what I'd build in another hour.

---

## 6. Guidelines — including implicit requirements

1. Only a **working** application will be reviewed.
2. **Read the spec twice** — there are implicit requirements.
3. No UI design is provided on purpose — a component library or plain CSS is allowed. **Must defend the choice.**
4. Cut corners deliberately — document in DECISIONS.md with what you'd do in production.
5. A working, well-designed solution with less functionality is preferred over a sprawling one with bugs.

### Identified implicit requirements
- **Unified data model** for a profile between randomuser.me ↔ the backend (explicit field mapping).
- **Stable identifier** for each profile (from randomuser `login.uuid` or a DB-generated id) — needed for Update/Delete.
- **Duplicate prevention** on save (what happens if the same profile is saved twice).
- **Loading / Error / Empty states** on every data-fetching screen.
- **CORS** between Client and Server.
- **Routing** between the 4 screens and preserving profile origin across screens.
- Correct direction handling for the editable name field while typing (caret, alignment).

---

## 7. Submission

- Public Git repo with clear Client/Server separation, or a zip without `node_modules`.
- Root-level README with project overview and run instructions for both sides.
- Deployment to a public cloud (Vercel / Render / Fly / AWS) — **a plus, not a requirement**.

---

## 8. Proposed Tech Stack (to approve / defend)

| Layer | Proposed choice | Short rationale (expanded in DECISIONS.md) |
|-------|-----------------|--------------------------------------------|
| Frontend | Vue 3 + Vite + TypeScript + Composition API | Required by spec; Vite for fast dev |
| State | Pinia | The Vue 3 standard, easy to defend vs. Vuex |
| Routing | Vue Router | Navigation across 4 screens + passing profile origin |
| HTTP | fetch / axios | Consistent error handling |
| Styling | Plain CSS / lightweight component library | No design provided — a deliberate choice |
| Backend | Node + TypeScript + Express (or Fastify) | Minimal API surface, thin |
| Persistence | SQLite (vs. JSON file) | Tradeoff documented in DECISIONS.md |
| Types | Shared `libs/core` | Unified client/server types |

> All choices in this table are subject to "Be ready to defend your choices".

---

## 9. Repository Structure

The project uses a hybrid monorepo layout, **scoped down and adapted** to a ~4-hour budget (no over-engineering, no auth/RBAC). The following top-level layout is mandatory: `backend-services/<service>`, `frontend-application/<app>`, `libs/core`, and **npm workspaces** at the root.

```
profile-explorer/
├─ backend-services/
│  ├─ profiles-service/            # Node + TS — the API
│  │  └─ src/
│  │     ├─ profiles/
│  │     │  ├─ domain-model/       # Profile model + validation
│  │     │  ├─ dao/                # persistence access layer
│  │     │  ├─ service/            # business logic
│  │     │  ├─ dto/                # request/response DTOs
│  │     │  ├─ enum/               # error codes, etc.
│  │     │  └─ exception/          # domain errors
│  │     ├─ infrastructure/        # error filter, middleware
│  │     ├─ health/                # health check
│  │     └─ common/
│  └─ libs/core/                   # shared types/utils (incl. Profile type shared with FE)
│
├─ frontend-application/
│  └─ profiles-app/                # Vue 3 + Vite
│     └─ src/
│        ├─ features/profiles/
│        │  ├─ views/              # Screen 0/1/2/3
│        │  ├─ components/
│        │  ├─ stores/             # Pinia
│        │  ├─ services/           # randomuser + backend API
│        │  ├─ types/
│        │  └─ composables/
│        ├─ core/                  # router, config, services, types
│        ├─ shared/                # components, utils, composables
│        ├─ layouts/
│        ├─ locales/               # i18n (Hebrew labels for Screen 3)
│        └─ styles/
│
├─ package.json                    # npm workspaces (backend-services/*, frontend-application/*, libs/core)
├─ tsconfig.base.json
├─ eslint.config.mjs
├─ .prettierrc / .prettierignore
├─ .gitignore
├─ .claude/                        # agents + skills for dev tooling
├─ README.md                       # root — overview + running both sides
├─ DECISIONS.md
├─ AI_USAGE.md
└─ SPEC.md                         # this document
```

### Scope notes
- **Configs**: `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `.gitignore`, `nx.json`, and the `package.json` (workspaces) structure.
- **`.claude/`**: agents + skills, so the dev tooling works consistently here.
- **No authentication / identity service / RBAC** — not required by the spec.
- A **single** backend service (`profiles-service`).
- A **single** feature (`profiles`) in the frontend.
- `docker-compose` / `nginx` — optional only (deployment is a plus, not a requirement).

---

## 10. Development Tracking Checklist

- [ ] Screen 0 — Home with two buttons
- [ ] Screen 1 — Random List (10 people, all fields, documented name+country filter)
- [ ] Screen 2 — Saved Profiles from the backend
- [ ] Screen 3 — Profile Detail (all fields + editable name)
- [ ] Screen 3 — 4 buttons with origin-conditional behavior (Save/Delete/Update/Back)
- [ ] Screen 3 — BiDi: RTL layout + correct LTR data
- [ ] Backend — 4 endpoints + persistence + error handling + types
- [ ] CORS + unified data model + stable identifier
- [ ] Loading / Error / Empty states
- [ ] One extension implemented
- [ ] README (root + client + server)
- [ ] DECISIONS.md (3 decisions + RTL + corners + extension)
- [ ] AI_USAGE.md
- [ ] Client/Server separation + working end-to-end run
