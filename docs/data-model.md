---
type: data-model
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/lib/technical.md, docs/modules/app/README.md, docs/decisions/0001-prisma-driver-adapter-postgresql.md, docs/decisions/0003-store-money-as-integer-cents.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Module: Data Model

## Purpose

This document consolidates the data entities inferred from Prisma query call sites across the app module, since no `schema.prisma` file was present in inputs.code.

## Key Entities

| Entity | Description |
|--------|-------------|
| User | `id`, `email`, `password` (bcrypt hash), `name` (optional) - inferred from `prisma.user.create`/`findUnique` calls in `src/app/api/auth/register/route.ts` and `src/lib/auth.ts`. |
| Plan | `id`, `userId`, `year`, `month`, `currency`, `title` - inferred from `prisma.plan.create`/`findFirst`/`findMany` calls in `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts`. A unique constraint on `(userId, year, month)` is implied by the 409 conflict handling in `src/app/api/plans/route.ts`, but the constraint itself could not be confirmed without `schema.prisma`. |
| PlannedItem | `id`, `planId`, `title`, `amountCents` (integer), `categoryId` (optional), `note` (optional), `createdAt` - inferred from `prisma.plannedItem.create` in `src/app/api/plans/[planId]/items/route.ts` and the `orderBy: { createdAt: "asc" }` read in `src/app/api/plans/[planId]/route.ts`. |

## Data Storage

**Database:** PostgreSQL, accessed through Prisma with the `PrismaPg` driver adapter (`@prisma/adapter-pg`), configured from `DATABASE_URL` (`src/lib/db.ts`; see `docs/decisions/0001-prisma-driver-adapter-postgresql.md`).

| Table/Collection | Stores |
|------------------|--------|
| [NEEDS CLARIFICATION] | Exact table names, column types, and constraints require `schema.prisma`, which was not present in inputs.code; the entities above are inferred solely from Prisma client call sites. |

## Dependencies

| Module | Purpose |
|--------|---------|
| app | Every Prisma call site that establishes the data model above lives in `src/app/api/*` (see `docs/modules/app/README.md`). |
| lib | Provides the shared `prisma` client instance used by all of the above call sites (`src/lib/db.ts`, see `docs/modules/lib/README.md`). |
