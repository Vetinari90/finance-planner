---
type: documentation
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/auth/api.md, ../modules/auth/technical-concerns.md, ../modules/auth/data-model.md, ../modules/plans/api.md, ../modules/plans/technical-concerns.md, ../decisions/0005-scope-all-queries-by-session-user.md]
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:c570623018befaf06912252ebc777c39c0f38664ad5cf303bf17f184e1f10d59
---

# Security

## security.md

<!-- SLOT:content brief="Document content (security.md)" -->
### Summary

Finance-planner authenticates users with NextAuth's `credentials` provider and scopes every plan/plan-item read or write to the resolved session user. Passwords are hashed with bcrypt before storage and request bodies are validated with Zod at the API boundary. Several security-relevant implementation details (the concrete session strategy, secret storage, transport-security configuration, and the persistence-layer schema/constraints) live in files or modules outside this dispatch's grounded read set and are marked below rather than guessed.

### Authentication

- Account creation is handled by `POST /api/auth/register` (`src/app/api/auth/register/route.ts`), which validates the request body with a Zod schema, checks for an existing user via `prisma.user.findUnique`, hashes the password with `bcryptjs` (cost factor 12), and creates the user via `prisma.user.create` (per [`docs/modules/auth/overview.md`](../modules/auth/overview.md) and [`docs/modules/auth/api.md`](../modules/auth/api.md)).
- Sign-in uses the NextAuth `credentials` provider: `src/app/login/LoginClient.tsx` and the post-registration auto-login in `src/app/register/page.tsx` both call `signIn("credentials", { email, password, redirect: false, ... })` from `next-auth/react`.
- All other NextAuth-managed flows (sign-in, sign-out, session, CSRF, callback) are served by the catch-all route `src/app/api/auth/[...nextauth]/route.ts`, which delegates to `NextAuth(authOptions)`. A convenience `GET /logout` route (`src/app/logout/route.ts`) redirects to NextAuth's built-in `/api/auth/signout` endpoint.
- [NEEDS CLARIFICATION] The internal behavior of `authOptions` — provider configuration, session strategy (JWT vs. database), token lifetime, and the exact credential-verification logic — is imported from `@/lib/auth` but that file falls under the `persistence`/`src/lib` module scope, not `auth`, and is outside this dispatch's grounded read set. `docs/modules/persistence/overview.md` and `docs/modules/persistence/technical-concerns.md`, which could resolve this, are still `[UNFILLED]` skeleton documents from a not-yet-completed parallel work package at the time this document was generated.
- [NEEDS CLARIFICATION] Password reset and email verification are not implemented — no such code path was found in the reviewed `auth` module files (per `docs/modules/auth/overview.md`'s Boundaries section). Whether this is an intentional scope limitation is not established.

### Session Management

- The `Session.user` shape (`id`, optional `name`, optional `email`) is declared via a NextAuth module augmentation in `src/types/next-auth.d.ts` (per [`docs/modules/auth/data-model.md`](../modules/auth/data-model.md)).
- Server-rendered pages resolve the current user via `getServerSession(authOptions)` (e.g. `src/app/page.tsx`, and per the `plans` module's boundaries in `docs/modules/plans/overview.md`); unauthenticated visitors are redirected to `/login`.
- API routes resolve the current user via `requireUserId()` (imported from `@/lib/requireUser`), returning `401 { "error": "Unauthorized" }` when no user is present, before any other work is done (per [`docs/modules/plans/api.md`](../modules/plans/api.md)).
- [NEEDS CLARIFICATION] Session cookie attributes (name, `Secure`/`HttpOnly`/`SameSite` flags), token/cookie lifetime, and the exact session-invalidation mechanism on sign-out are configured inside `authOptions` (`@/lib/auth`), which is outside this dispatch's grounded read set. `docs/modules/auth/domain-model.md` explicitly flags this same gap for the `SessionUser` lifecycle's "Deleted when" case.

### Authorization and Data Isolation

- Every `plans` API route ties its query to the resolved session user: `GET /api/plans` and `POST /api/plans` operate on the current user's rows only, and `GET /api/plans/{planId}` / `DELETE /api/plans/{planId}` filter by `{ id: planId, userId }`, returning `404 Not found` (not `403`) when a plan exists but belongs to another user — this collapses "does not exist" and "belongs to another user" into one response, per [`docs/modules/plans/api.md`](../modules/plans/api.md).
- `DELETE /api/plans/{planId}` performs an explicit ownership check (`prisma.plan.findFirst({ where: { id: planId, userId }, select: { id: true } })`) before deleting.
- This per-query user-scoping pattern is documented project-wide as [ADR 0005](../decisions/0005-scope-all-queries-by-session-user.md), which itself notes: "[NEEDS CLARIFICATION] Neither `inputs.references` nor the available module-docs state whether this scoping is implemented as an explicit `userId` (or equivalent) filter added to every persistence-layer query, or through some other mechanism ... the persistence module's `overview.md` is not yet generated."
- [NEEDS CLARIFICATION] Whether the `planned-items` module (item CRUD under `/api/plans/{planId}/items`) applies the same user-scoping and ownership-check pattern cannot be confirmed here: `docs/modules/planned-items/overview.md`, `docs/modules/planned-items/technical-concerns.md`, and `docs/modules/planned-items/api.md` are all still `[UNFILLED]` skeleton documents at the time this document was generated.
- [NEEDS CLARIFICATION] No role- or scope-based permission model (beyond "is this an authenticated user, and does the row's `userId` match") was found in any reviewed `auth` or `plans` file; per `docs/modules/auth/api.md` and `docs/modules/plans/api.md`, "Required Scopes" is explicitly unconfirmed in both.

### Input Validation

- Request bodies are validated with Zod schemas at the API route boundary: `RegisterSchema` for `POST /api/auth/register` (email format, password minimum 8 characters, optional name 1-80 characters) and `CreatePlanSchema` for `POST /api/plans` (title, year 2000-2100, month 1-12, 3-character currency), per `docs/modules/auth/technical-concerns.md` and `docs/modules/plans/technical-concerns.md`.
- Client-side validation supplements but does not replace server-side checks: the registration form marks `email`/`password` as `required` and `password` as `minLength={8}`; `AddItemForm.tsx` (plans module) validates an amount format client-side with a regex before submission.
- [NEEDS CLARIFICATION] Whether the `planned-items` module re-validates the item amount server-side (the `plans` module's `technical-concerns.md` notes this "happens in the planned-items module, outside this manifest") could not be confirmed, since `docs/modules/planned-items/technical-concerns.md` is still an `[UNFILLED]` skeleton.
- [NEEDS CLARIFICATION] Database-level constraint enforcement (e.g. column types, uniqueness constraints such as the presumed `(userId, year, month)` unique index inferred only from `409` handling in `POST /api/plans`) is not established: the Prisma schema file lives under the `persistence` module and was not part of this dispatch's grounded read set.

### Secrets and Credential Storage

- User passwords are never stored in plaintext: `POST /api/auth/register` hashes the password with `bcrypt.hash(password, 12)` before persisting it, and the stored `password` column holds only the bcrypt hash (per `docs/modules/auth/data-model.md` and `docs/modules/auth/domain-model.md`).
- [NEEDS CLARIFICATION] Application secrets (e.g. a NextAuth secret / signing key, database connection string, or any third-party API key) and where/how they are configured (environment variables, a secrets manager, `.env` file) are not established by this dispatch's grounded read set — no configuration or environment file was reviewed, and `docs/modules/persistence/overview.md` / `docs/modules/persistence/deployment.md`, which would likely own this concern, are still `[UNFILLED]` skeleton documents.

### Transport Security

[NEEDS CLARIFICATION] No TLS/HTTPS configuration, reverse-proxy setup, or deployment target was found in the files reviewed for this dispatch. `README.md` is generic `create-next-app` boilerplate with no finance-planner-specific deployment or transport-security content, and `docs/modules/persistence/deployment.md` (the module most likely to own this concern) is still an `[UNFILLED]` skeleton document at the time this document was generated. One concrete code-level observation: the `GET /logout` route hard-codes its redirect target as the literal string `"http://localhost:3000"` rather than deriving it from the incoming request (per `docs/modules/auth/api.md`); whether this is a local-only convenience or a defect for non-local (HTTPS) deployments is unconfirmed.

### Error Handling and Information Disclosure

- Error responses across the reviewed `auth` and `plans` routes use a flat `{ "error": "<message>" }` shape (with an additional `details` field carrying the Zod-flattened error tree on `400` validation failures), not a structured `error.code`/`error.message` envelope — see `docs/modules/auth/api.md` and `docs/modules/plans/api.md`.
- `POST /api/auth/register`'s validation error message for password length is the literal Czech string `"Minimálně 8 znaků"`, while the rest of the reviewed `auth` UI copy is in English — an inconsistency noted in `docs/modules/auth/technical-concerns.md`, not a security control by itself but relevant to any future security-copy audit.
- [NEEDS CLARIFICATION] The `POST /api/auth/register` handler has no explicit `try/catch` around `prisma.user.create`; the resulting HTTP status and error detail (if any) surfaced to the client on an unhandled database error is not established by the reviewed code (per `docs/modules/auth/api.md`).

### Dependency Security

[NEEDS CLARIFICATION] No build manifest (`package.json`) was present in this dispatch's grounded inputs, so the versions of `next-auth`, `bcryptjs`, `zod`, and `prisma` (observed only via `import` statements in the reviewed files) could not be cross-confirmed against a manifest, and no known-vulnerability review of these dependencies can be performed from the available inputs.

### Known Gaps and Follow-Ups

- Session cookie configuration, token lifetime, and CSRF handling inside `authOptions` are unconfirmed (see Session Management).
- Whether the `planned-items` module enforces the same per-user scoping pattern as `plans` (ADR 0005) is unconfirmed pending `docs/modules/planned-items/overview.md` and `docs/modules/planned-items/technical-concerns.md` completion.
- Secrets management and transport security (TLS) configuration are unconfirmed pending `docs/modules/persistence/overview.md` and `docs/modules/persistence/deployment.md` completion.
- No password-reset or email-verification flow exists in the reviewed code; whether this is an accepted scope gap or a planned feature is unconfirmed.
<!-- /SLOT:content -->
