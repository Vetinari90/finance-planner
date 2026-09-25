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
| Method | Session-derived user id resolved via `requireUserId()` (imported from `@/lib/requireUser`); requests without a resolvable user id receive `401 Unauthorized`. The concrete authentication mechanism is NextAuth.js with a JWT session strategy (`session: { strategy: "jwt" }` in `src/lib/auth.ts`), backed by a `CredentialsProvider` that verifies email/password against `prisma.user` records via `bcrypt.compare()`. |
The concrete authentication mechanism is NextAuth.js configured for a JWT session strategy (`session: { strategy: "jwt" }` in `src/lib/auth.ts`), backed by a `CredentialsProvider` that authenticates email/password against `prisma.user` records via `bcrypt.compare()`; the resulting user id is stored on the token via the `jwt` callback and exposed on `session.user.id` via the `session` callback.
| Required Scopes | None. The session (`src/types/next-auth.d.ts`) carries only `id`, `name`, and `email` — there is no role or scope field. Authorization is enforced by data ownership rather than roles: every query scopes results to the authenticated user's own records (e.g. `prisma.plan.findFirst({ where: { id: planId, userId } })`). |

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

Authorization is derived from the NextAuth JWT session cookie, not a manually-set header: `requireUserId()` (`src/lib/requireUser.ts`) calls `getServerSession(authOptions)`, which reads and validates the session cookie set by NextAuth at login and returns `session?.user?.id` (or `null` if absent/invalid).
`requireUserId()` (`src/lib/requireUser.ts`) calls `getServerSession(authOptions)` — the NextAuth server helper — which reads and validates the JWT session cookie set by NextAuth at login and returns `session?.user?.id`, or `null` if no valid session exists. No Authorization header is read directly; the session cookie is parsed internally by NextAuth.

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
[NEEDS CLARIFICATION] [REVIEW] completeness: The POST /api/plans/{planId}/items success response status code (201, per `route.ts` line 53) is never documented; the Error Codes table and Response Example section cover only error statuses, silently omitting the success status.
|--------|------|------|
| 400 | Invalid input | Request body fails the `CreateItemSchema` Zod validation (`title` 1-120 chars, `amountCents` non-negative integer, `note` max 400 chars) |
| 401 | Unauthorized | `requireUserId()` resolves no user |
| 404 | Not Found | No plan with the given `planId` exists for the authenticated user (`prisma.plan.findFirst({ where: { id: planId, userId } })` returns null) |
The 404 row's Code value should read `Not found` (lowercase f), matching the exact error string returned by the route: `return NextResponse.json({ error: "Not found" }, { status: 404 })`.

---
