---
type: readme
audience: [developer]
language: en
links: [docs/modules/lib/technical.md, docs/modules/lib/use-cases.md, docs/modules/app/README.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Module: Lib (src/lib)

## Purpose

The lib module provides the shared infrastructure used by the app module: the NextAuth configuration (`src/lib/auth.ts`), the Prisma database client singleton (`src/lib/db.ts`), and a helper to resolve the current authenticated user's id on the server (`src/lib/requireUser.ts`).

## Key Entities

| Entity | Description |
|--------|-------------|
| authOptions | `NextAuthOptions` object configuring the credentials provider, JWT session strategy, and callbacks (`src/lib/auth.ts`). |
[NEEDS CLARIFICATION] [REVIEW] completeness: The Key Entities table omits `requireUserId` (src/lib/requireUser.ts), even though the Purpose section explicitly names it as one of the three things the lib module provides. Only 2 of the 3 promised entities are documented in the table.
| prisma | Shared `PrismaClient` singleton, adapted for PostgreSQL via `@prisma/adapter-pg` (`src/lib/db.ts`). |

## Data Storage

**Database:** PostgreSQL, via the `PrismaPg` driver adapter (`@prisma/adapter-pg`) configured from the `DATABASE_URL` environment variable (`src/lib/db.ts`).

| Table/Collection | Stores |
|------------------|--------|
| User, Plan, PlannedItem (model accessor names inferred from Prisma Client calls across the codebase — `prisma.user`, `prisma.plan`, `prisma.plannedItem`; exact underlying table/column names are unconfirmed without a `schema.prisma` file) | No `schema.prisma` file was present in inputs.code; table/column definitions could not be confirmed beyond the fields referenced by Prisma calls in the app module (see `docs/modules/app/README.md`). |

## Dependencies

| Module | Purpose |
|--------|---------|
| types (implicit) — `src/types/next-auth.d.ts` augments the `next-auth` module's `Session` interface via TypeScript ambient declaration merging (`declare module "next-auth"`); this mechanism applies automatically to files within the TypeScript compilation scope and does not require an explicit import statement, which is why `src/lib/auth.ts` can type-safely assign `session.user.id = token.sub` without importing anything from `src/types` | No import of the `types` or `app` modules was found in `src/lib/*`. `src/lib/auth.ts` assigns `session.user.id = token.sub`, which is only type-safe due to the ambient augmentation in `src/types/next-auth.d.ts`, but no explicit import statement linking the two files was found. |
