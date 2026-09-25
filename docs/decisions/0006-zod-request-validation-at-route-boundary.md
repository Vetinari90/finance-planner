---
type: adr
audience: [developer, architect]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/planned-items/overview.md]
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:24ae02e6e3c7a1bb5dae6246c6238647f6a66d1dd5f40aa5227168a368a14598
---

# 0006 Zod Request Validation At Route Boundary

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Status

Accepted. Zod-based request validation is present, as a consistent pattern, at the
route-handler boundary of every write endpoint documented across the reviewed
modules (see Decision below); it is not a proposal for future work.

### Context

finance-planner exposes several Next.js App Router API route handlers that accept
user-supplied JSON request bodies before the data reaches business logic and the
shared Prisma client (owned by the [persistence module](../modules/persistence/overview.md)):

- `POST /api/auth/register` in the [auth module](../modules/auth/overview.md) accepts
  registration input (email, password, etc.) that must be checked before a `User`
  row is created.
- `POST /api/plans` in the [plans module](../modules/plans/overview.md) accepts
  `title`/`year`/`month`/`currency` input that must be checked before a `Plan` row
  is created.
- `POST /api/plans/{planId}/items` in the
  [planned-items module](../modules/planned-items/overview.md) accepts
  `title`/`amountCents`/optional `categoryId`/optional `note` input that must be
  checked before a `PlannedItem` row is created.

Each of these handlers needs a way to reject malformed or missing fields before
they are passed to `prisma.*.create` calls.

[NEEDS CLARIFICATION] The specific forces that led to choosing a schema-validation
library at all (as opposed to hand-written `if` checks, or a different library) are
not established by `README.md` or the module overview documents available to this
synthesis; `README.md` is generic `create-next-app` boilerplate with no
finance-planner-specific content.

### Decision

We will validate incoming request bodies with Zod schemas at the API route-handler
boundary, before the data is passed to business logic or persisted through the
shared Prisma client. This pattern is evidenced consistently across three modules:

- The [auth module overview](../modules/auth/overview.md) states that
  `POST /api/auth/register` "validates input with a Zod schema" before checking for
  an existing email and creating the user.
- The [plans module overview](../modules/plans/overview.md) states that
  `POST /api/plans` validates `title`/`year`/`month`/`currency` "with Zod",
  defaulting `title` to `${month}.${year}` and `currency` to `CZK`.
- The [planned-items module overview](../modules/planned-items/overview.md) states
  that the module applies "field-level validation (via Zod) before persistence" for
  `POST /api/plans/{planId}/items`.

[NEEDS CLARIFICATION] The exact Zod schema definitions (field constraints, error
messages) and whether schemas are shared/reused across these three route handlers
or defined independently per route were not available in the module-overview
documents or `README.md` used to synthesize this decision; confirming this
requires reading the individual route-handler source files, which are outside this
synthesis node's permitted inputs (references and module-docs only).

### Consequences

#### Positive

- A single, consistent validation library and pattern is applied at the boundary
  of every write endpoint reviewed (auth, plans, planned-items), rather than each
  module inventing its own ad hoc checks.
- Validation runs before any database write (`prisma.*.create`), reducing the risk
  of malformed data reaching persistence.

#### Negative

[NEEDS CLARIFICATION] No input describes the error-response format returned when
Zod validation fails, whether validation schemas are centralized or duplicated
per route, or any performance/maintenance trade-offs observed in practice. None
of the reviewed module overviews or `README.md` address these points.

### Alternatives Considered

[NEEDS CLARIFICATION] No alternative validation approaches (e.g., manual checks,
a different schema library) are discussed in `README.md` or in any of the module
overview documents available to this synthesis node.

### References

[NEEDS CLARIFICATION] No dependency manifest (e.g. `package.json`) was part of
this synthesis node's inputs, so the installed `zod` package version cannot be
confirmed here, per the dependency-grounding rule. No other reference document or
URL discussing this decision was present in `README.md`.
<!-- /SLOT:content -->
