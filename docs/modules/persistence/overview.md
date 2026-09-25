---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Overview

## overview.md

<!-- SLOT:content brief="Document content (overview.md)" -->
### Purpose

The `persistence` module (`src/lib/`) provides the shared data-access and session infrastructure used across the application: a singleton PostgreSQL-backed Prisma client, the NextAuth credentials-based authentication configuration, and a helper to resolve the current authenticated user's ID from the server session.

### Responsibilities

- Instantiate and cache a single `PrismaClient` bound to PostgreSQL through a `PrismaPg` adapter, reused across Next.js hot reloads via a `globalThis` cache (`src/lib/db.ts`).
- Fail fast at module load if `DATABASE_URL` is not set (`src/lib/db.ts`).
- Define `authOptions` (`NextAuthOptions`): a `CredentialsProvider` that verifies email/password against `prisma.user` with `bcrypt.compare`, a `jwt`-strategy session, `jwt`/`session` callbacks that propagate the user ID onto the session, and a custom `/login` sign-in page (`src/lib/auth.ts`).
- Expose `requireUserId()`, an async helper that calls `getServerSession(authOptions)` and returns the session user's ID, or `null` if there is none (`src/lib/requireUser.ts`).

### Boundaries

**This module does NOT:**

- Define any HTTP route handlers or API endpoints itself - see [api.md](api.md).
- Throw or redirect when no session is present; `requireUserId()` only returns `null`, leaving enforcement (e.g. returning a 401) to its callers. [NEEDS CLARIFICATION] The calling API routes that enforce this are outside this module's manifest scope.
[NEEDS CLARIFICATION] [REVIEW] accuracy: The doc claims confirming the 401-enforcing callers is outside this module's manifest scope, but src/app/api/plans/route.ts (one of this doc's own code inputs) directly shows requireUserId() being checked and a 401 returned - the fact was verifiable from the inputs actually provided.
- Include the Prisma schema in the files available to this module; `src/lib/db.ts` imports the generated client from `@/generated/prisma/client` but the schema source (`schema.prisma`) is not part of this module's inputs. [NEEDS CLARIFICATION] Confirm the location of `schema.prisma` and include it in a future documentation pass.

### Key Entities

| Entity | Description |
|--------|-------------|
| User | Referenced via `prisma.user.findUnique({ where: { email } })` in `src/lib/auth.ts`; observed fields: `id`, `email`, `password`, `name`. Full schema not available in this module's inputs. |

See: [domain-model.md](domain-model.md)

### Dependencies

| Module | Purpose |
|--------|---------|
| - | No internal cross-module imports were found in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`; their imports resolve to external packages (`next-auth`, `bcryptjs`, `@/generated/prisma/client`, `@prisma/adapter-pg`) or to files within this same module. |

### Dependents

| Module | Uses For |
|--------|----------|
| [NEEDS CLARIFICATION] | This module's inputs (`src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/requireUser.ts`) give no visibility into which other modules import `authOptions`, `prisma`, or `requireUserId` - confirming consumers requires inspecting `src/app/api/**` and other modules' source, which is outside this module's manifest scope. |
[NEEDS CLARIFICATION] [REVIEW] consistency: The Dependents row claims no visibility into which modules consume `authOptions`/`prisma`/`requireUserId`, but the auth, plans, and planned-items module overviews (visible in the same doc set) each explicitly list `persistence` as a dependency and name exactly what they use it for (Prisma client for CRUD, `requireUserId()`/`authOptions` for session resolution), so the consumer information this row says is unavailable is already documented elsewhere in the generated docs.
[NEEDS CLARIFICATION] [REVIEW] accuracy: The doc asserts it has no visibility into consumers of authOptions/prisma/requireUserId and that inspecting src/app/api/** is out of scope, but src/app/api/** and src/app/**/page.tsx files were themselves provided among this doc's code inputs and plainly show these imports - the Dependents table is inaccurate about its own available evidence.
<!-- /SLOT:content -->
