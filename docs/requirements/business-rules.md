---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 983341781c05105b2104725ca48c43ffa23ea03a
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:d33fdb3f7ae1daded7dd01637bd972ca815ff8d2f5f33a35eed05233d91bc3c2
---

# Business Rules

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

This document collects the business rules that govern the finance-planner application's monthly financial planning workflow. It is synthesized from the generated module overview documents and from the project `README.md`. As of this generation, only the [plans module overview](../modules/plans/overview.md) has been generated with substantive content; the auth, planned-items, persistence, and web-ui module overviews were still unfilled skeletons at synthesis time, so most of this document is grounded in the plans module alone, with the remaining areas marked as needing clarification below.

### Plan Ownership and Access

- A plan belongs to the authenticated user who created it. Listing plans, fetching a single plan's detail, and deleting a plan are all scoped to the "current user" resolved via `requireUserId()` (API routes) or `getServerSession(authOptions)` (server-rendered pages). (Source: [plans module overview](../modules/plans/overview.md))
- Before a plan is deleted, the system verifies that the requesting user owns the plan. (Source: [plans module overview](../modules/plans/overview.md))
- [NEEDS CLARIFICATION] The specific business rules for account registration, sign-in, and session/credential handling (e.g. password requirements, session lifetime) could not be grounded: `docs/modules/auth/overview.md` was an unfilled skeleton at synthesis time.

### Plan Creation Rules

- Creating a plan requires `title`, `year`, `month`, and `currency`, validated with Zod at the API boundary (`POST /api/plans`). (Source: [plans module overview](../modules/plans/overview.md))
- If `title` is not supplied, it defaults to `${month}.${year}`. (Source: [plans module overview](../modules/plans/overview.md))
- If `currency` is not supplied, it defaults to `CZK`. (Source: [plans module overview](../modules/plans/overview.md))
- [NEEDS CLARIFICATION] Whether a user may have more than one plan for the same year/month, and any other uniqueness or range constraints on `year`/`month`/`currency` beyond Zod validation, were not established by the available inputs.

### Plan Listing and Detail Rules

- Plans are listed ordered by year, then by month, descending (`GET /api/plans`). (Source: [plans module overview](../modules/plans/overview.md))
- A single plan's detail includes its items, ordered by creation time, together with a running total. (Source: [plans module overview](../modules/plans/overview.md))
- [NEEDS CLARIFICATION] The exact definition and calculation basis of the "running total" (e.g. whether it sums planned amounts, actual amounts, or both, and how currency conversion or rounding is handled) was not established by the available inputs.

### Planned Item Rules

- Planned items are created and read in the context of a `planId` owned by the plans module, via the endpoint `/api/plans/{planId}/items`; the plans module's "add item" form posts to this endpoint. (Source: [plans module overview](../modules/plans/overview.md))
- [NEEDS CLARIFICATION] The validation rules, allowed fields, and constraints for an individual planned item (e.g. required fields, amount format, category) could not be grounded: `docs/modules/planned-items/overview.md` was an unfilled skeleton at synthesis time.

### Data Persistence Rules

- [NEEDS CLARIFICATION] Rules governing how financial data is persisted (e.g. storage precision for monetary amounts, cascade/delete behavior for a plan's items) could not be grounded: `docs/modules/persistence/overview.md` was an unfilled skeleton at synthesis time.

### Presentation / UI Rules

- The plans module renders a plans list page and a plan-detail page, including a "new plan" form, an "add item" form, and a "delete plan" button. (Source: [plans module overview](../modules/plans/overview.md))
- [NEEDS CLARIFICATION] Any additional client-side validation, formatting, or display rules could not be grounded: `docs/modules/web-ui/overview.md` was an unfilled skeleton at synthesis time.

### Reference Material

- [NEEDS CLARIFICATION] `README.md` (the sole declared reference for this node) contains only generic `create-next-app` bootstrap instructions and does not describe any project-specific business rules.
<!-- /SLOT:content -->
