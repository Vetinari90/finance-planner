---
type: test-plan
audience: [developer, qa]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Testing: Planned Items

## Strategy Overview

[NEEDS CLARIFICATION] No test files were present in this module's inputs (only `src/app/api/plans/[planId]/items/route.ts` was provided), so the module's actual testing strategy and coverage could not be confirmed. The scenarios below are derived from the branches present in the route handler's implementation and are recommendations, not confirmed existing tests.

## Test Levels

| Level | Scope | Coverage Target |
|-------|-------|-----------------|
| Unit | Zod schema validation (`CreateItemSchema`) | [NEEDS CLARIFICATION] |
| Integration | Route handler behavior against the database (auth check, plan-ownership check, creation) | [NEEDS CLARIFICATION] |
| E2E | [NEEDS CLARIFICATION] | [NEEDS CLARIFICATION] |

## Test Categories

### Functional Tests

| Category | Priority | Examples |
|----------|----------|----------|
| Happy path | P0 | Authenticated user creates a planned item under their own plan; receives `201` with the created item |
| Validation | P0 | Missing/empty `title`, `title` over 120 chars, negative or non-integer `amountCents`, `note` over 400 chars |
| Edge cases | P1 | `categoryId`/`note` omitted (defaulted to `null`) |
| Error handling | P1 | No resolvable user (`401`); `planId` does not exist or belongs to another user (`404`); malformed JSON body (`400`) |

### Non-Functional Tests

[NEEDS CLARIFICATION] No performance or security testing information was present in inputs.

## Key Test Scenarios

### Create planned item - happy path

**Tests:** `POST /api/plans/{planId}/items` with a valid body and an authenticated user who owns the plan.

**Preconditions:**
- User is authenticated (`requireUserId()` resolves a user id).
- A plan with the given `planId` exists and belongs to that user.

**Test Cases:**

| Case | Input | Expected Result |
|------|-------|-----------------|
| Valid minimal body | `{ "title": "Groceries", "amountCents": 5000 }` | `201`, item created with `categoryId: null`, `note: null` |
| Valid full body | `{ "title": "Groceries", "amountCents": 5000, "categoryId": "cat1", "note": "Weekly" }` | `201`, item created with supplied `categoryId`/`note` |

---

### Create planned item - authorization and validation failures

**Tests:** The handler's guard clauses.

**Preconditions:** Varies per case below.

**Test Cases:**

| Case | Input | Expected Result |
|------|-------|-----------------|
| No session | Request without a resolvable user | `401`, `{"error": "Unauthorized"}` |
| Plan not owned / not found | Valid body, `planId` belonging to another user or nonexistent | `404`, `{"error": "Not found"}` |
| Invalid body | `{ "title": "", "amountCents": -1 }` | `400`, `{"error": "Invalid input", "details": {...}}` |
| Malformed JSON | Non-JSON request body | `400`, `{"error": "Invalid input", ...}` (caught via `req.json().catch(() => null)`) |

## Test Data

[NEEDS CLARIFICATION] No fixtures or test-data generation strategy were present in inputs.

## CI/CD Integration

[NEEDS CLARIFICATION] No CI/CD pipeline configuration was present in this module's inputs.

## Test Environment

[NEEDS CLARIFICATION] No test environment configuration (database, mocking strategy) was present in inputs.
