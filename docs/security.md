---
type: cross-cutting
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/lib/technical.md, docs/modules/app/README.md, docs/modules/app/technical.md]
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_branch: sdlc/20261001-2017
---

# Security

This document synthesizes security-relevant facts already recorded in the `app`
and `lib` module docs (`docs/modules/lib/README.md`, `docs/modules/lib/technical.md`,
`docs/modules/app/README.md`, `docs/modules/app/technical.md`). It does not re-read
source code; every statement below is grounded in those four files.

## Authentication

Authentication is credentials-based, implemented with NextAuth's
`CredentialsProvider` and configured as `authOptions` in `src/lib/auth.ts`
(`docs/modules/lib/README.md`). Sign-in resolves the user with
`prisma.user.findUnique({ where: { email } })` and verifies the submitted
password against the stored bcrypt hash with `bcrypt.compare`
(`docs/modules/lib/README.md`). The NextAuth route handler that mounts
`authOptions` is `GET, POST /api/auth/[...nextauth]`
(`src/app/api/auth/[...nextauth]/route.ts`), which re-exports the
`NextAuth(authOptions)` handler directly (`docs/modules/app/technical.md`).

Registration (`POST /api/auth/register`, `src/app/api/auth/register/route.ts`)
validates the request body with a `RegisterSchema` (email format, password
minimum length 8, optional name up to 80 chars), lower-cases/trims the email,
rejects duplicate emails with `409`, hashes the password with
`bcrypt.hash(..., 12)`, and creates the user via `prisma.user.create`
(`docs/modules/app/technical.md`).

Every protected `app`-module route handler requires an authenticated session
via the `requireUserId()` helper (`src/lib/requireUser.ts`), which resolves the
current user id from the session and is consumed across every
`src/app/api/plans/**/route.ts` handler; absence of a session yields `401`
(`docs/modules/lib/README.md`, `docs/modules/app/technical.md`).

[NEEDS CLARIFICATION] `docs/modules/lib/technical.md` states that
`src/lib/auth.ts` does not reference a NextAuth signing secret (e.g. an env var
such as `NEXTAUTH_SECRET`) and that no secrets configuration file was present
in the `lib` module's inputs; whether such a secret is configured elsewhere in
the project could not be confirmed from the module docs available to this
synthesis node.

[NEEDS CLARIFICATION] Session strategy (JWT vs. database-backed sessions),
session/token lifetime, and refresh-token handling are not described in
`docs/modules/lib/README.md` or `docs/modules/lib/technical.md`.

## API Conventions

The API surface is the set of Next.js App Router route handlers documented in
`docs/modules/app/technical.md`: `GET, POST /api/auth/[...nextauth]`,
`POST /api/auth/register`, `GET /logout`, `GET, POST /api/plans`,
`GET, DELETE /api/plans/{planId}`, and `POST /api/plans/{planId}/items`. No
version prefix (e.g. `/api/v1`) appears in any of these paths
(`docs/modules/app/technical.md`).

Ownership scoping is applied consistently on the plan-scoped endpoints: both
`GET /api/plans/{planId}` and `DELETE /api/plans/{planId}` look the plan up
with `findFirst` scoped to the caller's `userId`, returning `404` when the plan
does not exist or is not owned by the requesting user
(`docs/modules/app/technical.md`). `POST /api/plans/{planId}/items` likewise
confirms the plan exists and belongs to the caller before creating a
`PlannedItem`, returning `404` otherwise (`docs/modules/app/technical.md`).

### HTTP Status Codes

Only the statuses explicitly described in `docs/modules/app/technical.md` and
`docs/modules/app/README.md` are listed; no other status codes are documented
there.

| Code | Where observed (per `docs/modules/app/technical.md`) |
|------|-------------------------------------------------------|
| 201 | `POST /api/auth/register` (user created); `POST /api/plans` (plan created); `POST /api/plans/{planId}/items` (item created) |
| 400 | `POST /api/auth/register` — invalid input, body `{ error, details }` from zod `flatten()` |
| 401 | Any `app`-module route guarded by `requireUserId()` when no session is present |
| 404 | `GET`/`DELETE /api/plans/{planId}` — plan not found or not owned; `POST /api/plans/{planId}/items` — plan not found or not owned |
| 409 | `POST /api/auth/register` — duplicate email; `POST /api/plans` — plan already exists for that user/year/month |

[NEEDS CLARIFICATION] No explicit `403 Forbidden` usage is described in the
module docs (ownership failures are reported as `404`, not `403`); whether a
distinct `403` path exists elsewhere could not be confirmed from the inputs
available to this node.

## Error Handling

Validation failures are returned as JSON with an `error` field and a `details`
field carrying the zod `flatten()` output, e.g.
`{ error: "Invalid input", details: parsed.error.flatten() }` on
`POST /api/auth/register` (`docs/modules/app/technical.md`). Conflict
responses are returned as a plain `{ error: "..." }` object, e.g.
`{ error: "Plan for this month already exists" }` on `POST /api/plans`
(`docs/modules/app/technical.md`).

[NEEDS CLARIFICATION] `docs/modules/app/technical.md` and
`docs/modules/app/README.md` do not describe a `code` field or a `requestId`
field in any API response shape; whether a consistent machine-readable error
code or request-correlation id convention exists elsewhere in the project
could not be confirmed from the module docs available to this synthesis node.

## Logging

[NEEDS CLARIFICATION] None of the four module docs synthesized for this node
(`docs/modules/lib/README.md`, `docs/modules/lib/technical.md`,
`docs/modules/app/README.md`, `docs/modules/app/technical.md`) describe any
logging practice — no log levels, no structured-logging library, and no
statement about whether passwords, tokens, or PII are excluded from logs.
