---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Glossary

## glossary.md

<!-- SLOT:content brief="Document content (glossary.md)" -->
This glossary is synthesized exclusively from the already-generated module domain-model and data-model documents named as this node's inputs. No `inputs.references` were supplied for this node.

### Item

A single budget line within a plan, comprising a `title`, an amount in integer cents (`amountCents`), an optional `note`, and a `categoryId` (always submitted as `null` by the reviewed client code; no category-selection UI was observed). `Item` is owned by the planned-items module and is documented here only through its relationship to `Plan`.

Source: [Domain Model](modules/plans/domain-model.md), [Data Model](modules/plans/data-model.md) (plans module)

### Plan

The aggregate root of the plans module. Represents one user's financial plan for a single calendar month. A `Plan` belongs to exactly one `userId` and is unique per `(userId, year, month)` for that user - a duplicate create is rejected with a `409` response. Key fields: `title` (defaults to `${month}.${year}` when omitted), `year` (2000-2100), `month` (1-12), and `currency` (defaults to `"CZK"`). Contains zero or more `Item` records.

Source: [Domain Model](modules/plans/domain-model.md), [Data Model](modules/plans/data-model.md) (plans module)

### SessionUser

A non-persisted value object representing the shape of `session.user` after a successful sign-in, declared via NextAuth module augmentation (`src/types/next-auth.d.ts`). Fields: `id` (required), `name` and `email` (both optional, nullable). Derived from `User` but is not itself a database row.

Source: [Domain Model](modules/auth/domain-model.md) (auth module)

### User

The aggregate root of the auth module. Represents a registered account holder, created via the registration endpoint. Fields: `email` (lowercased and trimmed before lookup/creation), `password` (stored only as a bcrypt hash with cost factor 12 - never the plaintext value), and an optional `name` (1-80 characters when provided).

Source: [Domain Model](modules/auth/domain-model.md) (auth module)

### amountCents

Integer field on `Item` holding a monetary amount expressed in cents rather than major currency units. Computed client-side before submission.

Source: [Data Model](modules/plans/data-model.md) (plans module)

### currency

A 3-character string field on `Plan` identifying the plan's currency; defaults to `"CZK"` when not supplied. The reviewed client UI offers only `CZK`, `EUR`, and `USD`, but the server-side validation does not restrict values to that set.

Source: [Domain Model](modules/plans/domain-model.md), [Data Model](modules/plans/data-model.md) (plans module)

### Terms not yet available

### PlannedItem

A single budgeted line item within a `Plan`, created via `POST /api/plans/{planId}/items`. Comprises a `title` (1-120 characters), an amount in integer cents (`amountCents`, a non-negative integer), an optional `categoryId`, and an optional `note` (up to 400 characters), with both `categoryId` and `note` nullable. Creation is scoped to the requesting user: the request is rejected with `404` unless a `Plan` matching `(id: planId, userId)` is found for the authenticated user.

Source: `src/app/api/plans/[planId]/items/route.ts`
### planId

Foreign key field on `PlannedItem` linking it to its owning `Plan`. Populated from the `{planId}` dynamic route segment at item-creation time (`POST /api/plans/{planId}/items`), after the handler confirms a `Plan` matching `(id: planId, userId)` exists for the authenticated user; it is not accepted as a client-supplied field in the create-item request body.

Source: `src/app/api/plans/[planId]/items/route.ts`
[NEEDS CLARIFICATION] [REVIEW] completeness: The glossary claims docs/modules/planned-items/domain-model.md, docs/modules/planned-items/data-model.md, and docs/modules/persistence/data-model.md are unfilled skeletons, but all three now contain full generated content (a detailed `PlannedItem` entity with invariants/relationships, and a `user` table definition). The glossary is missing terms genuinely available from its own named inputs, e.g. `PlannedItem` as a distinct domain term (with its `categoryId`/nullable-Category note and creation invariant) beyond the partial 'Item' entry sourced only from the plans module.
<!-- /SLOT:content -->
