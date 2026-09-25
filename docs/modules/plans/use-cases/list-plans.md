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

# List Plans

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

An authenticated user views the list of all their monthly plans, each with a running total of its items, on the plans landing page.

### Actors

| Actor | Type | Description |
|-------|------|-------------|
| End user | Primary | Authenticated user visiting `/plans` (`src/app/plans/page.tsx`) |

### Preconditions

- [ ] The user has a valid session (`getServerSession(authOptions)` in `src/app/plans/page.tsx`); otherwise the page redirects to `/login`

### Postconditions

- [ ] The user sees every plan they own, ordered by year then month descending, each showing month/year, currency, item count, and a summed total in cents converted to a 2-decimal display

### Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-------------------|
| 1 | End user | Navigates to `/plans` | `PlansPage` (server component) calls `getServerSession(authOptions)` |
| 2 | System | Session present | Queries `prisma.plan.findMany({ where: { userId }, orderBy: [{ year: "desc" }, { month: "desc" }], include: { items: true } })` |
| 3 | System | For each plan, sums `items[].amountCents` and formats as `(sumCents / 100).toFixed(2)` | Renders a list item per plan with title (linking to `/plans/{id}`), `month.year`, currency, item count, and total |
| 4 | System | If no plans exist | Renders "No plans yet. Create one above." |

### Alternative Flows

None observed.

### Error Handling

| Error Condition | System Response |
|-------------------|-------------------|
| No authenticated session | `redirect("/login")` (server-side, via `next/navigation`) |

[NEEDS CLARIFICATION] `src/app/plans/page.tsx` does not appear to catch a database-query failure explicitly; behavior on a `prisma.plan.findMany` throw is not established by this module's inputs.

### Acceptance Criteria

#### AC-1: Plans listed in correct order with totals

```gherkin
Given an authenticated user has plans for 2026-07 and 2026-09
When they visit /plans
Then the 2026-09 plan is listed before the 2026-07 plan, each showing its item-sum total
```

#### AC-2: Empty state

```gherkin
Given an authenticated user has no plans
When they visit /plans
Then the page shows "No plans yet. Create one above."
```
<!-- /SLOT:content -->
