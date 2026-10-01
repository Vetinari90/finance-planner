---
type: decision
audience: [developer]
language: en
links:
  - docs/modules/app/README.md
  - docs/modules/app/technical.md
  - docs/modules/lib/README.md
  - docs/modules/lib/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_branch: sdlc/20261001-2017
---

# ADR: Zod Validation and Error Envelope

**Status:** Accepted (inferred from the implementation described in docs/modules/app/technical.md; no separate decision record was present in this node's declared inputs.references, which is empty)

## Context

Per docs/modules/app/technical.md, the app module's route handlers accept
untrusted JSON request bodies on several mutating endpoints: `POST
/api/auth/register`, `POST /api/plans`, and `POST /api/plans/{planId}/items`.
Each of these needs to validate the incoming body before using it, and each
needs to communicate validation and other request failures to the client in
some response shape. docs/modules/app/README.md additionally lists `zod` as a
directly-imported third-party package used for "request body validation"
across these same three handlers (`RegisterSchema`, `CreatePlanSchema`,
`CreateItemSchema`).

[NEEDS CLARIFICATION] Neither docs/modules/lib/README.md nor
docs/modules/lib/technical.md describes any request-body validation or error
envelope — the `lib` module's documented surface (`src/lib/auth.ts`,
`src/lib/db.ts`, `src/lib/requireUser.ts`) is session/credentials and
database-client plumbing, not route handling. The context below is therefore
grounded in the `app` module's documentation only.

## Decision

Per docs/modules/app/technical.md, each of the following `app`-module route
handlers validates its JSON request body against a dedicated Zod schema before
proceeding:

- `POST /api/auth/register` (`src/app/api/auth/register/route.ts`) — validated
  with `RegisterSchema` (email format; password minimum length 8; optional
  `name` up to 80 characters).
- `POST /api/plans` (`src/app/api/plans/route.ts`) — validated with
  `CreatePlanSchema` (optional `title` up to 80 characters; integer `year`
  2000-2100; integer `month` 1-12; 3-character `currency`, defaulting to
  `"CZK"`).
- `POST /api/plans/{planId}/items` (`src/app/api/plans/[planId]/items/route.ts`)
  — validated with `CreateItemSchema` (`title` 1-120 characters;
  non-negative integer `amountCents`; optional/nullable `categoryId`; optional
  `note` up to 400 characters, nullable).

For the register and plans-creation endpoints, docs/modules/app/technical.md
states that a validation failure returns HTTP 400 with a body containing an
`error` field and a `details` field built from Zod's `flatten()` output.
[NEEDS CLARIFICATION] docs/modules/app/technical.md does not quote the literal
`error` string returned on a 400, so the exact message text cannot be
confirmed from this node's inputs. [NEEDS CLARIFICATION]
docs/modules/app/technical.md describes the `CreateItemSchema` validation
itself but does not separately restate the response shape on a validation
failure for `POST /api/plans/{planId}/items`; whether it follows the same
`{ error, details }` shape as the other two endpoints is not confirmed by this
node's inputs.

Beyond validation failures, docs/modules/app/technical.md documents other
non-2xx responses on the same and adjacent endpoints as a plain object with an
`error` field (no `details`): `POST /api/plans` returns HTTP 409 with
`{ error: "Plan for this month already exists" }` when a create throws; `GET
/api/plans/{planId}` and `DELETE /api/plans/{planId}` return HTTP 404 when the
plan is not found or not owned by the caller; and the plans endpoints return
HTTP 401 when `requireUserId()` finds no session. [NEEDS CLARIFICATION] The
exact JSON body returned for the 404 and 401 cases is not quoted verbatim in
docs/modules/app/technical.md (only the status code and condition are
stated), so only the 400 and 409 bodies above can be confirmed literally.

## Consequences

**Positive:**
- Per docs/modules/app/technical.md, the register and plans-creation endpoints
  share a consistent `{ error, details }` shape on validation failure (HTTP
  400), and non-validation failures across the documented plans endpoints
  consistently use a plain `{ error }` shape.

**Negative:**
- [NEEDS CLARIFICATION] Neither docs/modules/app/README.md nor
  docs/modules/app/technical.md describes a shared validation helper or
  centralized error-envelope middleware; the technical doc describes the Zod
  parse and the error response as occurring inline in each of the three route
  handlers. Whether a shared helper exists elsewhere is not established by
  this node's declared inputs (inputs.references is empty, and no such helper
  is named in the four module docs read for this node).
