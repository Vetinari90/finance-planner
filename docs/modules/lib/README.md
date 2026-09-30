---
type: readme
audience: [developer]
language: en
links: [docs/modules/app/README.md, docs/modules/types/README.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Module: lib

## Purpose

The `lib` module (`src/lib`) provides shared server-side infrastructure used by the `app` module: NextAuth configuration and credential verification (`auth.ts`), the Prisma database client (`db.ts`), and a helper for resolving the current authenticated user's id from the session (`requireUser.ts`).

## Key Entities

`lib` does not own domain entities directly; it configures access to `User` (via `prisma.user` lookups in `auth.ts`) and exposes the Prisma client used elsewhere to read/write `Plan` and `PlannedItem`.

| Entity | Description |
|--------|-------------|
| User | Looked up by `email` in `src/lib/auth.ts`'s `authorize()` callback (fields used: `id`, `email`, `password`, `name`). |

[NEEDS CLARIFICATION] No `schema.prisma` file is present in inputs.code to confirm the canonical `User` definition.

## Data Storage

**Database:** PostgreSQL, accessed through `PrismaClient` configured with a `PrismaPg` driver adapter (`@prisma/adapter-pg`), connection string read from `DATABASE_URL` (`src/lib/db.ts`). The Prisma Client is imported from a non-default path, `@/generated/prisma/client`, rather than the standard `@prisma/client` package.

| Table/Collection | Stores |
|------------------|--------|
| user | Credentials and profile, queried in `src/lib/auth.ts`. |

## Dependencies

| Module | Purpose |
|--------|---------|
| app | Consumes `authOptions`, `prisma`, and `requireUserId` exported from this module. `lib` does not import from `app`. |
| types | `src/lib/auth.ts` and `src/lib/requireUser.ts` both read `session.user.id`, which is only valid TypeScript because of the `Session` augmentation declared in `src/types/next-auth.d.ts`. |
