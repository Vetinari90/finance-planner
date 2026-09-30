---
type: decision
audience: [developer]
language: en
links: [docs/standards.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Zod Validation with a Common Error Envelope

**Status:** Accepted

## Context

Every API route that accepts a request body needs to validate untrusted input before it reaches the database.

## Decision

We will validate all POST bodies with `zod` schemas defined per route: `RegisterSchema` (`src/app/api/auth/register/route.ts`: email, password min 8 characters, optional name max 80), `CreatePlanSchema` (`src/app/api/plans/route.ts`: year 2000-2100, month 1-12, 3-letter currency defaulting to `"CZK"`), and `CreateItemSchema` (`src/app/api/plans/[planId]/items/route.ts`: title max 120, non-negative integer `amountCents`, optional `categoryId`/`note`). On validation failure, routes return HTTP 400 with body `{ error: "Invalid input", details: parsed.error.flatten() }`. Other failure cases return a flat `{ error: "<message>" }` string (e.g. `{ error: "Unauthorized" }` for 401, `{ error: "Not found" }` for 404, `{ error: "Email already exists" }` / `{ error: "Plan for this month already exists" }` for 409).

## Consequences

**Positive:**
- Input shape is enforced consistently at the API boundary before any database call.
- Validation errors expose field-level detail (`parsed.error.flatten()`) to help API consumers correct requests.

**Negative:**
- The actual error shape (`{ error: string, details?: object }`) is a flatter, string-based envelope than the nested `{ error: { code, message, requestId } }` convention shown in the project's cross-cutting standards document (see [../standards.md](../standards.md)). This is an existing deviation between the documented convention and the current implementation that inputs.code does not reconcile.
[NEEDS CLARIFICATION] [REVIEW] consistency: This ADR claims the nested `{ error: { code, message, requestId } }` envelope convention is 'shown in the project's cross-cutting standards document' (docs/standards.md), but docs/standards.md's own Error Handling section does not state or display any such nested convention - it only describes the same flat `{ error: string }` shape and refers back to this ADR. The two docs are inconsistent about where this 'documented convention' is actually defined.
