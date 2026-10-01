---
type: data-model
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/lib/technical.md, docs/modules/app/README.md]
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_branch: sdlc/20261001-2017
---

# Data Model

## Purpose

This document consolidates the data entities, storage, and cross-module
dependencies of finance-planner, synthesized from the already-generated module
documentation for `lib` ([docs/modules/lib/README.md](modules/lib/README.md),
[docs/modules/lib/technical.md](modules/lib/technical.md)) and `app`
([docs/modules/app/README.md](modules/app/README.md)). No source code or
build manifest was read directly for this node; every claim below is grounded in
those module documents. Both source module documents cite record-level data
access through a Prisma client (`@/lib/db`) but note that no `schema.prisma`
file was present in their own inputs, so the authoritative schema (column
types, nullability, constraints, migrations) could not be confirmed there
either.

[NEEDS CLARIFICATION] No `schema.prisma` or migration file is available in the
module documentation this node is synthesized from, so the entity descriptions
below reflect only the fields observed by the `lib` and `app` module docs at
their respective Prisma client call sites, not an authoritative schema.

## Key Entities

| Entity | Description |
|--------|-------------|
| User | Per `docs/modules/lib/README.md`: resolved via `prisma.user.findUnique({ where: { email } })` in `src/lib/auth.ts`; observed fields are `id`, `email`, `name`, and `password` (a bcrypt hash compared with `bcrypt.compare`). Per `docs/modules/app/README.md`: also accessed via `prisma.user` in `src/app/api/auth/register/route.ts` with fields `email`, `password` (bcrypt hash), and `name` (optional); the session shape `session.user.id` / `session.user.email` is read in `src/app/plans/page.tsx` and `src/app/plans/[planId]/page.tsx`. |
| Plan | Per `docs/modules/app/README.md`: accessed via `prisma.plan` in `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts`; observed fields are `id`, `userId`, `year`, `month`, `currency`, `title`, and an `items` relation. Not documented in the `lib` module docs. |
| PlannedItem | Per `docs/modules/app/README.md`: accessed via `prisma.plannedItem` in `src/app/api/plans/[planId]/items/route.ts` and rendered in `src/app/plans/[planId]/page.tsx`; observed fields are `id`, `planId`, `title`, `amountCents`, `categoryId` (optional), `note` (optional), and `createdAt`. Not documented in the `lib` module docs. |

[NEEDS CLARIFICATION] `docs/modules/app/README.md` itself states that exact
column types, nullability, and any `@@map`/`@@unique` directives are defined by
a Prisma schema that was not part of its own inputs, and `docs/modules/lib/README.md`
makes the equivalent statement for the `User` entity. Neither source document
could confirm whether `Plan` or `PlannedItem` carry any uniqueness constraint
(for example, on a `(userId, year, month)` combination for `Plan`).

## Data Storage

**Database:** Per `docs/modules/lib/README.md` and `docs/modules/lib/technical.md`:
PostgreSQL, accessed through a generated Prisma Client (imported from
`@/generated/prisma/client`) and the `@prisma/adapter-pg` driver adapter
(`PrismaPg`) in `src/lib/db.ts`. The connection string is read from the
`DATABASE_URL` environment variable; `src/lib/technical.md` records that
`src/lib/db.ts` throws `"DATABASE_URL is not set"` at module-load time if it is
missing.

`docs/modules/app/README.md` states that the `app` module accesses storage
exclusively through the `prisma` client imported from `@/lib/db`, and that the
underlying database engine and schema file were not part of its own inputs
(it relies on the `lib` module for that information).

| Table/Collection | Stores |
|------------------|--------|
| User (`prisma.user`) | Per `docs/modules/lib/README.md`: email, name, and hashed password used for credentials-based sign-in. Per `docs/modules/app/README.md`: account records created during registration and read for session identity. |
| Plan (`prisma.plan`) | Per `docs/modules/app/README.md`: one record per user/year/month monthly plan; created and listed in `src/app/api/plans/route.ts`, read/deleted in `src/app/api/plans/[planId]/route.ts`. |
| PlannedItem (`prisma.plannedItem`) | Per `docs/modules/app/README.md`: line items belonging to a plan, created in `src/app/api/plans/[planId]/items/route.ts` and displayed/exported in `src/app/plans/[planId]/page.tsx` and its CSV export button. |

[NEEDS CLARIFICATION] Neither `docs/modules/lib/README.md` nor
`docs/modules/lib/technical.md` lists a `schema.prisma` or migration file among
their inputs, so the complete set of tables/models (including any beyond
`user`, `plan`, and `plannedItem`) cannot be enumerated from the documentation
available to this synthesis step.

## Dependencies

| Module | Purpose |
|--------|---------|
| lib | Per `docs/modules/lib/README.md`: supplies the shared Prisma client instance (`src/lib/db.ts`) and the NextAuth credentials configuration (`src/lib/auth.ts`) that together back every data-model entity above (`User` via `auth.ts`/`db.ts`; `Plan` and `PlannedItem` indirectly via the shared `prisma` client re-exported to `app`). |
| app | Per `docs/modules/app/README.md`: every `Plan` and `PlannedItem` read/write observed above originates in `src/app/api/plans/**/route.ts`, which imports the `prisma` client via `@/lib/db`. |

[NEEDS CLARIFICATION] `docs/modules/lib/technical.md` notes that no
`package.json` was present among its own module's inputs, so the declared
versions of `next-auth`, `bcryptjs`, `@prisma/adapter-pg`, and the generated
Prisma Client package cannot be confirmed from the documentation this node was
synthesized from.
