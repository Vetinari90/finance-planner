---
type: cross-cutting
audience: [developer]
language: en
links: [docs/modules/lib/technical.md, docs/modules/app/technical.md, docs/decisions/0003-store-money-as-integer-cents.md, docs/decisions/0001-prisma-driver-adapter-postgresql.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Data Protection

## Authentication

User passwords are never stored in plaintext: `src/app/api/auth/register/route.ts` hashes the password with `bcrypt.hash(password, 12)` before persisting it via `prisma.user.create`, and `src/lib/auth.ts` verifies logins with `bcrypt.compare` rather than a plaintext comparison.

## API Conventions

No API-level data-classification or PII-tagging convention exists in this codebase. Endpoints return raw Prisma-selected fields directly without redaction or masking — e.g. `src/app/api/auth/register/route.ts` selects and returns `{ id, email, name }` for a newly created user, and `src/app/api/plans/[planId]/route.ts` returns the full `plan` record including its `items` — with no field-level classification metadata applied before serialization.

### HTTP Status Codes

No distinct status code exists for data-access-denied vs. not-found; both cases return a generic `404` `{ error: "Not found" }`. In `src/app/api/plans/[planId]/route.ts` and `src/app/api/plans/[planId]/items/route.ts`, `prisma.plan.findFirst({ where: { id: planId, userId } })` returns `404` whether the plan does not exist or exists but belongs to another user, deliberately avoiding leaking a resource's existence to non-owners via the status code.

## Error Handling

Validation error responses include the raw zod `flatten()` output (`{ error: "Invalid input", details: parsed.error.flatten() }`), which can echo back submitted field values. Zod's `flatten()` output contains only field-scoped validation error MESSAGES (the strings configured on each schema, e.g. the `RegisterSchema` message `"Minimálně 8 znaků"` for `password` in `src/app/api/auth/register/route.ts`), not the submitted field values; the echoed `details` therefore expose field NAMES (`email`, `password`) but never the raw email or password value entered by the user.

## Logging

`src/lib/db.ts` restricts Prisma logging to `["error", "warn"]` (not `"query"`), which limits the risk of logging full SQL parameter values (e.g. password hashes) at query level. No explicit PII-redaction or log-scrubbing rule exists for Prisma's error/warn output; `src/lib/db.ts` relies solely on excluding `"query"` from the `log` option (`log: ["error", "warn"]`) to prevent full SQL statements and parameter values (such as password hashes) from being logged at the query level.
