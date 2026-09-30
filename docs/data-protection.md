---
type: cross-cutting
audience: [developer]
language: en
links: [docs/security.md, docs/decisions/0005-per-user-tenant-isolation.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Standards

## Authentication

Access to personal financial data (plans, planned items) requires an authenticated session; see [security.md](security.md) for the mechanism. Per-user isolation ([decisions/0005-per-user-tenant-isolation.md](decisions/0005-per-user-tenant-isolation.md)) additionally ensures that an authenticated user cannot read or modify another user's data, because every plan query filters by `userId`.

## API Conventions

Confirmed: No data-protection-specific API conventions (e.g. field-level redaction, a data-export-for-the-user endpoint, or a right-to-erasure endpoint beyond `DELETE /api/plans/{planId}`) were found in inputs.code, beyond the general conventions in [security.md](security.md).

## Error Handling

A plan owned by another user returns `{ error: "Not found" }` with HTTP 404, rather than a 403 `Forbidden`, so as not to confirm the resource's existence to a non-owner (`src/app/api/plans/[planId]/route.ts`). This is a data-protection-relevant choice, not merely a generic error-handling convention.

## Logging

Passwords are hashed with bcrypt before any persistence occurs (`src/app/api/auth/register/route.ts`); the Prisma client logs only `error`/`warn` levels (`src/lib/db.ts`). Confirmed: No explicit statement excluding PII or financial data (plan titles, item amounts, notes) from logs, and no data-retention or deletion policy beyond the single `DELETE /api/plans/{planId}` endpoint, was found in inputs.code or inputs.references.
