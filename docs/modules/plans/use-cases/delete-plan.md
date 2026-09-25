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

# Delete Plan

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

An authenticated user deletes one of their own plans from the plan-detail page, after a browser confirmation.

### Actors

| Actor | Type | Description |
|-------|------|-------------|
| End user | Primary | Authenticated user clicking "Delete plan" on `DeletePlanButton.tsx` (rendered from `src/app/plans/[planId]/page.tsx`) |

### Preconditions

- [ ] The user has a valid session
- [ ] The plan identified by `planId` belongs to the current user

### Postconditions

- [ ] The plan row (and, per the route handler, only the plan row itself - see [NEEDS CLARIFICATION] on cascade behavior in data-model.md) no longer exists
- [ ] The browser navigates to `/plans` and the list no longer shows the deleted plan

### Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-------------------|
| 1 | End user | Clicks "Delete plan" on the plan detail page | `DeletePlanButton.tsx` shows a `confirm("Delete this plan? This cannot be undone.")` browser dialog |
| 2 | End user | Confirms the dialog | Client sends `DELETE /api/plans/{planId}` |
| 3 | System | `src/app/api/plans/[planId]/route.ts` calls `requireUserId()`, then `prisma.plan.findFirst({ where: { id: planId, userId }, select: { id: true } })` to verify ownership | Proceeds only if the plan is found |
| 4 | System | Calls `prisma.plan.delete({ where: { id: planId } })` | Returns `200 { "ok": true }` |
| 5 | Client | `DeletePlanButton.tsx` on success calls `router.push("/plans")` and `router.refresh()` | User is returned to the plans list |

### Alternative Flows

#### AF-1: User cancels the confirmation dialog

**Branches from:** Step 1

| Step | Action | Response |
|------|--------|----------|
| 1.1 | User clicks "Cancel" in the `confirm()` dialog | `onDelete()` returns early; no request is sent |

**Continues at:** N/A (use case ends without effect)

### Error Handling

| Error Condition | System Response |
|-------------------|-------------------|
| No authenticated session | `401 { "error": "Unauthorized" }` |
| Plan not found for this user | `404 { "error": "Not found" }`; `DeletePlanButton.tsx` shows a generic `alert("Delete failed")` since it only checks `res.ok` |

### Acceptance Criteria

#### AC-1: Owner can delete their plan

```gherkin
Given an authenticated user owns plan P
When they confirm deletion of plan P
Then the plan is deleted, the API returns { "ok": true }, and the user is redirected to /plans
```

#### AC-2: Cannot delete another user's plan

```gherkin
Given an authenticated user does not own plan P
When they send DELETE /api/plans/P
Then the API responds 404 Not found and the plan is not deleted
```
<!-- /SLOT:content -->
