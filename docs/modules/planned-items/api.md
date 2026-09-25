---
type: api-spec
audience: [developer]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# API: Planned Items

## Overview

Based on the sole route handler found (`src/app/api/plans/[planId]/items/route.ts`), the Planned Items API currently exposes creation of a planned item (a budget line item) within a specific monthly plan.

[NEEDS CLARIFICATION] No route handlers for listing, updating, or deleting individual planned items were present in the inputs provided to this dispatch (only `route.ts` with a `POST` handler was included, per `generation.module-source-map` scoping this module to `src/app/api/plans/[planId]/items`); confirm whether such endpoints exist elsewhere in the codebase.

**Base Path:** `/api/plans/{planId}/items` (derived directly from the Next.js App Router file path `src/app/api/plans/[planId]/items/route.ts`, where `[planId]` is a dynamic route segment).

**OpenAPI Spec:** [NEEDS CLARIFICATION] No OpenAPI specification file was present in inputs.code or inputs.references.

## Authentication

| Requirement | Details |
|-------------|---------|
| Method | Session-derived user id resolved via `requireUserId()` (imported from `@/lib/requireUser`); requests without a resolvable user id receive `401 Unauthorized`. [NEEDS CLARIFICATION] The concrete authentication mechanism (e.g. JWT session cookie) is implemented outside the files available to this dispatch. |
| Required Scopes | [NEEDS CLARIFICATION] No scope/role model was found in the available inputs. |

## Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/plans/{planId}/items` | Create a planned item under the given plan | Yes |

[NEEDS CLARIFICATION] No GET (list/detail), PUT, PATCH, or DELETE handlers for planned items were present in the inputs available to this dispatch.

## Common Patterns

### Pagination

[NEEDS CLARIFICATION] The single grounded endpoint does not return a paginated collection; no pagination pattern is evidenced in inputs.

### Error Response

The grounded error shape, taken directly from `route.ts`, is:

```json
{
  "error": "Invalid input",
  "details": { }
}
```

For simpler failures (unauthorized, not found) the shape omits `details`:

```json
{
  "error": "Unauthorized"
}
```

`details` is populated with `parsed.error.flatten()` from Zod on `400` responses.

## Key Endpoints

### POST /api/plans/{planId}/items

**Purpose:** Create a new planned item (budget line) attached to the plan identified by `planId`, scoped to the authenticated user.

**Request Example:**

```bash
curl -X POST https://[NEEDS CLARIFICATION-host]/api/plans/{planId}/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Groceries", "amountCents": 5000, "categoryId": null, "note": null}'
```

[NEEDS CLARIFICATION] Authorization header/cookie mechanics were not present in the grounded route code; `requireUserId()` reads them internally but its implementation is outside this dispatch's inputs.

**Response Example:**

```json
{
  "item": {
    "planId": "...",
    "title": "Groceries",
    "amountCents": 5000,
    "categoryId": null,
    "note": null
  }
}
```

[NEEDS CLARIFICATION] The exact shape of the persisted `item` object (e.g. presence of `id`, `createdAt`) depends on the Prisma schema for `plannedItem`, which was not present in inputs.

**Error Codes:**

| Status | Code | When |
|--------|------|------|
| 400 | Invalid input | Request body fails the `CreateItemSchema` Zod validation (`title` 1-120 chars, `amountCents` non-negative integer, `note` max 400 chars) |
| 401 | Unauthorized | `requireUserId()` resolves no user |
| 404 | Not Found | No plan with the given `planId` exists for the authenticated user (`prisma.plan.findFirst({ where: { id: planId, userId } })` returns null) |

---
