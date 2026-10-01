---
type: cross-cutting
audience: [developer]
language: en
links:
  - docs/modules/lib/technical.md
  - docs/modules/app/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_branch: sdlc/20261001-2017
---

# Data Protection

## Authentication

Authentication is implemented via NextAuth, configured through the `authOptions` object exported by `src/lib/auth.ts` (see [lib module technical reference](modules/lib/technical.md)). The `app` module mounts this configuration at the `/api/auth/[...nextauth]` route handler (`src/app/api/auth/[...nextauth]/route.ts`), which re-exports the NextAuth handler for both `GET` and `POST` (see [app module technical reference](modules/app/technical.md)).

User registration is handled by `POST /api/auth/register` (`src/app/api/auth/register/route.ts`), which validates the request body with a `RegisterSchema` (email must be a valid email, password minimum length 8, optional name up to 80 characters), normalizes the email (lower-case, trim), rejects duplicate emails with `409`, and hashes the password with `bcrypt.hash(..., 12)` before persisting the user via `prisma.user.create`. Passwords are therefore not stored in plaintext.

Session-protected endpoints (`/api/plans`, `/api/plans/{planId}`, `/api/plans/{planId}/items`) call `requireUserId()` (`src/lib/requireUser.ts`) and return `401` when no session/user id is present.

The database connection string is read from the `DATABASE_URL` environment variable in `src/lib/db.ts`; the module throws `"DATABASE_URL is not set"` at load time if it is missing, so the value is required rather than optional.

[NEEDS CLARIFICATION] Neither the `lib` nor the `app` module's technical documentation shows a NextAuth signing secret (e.g. an env var such as `NEXTAUTH_SECRET`) being read or configured; whether and where such a secret is set cannot be confirmed from these inputs.

[NEEDS CLARIFICATION] Session/token lifetime, storage mechanism (cookie vs. memory), and refresh-token handling are not established by either module's technical documentation.

## API Conventions

Plan-scoped endpoints restrict reads and writes to the authenticated caller. `GET /api/plans` returns only the current user's plans (ordered by `year` desc, then `month` desc). `GET` and `DELETE /api/plans/{planId}` look up the plan via `findFirst` scoped by `userId`, returning `404` when the plan does not exist or is not owned by the caller, rather than distinguishing "not found" from "not yours" with a different status code. `POST /api/plans/{planId}/items` likewise confirms the parent plan exists and belongs to the caller (`404` otherwise) before creating a `PlannedItem`.

[NEEDS CLARIFICATION] Whether child `PlannedItem` rows are cascade-deleted when a `Plan` is deleted depends on the Prisma schema's relation definition, which is outside the `lib`/`app` module inputs reviewed for this document.

The routes documented in the `app` module's technical reference are flat file-system routes (e.g. `/api/plans`, `/api/plans/{planId}`) with no API version prefix (e.g. no `/api/v1/`).

Separately, `src/app/logout/route.ts` builds its sign-out redirect URL against a hard-coded base of `http://localhost:3000` rather than a configured host; this is noted in the `app` module's technical reference as a direct reading of the implementation, not an inference, and would not resolve correctly outside local development.

## Error Handling

Input validation errors on `POST /api/auth/register` and `POST /api/plans` return `400` with `{ error, details }`, where `details` is the result of zod's `flatten()` on the parse failure. Duplicate-registration and duplicate-plan conflicts return `409`. Missing/unauthorized access to plan resources returns `401` (no session) or `404` (plan absent or not owned by caller).

[NEEDS CLARIFICATION] Neither module's technical documentation shows a request-id / correlation-id being attached to error responses, nor a project-wide generic error envelope beyond the per-route zod `flatten()` shape and ad hoc `{ error: "..." }` strings.

## Logging

[NEEDS CLARIFICATION] Neither `docs/modules/lib/technical.md` nor `docs/modules/app/technical.md` documents any logging calls, log levels, or a logging library/configuration for this project. Whether passwords, password hashes, session tokens, or other personally identifiable information could be written to logs cannot be confirmed from these inputs.
