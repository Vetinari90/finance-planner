---
type: use-case
audience: [developer]
language: en
links: [../api.md, sign-in.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Sign Out

## Summary

An authenticated user ends their session by requesting `GET /logout`, which redirects to NextAuth's built-in sign-out endpoint.

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Authenticated user | Primary | A user with an active session, whose client issues `GET /logout` (`src/app/logout/route.ts`). |

## Preconditions

- [ ] The user has an active session (established per [sign-in.md](sign-in.md)).

## Postconditions

- [ ] [NEEDS CLARIFICATION] Whether the session cookie is actually cleared is determined by NextAuth's internal `/api/auth/signout` flow, which is outside this dispatch's permitted read set; only the redirect step itself is grounded.
- [ ] The user's browser is redirected toward `/api/auth/signout?callbackUrl=/login`.

## Main Flow

| Step | Actor | Action | System Response |
|------|-------|--------|-----------------|
| 1 | User / client | Issues `GET /logout`. | `src/app/logout/route.ts` handles the request. |
| 2 | System | — | Returns `NextResponse.redirect(new URL("/api/auth/signout?callbackUrl=/login", "http://localhost:3000"))`. |
| 3 | System | — | [NEEDS CLARIFICATION] NextAuth's internal sign-out flow at `/api/auth/signout` is not visible in this dispatch's permitted read set; it presumably clears the session and follows `callbackUrl` to `/login`. |

## Alternative Flows

None found — `src/app/logout/route.ts` contains a single unconditional redirect with no branching logic.

## Error Handling

| Error Condition | System Response |
|-----------------|-----------------|
| None | No error-handling branches exist in `src/app/logout/route.ts`; it is an unconditional redirect. |

**Grounded note:** the redirect's base URL is the hard-coded literal `"http://localhost:3000"`, not derived from the incoming request. [NEEDS CLARIFICATION] Whether this is correct outside local development is not established by the code.

## Acceptance Criteria

### AC-1: Logout redirects toward NextAuth sign-out

```gherkin
Given an authenticated user
When they issue GET /logout
Then they receive a redirect toward /api/auth/signout?callbackUrl=/login
```

### AC-2: Hard-coded base URL risk

```gherkin
[NEEDS CLARIFICATION]
Given the route is deployed to a non-local environment
When a client requests /logout
Then the redirect target's correctness (built from the hard-coded "http://localhost:3000") is unconfirmed
```
