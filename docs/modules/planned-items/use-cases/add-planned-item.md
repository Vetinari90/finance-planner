---
type: use-case
audience: [developer, qa, business]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# UC-001: Add Planned Item

## Summary

An authenticated user adds a new budget line item (planned item) to one of their monthly plans.

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Authenticated User | Primary | A user with a resolvable session (`requireUserId()`) who owns the target plan |

## Preconditions

- [x] The user is authenticated (`requireUserId()` resolves a user id).
- [x] A plan identified by `planId` exists and is owned by the authenticated user.

## Postconditions

- [x] A new `plannedItem` record is persisted, linked to the plan via `planId`.
- [x] The created item is returned to the caller with HTTP `201`.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | User | Submits `POST /api/plans/{planId}/items` with `title`, `amountCents`, and optionally `categoryId`/`note` | Route handler invoked |
| 2 | System | Resolves the user id via `requireUserId()` | Proceeds if a user id is resolved |
| 3 | System | Looks up the plan (`prisma.plan.findFirst({ id: planId, userId })`) | Proceeds if the plan is found |
| 4 | System | Validates the request body against `CreateItemSchema` | Proceeds if valid |
| 5 | System | Persists the item (`prisma.plannedItem.create()`) | Returns `201` with the created item |

## Alternative Flows

This use case has no alternative (non-error) flows. The `POST /api/plans/{planId}/items` route handler follows a single linear success path: resolve the user id, look up the owned plan, validate the request body, and persist the item (see Main Flow, steps 1-5). All branching in the handler is error handling, covered in the Error Handling section below.

## Error Handling

| Error Condition | System Response |
|-----------------|-----------------|
| No resolvable user id | `401` `{"error": "Unauthorized"}` |
| Plan not found / not owned by user | `404` `{"error": "Not found"}` |
| Body fails `CreateItemSchema` validation | `400` `{"error": "Invalid input", "details": ...}` |

## Acceptance Criteria

### AC-1: Successful creation

```gherkin
Given an authenticated user who owns plan "planId"
When they POST a valid item body to /api/plans/{planId}/items
Then the response status is 201
And the response body contains the created item
```

### AC-2: Unauthenticated request rejected

```gherkin
Given a request with no resolvable user session
When it POSTs to /api/plans/{planId}/items
Then the response status is 401
```

### AC-3: Plan ownership enforced

```gherkin
Given an authenticated user who does not own plan "planId"
When they POST a valid item body to /api/plans/{planId}/items
Then the response status is 404
```

### AC-4: Invalid input rejected

```gherkin
Given an authenticated user who owns plan "planId"
When they POST a body with an empty title or a negative amountCents
Then the response status is 400
And the response includes validation error details
```
