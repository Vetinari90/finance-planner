---
type: decision
audience: [developer]
language: en
links: [docs/decisions/0005-per-user-tenant-isolation.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Security Baseline

**Status:** Accepted

## Context

The finance-planner application stores personal financial data (plans and planned items) per user account. It must ensure only the owning user can read or write their own data, that credentials are never stored in plaintext, and that unauthenticated requests are rejected.

## Decision

We will require a valid NextAuth session for every plan/item API route, resolved via `requireUserId()` (`src/lib/requireUser.ts`); routes return HTTP 401 when no session is present (see `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`). We will hash passwords with bcrypt at a cost factor of 12 before persisting them (`src/app/api/auth/register/route.ts`) and verify with `bcrypt.compare` at sign-in (`src/lib/auth.ts`). We will scope every plan lookup to `{ id: planId, userId }` so a user can never read or modify another user's plan (see [0005-per-user-tenant-isolation.md](0005-per-user-tenant-isolation.md)).

## Consequences

**Positive:**
- Every plan-scoped endpoint enforces ownership at the query level, reducing the risk of insecure direct object reference (IDOR) issues.
- Passwords are never stored or compared in plaintext.

**Negative:**
- [NEEDS CLARIFICATION] No rate-limiting, account lockout, or explicit CSRF handling beyond NextAuth's defaults was found in inputs.code; these may still need explicit design decisions.
