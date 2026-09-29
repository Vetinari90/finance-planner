---
type: cross-cutting
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/lib/technical.md, docs/modules/app/README.md, docs/modules/app/technical.md, docs/decisions/0002-credentials-auth-with-jwt-sessions.md, docs/decisions/0001-security-baseline.md, docs/decisions/0005-per-user-tenant-isolation.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Security

## Authentication

The application uses NextAuth's `CredentialsProvider` (email + password) with `session: { strategy: "jwt" }` (`src/lib/auth.ts`, see `docs/modules/lib/technical.md`). Passwords are hashed with bcrypt at cost factor 12 on registration and verified with `bcrypt.compare` on login (`src/app/api/auth/register/route.ts`, `src/lib/auth.ts`; see `docs/decisions/0002-credentials-auth-with-jwt-sessions.md`). No `secret` option is set explicitly in `authOptions` (`src/lib/auth.ts`); NextAuth's JWT session strategy requires a signing secret, conventionally supplied via the `NEXTAUTH_SECRET` environment variable at deploy time, which is not part of `inputs.code`.

## API Conventions

Every protected API route calls `requireUserId()` (`src/lib/requireUser.ts`) before performing any read or write, and returns HTTP 401 if no authenticated session exists. Plan and item queries are additionally scoped by both resource id and `userId` (e.g. `prisma.plan.findFirst({ where: { id: planId, userId } })` in `src/app/api/plans/[planId]/route.ts`), enforcing per-user data isolation (see `docs/decisions/0005-per-user-tenant-isolation.md`).

### HTTP Status Codes

| Code | Meaning (as used in this project) |
|------|-------------|
| 200 | Successful GET (e.g. `src/app/api/plans/route.ts`) |
| 201 | Resource created (register, plan, item) |
| 400 | zod validation failure (`parsed.error.flatten()`) |
| 401 | No authenticated session (`requireUserId()` returned `null`) |
| 404 | Resource not found or not owned by the requesting user |
| 409 | Conflict (duplicate email on register; duplicate plan for user/year/month) |

## Error Handling

API routes return errors as JSON with an `error` field and, for validation failures, a `details` field containing the zod flattened error (`{ error: "Invalid input", details: parsed.error.flatten() }`, e.g. `src/app/api/auth/register/route.ts`). The project's error envelope is limited to `{ error: string }` (with an additional `details` field carrying the zod flattened error on validation failures); no `code` or `requestId` field appears in any API response (e.g. `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`).

## Logging

`src/lib/db.ts` configures Prisma logging for `["error", "warn"]` only. [NEEDS CLARIFICATION] No explicit statement confirming that passwords, tokens, or PII are excluded from these Prisma error/warn logs was found in inputs.code.
