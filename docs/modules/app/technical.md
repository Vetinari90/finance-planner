---
type: technical
audience: [developer]
language: en
links: [docs/modules/app/README.md, docs/modules/lib/technical.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technical: App (src/app)

## API Endpoints

**Base Path:** `/api`

| Method | Path | Description |
|--------|------|-------------|
| GET, POST | `/api/auth/[...nextauth]` | NextAuth.js catch-all handler built from `authOptions` (`src/app/api/auth/[...nextauth]/route.ts`). |
| POST | `/api/auth/register` | Registers a new user: validates body with `RegisterSchema` (zod), hashes the password with bcrypt (cost 12), returns `{ user }` with status 201, or 409 if the email already exists, or 400 on invalid input (`src/app/api/auth/register/route.ts`). |
| GET | `/api/plans` | Lists the authenticated user's plans, ordered by year desc then month desc. Returns 401 if unauthenticated (`src/app/api/plans/route.ts`). |
| POST | `/api/plans` | Creates a plan for the authenticated user; validates body with `CreatePlanSchema` (zod); returns 201 with `{ plan }`, 400 on invalid input, or 409 if a plan already exists for that user/year/month (`src/app/api/plans/route.ts`). |
| GET | `/api/plans/{planId}` | Returns a single plan owned by the authenticated user, including its items ordered by `createdAt` ascending; 401 if unauthenticated, 404 if not found or not owned (`src/app/api/plans/[planId]/route.ts`). |
| DELETE | `/api/plans/{planId}` | Deletes a plan owned by the authenticated user; 401 if unauthenticated, 404 if not found or not owned (`src/app/api/plans/[planId]/route.ts`). |
| POST | `/api/plans/{planId}/items` | Adds a planned item to a plan owned by the authenticated user; validates body with `CreateItemSchema` (zod); 401 if unauthenticated, 404 if the plan is not found/owned, 400 on invalid input, 201 with `{ item }` on success (`src/app/api/plans/[planId]/items/route.ts`). |
| GET | `/logout` | Redirects to NextAuth's built-in sign-out URL (`/api/auth/signout?callbackUrl=/login`) against a hardcoded base URL `http://localhost:3000` (`src/app/logout/route.ts`). |

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|--------------|
| DATABASE_URL | [NEEDS CLARIFICATION - see `docs/modules/lib/technical.md`] | Consumed indirectly via `src/lib/db.ts`; the app module does not read it directly. |
Yes

[NEEDS CLARIFICATION] No `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, or similar NextAuth environment variable read was found in `src/app` or `src/lib/auth.ts`; the JWT signing key source could not be confirmed from inputs.code.

### Secrets

| Secret | Description |
|--------|-------------|
| User password hash | Stored via `bcrypt.hash(password, 12)` in `src/app/api/auth/register/route.ts`; verified via `bcrypt.compare` in `src/lib/auth.ts`. Plaintext passwords are never persisted. |

## Testing

[NEEDS CLARIFICATION] No test files (e.g. `*.test.ts`, `*.spec.ts`) and no `package.json` test script were present in inputs.code; the testing approach for this module could not be confirmed.
