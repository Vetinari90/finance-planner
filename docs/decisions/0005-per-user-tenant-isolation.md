---
type: adr
audience: [developer]
language: en
links:
  - docs/modules/app/README.md
  - docs/modules/app/technical.md
  - docs/modules/lib/README.md
  - docs/modules/lib/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_branch: sdlc/20261001-2017
---

# ADR: Per-User Tenant Isolation

**Status:** Accepted (observed as implemented across the `app` module's route handlers; no separate decision log or status record was present in this node's inputs, so this status reflects the current, in-force implementation rather than a confirmed ADR status field).

## Context

finance-planner stores per-user financial data (`Plan` and `PlannedItem` records,
per `docs/modules/app/README.md`). There is no organization/tenant entity
documented anywhere in the `app` or `lib` module docs — each authenticated
`User` is effectively its own tenant. A decision was needed on how to prevent
one authenticated user from reading or modifying another user's `Plan` /
`PlannedItem` records.

The module-level docs show the data-access pattern that exists in the
codebase today:

- Every `/api/plans/**` route handler resolves the caller's identity via
  `requireUserId()` (supplied by the `lib` module and consumed throughout
  `src/app/api/plans/**/route.ts`, per `docs/modules/app/README.md`) and
  returns `401` if no session is present (`docs/modules/app/technical.md`,
  `GET /api/plans` entry).
- `GET /api/plans` returns only `{ plans }` for the current user
  (`docs/modules/app/technical.md`).
- `GET /api/plans/{planId}` and `DELETE /api/plans/{planId}` look the plan up
  with `findFirst` scoped to `userId`, returning `404` "if not found or not
  owned by the caller" (`docs/modules/app/technical.md`).
- `POST /api/plans/{planId}/items` first confirms "the plan exists and
  belongs to the caller (`404` otherwise)" before creating a `PlannedItem`
  (`docs/modules/app/technical.md`).
- `POST /api/plans` relies on an in-code comment indicating "a unique
  constraint on `(userId, year, month)`"; per `docs/modules/app/technical.md`
  itself, "the constraint itself is defined in the Prisma schema, not in this
  file," so this constraint is not independently confirmed from the inputs
  available to this node.

[NEEDS CLARIFICATION] No `schema.prisma` file, migration file, or
database-level policy configuration (e.g. PostgreSQL row-level security) was
present in either the `app` or `lib` module's inputs (per
`docs/modules/lib/README.md` and `docs/modules/lib/technical.md`), so it
cannot be confirmed whether isolation is enforced only in application code or
also at the database layer.

## Decision

Based on the pattern observed consistently across every `/api/plans/**`
route handler (see Context above), the decision in force is: enforce
per-user data isolation at the **application layer**, not via separate
tenant schemas, separate databases, or (as far as the available inputs show)
database-level row-level security.

Concretely, every handler that reads or mutates a `Plan` or `PlannedItem`:

1. Resolves the authenticated user's id via `requireUserId()`
   (`@/lib/requireUser`, per `docs/modules/app/README.md`).
2. Scopes the corresponding Prisma query by that `userId` — `findFirst`
   lookups include `userId` in the `where` clause, and list/create operations
   are filtered or associated by the same id (`docs/modules/app/technical.md`).
3. Returns `401` when no session exists, and `404` (rather than `403`) when a
   resource exists but is not owned by the caller, per the `GET`/`DELETE
   /api/plans/{planId}` and `POST /api/plans/{planId}/items` entries in
   `docs/modules/app/technical.md`.

Authentication identity itself is supplied by NextAuth credentials-based
sessions configured in `authOptions` (`src/lib/auth.ts`, per
`docs/modules/lib/README.md`), which resolves a `User` via
`prisma.user.findUnique({ where: { email } })` and verifies the password hash
with `bcrypt.compare`.

[NEEDS CLARIFICATION] No reference document or design note describing the
rationale for choosing application-level scoping over an alternative (e.g.
database-level row-level security, or a separate-schema-per-tenant model) was
present in this node's inputs (`inputs.references` was empty); the
alternatives-considered rationale cannot be grounded here.

## Consequences

**Positive:**
- A single, consistent enforcement pattern (`requireUserId()` + a `userId`
  predicate on every `Plan`/`PlannedItem` query) is applied uniformly across
  all `/api/plans/**` handlers (`docs/modules/app/technical.md`), which keeps
  the isolation logic co-located with each handler rather than spread across
  a separate infrastructure layer.
- No per-tenant schema or database provisioning is required, since isolation
  keys off the existing `User`/`userId` relationship already modeled by
  `Plan` and `PlannedItem` (`docs/modules/app/README.md`).

**Negative:**
- Because isolation is enforced in application code rather than (as far as
  the available inputs show) at the database layer, correctness depends on
  every current and future handler remembering to add the `userId` scope; a
  handler that omits this check would not be caught by a schema-level
  constraint. [NEEDS CLARIFICATION] Whether any database-level safeguard
  (e.g. row-level security) exists as a backstop cannot be confirmed, since
  no `schema.prisma` or database policy file was present in the `lib`
  module's inputs.
- No test files were present in the `app` module's inputs
  (`docs/modules/app/technical.md`, Testing section), so the correctness of
  this per-user scoping cannot be verified against an automated test suite
  from the inputs available to this node.
