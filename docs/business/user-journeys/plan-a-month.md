---
type: documentation
audience: [developer]
language: en
links: []
generated_from: e9427eb628c7bd0263034f7b39829026b6935d52
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:be70e56cf13a6a6d46a56c3b9a73343a5445547498bf19feb637d0805163bf7b
---

# Plan A Month

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
**Summary:** A signed-in finance-planner user sets up a monthly budget by creating a plan for a given year and month, adding the items they expect to spend or earn that month, and reviewing the plan's running total, per the [auth](../../modules/auth/overview.md) and [plans](../../modules/plans/overview.md) module overviews.

### Overview

The user accomplishes monthly budget tracking: they create a financial plan scoped to a specific year and month, populate it with planned items, and review the resulting running total. This is grounded in the [plans module overview](../../modules/plans/overview.md), which describes "monthly financial plan management for an authenticated user: creating a plan for a given year/month, listing existing plans, viewing a single plan's detail (with its items and running total), and deleting a plan."

[NEEDS CLARIFICATION] `README.md` is generic Next.js boilerplate with no finance-planner-specific business framing (e.g. why a user would want to plan a month, or what "planned item" categories exist), so the business motivation behind this journey beyond what the module overviews describe could not be confirmed.

### Actor

An authenticated finance-planner user - someone who already has an account and is signed in. Session-gated access to a user's own plans is provided by the [auth module](../../modules/auth/overview.md), which "issues the session that gates access to a user's own plans." A first-time user must complete account creation and sign-in before this journey begins; that flow is documented separately in [first-time-signup.md](first-time-signup.md).

[NEEDS CLARIFICATION] No persona name, role title, or explicit motivation statement for this actor was present in `inputs.references` (`README.md`) or in the available module overviews.

### Steps

1. **Sign in**: The user authenticates via the credentials sign-in UI (`src/app/login/LoginClient.tsx`), which calls `signIn("credentials", { email, password, redirect: false, ... })`, per the [auth module overview](../../modules/auth/overview.md). A valid session is required for every subsequent step.
2. **Create a plan**: The user submits a "new plan" form which calls `POST /api/plans`, validated by Zod for `title`/`year`/`month`/`currency`. `title` defaults to `${month}.${year}` and `currency` defaults to `CZK` when not supplied, per the [plans module overview](../../modules/plans/overview.md).
3. **View the plan**: The user opens the plan detail page, which calls `GET /api/plans/{planId}` and returns the plan together with its items and running total, per the [plans module overview](../../modules/plans/overview.md).
4. **Add planned items**: The user adds items to the plan via the "add item" form (`AddItemForm.tsx`), which posts to the planned-items endpoint `/api/plans/{planId}/items`, per the Dependents section of the [plans module overview](../../modules/plans/overview.md). [NEEDS CLARIFICATION] The exact fields, validation rules, and UI flow for adding a planned item could not be confirmed: `docs/modules/planned-items/overview.md`, named as a module-doc input for this journey, was still an unfilled `[UNFILLED]` skeleton at the time of this generation run.
5. **Review and optionally delete the plan**: The user may delete the plan via the "delete plan" button (`DeletePlanButton.tsx`), which calls `DELETE /api/plans/{planId}` after ownership is verified, per the [plans module overview](../../modules/plans/overview.md).

[NEEDS CLARIFICATION] How the plan detail page and its running-total display render on screen (layout, formatting, responsiveness) could not be confirmed: `docs/modules/web-ui/overview.md`, named as a module-doc input for this journey, was still an unfilled `[UNFILLED]` skeleton at the time of this generation run.

### Success Outcome

At the end of this journey, the user has a plan for the target month, populated with the items they added, and can see the plan's running total on the plan detail page, per the [plans module overview](../../modules/plans/overview.md) ("viewing a single plan's detail (with its items and running total)").

### Notes

[NEEDS CLARIFICATION] Alternative paths (e.g. editing an existing item, handling validation errors on the new-plan or add-item forms) and pain points could not be confirmed. `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, and `docs/modules/web-ui/overview.md`, all named as module-doc inputs for this journey, were still unfilled `[UNFILLED]` skeletons at the time of this generation run; they may resolve these gaps once populated.
<!-- /SLOT:content -->
