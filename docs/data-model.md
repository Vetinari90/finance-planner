---
type: data-model
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/app/README.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Module: Data Model

## Purpose

This document consolidates the data model implied by the application code across the `lib` and `app` modules: the entities persisted in PostgreSQL via Prisma and how they are used.

## Key Entities

| Entity | Description |
|--------|-------------|
| User | Registered account: `id`, `email` (looked up lower-cased/trimmed), `password` (bcrypt hash), optional `name`. Created in `src/app/api/auth/register/route.ts`; looked up by email in `src/lib/auth.ts`. |
| Plan | A monthly financial plan: `id`, `userId`, `year`, `month`, `currency` (3-letter code, default `"CZK"`), `title`. Appears to be unique per `(userId, year, month)`, inferred from the HTTP 409 conflict handling and an inline comment ("unikát (userId, year, month)") in `src/app/api/plans/route.ts`. |
| PlannedItem | A line item within a plan: `id`, `planId`, `title`, `amountCents` (non-negative integer), optional `categoryId`, optional `note`, `createdAt`. Created in `src/app/api/plans/[planId]/items/route.ts`. |

[NEEDS CLARIFICATION] No `schema.prisma` file is present in inputs.code; the field list above is inferred from TypeScript usage (Prisma `where`/`data`/`select` clauses) rather than read directly from a schema, so exact column types, nullability, indexes, and foreign-key/cascade behavior could not be confirmed.

## Data Storage

**Database:** PostgreSQL, accessed via `PrismaClient` with the `@prisma/adapter-pg` driver adapter and a `DATABASE_URL` connection string (`src/lib/db.ts`).

| Table/Collection | Stores |
|------------------|--------|
| user | Account credentials/profile. |
| plan | One row per user per plan-month. |
| plannedItem | Line items belonging to a plan. |

[NEEDS CLARIFICATION] Actual table/column names depend on `schema.prisma` (and any `@@map`/`@map` directives), which is not present in inputs.code; the names above reflect the Prisma model accessors used in code (`prisma.user`, `prisma.plan`, `prisma.plannedItem`).

## Dependencies

| Module | Purpose |
|--------|---------|
| lib | Owns the Prisma client through which all entities above are read/written (`src/lib/db.ts`). |
| app | Defines the zod schemas (`RegisterSchema`, `CreatePlanSchema`, `CreateItemSchema`) that constrain what values can be written for each entity. |
