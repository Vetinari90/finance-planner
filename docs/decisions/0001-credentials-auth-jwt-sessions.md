---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:46d0ac250ad2a72f1e43ff8a158cd1807522a5e39dc0463b5d9d6f6367d46c72
---

# 0001 Credentials Auth Jwt Sessions

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
## Status

Accepted (inferred from the shipped implementation; no separate proposal record was present in the inputs available to this dispatch).

## Context

finance-planner needs to identify which user is making a request so that plans and planned items can be scoped to their owner. Per `docs/modules/auth/overview.md`, the `auth` module "issues the session that gates access to a user's own plans," and the `plans` module "does not authenticate users itself and instead calls `requireUserId()` / `getServerSession(authOptions)`" (per `docs/modules/plans/overview.md`'s Boundaries section), redirecting unauthenticated visitors to `/login`.

Per `docs/modules/persistence/overview.md`, the concrete mechanism is defined in `src/lib/auth.ts` as NextAuth `authOptions`: a `CredentialsProvider` that verifies email/password against `prisma.user` with `bcrypt.compare`, a `jwt`-strategy session, `jwt`/`session` callbacks that propagate the user ID onto the session, and a custom `/login` sign-in page.

[NEEDS CLARIFICATION] No design note, ADR draft, or comment in the reviewed inputs (`README.md`, and the `auth`, `plans`, `planned-items`, `persistence`, `web-ui` overview docs) states *why* a credentials provider with JWT-strategy sessions was chosen over an alternative (e.g. database-backed sessions or an OAuth-only provider). `README.md` is generic Next.js `create-next-app` boilerplate with no finance-planner-specific content.

## Decision

Based on `docs/modules/persistence/overview.md`, the project uses NextAuth's `CredentialsProvider`, configured in `authOptions` (`src/lib/auth.ts`), to authenticate users by email and password:

- Registration hashes the password with `bcryptjs` (cost factor 12) and stores it via `prisma.user.create`, per `docs/modules/auth/overview.md` (`POST /api/auth/register`, `src/app/api/auth/register/route.ts`).
- Sign-in verifies the submitted password against the stored hash with `bcrypt.compare` inside `authOptions`, per `docs/modules/persistence/overview.md`.
- Sessions use NextAuth's `jwt` strategy rather than database-backed sessions; `jwt` and `session` callbacks propagate the authenticated user's ID onto the session object, per `docs/modules/persistence/overview.md`.
- A custom `/login` sign-in page is configured in `authOptions`, and all NextAuth sub-routes (sign-in, sign-out, session, CSRF, callback) are served through the catch-all handler `src/app/api/auth/[...nextauth]/route.ts`, per `docs/modules/auth/overview.md`.
- `requireUserId()` (`src/lib/requireUser.ts`) resolves the current user's ID from `getServerSession(authOptions)` for use by API routes and server-rendered pages across the `plans` and `planned-items` modules, per `docs/modules/persistence/overview.md` and `docs/modules/plans/overview.md`.

## Consequences

### Positive

- Registration and sign-in funnel through the same credential-verification configuration (`authOptions` in `src/lib/auth.ts`), rather than duplicating password-checking logic per route, per `docs/modules/auth/overview.md` and `docs/modules/persistence/overview.md`.
- Passwords are never stored or compared in plaintext: they are hashed with `bcryptjs` at registration and verified with `bcrypt.compare` at sign-in, per `docs/modules/auth/overview.md` and `docs/modules/persistence/overview.md`.
- The `jwt`/`session` callbacks make the authenticated user's ID available on the session object, so downstream code (`requireUserId()`, and consumers such as the `plans` module per `docs/modules/plans/overview.md`'s Dependencies section) can resolve "who is the current user" through a single shared helper instead of re-implementing session parsing per module.

### Negative

- `requireUserId()` only returns `null` when no session is present; it does not itself throw or redirect. Per `docs/modules/persistence/overview.md`'s Boundaries section, "enforcement (e.g., returning a 401) [is left] to its callers," which means each API route/page is individually responsible for checking the result and rejecting unauthenticated access.
- Per `docs/modules/auth/overview.md`'s Boundaries section, this module does not "implement password reset or email verification — no such code path was found in the reviewed files."
- [NEEDS CLARIFICATION] JWT expiry/lifetime, refresh behavior, and the source/rotation of the signing secret are not documented in `docs/modules/auth/overview.md` or `docs/modules/persistence/overview.md`.
- [NEEDS CLARIFICATION] `docs/modules/persistence/overview.md` notes that `src/lib/db.ts` imports the generated Prisma client from `@/generated/prisma/client`, but the `User` model's full schema (`schema.prisma`) was not part of any reviewed module's inputs, so the complete set of fields validated during credential sign-in cannot be confirmed here.

## Alternatives Considered

[NEEDS CLARIFICATION] No reference document or module overview in this dispatch's inputs records alternatives that were evaluated (e.g. database-backed sessions, an OAuth-only provider, or a third-party auth service) or why they were rejected in favor of the credentials provider with JWT-strategy sessions.

## References

- [docs/modules/auth/overview.md](../modules/auth/overview.md)
- [docs/modules/persistence/overview.md](../modules/persistence/overview.md)
- [docs/modules/plans/overview.md](../modules/plans/overview.md)
- [docs/modules/planned-items/overview.md](../modules/planned-items/overview.md)
- [docs/modules/web-ui/overview.md](../modules/web-ui/overview.md)
- [../../README.md](../../README.md) (generic Next.js `create-next-app` boilerplate; no finance-planner-specific authentication rationale found)
<!-- /SLOT:content -->
