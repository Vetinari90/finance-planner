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

# UC-P02: Resolve Session User

## Summary

A server-side caller (e.g. an API route handler) needs to know which user is making the current request; it calls `requireUserId()` (`src/lib/requireUser.ts`) to resolve the authenticated user's ID from the NextAuth server session.

## Actors

| Actor | Type | Description |
|-------|------|--------------|
| Server-side caller | Primary | Any server code that calls `await requireUserId()`; concrete callers are outside this module's inputs |
[NEEDS CLARIFICATION] [REVIEW] completeness: The Actors table claims concrete callers of requireUserId() are outside this module's inputs, but three callers (src/app/api/plans/route.ts, src/app/api/plans/[planId]/route.ts, src/app/api/plans/[planId]/items/route.ts) are in the provided codeFiles and each call requireUserId() directly - this input-evident material is omitted from the Actors description.
Concrete callers of `requireUserId()` present in this module's inputs are `src/app/api/plans/route.ts` (GET, POST), `src/app/api/plans/[planId]/route.ts` (GET, DELETE), and `src/app/api/plans/[planId]/items/route.ts` (POST) - each awaits `requireUserId()` directly and returns HTTP 401 when the result is `null`.
| NextAuth session store | Secondary | Backs `getServerSession(authOptions)` |

## Preconditions

- [ ] `authOptions` is correctly configured (`src/lib/auth.ts`) so that `getServerSession` can decode a valid session.
- [ ] The caller has previously authenticated through the credentials sign-in flow (`src/app/login/LoginClient.tsx` invoking NextAuth's `signIn("credentials", ...)`, handled by `src/app/api/auth/[...nextauth]/route.ts` using `authOptions` in `src/lib/auth.ts`), which establishes the JWT-backed session (`session: { strategy: "jwt" }`) that `getServerSession` reads.

## Postconditions

- [ ] If a valid session with a user ID exists: `requireUserId()` returns that ID (a string).
- [ ] If no valid session exists: `requireUserId()` returns `null`; no error is thrown.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|------------------|
| 1 | Server-side caller | Calls `await requireUserId()` | `requireUserId()` calls `getServerSession(authOptions)` |
| 2 | System | Reads `session?.user?.id` | Extracts the user ID with optional chaining |
| 3 | System | Returns the ID if present | Caller receives a string |

## Alternative Flows

### AF-1: No active session

**Branches from:** Step 2

| Step | Action | Response |
|------|--------|----------|
| 2.1 | `session` or `session.user.id` is falsy | `requireUserId()` returns `null` |

**Continues at:** ends - caller must decide how to respond (e.g. return HTTP 401); that logic is outside this module's inputs
[NEEDS CLARIFICATION] [REVIEW] completeness: The Alternative Flow states the HTTP-401 handling logic is 'outside this module's inputs', but the exact 401 response pattern is implemented in three caller files that are part of this doc's codeFiles (src/app/api/plans/route.ts, [planId]/route.ts, [planId]/items/route.ts) - the doc omits this readily available, input-evident detail.
Concretely implemented: each caller returns `NextResponse.json({ error: "Unauthorized" }, { status: 401 })` when `requireUserId()` resolves to `null`, in `src/app/api/plans/route.ts` (GET, POST), `src/app/api/plans/[planId]/route.ts` (GET, DELETE), and `src/app/api/plans/[planId]/items/route.ts` (POST).

## Error Handling

| Error Condition | System Response |
|------------------|-------------------|
| No session / unauthenticated | Returns `null` (not an exception) |
| `getServerSession` throws | Propagates uncaught: `requireUserId()` (`src/lib/requireUser.ts`) has no try/catch around `getServerSession`, and none of its callers (`src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`) wrap the `await requireUserId()` call either, so an exception from `getServerSession` propagates unhandled to the Next.js route handler. |

## Acceptance Criteria

### AC-1: Authenticated caller

```gherkin
Given a valid NextAuth session with session.user.id set
When requireUserId() is called
Then it returns that user ID
```

### AC-2: Unauthenticated caller

```gherkin
Given no active NextAuth session
When requireUserId() is called
Then it returns null
```
