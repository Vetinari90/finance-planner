---
type: technical
purpose: "Module technical reference - API, configuration, testing"
audience: [developer]
language: en
links:
  - docs/modules/app/README.md
  - docs/modules/app/use-cases.md
  - docs/modules/lib/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Technical: app

## API Endpoints

All endpoints below are Next.js App Router route handlers found under
`src/app/`. There is no single declared base path (e.g. no `/api/v1` prefix) —
each path is the literal file-system route.

| Method | Path | Handler file | Description |
|--------|------|---------------|-------------|
| GET, POST | `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | Delegates entirely to the `NextAuth(authOptions)` handler from `@/lib/auth`; the module re-exports it as `GET` and `POST`. |
| POST | `/api/auth/register` | `src/app/api/auth/register/route.ts` | Validates body with `RegisterSchema` (`email` must be a valid email, `password` min length 8, `name` optional, max 80 chars). Lower-cases/trims the email, returns `409` if a user with that email already exists, hashes the password with `bcrypt.hash(..., 12)`, creates the user via `prisma.user.create`, returns `201` with `{ user: { id, email, name } }`. Returns `400` with `{ error, details }` (zod `flatten()`) on invalid input. |
| GET | `/logout` | `src/app/logout/route.ts` | Redirects (HTTP redirect) to `` /api/auth/signout?callbackUrl=/login `` against a hard-coded base URL `http://localhost:3000`. The in-code comment notes that NextAuth's `signOut` is a client-side function, so a server redirect to the built-in sign-out URL is used instead. |
| GET | `/api/plans` | `src/app/api/plans/route.ts` | Requires a session (`requireUserId()`); returns `401` if absent. Returns `{ plans }` for the current user, ordered by `year` desc then `month` desc. |
| POST | `/api/plans` | `src/app/api/plans/route.ts` | Requires a session; validates body with `CreatePlanSchema` (`title` optional max 80, `year` int 2000-2100, `month` int 1-12, `currency` 3 chars, default `"CZK"`). Falls back to a `${month}.${year}` title when none is given. Returns `201` with `{ plan }`, or `409` `{ error: "Plan for this month already exists" }` when the create throws (the in-code comment indicates a unique constraint on `(userId, year, month)`; the constraint itself is defined in the Prisma schema, not in this file). |
| GET | `/api/plans/{planId}` | `src/app/api/plans/[planId]/route.ts` | Requires a session; looks the plan up scoped to `userId` via `findFirst`, includes `items` ordered by `createdAt` asc. Returns `404` if not found or not owned by the caller, else `{ plan }`. |
| DELETE | `/api/plans/{planId}` | `src/app/api/plans/[planId]/route.ts` | Requires a session; confirms ownership via `findFirst`, returns `404` if absent, otherwise deletes via `prisma.plan.delete` and returns `{ ok: true }`. [NEEDS CLARIFICATION] Whether child `PlannedItem` rows are cascade-deleted is determined by the Prisma schema's relation definition, which is outside this module's inputs. |
| POST | `/api/plans/{planId}/items` | `src/app/api/plans/[planId]/items/route.ts` | Requires a session; confirms the plan exists and belongs to the caller (`404` otherwise); validates body with `CreateItemSchema` (`title` 1-120 chars, `amountCents` non-negative int, `categoryId` optional/nullable, `note` optional/nullable max 400 chars); creates the item via `prisma.plannedItem.create` and returns `201` with `{ item }`. |

## Configuration

### Environment Variables

[NEEDS CLARIFICATION] No `process.env` reads appear in any file in this module's inputs. Environment configuration (database connection string, NextAuth secret/providers, etc.) is referenced only indirectly through `@/lib/auth` and `@/lib/db`, both defined in the `lib` module, which is outside this module's input set.

| Variable | Required | Description |
|----------|----------|-------------|
| [NEEDS CLARIFICATION] | — | Not observable from `src/app` inputs; see the `lib` module's own technical documentation. |

### Secrets

[NEEDS CLARIFICATION] No secret handling is present in `src/app` inputs beyond consuming the `authOptions` object from `@/lib/auth`.

| Secret | Description |
|--------|-------------|
| [NEEDS CLARIFICATION] | Not observable from `src/app` inputs. |

### Notable hard-coded value

`src/app/logout/route.ts` builds its redirect URL with a literal base of
`http://localhost:3000` (`new URL("/api/auth/signout?callbackUrl=/login",
"http://localhost:3000")`) rather than reading a configured host/env variable.
This is a direct reading of the implementation, not an inference — flagging it
because a hard-coded localhost base would not resolve correctly outside local
development.

## Testing

[NEEDS CLARIFICATION] No test files (e.g. `*.test.ts`, `*.spec.ts`, `__tests__/`) and no `package.json` test script were present in this module's inputs, so the test command, framework, and current test coverage for the `app` module cannot be grounded here.
