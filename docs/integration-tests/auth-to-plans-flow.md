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

# Auth To Plans Flow

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Overview

**Test Type:** User Journey E2E

**Criticality:** [NEEDS CLARIFICATION] No criticality rating for this scenario is present in inputs.references or in the available module-docs.

**Description:** This scenario documents the flow from user authentication through monthly-plan management. The plans module's overview states that it "does NOT... Authenticate users itself - it calls `requireUserId()` (from `@/lib/requireUser`) and, on the page side, `getServerSession(authOptions)` (from `@/lib/auth`), both outside this module" (see [plans module overview](../modules/plans/overview.md)). This makes a valid auth session a precondition for every plans-module operation covered here (create, list, view, delete). The auth module's own overview document (`docs/modules/auth/overview.md`) has not yet been generated/filled at the time this document was synthesized, so the mechanics of session establishment itself (login flow, session/JWT shape, expiry) cannot be grounded here.

[NEEDS CLARIFICATION] The auth module's overview.md, domain-model.md, and testing.md were listed as inputs for this synthesis but are still unfilled skeletons; auth-side behavior in this document is limited to what the plans module overview states about its dependency on auth.

### Scope

#### Modules/Systems Involved

| Component | Role | Real/Mocked |
|-----------|------|-------------|
| auth | Resolves the current user for API routes via `requireUserId()` and for server-rendered pages via `getServerSession(authOptions)`, per the plans module's documented dependency on auth (see [plans module overview](../modules/plans/overview.md)) | [NEEDS CLARIFICATION] |
| plans | Creates, lists, fetches, and deletes monthly plans for the current user (`POST /api/plans`, `GET /api/plans`, `GET /api/plans/{planId}`, `DELETE /api/plans/{planId}`), per [plans module overview](../modules/plans/overview.md) | [NEEDS CLARIFICATION] |
| persistence | Provides the shared Prisma client (`@/lib/db`) used for all plan CRUD queries, per the plans module's documented dependency on persistence (see [plans module overview](../modules/plans/overview.md)) | [NEEDS CLARIFICATION] |

#### Integration Points

- `requireUserId()` - called by the plans module's API routes to resolve the current user before any plan CRUD operation (per [plans module overview](../modules/plans/overview.md)).
- `getServerSession(authOptions)` - called by the plans module's server-rendered pages to resolve the current user (per [plans module overview](../modules/plans/overview.md)).
- The shared Prisma client (`@/lib/db`) - the data-access integration point between the plans module and the persistence module (per [plans module overview](../modules/plans/overview.md)).
- [NEEDS CLARIFICATION] No event-based or additional API integration points between auth and plans are documented in the available inputs.

### Preconditions

- [ ] A user account must exist and be able to establish an authenticated session before any plans-module operation is exercised. [NEEDS CLARIFICATION] The specific mechanism (credentials sign-in, registration flow, session/JWT format) is not grounded here because `docs/modules/auth/overview.md` is not yet filled.
- [ ] [NEEDS CLARIFICATION] No test-environment or seed-data preconditions are documented in inputs.references or the available module-docs.

### Test Scenarios

#### Scenario 1: Happy Path

**Given:**
- An authenticated user with a valid session. [NEEDS CLARIFICATION] Session-establishment specifics are not available (auth module overview not yet filled).

**When:**
- The user submits `POST /api/plans` with `title`, `year`, `month`, and `currency`, where `title` defaults to `${month}.${year}` and `currency` defaults to `CZK` when omitted (per [plans module overview](../modules/plans/overview.md)).

**Then:**
- A new plan is created and owned by that user, and subsequently appears when the user calls `GET /api/plans` (listed ordered by year then month descending, per [plans module overview](../modules/plans/overview.md)).

---

#### Scenario 2: Error Handling

**Given:**
- A request to a plans-module endpoint (e.g. `POST /api/plans`, `GET /api/plans`, `GET /api/plans/{planId}`, or `DELETE /api/plans/{planId}`) without a valid authenticated session.

**When:**
- The request is made.

**Then:**
- [NEEDS CLARIFICATION] The exact rejection behavior (HTTP status code, redirect target, or error payload) for an unauthenticated request to a plans-module endpoint is not documented in the available inputs. The plans module overview only establishes that authentication is resolved outside the module (`requireUserId()` / `getServerSession(authOptions)`), not what happens on failure.

---

#### Scenario 3: Authorization Isolation Across Users

**Given:**
- Two distinct authenticated users, where user B does not own a given plan created by user A.

**When:**
- User B calls `GET /api/plans/{planId}` or `DELETE /api/plans/{planId}` for a plan owned by user A. Per [plans module overview](../modules/plans/overview.md), fetching and deleting a plan both operate "owned by the current user, after verifying ownership."

**Then:**
- [NEEDS CLARIFICATION] The exact response for a cross-user access attempt (e.g. 403, 404, or an empty result) is not documented in the available inputs.

### Verification Points

| Step/Action | What to Verify | How |
|-------------|----------------|-----|
| `POST /api/plans` by an authenticated user | Plan is created and owned by the current user, with `title`/`currency` defaults applied when omitted | API response / DB state (per [plans module overview](../modules/plans/overview.md)) |
| `GET /api/plans` by the same authenticated user | The newly created plan appears in the list, ordered by year then month descending | API response (per [plans module overview](../modules/plans/overview.md)) |
| `GET /api/plans/{planId}` / `DELETE /api/plans/{planId}` by a non-owning user | Ownership is verified before the operation proceeds | [NEEDS CLARIFICATION] exact verification mechanism/response not documented |
| Unauthenticated request to any plans endpoint | Request is not fulfilled | [NEEDS CLARIFICATION] exact verification mechanism/response not documented |

### Test Data

| Data Element | Setup Method | Cleanup |
|--------------|--------------|---------|
| Authenticated user account(s) | [NEEDS CLARIFICATION] no fixture/factory/seed mechanism documented in available inputs | [NEEDS CLARIFICATION] |
| Plan record(s) (`title`, `year`, `month`, `currency`) | [NEEDS CLARIFICATION] no fixture/factory/seed mechanism documented in available inputs | [NEEDS CLARIFICATION] |

### Environment

**Required Services:**
[NEEDS CLARIFICATION] No deployment/infrastructure documentation was included in this node's inputs (`docs/modules/persistence/deployment.md` and similar were not listed among this node's `module-docs`), so the services required to run this scenario (e.g. database) cannot be grounded here.

**Configuration:**
[NEEDS CLARIFICATION] No environment-specific configuration for auth-to-plans integration testing is documented in `README.md` (which only contains generic Next.js scaffold instructions) or in the available module-docs.

### Implementation

**Test File:** [NEEDS CLARIFICATION] No test file path for this scenario is present in inputs.references or the available module-docs; raw source/test files are out of scope for this synthesis node.

**Run Command:**
```bash
# [NEEDS CLARIFICATION] No run command for this integration test is documented in the available inputs.
```

### Notes

[NEEDS CLARIFICATION] No known issues, flaky-test considerations, or special setup instructions for this scenario are documented in `README.md` or in the available module-docs. This document should be revisited once `docs/modules/auth/overview.md`, `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, and `docs/modules/web-ui/overview.md` (all listed as inputs but unfilled at synthesis time) are populated.
<!-- /SLOT:content -->
