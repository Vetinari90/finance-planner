---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:46d0ac250ad2a72f1e43ff8a158cd1807522a5e39dc0463b5d9d6f6367d46c72
---

# Functional Monthly Planning

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
# FR: Monthly Plan and Planned-Item Management

[NEEDS CLARIFICATION] No `REQ-ID` numbering convention (e.g. `FR-001`) was established in `README.md` or in any of the module-overview docs used as input for this synthesis node; the heading above uses a descriptive title without a fabricated numeric ID.

## Type

Functional

## Statement

Synthesized from `docs/modules/plans/overview.md` and `docs/modules/planned-items/overview.md`:

- The system shall let an authenticated user create a monthly plan (`POST /api/plans`), validating `title`, `year`, `month`, and `currency` with Zod, defaulting `title` to `${month}.${year}` and `currency` to `CZK` when not supplied.
- The system shall let an authenticated user list only the plans they own (`GET /api/plans`), ordered by year then month descending.
- The system shall let an authenticated user view a single plan they own together with its items, ordered by item creation time (`GET /api/plans/{planId}`).
- The system shall let an authenticated user delete a plan they own, after verifying ownership (`DELETE /api/plans/{planId}`).
- The system shall let an authenticated user add a planned item (`title`, `amountCents`, optional `categoryId`, optional `note`) to a plan they own (`POST /api/plans/{planId}/items`), after Zod field-level validation.

[NEEDS CLARIFICATION] `docs/modules/planned-items/overview.md` notes that a sibling `use-cases/list-plan-items.md` node is declared in the doc tree, but no listing/update/delete route handler for planned items was found in that module's inputs (only a `POST` handler in `src/app/api/plans/[planId]/items`). Whether listing, updating, or deleting individual planned items is an intended-but-unimplemented requirement or out of current scope could not be confirmed.

## Priority

**Priority:** [NEEDS CLARIFICATION] No MoSCoW prioritization for monthly-plan or planned-item operations was present in `README.md` or in the module-overview docs used as input.

## Rationale

[NEEDS CLARIFICATION] `README.md` is generic Next.js `create-next-app` boilerplate with no finance-planner-specific business rationale. None of the input module-overview docs (`docs/modules/auth/overview.md`, `docs/modules/plans/overview.md`, `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`) state why monthly plans and planned items exist as a business concept beyond the observable behavior described under Statement above.

## Acceptance Criteria

- [ ] **AC1:** Given an authenticated user, when they submit `POST /api/plans` with valid `year`/`month`/`currency` (and optional `title`), then a plan scoped to that user is created; when `title` is omitted it defaults to `${month}.${year}`, and when `currency` is omitted it defaults to `CZK`.
- [ ] **AC2:** Given an authenticated user with existing plans, when they request `GET /api/plans`, then only plans owned by that user are returned, ordered by year then month descending.
- [ ] **AC3:** Given an authenticated user, when they request `GET /api/plans/{planId}` for a plan they own, then the plan and its items (ordered by creation time) are returned.
- [ ] **AC4:** Given an authenticated user, when they submit `DELETE /api/plans/{planId}` for a plan they own, then the plan is deleted after ownership is verified.
- [ ] **AC5:** Given an authenticated user and an existing plan they own, when they submit `POST /api/plans/{planId}/items` with a valid `title`, `amountCents`, and optional `categoryId`/`note`, then the planned item is created under that plan after Zod validation.
- [ ] **AC6:** [NEEDS CLARIFICATION] Acceptance criteria for cross-user access attempts (e.g. requesting another user's `planId`) were not independently confirmed for the planned-items endpoint in this synthesis node's inputs; `docs/modules/planned-items/overview.md` states ownership is enforced via `prisma.plan.findFirst` for creation, but list/view/delete behavior for planned items specifically is unconfirmed (see Statement above).

## Scope

- Modules: [plans](../modules/plans/overview.md) (plan create/list/view/delete) and [planned-items](../modules/planned-items/overview.md) (planned-item creation).
- Depends on the current authenticated user's identity, resolved by the [auth](../modules/auth/overview.md) module and the [persistence](../modules/persistence/overview.md) module's `requireUserId()` helper.
- All plan and planned-item data access goes through the shared Prisma client owned by the persistence module.
- Use cases in scope per the doc tree: [create-monthly-plan.md](../modules/plans/use-cases/create-monthly-plan.md), [list-plans.md](../modules/plans/use-cases/list-plans.md), [view-plan-detail.md](../modules/plans/use-cases/view-plan-detail.md), [delete-plan.md](../modules/plans/use-cases/delete-plan.md), [add-planned-item.md](../modules/planned-items/use-cases/add-planned-item.md), [list-plan-items.md](../modules/planned-items/use-cases/list-plan-items.md).

## Dependencies

| Requirement / Module | Relationship |
|---|---|
| [auth module](../modules/auth/overview.md) | Resolves the current authenticated user for plan and planned-item operations; unauthenticated requests are gated (per `docs/modules/plans/overview.md`, page-side access redirects to `/login`). |
| [persistence module](../modules/persistence/overview.md) | Provides the shared Prisma client and `requireUserId()` used by both the plans and planned-items operations. |

[NEEDS CLARIFICATION] No cross-reference to `docs/requirements/functional-account-access.md` is made here because it is not itself a module-doc input to this synthesis node and its content was not available for confirmation in this dispatch.

## Traceability

- Module docs: [plans/overview.md](../modules/plans/overview.md), [planned-items/overview.md](../modules/planned-items/overview.md), [auth/overview.md](../modules/auth/overview.md), [persistence/overview.md](../modules/persistence/overview.md).
- Use cases: [create-monthly-plan.md](../modules/plans/use-cases/create-monthly-plan.md), [list-plans.md](../modules/plans/use-cases/list-plans.md), [view-plan-detail.md](../modules/plans/use-cases/view-plan-detail.md), [delete-plan.md](../modules/plans/use-cases/delete-plan.md), [add-planned-item.md](../modules/planned-items/use-cases/add-planned-item.md), [list-plan-items.md](../modules/planned-items/use-cases/list-plan-items.md).
- Behavior: [plan-lifecycle.md](../modules/plans/behavior/plan-lifecycle.md).
- [NEEDS CLARIFICATION] No ADR among the tree's `docs/decisions/` entries is titled specifically around monthly-plan or planned-item modeling; `docs/decisions/0004-store-money-as-integer-cents.md` is a plausibly related decision (the `amountCents` field observed in `docs/modules/planned-items/overview.md`) but its content was not part of this synthesis node's inputs, so the relationship is noted here as unconfirmed rather than linked as verified.

## Notes

- Currency defaulting to `CZK` and title defaulting to `${month}.${year}` are observed defaults from `docs/modules/plans/overview.md`; no business policy document confirming these defaults as intentional/permanent was available in this synthesis node's inputs.
- `docs/modules/persistence/overview.md` notes that `requireUserId()` only returns `null` when no session exists and does not itself enforce authentication (enforcement, e.g. a 401 response, is left to callers); this node's inputs do not include the plans/planned-items route-handler source needed to confirm exactly how that enforcement is implemented for each of the endpoints listed under Statement above.
- `docs/modules/auth/overview.md` and `docs/modules/web-ui/overview.md` both flag unresolved dependents/dependencies at generation time; those uncertainties are inherited here rather than re-resolved, since this synthesis node's declared inputs do not include the underlying source code.
<!-- /SLOT:content -->
