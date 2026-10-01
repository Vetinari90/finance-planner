---
type: readme
audience: [developer]
language: en
links:
  - docs/modules/lib/technical.md
  - docs/modules/lib/use-cases.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Module: lib

## Purpose

The `lib` module provides shared server-side infrastructure consumed by the rest of the application: NextAuth credentials-based authentication configuration (`src/lib/auth.ts`), a Prisma-backed PostgreSQL database client (`src/lib/db.ts`), and a helper that resolves the currently authenticated user's id from the session (`src/lib/requireUser.ts`).

## Key Entities

| Entity | Description |
|--------|-------------|
| User | Resolved via `prisma.user.findUnique({ where: { email } })` in `src/lib/auth.ts`. Fields observed in code: `id`, `email`, `name`, `password` (the password is a bcrypt hash compared with `bcrypt.compare`). [NEEDS CLARIFICATION] The full `User` model definition (e.g. a Prisma schema file) is not present in this module's inputs, so additional fields/columns cannot be confirmed. |

## Data Storage

**Database:** PostgreSQL, accessed through `@prisma/adapter-pg` (`PrismaPg`) and a generated Prisma Client imported from `@/generated/prisma/client` (`src/lib/db.ts`). The connection string is read from the `DATABASE_URL` environment variable; `db.ts` throws at module-load time if it is unset.

| Table/Collection | Stores |
|------------------|--------|
| user (Prisma model, accessed via `prisma.user`) | Email, name, and hashed password used for credentials-based sign-in (`src/lib/auth.ts`). |

[NEEDS CLARIFICATION] No `schema.prisma` or migration files are present in this module's inputs, so the complete set of tables/models managed by this module cannot be enumerated beyond the `user` model referenced in `auth.ts`.

## Dependencies

| Module | Purpose |
|--------|---------|
| `next-auth` (and `next-auth/providers/credentials`) | Supplies `NextAuthOptions` and `CredentialsProvider` used to build `authOptions` in `src/lib/auth.ts`. |
| `bcryptjs` | Verifies submitted passwords against the stored hash in `authOptions.providers[0].authorize` (`src/lib/auth.ts`). |
| `@/generated/prisma/client` | Generated Prisma Client type/class instantiated in `src/lib/db.ts`. |
| `@prisma/adapter-pg` | `PrismaPg` driver adapter used to connect the Prisma Client to PostgreSQL in `src/lib/db.ts`. |
| `src/lib/db.ts` (internal) | Supplies the shared `prisma` client instance imported by `src/lib/auth.ts`. |
| `src/lib/auth.ts` (internal) | Supplies `authOptions`, imported by `src/lib/requireUser.ts` to read the current session. |

[NEEDS CLARIFICATION] No `package.json` is present in this module's inputs, so exact declared versions of `next-auth`, `bcryptjs`, and the Prisma/adapter packages cannot be confirmed; the table above lists only the import relationships observed directly in the source files.
