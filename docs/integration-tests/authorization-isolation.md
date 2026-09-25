---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:482e4fdaa7468707c90cbef94244a1e7de37a0f7c489f1a7ebf9bb45578b81f8
---

# Authorization Isolation

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
## Overview

**Test Type:** Module Integration

**Criticality:** High

**Description:**
This scenario verifies that session-based authorization is correctly enforced across
the module boundary between [persistence](../modules/persistence/overview.md) (session
issuance and the `requireUserId()` helper), [auth](../modules/auth/overview.md)
(credential sign-in and registration), and [plans](../modules/plans/overview.md)
(ownership-scoped plan CRUD). Per `docs/modules/plans/overview.md`, plan endpoints are
described as resolving, listing, fetching, and deleting data "owned by the current
user", and the delete path is described as verifying ownership before deleting. Per
`docs/modules/persistence/overview.md`, the `requireUserId()` helper itself does not
throw or redirect when no session is present - it returns `null` and leaves enforcement
(e.g. returning a 401) to its callers, which are outside the `persistence` module's
documented scope. This test exists to confirm, end-to-end, that (a) an unauthenticated
caller is denied, and (b) an authenticated caller cannot read or mutate a plan owned by
a different user.

[NEEDS CLARIFICATION] `README.md`, the only reference supplied to this node, is generic
Next.js `create-next-app` boilerplate and contains no finance-planner-specific
authorization or security requirement that could corroborate or refine this description.

## Scope

### Modules/Systems Involved

| Component | Role | Real/Mocked |
|-----------|------|-------------|
| [auth](../modules/auth/overview.md) | Issues the authenticated session via the NextAuth `credentials` provider (registration and sign-in) | [NEEDS CLARIFICATION] Real/Mocked not established by inputs |
| [persistence](../modules/persistence/overview.md) | Owns `authOptions` (JWT-strategy session, credential verification against `prisma.user`) and the `requireUserId()` helper used to resolve the current user | [NEEDS CLARIFICATION] Real/Mocked not established by inputs |
| [plans](../modules/plans/overview.md) | Owns the ownership-scoped plan endpoints (`GET/POST /api/plans`, `GET/DELETE /api/plans/{planId}`) that this test exercises | [NEEDS CLARIFICATION] Real/Mocked not established by inputs |
| planned-items | [NEEDS CLARIFICATION] `docs/modules/planned-items/overview.md`, named as a module-doc input for this node, is still an unfilled skeleton document (`[UNFILLED]`) as of this generation run; whether/how item-level endpoints (`/api/plans/{planId}/items`) enforce plan ownership could not be confirmed here. |
[NEEDS CLARIFICATION] [REVIEW] consistency: This document asserts docs/modules/planned-items/overview.md is an unfilled skeleton and that ownership enforcement for item-level endpoints could not be confirmed, but that referenced document is fully filled and explicitly states 'Enforce that a planned item can only be created under a plan owned by the authenticated user' - directly contradicting the claim.
| [web-ui](../modules/web-ui/overview.md) | Root route (`/`) redirects to `/login` or `/plans` based on session presence; not itself part of the API authorization path exercised by this test | [NEEDS CLARIFICATION] Real/Mocked not established by inputs |

### Integration Points

- Session issuance: the NextAuth `credentials` provider and catch-all route
  (`src/app/api/auth/[...nextauth]/route.ts`), delegating to `authOptions` owned by the
  persistence module, per `docs/modules/auth/overview.md`.
- Session resolution: `requireUserId()` (`@/lib/requireUser`), which calls
  `getServerSession(authOptions)` and returns the session user's ID or `null`, per
  `docs/modules/persistence/overview.md`.
- Ownership-scoped data access: `GET /api/plans`, `POST /api/plans`,
  `GET /api/plans/{planId}`, `DELETE /api/plans/{planId}`, described in
  `docs/modules/plans/overview.md` as scoped to "the current user" (list/create/fetch)
  and, for delete, as verifying ownership before deleting.
- [NEEDS CLARIFICATION] Item-level integration point `/api/plans/{planId}/items`
  (referenced from `docs/modules/plans/overview.md` as the endpoint `AddItemForm.tsx`
  posts to) cannot be described further because `docs/modules/planned-items/overview.md`
  is unfilled in this generation run.

## Preconditions

- [ ] Two distinct user accounts exist, each created via `POST /api/auth/register`
  (per `docs/modules/auth/overview.md`).
- [ ] User A has an existing plan, created via `POST /api/plans` (per
  `docs/modules/plans/overview.md`).
- [ ] [NEEDS CLARIFICATION] The exact mechanism for obtaining an authenticated session
  in a test harness (e.g. seeding a JWT session cookie directly vs. driving the
  `signIn("credentials", ...)` flow described in `docs/modules/auth/overview.md`) is not
  established by inputs.

