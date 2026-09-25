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

# Create Monthly Plan

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

An authenticated user creates a new monthly financial plan by choosing a year, month, currency, and optional title, so a fresh plan exists for tracking that month's items.

### Actors

| Actor | Type | Description |
|-------|------|-------------|
| End user | Primary | Authenticated user submitting `NewPlanForm.tsx` on the plans list page (`src/app/plans/page.tsx`) |

### Preconditions

- [ ] The user has a valid session (`requireUserId()` in `src/app/api/plans/route.ts` succeeds); otherwise `POST /api/plans` returns `401 Unauthorized`
- [ ] No existing plan for the same `(userId, year, month)` combination

### Postconditions

- [ ] A new plan row exists with the submitted `year`, `month`, `currency`, and `title` (or the default title `${month}.${year}`)
- [ ] The plans list page reflects the new plan after `router.refresh()` (`NewPlanForm.tsx`)

### Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-------------------|
| 1 | End user | Fills the year, month, currency, and optional title fields in `NewPlanForm.tsx` and submits | Client sends `POST /api/plans` with the form values as JSON |
| 2 | System | `src/app/api/plans/route.ts` calls `requireUserId()` | Proceeds only if a user id is returned |
| 3 | System | Validates the body with `CreatePlanSchema` (Zod) | Proceeds only if validation passes |
| 4 | System | Calls `prisma.plan.create({ data: { userId, year, month, currency, title } })` | Returns `201` with `{ plan }` on success |
| 5 | System | `NewPlanForm.tsx` clears the title field and calls `router.refresh()` | Plans list re-fetches and displays the new plan |

### Alternative Flows

None observed beyond the error paths listed under Error Handling.

### Error Handling

| Error Condition | System Response |
|-------------------|-------------------|
| No authenticated session | `401 { "error": "Unauthorized" }` |
| `year`/`month`/`currency`/`title` fail Zod validation | `400 { "error": "Invalid input", "details": ... }`; `NewPlanForm.tsx` shows `data?.error` in the form |
| A plan for the same `(userId, year, month)` already exists | `409 { "error": "Plan for this month already exists" }`; shown the same way in the form |
| Network failure during `fetch` | `AddItemForm`/`NewPlanForm` pattern: caught and shown as `"Network error"` in `NewPlanForm.tsx` |

### Acceptance Criteria

#### AC-1: Successful plan creation

```gherkin
Given an authenticated user with no plan for July 2026
When they submit the new-plan form with year=2026, month=7, currency="CZK"
Then a plan is created and returned with status 201, and appears in "Existing plans"
```

#### AC-2: Duplicate month rejected

```gherkin
Given an authenticated user already has a plan for July 2026
When they submit the new-plan form again with year=2026, month=7
Then the request is rejected with status 409 and the message "Plan for this month already exists"
```
<!-- /SLOT:content -->
