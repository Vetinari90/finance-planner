---
type: decision
audience: [developer]
language: en
links: [docs/modules/app/technical.md, docs/security.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Per-User Tenant Isolation

**Status:** Accepted (inferred from current implementation in code; no separate decision record was present in inputs)

## Context

Multiple users share the same application and database; each user's plans and planned items must not be visible or mutable by other users.

## Decision

We will scope all plan reads/writes by both the resource id and the authenticated `userId`. `prisma.plan.findFirst({ where: { id: planId, userId } })` is used in `src/app/api/plans/[planId]/route.ts` and `src/app/api/plans/[planId]/items/route.ts`; plan creation in `src/app/api/plans/route.ts` always sets `userId` from the session; plan listing filters `where: { userId }`.

## Consequences

**Positive:**
- A user cannot read, modify, or delete another user's plan or items, even by guessing another plan's id, because the ownership filter is part of the query itself.

**Negative:**
- [NEEDS CLARIFICATION] No database-level row-level-security or authorization audit logging was found in inputs.code; isolation currently relies entirely on application-layer query filtering.
