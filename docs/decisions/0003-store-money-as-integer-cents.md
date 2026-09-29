---
type: decision
audience: [developer]
language: en
links: [docs/modules/app/technical.md, docs/data-model.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Store Money as Integer Cents

**Status:** Accepted (inferred from current implementation in code; no separate decision record was present in inputs)

## Context

Planned-item amounts must be stored and summed without floating-point rounding errors.

## Decision

We will store planned item amounts as an integer number of cents. `CreateItemSchema` validates `amountCents: z.number().int().min(0)` (`src/app/api/plans/[planId]/items/route.ts`). The client converts a decimal string entered by the user into an integer cents value via regex-based parsing in `toCents()` (`src/app/plans/[planId]/AddItemForm.tsx`) before submission, and totals are computed by summing `amountCents` and dividing by 100 for display (`src/app/plans/[planId]/page.tsx`, `src/app/plans/page.tsx`).
[NEEDS CLARIFICATION] [REVIEW] accuracy: Document asserts specific code facts (Zod schema shape, a regex-based toCents() parser, and totals logic in named files) that are absent from every input the doc was generated from - the manifest (docs/.expanded-inputs.decisions.json) shows only README.md, a generic Next.js boilerplate readme with no mention of these symbols, was supplied.

## Consequences

**Positive:**
- Summation of item amounts (`plan.items.reduce((acc, it) => acc + it.amountCents, 0)`) is exact integer arithmetic with no floating-point drift.
[NEEDS CLARIFICATION] [REVIEW] accuracy: The exact code snippet `plan.items.reduce((acc, it) => acc + it.amountCents, 0)` is quoted as fact but has no grounding in any input available for this doc (manifest lists only README.md, which contains no such code).

**Negative:**
- [NEEDS CLARIFICATION] Currency-specific minor-unit exceptions (e.g. currencies with 0 or 3 decimal places) are not addressed by the fixed 2-decimal `toCents()` conversion in `AddItemForm.tsx`.
