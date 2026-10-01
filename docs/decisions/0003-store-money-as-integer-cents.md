---
type: adr
audience: [developer]
language: en
links:
  - docs/modules/app/README.md
  - docs/modules/app/technical.md
  - docs/modules/lib/README.md
  - docs/modules/lib/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:841bd03d226462c2e1b23b2527b2808a82ede46377b7f3ac2dc7f4da6f211206
---

# ADR: Store Money as Integer Cents

**Status:** [NEEDS CLARIFICATION] No decision-record reference (date, author, or explicit "Proposed"/"Accepted"/"Deprecated" status) was part of this node's inputs (`inputs.references` is empty for this node). The status below is inferred solely from the fact that the described representation is present in the generated module documentation; it has not been confirmed against an authoritative decision log.

## Context

`docs/modules/app/technical.md` documents the `PlannedItem` creation endpoint
(`POST /api/plans/{planId}/items`, `src/app/api/plans/[planId]/items/route.ts`):
the request body is validated by `CreateItemSchema`, whose `amountCents` field is
described as "non-negative int". `docs/modules/app/README.md` corroborates this,
listing `amountCents` as a field read/written on the `PlannedItem` entity
(`prisma.plannedItem`, observed in the same route file and rendered in
`src/app/plans/[planId]/page.tsx`).

Representing a monetary value as a field literally named `amountCents` — and
validating it as an integer rather than a decimal/float — indicates the planned
item's monetary value is stored in the smallest currency subunit (cents) rather
than as a floating-point major-unit amount. Storing money as a float is a
well-known source of binary floating-point rounding error in arithmetic
(summation, splitting, comparison); representing it as an integer count of the
minor unit avoids that class of error. Neither `docs/modules/app/README.md` nor
`docs/modules/app/technical.md` states this rationale explicitly in prose — it is
inferred from the field name and type constraint, consistent with the
implementation-over-comment precedence rule when no comment exists to contradict
it.

[NEEDS CLARIFICATION] Neither `docs/modules/lib/README.md` nor
`docs/modules/lib/technical.md` (the other module docs available to this node)
documents a `Plan` or `PlannedItem` schema definition, a currency-handling
utility, or any amount-formatting/conversion code, so the full problem statement
(e.g. whether the team evaluated and rejected a decimal/`Money`-object
alternative) cannot be grounded further from this node's inputs.

## Decision

Based on the evidence above, the system stores monetary amounts as integer cents:
the `PlannedItem.amountCents` field (validated as a non-negative integer by
`CreateItemSchema` in `src/app/api/plans/[planId]/items/route.ts`, per
`docs/modules/app/technical.md`) holds the amount in the minor currency unit
rather than as a floating-point decimal in the major unit.

`docs/modules/app/technical.md` also documents that a `Plan` carries its own
`currency` field (3 characters, defaulting to `"CZK"`, validated by
`CreatePlanSchema` in `src/app/api/plans/route.ts`). [NEEDS CLARIFICATION]
Whether the "cents" minor-unit assumption is applied uniformly across all
supported currency codes, including ones whose minor unit is not two decimal
places (e.g. zero-decimal currencies), is not addressed in any of this node's
inputs.

## Consequences

**Positive:**
- Arithmetic on `amountCents` (summation of `PlannedItem` amounts, comparisons)
  is exact integer arithmetic, avoiding binary floating-point rounding error
  that a decimal/float representation of a major-unit amount would be
  susceptible to.
- The validation rule observed in `docs/modules/app/technical.md`
  (`amountCents` must be a non-negative integer) is enforceable directly by the
  existing `CreateItemSchema` zod schema without an additional decimal-precision
  check.

**Negative:**
- [NEEDS CLARIFICATION] The conversion/formatting logic that renders
  `amountCents` back into a human-readable major-unit amount (for on-screen
  display or CSV export) is not present in any of this node's inputs
  (`docs/modules/app/README.md`, `docs/modules/app/technical.md`,
  `docs/modules/lib/README.md`, `docs/modules/lib/technical.md`), so its
  location and correctness (including rounding behavior and handling of
  non-two-decimal currencies) cannot be confirmed here.
- [NEEDS CLARIFICATION] No input available to this node states whether every
  write path to `PlannedItem.amountCents` (beyond the one `POST` endpoint
  documented in `docs/modules/app/technical.md`) consistently treats the value
  as cents, so a latent unit-mismatch risk (a future code path writing a
  major-unit float) cannot be ruled out from this node's inputs alone.
