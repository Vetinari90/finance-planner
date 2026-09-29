---
type: decision
audience: [developer]
language: en
links: [docs/modules/lib/technical.md, docs/modules/app/technical.md, docs/security.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Security Baseline
[NEEDS CLARIFICATION] [REVIEW] consistency: ADR numbering collision: this decision is numbered 0001, the same number used by docs/decisions/0001-prisma-driver-adapter-postgresql.md. Every other decision in the set (0002-0005) has a unique number, so two ADRs sharing 0001 is an inconsistency in the decision-record numbering scheme.

**Status:** Accepted (inferred from current implementation in code; no separate decision record was present in inputs)

## Context

The application handles user credentials and per-user financial plan data and needs baseline security practices around credential storage and route protection.

## Decision

We will hash passwords with bcrypt (cost factor 12) before storage (`src/app/api/auth/register/route.ts`) and verify credentials with `bcrypt.compare` on login (`src/lib/auth.ts`). We will require every plan- and item-related API route to call `requireUserId()` (`src/lib/requireUser.ts`) and return HTTP 401 Unauthorized before executing any business logic when no authenticated session exists (see `docs/security.md`).

## Consequences

**Positive:**
- Plaintext passwords are never persisted.
- Unauthenticated requests are rejected uniformly across all protected API routes.

**Negative:**
- [NEEDS CLARIFICATION] No rate-limiting, CSRF protection, or transport-security (HTTPS enforcement) configuration was found in inputs.code; these baseline hardening measures are unconfirmed.
