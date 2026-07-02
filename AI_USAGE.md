# AI_USAGE.md

Claude Code (Anthropic) was used as a coding assistant throughout this project. Its primary
contribution was generating boilerplate and scaffolding: the NestJS module/controller/service/DAO
skeleton, TypeORM entity and DTO shells, Vue 3 component stubs, Pinia store structure, the SCSS
design-system partials, and unit/integration test scaffolding. It also drafted this and the other
documentation files from a detailed specification.

Every architectural decision was made by the developer: the choice of PostgreSQL over SQLite, the
domain-model setter-validation pattern, the single combined filter composable, the profile-origin
routing strategy, the CSS-logical-properties BiDi approach, and the optimistic-update extension.
All generated code was reviewed, adjusted, and is owned by the developer. No AI output was
committed without being read and understood first.
