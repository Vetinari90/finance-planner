---
type: cross-cutting
audience: [developer]
language: en
links: [docs/decisions/0002-credentials-auth-with-jwt-sessions.md, docs/decisions/0001-security-baseline.md, docs/decisions/0004-zod-validation-and-error-envelope.md, docs/modules/app/technical.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Standards

## Authentication

The application uses NextAuth's `CredentialsProvider` with JWT-based sessions (`session: { strategy: "jwt" }`, `src/lib/auth.ts`). Passwords are hashed with bcrypt (cost factor 12) at registration (`src/app/api/auth/register/route.ts`) and verified with `bcrypt.compare` at sign-in. Every plan and item API route resolves the current user via `requireUserId()` (`src/lib/requireUser.ts`) and returns HTTP 401 when no session is present. See [decisions/0002-credentials-auth-with-jwt-sessions.md](decisions/0002-credentials-auth-with-jwt-sessions.md) and [decisions/0001-security-baseline.md](decisions/0001-security-baseline.md).

No `NEXTAUTH_SECRET` or token lifetime (JWT `maxAge`) configuration is set in `src/lib/auth.ts` or the NextAuth route handler (`src/app/api/auth/[...nextauth]/route.ts`); NextAuth's default JWT session settings apply, and `NEXTAUTH_SECRET` must be supplied via environment variable at deploy time rather than in application code.

## API Conventions

Observed routes follow REST-style plural resource naming under `/api/plans`, with a nested `/api/plans/{planId}/items` collection, using GET/POST/DELETE per resource (see [modules/app/technical.md](modules/app/technical.md)). No API version prefix (e.g. `/api/v1/...`) is present in the routes found in inputs.code. [NEEDS CLARIFICATION] whether API versioning is planned.

## Error Handling

Handlers return `NextResponse.json({ error: "<message>" }, { status })` with status codes 400 (validation, via zod `safeParse`), 401 (unauthenticated), 404 (not found / not owned), and 409 (unique-constraint conflicts, e.g. duplicate plan for a month or duplicate registration email); validation failures additionally include `details: parsed.error.flatten()`. No explicit 5xx handling or a `requestId` field was observed in inputs.code. See [decisions/0004-zod-validation-and-error-envelope.md](decisions/0004-zod-validation-and-error-envelope.md).

## Logging

`src/lib/db.ts` configures the Prisma client with `log: ["error", "warn"]`. No application-level logging (INFO/DEBUG) beyond Prisma's built-in `error`/`warn` logs is present in inputs.code: no `console.log`/`console.info`/`console.debug`/`console.warn`/`console.error` calls appear anywhere in the application source. Passwords are bcrypt-hashed (`src/app/api/auth/register/route.ts`) before being persisted via `prisma.user.create`, so plaintext passwords are never available to be logged; no other explicit PII log-exclusion statement was found.
