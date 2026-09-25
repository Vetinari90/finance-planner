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
- Throw or redirect when no session is present; `requireUserId()` only returns `null`, leaving enforcement (e.g. returning a 401) to its callers. The calling API routes that enforce this are `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, and `src/app/api/plans/[planId]/items/route.ts`, each of which checks `if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })` immediately after calling `requireUserId()`.
Confirmed from this module's own code inputs: `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, and `src/app/api/plans/[planId]/items/route.ts` each call `requireUserId()` and, when it returns `null`, respond with `NextResponse.json({ error: "Unauthorized" }, { status: 401 })` before performing any Prisma access.
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
| `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`, `src/app/page.tsx`, `src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx` | Import `authOptions` for NextAuth/`getServerSession` configuration, `prisma` for direct CRUD queries, and `requireUserId()` to resolve the current session's user ID before performing plan/item operations. |
Consumers of `authOptions`, `prisma`, and `requireUserId` are visible directly in this module's own code inputs: `src/app/api/auth/[...nextauth]/route.ts` and `src/app/api/auth/register/route.ts` (auth sign-in/registration flows), `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, and `src/app/api/plans/[planId]/items/route.ts` (plan/item CRUD via `requireUserId()` and `prisma`), and `src/app/page.tsx`, `src/app/plans/page.tsx`, and `src/app/plans/[planId]/page.tsx` (server-rendered pages using `authOptions` and `prisma` directly).
This module's code inputs directly include `src/app/api/**` and `src/app/**/page.tsx` files, which plainly show these imports: `authOptions` is imported in `src/app/api/auth/[...nextauth]/route.ts`, `src/app/page.tsx`, `src/app/plans/page.tsx`, and `src/app/plans/[planId]/page.tsx`; `prisma` is imported in `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`, `src/app/plans/page.tsx`, and `src/app/plans/[planId]/page.tsx`; and `requireUserId` is imported in `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, and `src/app/api/plans/[planId]/items/route.ts`.
<!-- /SLOT:content -->
