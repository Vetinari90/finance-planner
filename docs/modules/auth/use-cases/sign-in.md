---
type: use-case
audience: [developer]
language: en
links: [../api.md, ../behavior/credentials-sign-in.md, register-account.md, sign-out.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Sign In

## Summary

A registered user authenticates with email and password on the `/login` page to establish a session and access their plans.

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Registered user | Primary | A person with an existing `User` account, on `/login` (`src/app/login/page.tsx`, rendering `LoginClient.tsx`). |

## Preconditions

- [ ] The user has previously registered an account (see [register-account.md](register-account.md)).
- [ ] [NEEDS CLARIFICATION] Whether email verification is required before sign-in is possible is not established by the reviewed files — no verification step was found.

## Postconditions

- [ ] On success, a session is established and the user is redirected to the resolved `callbackUrl` (the `callbackUrl` search param, or `/plans` by default).
- [ ] On failure, no session is established and the user remains on `/login`.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | User | Navigates to `/login`. | `LoginPage` renders `LoginClient` inside a `Suspense` boundary. |
| 2 | User | Enters email and password, submits the form. | `LoginClient.onSubmit` calls `signIn("credentials", {email, password, redirect: false, callbackUrl})`. |
| 3 | System | — | [NEEDS CLARIFICATION] Credential verification is performed inside `authOptions` (`@/lib/auth`), which is outside this dispatch's permitted read set. |
| 4 | System (client) | — | On success, `router.push(callbackUrl)` (default `/plans`). |

## Alternative Flows

### AF-1: Invalid credentials

**Branches from:** Step 3

| Step | Action | Response |
|------|--------|----------|
| 3.1 | `signIn` resolves with `res.error` set | `LoginClient` sets the error state to `"Invalid email or password"`; user remains on `/login`. |

**Continues at:** end of flow.

## Error Handling

| Error Condition | System Response |
|-----------------|-----------------|
| Wrong email/password | UI shows "Invalid email or password" (`LoginClient.tsx`). |
| Network/unexpected failure during `signIn` | [NEEDS CLARIFICATION] `LoginClient.tsx`'s `onSubmit` has no `try/catch` around the `signIn` call, unlike `register/page.tsx`; resulting behavior on a thrown error is not established. |

## Acceptance Criteria

### AC-1: Successful sign-in

```gherkin
Given a user with a valid email and password
When they submit the sign-in form
Then they are redirected to the callback URL (default /plans)
```

### AC-2: Failed sign-in

```gherkin
Given a user submits an incorrect email or password
When the sign-in form is submitted
Then an "Invalid email or password" message is shown and no redirect occurs
```
