---
type: decision
audience: [developer]
language: en
links: [docs/modules/app/technical.md, docs/standards.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Zod Validation and Error Envelope

**Status:** Accepted (inferred from current implementation in code; no separate decision record was present in inputs)

## Context

API routes need to validate untrusted request bodies and return a consistent error shape to clients.

## Decision

We will parse the request body of every mutating API route with a `zod` schema via `.safeParse()`: `RegisterSchema` in `src/app/api/auth/register/route.ts`, `CreatePlanSchema` in `src/app/api/plans/route.ts`, and `CreateItemSchema` in `src/app/api/plans/[planId]/items/route.ts`. On failure, the route returns HTTP 400 with `{ error: "Invalid input", details: parsed.error.flatten() }`.

## Consequences

**Positive:**
- Validation logic and error shape are consistent across the register, plans, and items endpoints.

**Negative:**
- [NEEDS CLARIFICATION] No shared/reusable error-envelope helper or centralized validation middleware was found in inputs.code; each route repeats the same `safeParse`/400-response pattern inline.
