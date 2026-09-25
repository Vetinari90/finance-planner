---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:482e4fdaa7468707c90cbef94244a1e7de37a0f7c489f1a7ebf9bb45578b81f8
---

# 0003 Prisma Postgresql With Pg Adapter

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Status

[NEEDS CLARIFICATION] No input (`README.md`, or the auth/plans/planned-items/web-ui/persistence module overview docs) states whether this decision is Proposed, Accepted, Deprecated, or Superseded.

### Context

The application's `persistence` module (`src/lib/`) provides a shared, PostgreSQL-backed Prisma client used by every module that reads or writes application data. `docs/modules/persistence/overview.md` describes `src/lib/db.ts` as instantiating and caching "a single `PrismaClient` bound to PostgreSQL through a `PrismaPg` adapter, reused across Next.js hot reloads via a `globalThis` cache," and states that the module "fail[s] fast at module load if `DATABASE_URL` is not set." Both the `auth` module (user lookup and creation via `prisma.user.findUnique` / `prisma.user.create`, per `docs/modules/auth/overview.md`) and the `plans` module ("Persist data directly... all reads/writes go through the shared Prisma client (`prisma` from `@/lib/db`), owned by the persistence module," per `docs/modules/plans/overview.md`) depend on this shared client for their data access.

[NEEDS CLARIFICATION] None of the available inputs (`README.md`, or the auth/plans/planned-items/web-ui/persistence module overview docs) states the business or technical drivers behind choosing Prisma as ORM, PostgreSQL as the database engine, or the `pg`-adapter connection style specifically (e.g. serverless/edge-compatibility requirements, existing team expertise, or a comparison against alternative drivers/ORMs). `README.md` is unmodified Next.js `create-next-app` boilerplate and contains no finance-planner-specific rationale.

### Decision

Per `docs/modules/persistence/overview.md`, the project uses Prisma as its ORM, connected to PostgreSQL via a `PrismaPg` adapter:

- `src/lib/db.ts` instantiates a singleton `PrismaClient` bound to PostgreSQL through a `PrismaPg` adapter, cached on `globalThis` so the client is reused across Next.js hot reloads rather than re-instantiated on every reload.
- The module load fails fast if the `DATABASE_URL` environment variable is not set.
- The generated Prisma client is imported from `@/generated/prisma/client` (a custom generated-client output path) rather than the default `@prisma/client` package path, per `docs/modules/persistence/overview.md`'s Boundaries section.

[NEEDS CLARIFICATION] The exact adapter package name (e.g. `@prisma/adapter-pg`) and the Prisma / adapter version in use are not confirmed: no `package.json` or other build manifest was present in this synthesis node's inputs (`inputs.references` = `README.md` only), and per the dependency-grounding rule a dependency must be confirmed against a manifest, not prose, before being asserted as a version-specific fact.

### Consequences

#### Positive

- A single, shared Prisma client (`@/lib/db`) is the sole point of database access for every module that needs it - `auth` (user lookup/creation) and `plans` (plan CRUD), per their respective overview docs - centralizing the data-access layer instead of each module managing its own connection.
- Reusing the client via a `globalThis` cache (per `docs/modules/persistence/overview.md`) avoids exhausting database connections from repeated client instantiation during Next.js development hot reloads.

#### Negative

- The module load throws / fails fast when `DATABASE_URL` is not set (`docs/modules/persistence/overview.md`), meaning every environment that imports `@/lib/db` - directly or transitively - has a hard runtime dependency on that environment variable being present.
- [NEEDS CLARIFICATION] `docs/modules/persistence/overview.md` notes that the Prisma schema source (`schema.prisma`) was not available in that module's own inputs, so this decision record cannot confirm the full data model, migration strategy, or other trade-offs (e.g. connection-pooling behavior of the `pg` adapter versus Prisma's default connection style) that would normally be documented as consequences of this choice.

### Alternatives Considered

[NEEDS CLARIFICATION] No input (`README.md`, or the auth/plans/planned-items/web-ui/persistence module overview docs) documents any alternative ORM, database engine, or connection-adapter strategy that was evaluated and rejected in favor of Prisma + PostgreSQL + `PrismaPg` adapter.

### References

- [Persistence module overview](../modules/persistence/overview.md) - primary source for the Prisma/PostgreSQL/`PrismaPg`-adapter implementation described in this decision.
- [Auth module overview](../modules/auth/overview.md) - documents the `auth` module's use of the shared Prisma client for user lookup and creation.
- [Plans module overview](../modules/plans/overview.md) - documents the `plans` module's use of the shared Prisma client for plan CRUD operations.
<!-- /SLOT:content -->
