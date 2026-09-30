---
type: decision
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Per-User Tenant Isolation

**Status:** Accepted

## Context

finance-planner is a multi-user application (each user registers their own account, `src/app/api/auth/register/route.ts`), but no organizational/team entity is present. Every `Plan` must be isolated to the account that created it.

## Decision

We will treat each individual `User` as its own isolation boundary rather than introducing an organization or team entity. [NEEDS CLARIFICATION] No multi-tenant/organization concept was found in inputs.code, so "tenant" here is used to mean a single user account. Every plan-related query filters by the authenticated `userId`: `prisma.plan.findFirst({ where: { id: planId, userId } })` is used in both the plan detail/delete route (`src/app/api/plans/[planId]/route.ts`) and the item-creation route (`src/app/api/plans/[planId]/items/route.ts`) before any item is created, and `prisma.plan.findMany({ where: { userId } })` scopes the plan list endpoint (`src/app/api/plans/route.ts`). A plan not owned by the requesting user returns HTTP 404, not 403, so as not to reveal its existence.

## Consequences

**Positive:**
- Cross-user data leakage is prevented at the data-access layer, not only in the UI.
- Returning 404 instead of 403 avoids confirming whether a given `planId` exists for another user.

**Negative:**
- Every new query against `Plan`/`PlannedItem` must remember to add the `userId` filter manually; no framework-level enforcement (e.g. PostgreSQL row-level security) is observed in inputs.code. [NEEDS CLARIFICATION] whether row-level security policies exist outside inputs.code.
