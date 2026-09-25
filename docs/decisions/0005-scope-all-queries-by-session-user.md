---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 983341781c05105b2104725ca48c43ffa23ea03a
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:d33fdb3f7ae1daded7dd01637bd972ca815ff8d2f5f33a35eed05233d91bc3c2
---

# 0005 Scope All Queries By Session User

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Status

[NEEDS CLARIFICATION] No ADR status (Proposed / Accepted / Deprecated / Superseded) is stated in `inputs.references` or the available module-docs for this decision; please confirm the current status.

### Context

The plans module ([docs/modules/plans/overview.md](../modules/plans/overview.md)) documents that every plan-related operation - creating, listing, fetching the detail of, and deleting a plan - is performed "for the current user" or is restricted to plans "owned by the current user." The current user is resolved via `requireUserId()` (API routes) or `getServerSession(authOptions)` (server-rendered pages), both outside the plans module, and the delete operation additionally performs an explicit ownership check before deleting. This indicates a project-wide need to prevent one authenticated user from reading or modifying another user's data through shared database queries.

[NEEDS CLARIFICATION] The auth, planned-items, persistence, and web-ui module `overview.md` documents were not yet generated (each contains only an `[UNFILLED]` placeholder) at the time this document was synthesized, so the full cross-module context for this decision - in particular how the persistence module's Prisma client enforces the scoping, and whether the planned-items module applies the same pattern to plan items - could not be grounded.

### Decision

Based on the plans module's documented behavior, the project scopes plan-related queries (create, list, fetch, delete) by the current session user: each operation resolves the acting user before touching data, and the delete operation additionally verifies ownership before proceeding ([docs/modules/plans/overview.md](../modules/plans/overview.md)).

[NEEDS CLARIFICATION] Neither `inputs.references` nor the available module-docs state whether this scoping is implemented as an explicit `userId` (or equivalent) filter added to every persistence-layer query, or through some other mechanism (e.g., a database-level policy); the persistence module's `overview.md` is not yet generated, so the concrete mechanism cannot be confirmed. Likewise, no input confirms whether this scoping rule is applied uniformly across the auth, planned-items, and web-ui modules.

### Consequences

#### Positive

- Users cannot list, view, or delete plans they do not own, since the plans module resolves the acting user for every operation and verifies ownership before deleting ([docs/modules/plans/overview.md](../modules/plans/overview.md)).

#### Negative

[NEEDS CLARIFICATION] No negative consequences (e.g., added query complexity, performance impact, risk of a missed scoping filter in a new query) are stated in `inputs.references` or the available module-docs.

### Alternatives Considered

[NEEDS CLARIFICATION] No alternatives to per-query user scoping (e.g., database-level row-level security, per-tenant schemas) are documented in `inputs.references` or the available module-docs.

### References

- [Plans module overview](../modules/plans/overview.md)
<!-- /SLOT:content -->
