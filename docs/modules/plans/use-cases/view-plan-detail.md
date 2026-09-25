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

# View Plan Detail

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

An authenticated user views a single plan's detail page, seeing its items and running total, and can add new items or delete the plan from there.

### Actors

| Actor | Type | Description |
|-------|------|-------------|
| End user | Primary | Authenticated user visiting `/plans/{planId}` (`src/app/plans/[planId]/page.tsx`) |

### Preconditions

- [ ] The user has a valid session; otherwise the page redirects to `/login`
- [ ] `planId` corresponds to a plan owned by the current user; otherwise the page calls `notFound()`

### Postconditions

- [ ] The page shows the plan's title, `month.year`, currency, computed total (`sum of items[].amountCents / 100`), an "Add item" form, a "Delete plan" button, and the item list (or "No items yet." when empty)

### Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-------------------|
| 1 | End user | Navigates to `/plans/{planId}` | `PlanDetailPage` (server component) calls `getServerSession(authOptions)`; redirects to `/login` if absent |
| 2 | System | Session present | Queries `prisma.plan.findFirst({ where: { id: params.planId, userId }, include: { items: { orderBy: { createdAt: "asc" } } } })` |
| 3 | System | Plan not found | Calls `notFound()` (Next.js 404) |
| 4 | System | Plan found | Computes `totalCents` as the sum of `items[].amountCents`, formats as `(totalCents / 100).toFixed(2)` |
| 5 | System | Renders page | Shows title, `month.year • currency`, total, `DeletePlanButton`, `AddItemForm`, and the items list (each item shows title, optional note, and formatted amount) |

### Alternative Flows

None observed beyond the not-found case documented in Error Handling.

### Error Handling

| Error Condition | System Response |
|-------------------|-------------------|
| No authenticated session | `redirect("/login")` |
| Plan does not exist, or exists but belongs to another user | `notFound()` (the `findFirst` filters by both `id` and `userId`, so ownership and existence are indistinguishable to the caller - both produce a 404 page) |

### Acceptance Criteria

#### AC-1: Detail page shows items and total

```gherkin
Given an authenticated user owns a plan with two items totaling 15000 cents
When they visit /plans/{planId}
Then the page shows both items and a total of "150.00 <currency>"
```

#### AC-2: Not found for other users' plans

```gherkin
Given an authenticated user does not own plan P
When they visit /plans/P
Then the page renders a 404 (not found)
```
<!-- /SLOT:content -->
