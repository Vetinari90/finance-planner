---
type: cross-cutting
audience: [developer]
language: en
links: [docs/modules/app/technical.md, docs/modules/lib/README.md, docs/modules/lib/technical.md, docs/modules/app/README.md, docs/security.md, docs/decisions/0004-zod-validation-and-error-envelope.md]
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_branch: sdlc/20261001-2017
---

# Standards

## Summary

This document synthesizes engineering conventions observed across the `app` and
`lib` modules of finance-planner: how authentication is implemented, how API
requests are validated and errors are shaped, and what configuration the
modules require. It is derived entirely from `docs/modules/app/technical.md`,
`docs/modules/app/README.md`, `docs/modules/lib/technical.md`, and
`docs/modules/lib/README.md`; no project-level style guide, linter
configuration, or contributing guide was supplied as an input to this node.

## Authentication

Authentication is implemented via NextAuth's `CredentialsProvider`, configured
as `authOptions` in `src/lib/auth.ts` (see `docs/modules/lib/README.md` and
`docs/modules/lib/technical.md`). Credential verification resolves the user via
`prisma.user.findUnique({ where: { email } })` and compares the submitted
password against the stored hash with `bcrypt.compare`. New-user registration
(`POST /api/auth/register` in `src/app/api/auth/register/route.ts`, see
`docs/modules/app/technical.md`) hashes passwords with `bcrypt.hash(..., 12)`
before storing them. The `app` module reads session identity via
`session.user.id` / `session.user.email` (`docs/modules/app/README.md`) and via
the `requireUserId()` helper on API routes. Further authentication/session
detail, if documented separately, would live in `docs/security.md`.

[NEEDS CLARIFICATION] Neither `docs/modules/lib/technical.md` nor
`docs/modules/lib/README.md` records a NextAuth signing secret (e.g. a
`NEXTAUTH_SECRET`-style environment variable) being read in `src/lib/auth.ts`;
whether one is configured elsewhere cannot be confirmed from these inputs.

## API Conventions

Route handlers are Next.js App Router files under `src/app/`, with no declared
base path prefix such as `/api/v1` (`docs/modules/app/technical.md`). The
observed routes are:

| Method | Path |
|--------|------|
| GET, POST | `/api/auth/[...nextauth]` |
| POST | `/api/auth/register` |
| GET | `/logout` |
| GET, POST | `/api/plans` |
| GET, DELETE | `/api/plans/{planId}` |
| POST | `/api/plans/{planId}/items` |

(Full handler-level detail is in `docs/modules/app/technical.md`.)

[NEEDS CLARIFICATION] No URL versioning scheme is present in either module's
documented endpoints.

### HTTP status codes

| Code | Meaning | Source |
|------|---------|--------|
| 200 | Successful GET | `/api/plans`, `/api/plans/{planId}` |
| 201 | Resource created | `POST /api/auth/register`, `POST /api/plans`, `POST /api/plans/{planId}/items` |
| 400 | Invalid input (zod validation failure) | `POST /api/auth/register`, `POST /api/plans`, `POST /api/plans/{planId}/items` |
| 401 | No session (`requireUserId()` fails) | `/api/plans`, `/api/plans/{planId}`, `/api/plans/{planId}/items` |
| 404 | Resource not found or not owned by caller | `/api/plans/{planId}`, `/api/plans/{planId}/items` |
| 409 | Conflict (duplicate email at registration, or duplicate `(userId, year, month)` plan) | `POST /api/auth/register`, `POST /api/plans` |

## Validation & Error Handling

Mutating routes validate request bodies with `zod` schemas before touching the
database: `RegisterSchema` (`email`, `password` min length 8, optional `name`
max 80 chars), `CreatePlanSchema` (`title` optional max 80, `year` int
2000-2100, `month` int 1-12, `currency` 3 chars default `"CZK"`), and
`CreateItemSchema` (`title` 1-120 chars, `amountCents` non-negative int,
optional/nullable `categoryId`, optional/nullable `note` max 400 chars) — all
per `docs/modules/app/technical.md`. On validation failure, routes return HTTP
400 with a `{ error, details }` body, where `details` is the zod `flatten()`
output of the failed schema. Ownership/not-found conditions return
`{ error: "Not found" }`-style bodies with HTTP 404; unauthenticated requests
return `{ error: "Unauthorized" }`-style bodies with HTTP 401. See
`docs/decisions/0004-zod-validation-and-error-envelope.md` for the decision
record behind this pattern, if present.

## Configuration

| Variable | Required | Module | Description |
|----------|----------|--------|-------------|
| `DATABASE_URL` | Yes | `lib` | PostgreSQL connection string read in `src/lib/db.ts`; the module throws at load time (`"DATABASE_URL is not set"`) if it is missing (`docs/modules/lib/technical.md`). |

[NEEDS CLARIFICATION] `docs/modules/app/technical.md` reports no `process.env`
reads in the `app` module's own files; any additional environment
configuration (e.g. NextAuth providers/secret) is not observable from the
inputs available to this node.

`src/app/logout/route.ts` builds its redirect with a literal hard-coded base
URL `http://localhost:3000` rather than a configured host
(`docs/modules/app/technical.md`); this is flagged there as unlikely to
resolve correctly outside local development.

## Testing Standards

[NEEDS CLARIFICATION] `docs/modules/app/technical.md` and
`docs/modules/lib/technical.md` both report that no test files (e.g.
`*.test.ts`, `*.spec.ts`, `__tests__/`) and no `package.json` test script were
present in their respective module inputs. No test framework, test command, or
coverage figure can be grounded for either module from the inputs available to
this node.
