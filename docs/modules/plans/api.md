---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 983341781c05105b2104725ca48c43ffa23ea03a
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Api

## api.md

<!-- SLOT:content brief="Document content (api.md)" -->
### Overview

The plans module exposes REST endpoints for creating, listing, viewing, and deleting a user's monthly financial plans. All endpoints are implemented as Next.js route handlers under `src/app/api/plans` (`src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts`).

**Base Path:** `/api/plans`

**OpenAPI Spec:** [NEEDS CLARIFICATION] No OpenAPI/Swagger specification file was present in inputs.code.

### Authentication

| Requirement | Details |
|-------------|---------|
| Method | Every handler calls `requireUserId()` (imported from `@/lib/requireUser`) before doing any work. If it returns a falsy value, the handler responds `401 { "error": "Unauthorized" }` and stops. |
| Required Scopes | None. Access is gated solely by authentication (`requireUserId()` must resolve a valid user id) plus row-level ownership filtering on `userId`; no scope or permission model exists in `src/app/api/plans/route.ts` or `src/app/api/plans/[planId]/route.ts`. |

### Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/api/plans` | List all plans owned by the current user | Yes |
| POST | `/api/plans` | Create a new plan for the current user | Yes |
| GET | `/api/plans/{planId}` | Get a single plan (with its items) owned by the current user | Yes |
| DELETE | `/api/plans/{planId}` | Delete a plan owned by the current user | Yes |

Item management under a plan (`/api/plans/{planId}/items`) is implemented outside this module's manifest, in the planned-items module (see `src/app/api/plans/[planId]/items`, out of scope for this document); `AddItemForm.tsx` in this module calls that endpoint as a client.

### Common Patterns

#### Error Response

Every error response observed in `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts` follows the same flat shape:

```json
{
  "error": "Human readable message"
}
```

Validation failures additionally carry a `details` field with the Zod flattened error tree (see POST `/api/plans` below). There is no `error.code` field in this module's responses (unlike the generic recipe pattern) - callers should key off the HTTP status and the `error` string.

### Key Endpoints

#### GET `/api/plans`

**Purpose:** List all plans belonging to the authenticated user, ordered by year then month descending (`orderBy: [{ year: "desc" }, { month: "desc" }]`).

**Response Example:**

```json
{
  "plans": [
    { "id": "...", "userId": "...", "title": "9.2026", "year": 2026, "month": 9, "currency": "CZK" }
  ]
}
```

**Error Codes:**

| Status | Message | When |
|--------|---------|------|
| 401 | `Unauthorized` | `requireUserId()` returns no user |

#### POST `/api/plans`

**Purpose:** Create a new monthly plan for the authenticated user.

**Request body validated with Zod (`CreatePlanSchema`)** in `src/app/api/plans/route.ts`:

| Field | Type | Constraint | Default |
|-------|------|------------|---------|
| `title` | string | optional, 1-80 chars | `${month}.${year}` when omitted |
| `year` | integer | 2000-2100 | required |
| `month` | integer | 1-12 | required |
| `currency` | string | exactly 3 chars | `"CZK"` |

**Request Example:**

```bash
curl -X POST https://<host>/api/plans \
  -H "Content-Type: application/json" \
  -d '{"year": 2026, "month": 9, "currency": "CZK"}'
```

**Response Example (201):**

```json
{
  "plan": { "id": "...", "userId": "...", "year": 2026, "month": 9, "currency": "CZK", "title": "9.2026" }
}
```

**Error Codes:**

| Status | Message | When |
|--------|---------|------|
| 401 | `Unauthorized` | `requireUserId()` returns no user |
| 400 | `Invalid input` (with `details` from `parsed.error.flatten()`) | Zod validation fails |
| 409 | `Plan for this month already exists` | The Prisma `create` call throws (caught generically as `e: any`), which the code comment attributes to a unique constraint on `(userId, year, month)`. The route does not inspect the Prisma error code before returning 409, so any create failure currently maps to this message - [NEEDS CLARIFICATION] whether other Prisma failures should map to a different status. |

#### GET `/api/plans/{planId}`

**Purpose:** Fetch a single plan owned by the current user, including its items ordered by `createdAt` ascending.

**Response Example:**

```json
{
  "plan": { "id": "...", "title": "...", "items": [ { "id": "...", "title": "...", "amountCents": 12345 } ] }
}
```

**Error Codes:**

| Status | Message | When |
|--------|---------|------|
| 401 | `Unauthorized` | `requireUserId()` returns no user |
| 404 | `Not found` | No plan matches `{ id: planId, userId }` (covers both "does not exist" and "belongs to another user") |

#### DELETE `/api/plans/{planId}`

**Purpose:** Delete a plan owned by the current user.

**Response Example (200):**

```json
{ "ok": true }
```

**Error Codes:**

| Status | Message | When |
|--------|---------|------|
| 401 | `Unauthorized` | `requireUserId()` returns no user |
| 404 | `Not found` | Ownership check (`prisma.plan.findFirst({ where: { id: planId, userId }, select: { id: true } })`) finds nothing before the delete is attempted |

[NEEDS CLARIFICATION] Whether deleting a plan cascades to its items at the database level is not established by `src/app/api/plans/[planId]/route.ts` alone (it only calls `prisma.plan.delete`); the Prisma schema that would define `onDelete` behavior is not in this module's inputs.
<!-- /SLOT:content -->
