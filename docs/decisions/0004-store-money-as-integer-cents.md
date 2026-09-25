---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:46d0ac250ad2a72f1e43ff8a158cd1807522a5e39dc0463b5d9d6f6367d46c72
---

# 0004 Store Money As Integer Cents

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
## Status

[NEEDS CLARIFICATION] No explicit ADR status (Proposed / Accepted / Deprecated / Superseded) for this decision was found in `README.md` or in the module-overview docs supplied as inputs (`docs/modules/auth/overview.md`, `docs/modules/plans/overview.md`, `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`). The decision does, however, appear implemented: `docs/modules/planned-items/overview.md` describes the `POST /api/plans/{planId}/items` handler as validating and persisting a new planned item's `amountCents` field, which indicates the integer-cents representation is already present in the code that module's overview was generated from.

## Context

[NEEDS CLARIFICATION] None of the inputs available to this synthesis node (`README.md`, which is unmodified Next.js boilerplate with no finance-planner-specific content, or the five module-overview docs) state the problem, constraints, or forces that motivated storing money as integer cents (e.g. avoiding floating-point rounding error, currency-arithmetic requirements, or a specific bug this decision fixed). Only the resulting field name is observable, not the reasoning behind it.

The monetary fields observable across the supplied module-docs are:

- `PlannedItem.amountCents` - "Validate and persist new planned items (`title`, `amountCents`, optional `categoryId`, optional `note`) under a given plan, via `POST /api/plans/{planId}/items`." (`docs/modules/planned-items/overview.md`, Responsibilities)
- `Plan.currency` - "validating `title`/`year`/`month`/`currency` with Zod and defaulting `title` to `${month}.${year}` and `currency` to `CZK`" (`docs/modules/plans/overview.md`, Responsibilities)

## Decision

Based on the field name `amountCents` documented for the `PlannedItem` entity in `docs/modules/planned-items/overview.md`, the system represents a planned item's monetary amount as an integer number of cents (i.e. the smallest currency subunit) rather than as a decimal or floating-point value.

[NEEDS CLARIFICATION] The supplied module-docs do not state whether the `Plan` entity or any other entity also stores a monetary total or amount as integer cents, nor do they name the concrete data type (e.g. integer column type) used to persist `amountCents` - the underlying Prisma schema was not among this node's inputs.

## Consequences

### Positive

[NEEDS CLARIFICATION] No consequences of this decision (positive or negative) are stated in `README.md` or in the five supplied module-overview docs.

### Negative

[NEEDS CLARIFICATION] No consequences of this decision (positive or negative) are stated in `README.md` or in the five supplied module-overview docs.

## Alternatives Considered

[NEEDS CLARIFICATION] No alternative representations (e.g. decimal/`Money` type, floating-point) or the reasons they were rejected are documented in the inputs available to this synthesis node.

## References

[NEEDS CLARIFICATION] No links, benchmarks, or research documents backing this decision were present in `README.md` or in the supplied module-overview docs.
<!-- /SLOT:content -->