## Test Scenarios

### Scenario 1: Happy Path

**Given:**
- User A is authenticated (has a valid session, per `docs/modules/persistence/overview.md`'s
  JWT-strategy `authOptions`).
- User A owns an existing plan (per `docs/modules/plans/overview.md`).

**When:**
- User A calls `GET /api/plans/{planId}` for their own plan.

**Then:**
- The response returns the plan together with its items, ordered by creation time, per
  `docs/modules/plans/overview.md`'s description of this endpoint.

---

### Scenario 2: Error Handling - Unauthenticated Request

**Given:**
- No valid session is present (`requireUserId()` would resolve to `null`, per
  `docs/modules/persistence/overview.md`).

**When:**
- An unauthenticated caller invokes a plans endpoint (e.g. `GET /api/plans` or
  `GET /api/plans/{planId}`).

**Then:**
- [NEEDS CLARIFICATION] `docs/modules/persistence/overview.md` states explicitly that
  `requireUserId()` does not itself throw or redirect on a missing session - it returns
  `null` and enforcement is left to the caller. The actual HTTP status code and response
  body returned by the plans route handlers in this case are outside this node's
  module-doc inputs and cannot be confirmed here.

---

### Scenario 3: Cross-User Ownership Violation

**Given:**
- User A owns an existing plan.
- User B is authenticated as a different account.

**When:**
- User B calls `GET /api/plans/{planId}` or `DELETE /api/plans/{planId}` using User A's
  `planId`.

**Then:**
- [NEEDS CLARIFICATION] `docs/modules/plans/overview.md` states that fetching returns a
  plan "owned by the current user" and that deletion happens "after verifying
  ownership", but does not state the concrete behavior for a non-owned `planId` (e.g.
  `404 Not Found` vs. `403 Forbidden`, or whether the ownership check is expressed as a
  scoped-query filter versus an explicit comparison). This detail is not present in any
  of this node's module-doc or reference inputs.

## Verification Points

| Step/Action | What to Verify | How |
|-------------|----------------|-----|
| User A fetches own plan | Plan and items are returned | API response |
| Unauthenticated caller calls a plans endpoint | [NEEDS CLARIFICATION] Expected status code not established by inputs | API response |
| User B fetches or deletes User A's `planId` | [NEEDS CLARIFICATION] Expected status code / DB-state outcome not established by inputs | API response / DB state |

## Test Data

| Data Element | Setup Method | Cleanup |
|--------------|--------------|---------|
| User A account | `POST /api/auth/register`, per `docs/modules/auth/overview.md` | [NEEDS CLARIFICATION] not established by inputs |
| User B account | `POST /api/auth/register`, per `docs/modules/auth/overview.md` | [NEEDS CLARIFICATION] not established by inputs |
| User A's plan | `POST /api/plans`, per `docs/modules/plans/overview.md` | [NEEDS CLARIFICATION] not established by inputs |

## Environment

**Required Services:**
- The Next.js application itself.
- A PostgreSQL database reachable via the `DATABASE_URL` environment variable; per
  `docs/modules/persistence/overview.md`, the persistence module's Prisma client fails
  fast at module load if `DATABASE_URL` is not set.

**Configuration:**
- `DATABASE_URL` must be set (per `docs/modules/persistence/overview.md`).
- [NEEDS CLARIFICATION] Any additional NextAuth-related environment configuration (e.g.
  a session-signing secret) is not established by this node's inputs.

## Implementation

**Test File:** [NEEDS CLARIFICATION] No integration test file path is present in this
node's inputs (`README.md` and the five module `overview.md` documents); this synthesis
node does not read source code directly.

**Run Command:**
```bash
# [NEEDS CLARIFICATION] No test run command was present in this node's inputs.
```

## Notes

- This node is a synthesis document: per its `doc_struc.md` entry it is authored from
  `README.md` and the five module `overview.md` documents only, not from source code.
- `docs/modules/planned-items/overview.md` is still an unfilled skeleton
[NEEDS CLARIFICATION] [REVIEW] consistency: The Notes section repeats the stale claim that docs/modules/planned-items/overview.md is an unfilled skeleton limiting this document's authorization-behavior coverage, but that module doc is fully populated and already documents ownership enforcement for planned-item creation.
  (`[UNFILLED]`) as of this generation run, which limits this document's ability to
  describe authorization behavior for the plan-items endpoints.
- `README.md` contains no finance-planner-specific content (it is unmodified
  `create-next-app` boilerplate), so it could not be used to ground any authorization
  requirement in this document.
<!-- /SLOT:content -->
