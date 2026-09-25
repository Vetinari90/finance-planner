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
- [ ] No email verification step exists. `authorize()` in `src/lib/auth.ts` only checks that a user with the given email exists and that the submitted password matches via `bcrypt.compare`; it contains no check of an `emailVerified` field or similar flag. `POST /api/auth/register` (`src/app/api/auth/register/route.ts`) creates the user directly with `prisma.user.create` and returns 201, with no verification email or verification step. A user can therefore sign in immediately after registering.

## Postconditions

- [ ] On success, a session is established and the user is redirected to the resolved `callbackUrl` (the `callbackUrl` search param, or `/plans` by default).
- [ ] On failure, no session is established and the user remains on `/login`.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | User | Navigates to `/login`. | `LoginPage` renders `LoginClient` inside a `Suspense` boundary. |
| 2 | User | Enters email and password, submits the form. | `LoginClient.onSubmit` calls `signIn("credentials", {email, password, redirect: false, callbackUrl})`. |
| 3 | System | — | `authOptions.providers[0].authorize` (`src/lib/auth.ts`) normalizes the email (`toLowerCase().trim()`), looks up the user via `prisma.user.findUnique({ where: { email } })`, and compares the submitted password against the stored hash with `bcrypt.compare`. If the user is not found or the password does not match, `authorize` returns `null` (NextAuth then reports this via `res.error`); on success it returns `{ id, email, name }`, which the `jwt` callback places on the token (`token.sub = user.id`). |
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
| Network/unexpected failure during `signIn` | Because `onSubmit` in `LoginClient.tsx` has no `try/catch` around `await signIn(...)`, a thrown error (e.g. a network failure) becomes an unhandled promise rejection: `setLoading(false)` is never reached, so the submit button stays disabled showing "Signing in..." indefinitely, and no error message is shown to the user. |

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
