---
type: use-case
audience: [developer]
language: en
links: []
---

# UC-P02: Resolve Session User

## Summary

A server-side caller (e.g. an API route handler) needs to know which user is making the current request; it calls `requireUserId()` (`src/lib/requireUser.ts`) to resolve the authenticated user's ID from the NextAuth server session.

## Actors

| Actor | Type | Description |
|-------|------|--------------|
| Server-side caller | Primary | Any server code that calls `await requireUserId()`; concrete callers are outside this module's inputs |
| NextAuth session store | Secondary | Backs `getServerSession(authOptions)` |

## Preconditions

- [ ] `authOptions` is correctly configured (`src/lib/auth.ts`) so that `getServerSession` can decode a valid session.
- [ ] [NEEDS CLARIFICATION] Whether a session cookie/token is present depends on a prior sign-in, which is outside this module's inputs.

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

## Error Handling

| Error Condition | System Response |
|------------------|-------------------|
| No session / unauthenticated | Returns `null` (not an exception) |
| `getServerSession` throws | [NEEDS CLARIFICATION] No try/catch is present in `requireUserId()`; propagation is not confirmed in this module's inputs |

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
