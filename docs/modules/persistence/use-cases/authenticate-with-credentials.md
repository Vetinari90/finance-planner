---
type: use-case
audience: [developer]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# UC-P01: Authenticate with Credentials

## Summary

A user submits an email and password; the persistence module's `authorize()` callback (`src/lib/auth.ts`) verifies them against the stored `prisma.user` record and, on success, establishes a JWT session identifying the user.

## Actors

| Actor | Type | Description |
|-------|------|--------------|
| End User | Primary | Submits email/password via NextAuth's credentials sign-in flow |
| NextAuth runtime | Secondary | Invokes `authorize()` and manages the resulting JWT session |

## Preconditions

- [ ] A `prisma.user` row exists whose `email` matches the (lower-cased, trimmed) submitted email. [NEEDS CLARIFICATION] Additional preconditions (e.g. account "active" status) cannot be confirmed without the Prisma schema.
- [ ] The `DATABASE_URL` environment variable is set, or `src/lib/db.ts` throws at module load.

## Postconditions

- [ ] On success: NextAuth holds a JWT (`session: { strategy: "jwt" }`) with `token.sub` set to the user's `id` (`src/lib/auth.ts` `jwt` callback), and `session.user.id` set accordingly (`session` callback).
- [ ] On failure: no session is created; `authorize()` returned `null`.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|------------------|
| 1 | End User | Submits email and password to the credentials sign-in form | NextAuth invokes `authorize({ email, password })` in `src/lib/auth.ts` |
| 2 | System | Normalizes email (lower-case, trim); defaults missing password to `""` | - |
| 3 | System | Looks up `prisma.user.findUnique({ where: { email } })` | Returns the user row or `null` |
| 4 | System | Compares submitted password to `user.password` via `bcrypt.compare` | Returns `true`/`false` |
| 5 | System | On match, returns `{ id, email, name ?? undefined }` to NextAuth | NextAuth issues a JWT session; `jwt`/`session` callbacks propagate `id` |

## Alternative Flows

### AF-1: Missing credentials

**Branches from:** Step 1

| Step | Action | Response |
|------|--------|----------|
| 1.1 | Email or password absent | `authorize()` returns `null` before querying the database |

**Continues at:** ends - no session created

### AF-2: Unknown email or wrong password

**Branches from:** Step 3 or Step 4

| Step | Action | Response |
|------|--------|----------|
| 3.1 / 4.1 | User not found, or `bcrypt.compare` returns `false` | `authorize()` returns `null` |

**Continues at:** ends - no session created; the two failure modes are indistinguishable to the caller per `src/lib/auth.ts` (no user-enumeration signal)

## Error Handling

| Error Condition | System Response |
|------------------|-------------------|
| Missing email/password | `authorize()` returns `null` |
| Unknown email | `authorize()` returns `null` (same as wrong password) |
| Wrong password | `authorize()` returns `null` |
| Database error during lookup | None. `authorize()` in `src/lib/auth.ts` has no `try`/`catch` around `prisma.user.findUnique({ where: { email } })`; if that call rejects (e.g. a database connectivity failure), the exception propagates uncaught out of `authorize()` rather than being handled explicitly by this module |

## Acceptance Criteria

### AC-1: Successful authentication

```gherkin
Given a prisma.user row with email "user@example.com" and a bcrypt-hashed password
When the credentials form is submitted with the matching email and plaintext password
Then authorize() returns { id, email, name } and a JWT session is established with session.user.id set
```

### AC-2: Wrong password rejected

```gherkin
Given a prisma.user row with email "user@example.com"
When the credentials form is submitted with that email and an incorrect password
Then authorize() returns null and no session is created
```
