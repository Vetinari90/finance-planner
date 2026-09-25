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

# UC-002: List Plan Items

## Summary

This use case describes listing the planned items belonging to a plan. There is no dedicated REST endpoint for this operation; instead, `src/app/plans/[planId]/page.tsx` implements it as a Next.js Server Component that queries the plan together with its items (ordered by `createdAt` ascending) scoped to the authenticated user, and renders them with a computed running total.

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Authenticated User (Plan Owner) | Primary | The signed-in user who owns the plan; the plan detail page resolves the session via `getServerSession` and scopes the plan lookup to `userId: session.user.id` |

## Preconditions

The user must be authenticated (an active NextAuth session); unauthenticated requests are redirected to `/login`. The requested plan must exist and be owned by the authenticated user, identified by matching `planId` and `userId`.
[NEEDS CLARIFICATION] [REVIEW] completeness: The Main Flow (and similarly Preconditions/Postconditions/Alternative Flows/Error Handling) sections are left as bare 'not grounded' placeholders, but src/app/plans/[planId]/page.tsx contains a grounded listing flow: it queries the plan with its items (ordered by createdAt asc) scoped to the authenticated userId, returns 404 via notFound() if the plan isn't found/owned, and renders the items (title, note, amount) with a computed total. This input-evident material is absent from the documented flow sections despite being available in codeFiles.

## Postconditions

The plan's details and its planned items (title, note, and amount) are rendered to the user, along with a computed total (the sum of each item's `amountCents`, formatted as currency). No data is created, modified, or deleted.

## Main Flow

1. The user navigates to `/plans/{planId}`.
2. The server resolves the current session via `getServerSession`; if there is no authenticated user, the request is redirected to `/login`.
3. The server queries the plan by `id` and `userId`, including its items ordered by `createdAt` ascending.
4. If no matching plan is found, the server responds with a 404 (`notFound()`).
5. The server computes the total amount by summing each item's `amountCents` and formatting it to two decimal places.
6. The page renders the plan's title, month/year, and currency, the computed total, and the list of items (title, note if present, and amount) for the user to review.

## Alternative Flows

If the plan has no items, the page renders the message "No items yet." instead of an item list.

## Error Handling

If the user has no authenticated session, the request is redirected to `/login`. If the plan does not exist or is not owned by the authenticated user, the server responds with a 404 (`notFound()`), rendering the Next.js not-found page.

## Acceptance Criteria

- An authenticated user visiting `/plans/{planId}` for a plan they own sees the plan's items listed in creation order, each showing title, optional note, and amount, along with a computed total.
- An authenticated user visiting `/plans/{planId}` for a plan with no items sees the message "No items yet."
- An unauthenticated user visiting `/plans/{planId}` is redirected to `/login`.
- A user visiting `/plans/{planId}` for a plan that does not exist or that they do not own receives a 404 response.
