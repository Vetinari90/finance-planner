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

# Overview

## overview.md

<!-- SLOT:content brief="Document content (overview.md)" -->
### Purpose

The plans module provides monthly financial plan management for an authenticated user: creating a plan for a given year/month, listing existing plans, viewing a single plan's detail (with its items and running total), and deleting a plan. It is implemented as Next.js API route handlers (`src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`) plus server-rendered pages and client forms (`src/app/plans/page.tsx`, `src/app/plans/NewPlanForm.tsx`, `src/app/plans/[planId]/page.tsx`, `src/app/plans/[planId]/AddItemForm.tsx`, `src/app/plans/[planId]/DeletePlanButton.tsx`).

### Responsibilities

- Create a new plan for the current user, validating `title`/`year`/`month`/`currency` with Zod and defaulting `title` to `${month}.${year}` and `currency` to `CZK` (`POST /api/plans`).
- List all plans owned by the current user, ordered by year then month descending (`GET /api/plans`).
- Fetch a single plan owned by the current user together with its items, ordered by creation time (`GET /api/plans/{planId}`).
- Delete a plan owned by the current user, after verifying ownership (`DELETE /api/plans/{planId}`).
- Render the plans list page and plan-detail page, including a "new plan" form, an "add item" form, and a "delete plan" button.

### Boundaries

**This module does NOT:**

- Manage plan items beyond displaying them and initiating their creation via a client call - item persistence/validation is implemented under `src/app/api/plans/[planId]/items`, which per the project's module-source-map belongs to the planned-items module, not this one.
- Authenticate users itself - it calls `requireUserId()` (from `@/lib/requireUser`) and, on the page side, `getServerSession(authOptions)` (from `@/lib/auth`), both outside this module.
- Persist data directly - all reads/writes go through the shared Prisma client (`prisma` from `@/lib/db`), owned by the persistence module.

### Key Entities

| Entity | Description |
|--------|-------------|
| Plan | A user's monthly financial plan (year, month, currency, title) |

See: [domain-model.md](domain-model.md)

### Dependencies

| Module | Purpose |
|--------|---------|
| auth | Resolves the current user for both API routes (`requireUserId()`) and the server-rendered pages (`getServerSession(authOptions)`); redirects to `/login` when unauthenticated |
| persistence | Provides the Prisma client (`@/lib/db`) used for all plan CRUD queries |

### Dependents

| Module | Uses For |
|--------|----------|
| planned-items | Items are created and read in the context of a `planId` owned by this module; `AddItemForm.tsx` in this module posts to the planned-items endpoint `/api/plans/{planId}/items` |
<!-- /SLOT:content -->
