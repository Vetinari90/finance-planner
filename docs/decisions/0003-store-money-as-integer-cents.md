---
type: decision
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Store Money as Integer Cents

**Status:** Accepted

## Context

Monetary amounts for planned items must be stored and summed without floating-point rounding errors.

## Decision

We will store all amounts as integers representing the smallest currency unit ("cents"). The API schema enforces this: `amountCents: z.number().int().min(0)` in `CreateItemSchema` (`src/app/api/plans/[planId]/items/route.ts`). The client converts user-entered decimal text to cents client-side before submitting, via the `toCents()` function in `src/app/plans/[planId]/AddItemForm.tsx`, which parses at most two decimal digits and avoids float multiplication. Totals are computed by summing `amountCents` integers and only converted to a decimal display string at render/export time with `(totalCents / 100).toFixed(2)` (`src/app/plans/[planId]/page.tsx`, `src/app/plans/page.tsx`, `src/app/plans/[planId]/ExportCsvButton.tsx`).
[NEEDS CLARIFICATION] [REVIEW] accuracy: This paragraph asserts specific, concrete implementation facts (exact schema declaration `amountCents: z.number().int().min(0)`, the `toCents()` function's parsing behavior, and the exact `(totalCents / 100).toFixed(2)` formatting expression) attributed to named files, but none of those code files were provided as input for this review (codeFiles is empty; the only referenced file is the generic README). These facts are unverifiable against any enumerated input and cannot be confirmed as grounded.

## Consequences

**Positive:**
- Summing many items cannot accumulate binary floating-point rounding error.
- A single, consistent conversion boundary (cents to display string) exists at render/export time.

**Negative:**
- Every call site that displays or exports an amount repeats the same `(x / 100).toFixed(2)` pattern independently (`plans/[planId]/page.tsx`, `plans/page.tsx`, `ExportCsvButton.tsx`); [NEEDS CLARIFICATION] whether a shared formatting utility exists elsewhere was not confirmed in inputs.code.
