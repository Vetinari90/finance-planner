---
type: module-overview
audience: [developer, architect]
language: en
links: ["docs/modules/planned-items/domain-model.md"]
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Module: Planned Items

## Purpose

The Planned Items module manages the individual budget line items ("planned items") that make up a monthly plan. Based on the grounded route handler, it currently provides creation of a planned item scoped to a specific plan and user.

## Responsibilities

- Validate and persist new planned items (`title`, `amountCents`, optional `categoryId`, optional `note`) under a given plan, via `POST /api/plans/{planId}/items`.
- Enforce that a planned item can only be created under a plan owned by the authenticated user.
- Apply field-level validation (via Zod) before persistence.

Only creation is currently implemented. `src/app/api/plans/[planId]/items/route.ts` exposes solely a `POST` handler; listing, updating, and deleting individual planned items have no dedicated route handlers in this codebase. Existing planned items are instead read indirectly via the `Plan.items` relation returned by `GET /api/plans/{planId}` (`src/app/api/plans/[planId]/route.ts`).

## Boundaries

**This module does NOT:**

- Create or manage `Plan` records themselves (owned by the plans module).
- Resolve or validate the authenticated session/user identity itself; it delegates to `requireUserId()`.
- Directly manage database connectivity; it uses the shared Prisma client (`@/lib/db`), owned by the persistence module per `generation.module-source-map`.

## Key Entities

| Entity | Description |
|--------|-------------|
| PlannedItem | A budget line item belonging to a plan |

See: [domain-model.md](domain-model.md)

## Dependencies

| Module | Purpose |
|--------|---------|
| persistence | Database access via the shared Prisma client (`@/lib/db`) |
| plans | A planned item cannot be created without an existing plan owned by the same user (enforced via `prisma.plan.findFirst`) |

[NEEDS CLARIFICATION] `requireUserId()` (`@/lib/requireUser`) performs session/user resolution; per `generation.module-source-map` this file path falls under the `persistence` module (`src/lib`), though functionally it is an authentication concern; the true owning module could not be confirmed from this dispatch's inputs.

## Dependents

| Module | Purpose |
|--------|---------|
| plans | The plan detail page (`src/app/plans/[planId]/page.tsx`) reads planned items via the `Plan.items` relation (also returned by `GET /api/plans/{planId}`) and renders `AddItemForm.tsx`, which creates planned items via `POST /api/plans/{planId}/items`. |
