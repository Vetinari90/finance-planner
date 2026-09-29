---
type: cross-cutting
audience: [developer]
language: en
links: [docs/modules/app/technical.md, docs/modules/lib/README.md, docs/modules/lib/technical.md, docs/modules/app/README.md, docs/decisions/0004-zod-validation-and-error-envelope.md, docs/security.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Standards

## Authentication

Token-based authentication is implemented via NextAuth `CredentialsProvider` with JWT sessions (`src/lib/auth.ts`, see `docs/modules/lib/technical.md`); see [Security](docs/security.md) for full detail.

## API Conventions

API routes are grouped under `/api` (`/api/auth/register`, `/api/plans`, `/api/plans/{planId}`, `/api/plans/{planId}/items`, `/api/auth/[...nextauth]`) - see `docs/modules/app/technical.md` for the full endpoint table. Note: Routes are not versioned in the URL path (no `/api/v1/...` prefix); no versioning scheme was found in inputs.code.

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET) |
| 201 | Created (register, plan, item) |
| 400 | Invalid input (zod validation failure) |
| 401 | Unauthorized (no session) |
| 404 | Not found (resource missing or not owned) |
| 409 | Conflict (duplicate email or duplicate plan) |

## Error Handling

Mutating routes validate input with `zod` `.safeParse()` and return `{ error, details }` JSON with HTTP 400 on failure (see `docs/decisions/0004-zod-validation-and-error-envelope.md`). Ownership/not-found failures return `{ error: "Not found" }` with 404; unauthenticated requests return `{ error: "Unauthorized" }` with 401.

## Logging

`src/lib/db.ts` configures Prisma client logging for `error` and `warn` levels only. Note: No application-level logging framework (beyond Prisma's own `log` option) was found in `src/app/*` or `src/lib/*`.
