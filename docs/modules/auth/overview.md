---
type: module-overview
audience: [developer]
language: en
links: [domain-model.md, api.md, data-model.md, ../plans/overview.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Module: Auth

## Purpose

The `auth` module provides account registration and credential-based sign-in for finance-planner, and issues the session that gates access to a user's own plans. It is implemented as Next.js App Router route handlers and pages under `src/app/api/auth`, `src/app/login`, `src/app/register`, and `src/app/logout`, plus a NextAuth type augmentation in `src/types/next-auth.d.ts`.

This is corroborated by the [plans module overview](../plans/overview.md): the `plans` module explicitly does not authenticate users itself and instead calls `requireUserId()` / `getServerSession(authOptions)` (owned by `auth`), redirecting unauthenticated visitors to `/login` — consistent with `auth` gating access to a user's own plans.

[NEEDS CLARIFICATION] A broader business rationale for why authentication exists (e.g. multi-tenant privacy or compliance requirements) is still not established. `README.md` is generic Next.js boilerplate with no finance-planner-specific content. The `docs/modules/planned-items/overview.md` and `docs/modules/web-ui/overview.md` and `docs/modules/persistence/overview.md` files named as inputs for this section are, as of this generation run, still unfilled skeleton documents (their content is the `[UNFILLED]` sentinel) belonging to a not-yet-run partition of the generation and could not be incorporated here.

## Responsibilities

- Register a new user account: `POST /api/auth/register` (`src/app/api/auth/register/route.ts`) validates input with a Zod schema, checks for an existing email via `prisma.user.findUnique`, hashes the password with `bcryptjs` (cost factor 12), and creates the user via `prisma.user.create`.
- Authenticate a user with the NextAuth `credentials` provider: the sign-in UI (`src/app/login/LoginClient.tsx`) and the post-registration auto-login (`src/app/register/page.tsx`) both call `signIn("credentials", { email, password, redirect: false, ... })` from `next-auth/react`.
- Serve all NextAuth-managed sub-routes (sign-in, sign-out, session, CSRF, callback, etc.) through the catch-all handler `src/app/api/auth/[...nextauth]/route.ts`, which delegates to `NextAuth(authOptions)`.
- Provide a convenience `GET /logout` route (`src/app/logout/route.ts`) that redirects to NextAuth's built-in `/api/auth/signout` endpoint.
- Declare the shape of the authenticated session's `user` object (`id`, optional `name`, optional `email`) via a `next-auth` module augmentation in `src/types/next-auth.d.ts`.

## Boundaries

**This module does NOT:**

- Define the internal behavior of `authOptions` (provider configuration, session strategy, JWT/callback logic, credential-verification logic). `authOptions` is imported from `@/lib/auth` in `src/app/api/auth/[...nextauth]/route.ts`, but that file is outside this dispatch's permitted read set (it is mapped to the `persistence`/`src/lib` scope, not `auth`). [NEEDS CLARIFICATION] Session strategy (JWT vs. database), token lifetime, and the exact credential-verification implementation are unconfirmed; `docs/modules/persistence/overview.md`, which could resolve this, is still an unfilled skeleton in this generation run.
- Own the database schema for the `User` model. Queries go through `prisma` (imported from `@/lib/db`), but the Prisma schema file was not part of this dispatch's inputs. See `data-model.md` for what could and could not be confirmed.
- Implement password reset or email verification — no such code path was found in the reviewed files.

## Key Entities

<!-- Core domain objects managed by this module -->

| Entity | Description |
|--------|-------------|
| User | Account record with `id`, `email`, hashed `password`, and optional `name`, as observed in `src/app/api/auth/register/route.ts`. |
| Session.user | The authenticated-session projection of a user (`id`, optional `name`, optional `email`), as declared in `src/types/next-auth.d.ts`. |

See: [domain-model.md](domain-model.md)

## Dependencies

<!-- Modules this module depends on -->

| Module | Purpose |
|--------|---------|
| persistence (`@/lib/db` / `prisma`) | User lookup (`prisma.user.findUnique`) and creation (`prisma.user.create`) during registration. |

[NEEDS CLARIFICATION] No build manifest (e.g. `package.json`) was present in this dispatch's inputs, so the `next-auth`, `bcryptjs`, and `zod` package dependencies observed via `import` statements could not be cross-confirmed against a manifest as required by the dependency-grounding rule.

## Dependents

<!-- Modules that depend on this module (helps assess change impact) -->

| Module | Uses For |
|--------|----------|
| [plans](../plans/overview.md) | Resolves the current authenticated user for both its API routes (via `requireUserId()`) and its server-rendered pages (via `getServerSession(authOptions)`); redirects unauthenticated visitors to `/login`, per `docs/modules/plans/overview.md`'s Boundaries and Dependencies sections. |
| planned-items | [NEEDS CLARIFICATION] `docs/modules/planned-items/overview.md`, named as an input for this section, is still an unfilled skeleton (`[UNFILLED]`) in this generation run; its dependency on `auth` sessions could not be confirmed here. |
| web-ui | [NEEDS CLARIFICATION] `docs/modules/web-ui/overview.md`, named as an input for this section, is still an unfilled skeleton (`[UNFILLED]`) in this generation run; its dependency on `auth` sessions could not be confirmed here. |
| persistence | [NEEDS CLARIFICATION] `docs/modules/persistence/overview.md`, named as an input for this section, is still an unfilled skeleton (`[UNFILLED]`) in this generation run; whether/how it depends on `auth` could not be confirmed here. |
