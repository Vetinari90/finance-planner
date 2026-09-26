---
type: technical-concerns
audience: [developer]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technical Concerns: Planned Items

## Caching

### Overview

**Caching Enabled:** No evidence of caching in the grounded code.

No caching layer, technology, or cached keys are present. Each request queries the database directly through the shared Prisma client (`src/lib/db.ts`); the route handler (`src/app/api/plans/[planId]/items/route.ts`) sets no HTTP cache headers and uses no in-memory or external cache store (e.g. Redis).

## Data Validation

### Validation Layers

| Layer | Responsibility |
|-------|----------------|
| API | Zod schema (`CreateItemSchema`) validates request body shape and constraints before any persistence occurs |
| Database | No schema-level constraints (e.g. Prisma `@@` directives) were confirmed: the grounded inputs contain no Prisma schema file, and `src/lib/db.ts` only imports the generated Prisma client (`@/generated/prisma/client`) rather than a schema source; `prisma.plannedItem.create` in `src/app/api/plans/[planId]/items/route.ts` relies solely on the Zod schema above for validation |

### Field Validation Rules

#### PlannedItem

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| title | string | Yes | min 1, max 120 characters |
| amountCents | number (int) | Yes | integer, minimum 0 |
| categoryId | string | No | optional, nullable |
| note | string | No | optional, nullable, max 400 characters |

### Error Format

```json
{
  "error": "Invalid input",
  "details": { }
}
```

`details` is the output of `parsed.error.flatten()` (Zod), populated when `CreateItemSchema.safeParse(body)` fails.

### Common Error Codes

The grounded route handler (`src/app/api/plans/[planId]/items/route.ts`) does not use a structured error-code taxonomy (e.g. `REQUIRED`, `TOO_LONG`). It returns one of three fixed error strings tied to HTTP status: `401` `"Unauthorized"` (no authenticated session, from `requireUserId()`, line 19), `404` `"Not found"` (the plan does not exist or is not owned by the authenticated user, line 30), and `400` `"Invalid input"` (Zod validation failure via `CreateItemSchema.safeParse(body)`, with a `details` payload from `parsed.error.flatten()`, lines 36-40).
[NEEDS CLARIFICATION] [REVIEW] completeness: The Common Error Codes section covers only the 400 'Invalid input' validation error and omits the 401 'Unauthorized' and 404 'Not found' error responses that are evidenced in the same route file (src/app/api/plans/[planId]/items/route.ts, lines 19 and 30) this document is grounded in.

## Internationalization

No i18n/localization handling is present. The root layout hardcodes `lang="en"` (`src/app/layout.tsx`) and the grounded route handler (`src/app/api/plans/[planId]/items/route.ts`) returns fixed English error strings (`"Unauthorized"`, `"Not found"`, `"Invalid input"`) with no locale negotiation, translation catalog, or i18n library in use.
