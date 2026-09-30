---
type: technical
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Technical: app

## API Endpoints

**Base Path:** `/api`

| Method | Path | Description | Source |
|--------|------|-------------|--------|
| POST | `/api/auth/register` | Create a new user account (email, password, optional name); bcrypt-hashes the password before storage. | `src/app/api/auth/register/route.ts` |
| GET / POST | `/api/auth/[...nextauth]` | NextAuth-managed authentication endpoints (credentials sign-in, session, callback, signout), delegated to the NextAuth handler configured with `authOptions`. | `src/app/api/auth/[...nextauth]/route.ts` |
| GET | `/logout` | Redirects to NextAuth's built-in signout URL with `callbackUrl=/login`. | `src/app/logout/route.ts` |
| GET | `/api/plans` | List the current user's plans, ordered by year/month descending. Requires an authenticated session. | `src/app/api/plans/route.ts` |
| POST | `/api/plans` | Create a new plan (`year`, `month`, `currency`, optional `title`). Returns 409 if a plan for that user/year/month already exists. | `src/app/api/plans/route.ts` |
| GET | `/api/plans/{planId}` | Fetch a plan (with its items) owned by the current user. Returns 404 if not owned/found. | `src/app/api/plans/[planId]/route.ts` |
| DELETE | `/api/plans/{planId}` | Delete a plan owned by the current user. Returns 404 if not owned/found. | `src/app/api/plans/[planId]/route.ts` |
| POST | `/api/plans/{planId}/items` | Add a planned item (`title`, `amountCents`, optional `categoryId`/`note`) to a plan owned by the current user. | `src/app/api/plans/[planId]/items/route.ts` |

Page routes rendering UI (not JSON APIs): `/`, `/login`, `/register`, `/plans`, `/plans/{planId}`.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string; `src/lib/db.ts` throws at startup if unset. |

[NEEDS CLARIFICATION] NextAuth typically requires additional configuration (e.g. a signing secret) in production, but no such environment variable is referenced anywhere in inputs.code.

### Secrets

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Contains database credentials; treated as a secret connection string. |

[NEEDS CLARIFICATION] No other secrets (e.g. a NextAuth signing secret) were found referenced in inputs.code.

## Testing

[NEEDS CLARIFICATION] No test files, test framework configuration, or `package.json` scripts are present in inputs.code or inputs.references to describe how this module is tested.
