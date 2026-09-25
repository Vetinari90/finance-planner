---
type: use-case
audience: [developer]
language: en
links: [../api.md, ../data-model.md, sign-in.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Register Account

## Summary

A visitor creates a new account by supplying an email, an optional display name, and a password; on success they are automatically signed in and redirected to `/plans`.

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Visitor | Primary | An unauthenticated person on the `/register` page (`src/app/register/page.tsx`). |

## Preconditions

- [ ] The visitor can reach `/register`.
- [ ] [NEEDS CLARIFICATION] Whether an already-authenticated visitor is redirected away from `/register` is not established by the reviewed code.

## Postconditions

- [ ] A new `User` row exists (`id`, `email`, `password` hash, optional `name`), per `prisma.user.create` in `src/app/api/auth/register/route.ts`.
- [ ] The visitor is authenticated (session established via the automatic `signIn` call), unless the auto-login step failed — see AF-3.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | Visitor | Fills email, optional name, and password (client-enforced `minLength=8`), and submits the form. | `src/app/register/page.tsx` sends `POST /api/auth/register` with `{email, password, name}` as JSON. |
| 2 | System | — | `RegisterSchema` (Zod) validates the body; email is lowercased/trimmed; `prisma.user.findUnique` checks for an existing user with that email. |
| 3 | System | — | Password is hashed with `bcrypt.hash(password, 12)`; `prisma.user.create` persists the new user; response is `201` with `{user: {id, email, name}}`. |
| 4 | System (client) | — | `register/page.tsx` calls `signIn("credentials", {email, password, redirect: false})` to automatically log the new user in. |
| 5 | System (client) | — | On success, `router.push("/plans")`. |

## Alternative Flows

### AF-1: Validation failure

**Branches from:** Step 2

| Step | Action | Response |
|------|--------|----------|
| 2.1 | `RegisterSchema` rejects the body | Server returns 400 `{error: "Invalid input", details: ...}`; client sets the error message from `data.error` (or falls back to `"Registration failed"`) and does not navigate. |

**Continues at:** end of flow (visitor remains on `/register`).

### AF-2: Email already exists

**Branches from:** Step 2

| Step | Action | Response |
|------|--------|----------|
| 2.1 | `findUnique` finds an existing user with the same email | Server returns 409 `{error: "Email already exists"}`; client displays that message. |

**Continues at:** end of flow (visitor remains on `/register`).

### AF-3: Auto-login failure after successful registration

**Branches from:** Step 4

| Step | Action | Response |
|------|--------|----------|
| 4.1 | `signIn` resolves with an error | Client sets error to `"Registered, but login failed. Try logging in."` and calls `router.push("/login")`. |

**Continues at:** end of flow (account exists, but the visitor is not authenticated).

## Error Handling

| Error Condition | System Response |
|-----------------|-----------------|
| Network/fetch failure (client-side) | Caught by the `try/catch` in `register/page.tsx`'s `onSubmit`; error state set to `"Network error"`. |
| Invalid input (400) | UI displays `data.error` text (or fallback `"Registration failed"`). |
| Duplicate email (409) | UI displays the returned `error` text. |
| Unhandled database error during `prisma.user.create` | [NEEDS CLARIFICATION] No explicit `try/catch` exists around this call in `src/app/api/auth/register/route.ts`; resulting behavior is not established. |

## Acceptance Criteria

### AC-1: Successful registration

```gherkin
Given a visitor provides a valid, unused email and a password of at least 8 characters
When they submit the registration form
Then a new account is created and they are redirected to /plans
```

### AC-2: Duplicate email rejected

```gherkin
Given a visitor provides an email that already has an account
When they submit the registration form
Then they see an "Email already exists" message and remain on the registration page
```

### AC-3: Short password rejected

```gherkin
Given a visitor provides a password shorter than 8 characters
When they submit the registration form
Then the browser blocks submission via the minLength=8 constraint, and the server would independently reject it via RegisterSchema if submitted directly
```
