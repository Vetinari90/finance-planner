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
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:841bd03d226462c2e1b23b2527b2808a82ede46377b7f3ac2dc7f4da6f211206
---

# ADR: Security Baseline

**Status:** [NEEDS CLARIFICATION] This node's `inputs.references` is empty and no decision-record status (Proposed / Accepted / Deprecated) appears in the four module-docs it synthesizes from (`docs/modules/app/README.md`, `docs/modules/app/technical.md`, `docs/modules/lib/README.md`, `docs/modules/lib/technical.md`); status cannot be grounded from the permitted read set for this node.

## Context

finance-planner stores per-user credentials and per-user financial data (monthly
plans and their planned items) and exposes both through an HTTP API. The `app`
module's route handlers hold no authentication or database logic of their own;
they delegate session/authentication config, the database client, and a
session-identity helper to the `lib` module via `@/lib/auth`, `@/lib/db`, and
`@/lib/requireUser` (`docs/modules/app/README.md`, Purpose and Dependencies
sections). A baseline needed to be established for how credentials are stored,
how a caller is authenticated, and how one user's plans and items are kept from
being read or modified by another user.

[NEEDS CLARIFICATION] No discussion of why this particular baseline was chosen (alternatives considered, threat model, regulatory driver) was present in this node's inputs.references or in the four module-docs; only the resulting implementation is documented here.

## Decision

Based on the implementation documented in the `app` and `lib` module docs, the
following baseline is in place:

- **Password storage:** on registration, `src/app/api/auth/register/route.ts`
  hashes the submitted password with `bcrypt.hash(..., 12)` before calling
  `prisma.user.create`; the plaintext password is not persisted
  (`docs/modules/app/technical.md`, `/api/auth/register` row).
- **Credential verification:** sign-in is handled by a NextAuth
  `CredentialsProvider` configured in `src/lib/auth.ts`, which resolves the user
  via `prisma.user.findUnique({ where: { email } })` and verifies the submitted
  password against the stored hash with `bcrypt.compare`
  (`docs/modules/lib/README.md`, Key Entities and Dependencies sections).
- **Input validation:** write endpoints validate request bodies with `zod`
  schemas before touching the database - `RegisterSchema` (email format,
  password minimum length 8, optional name up to 80 chars), `CreatePlanSchema`,
  and `CreateItemSchema` - returning HTTP 400 with the schema's `flatten()`
  error details on invalid input (`docs/modules/app/technical.md`, `/api/auth/register`,
  `/api/plans`, and `/api/plans/{planId}/items` rows).
- **Session requirement on every plan/item route:** `GET`/`POST /api/plans`,
  `GET`/`DELETE /api/plans/{planId}`, and `POST /api/plans/{planId}/items` all
  call `requireUserId()` (`src/lib/requireUser.ts`) before running any business
  logic and return HTTP 401 when no session is present
  (`docs/modules/app/technical.md`, corresponding endpoint rows).
- **Per-user ownership scoping:** reads and deletes of a specific plan look it
  up with `prisma.plan.findFirst` scoped to the caller's `userId`, returning
  HTTP 404 - not a bare "found but forbidden" response - when the plan either
  does not exist or belongs to a different user, so the API does not reveal
  whether a given `planId` exists for another account
  (`docs/modules/app/technical.md`, `GET`/`DELETE /api/plans/{planId}` rows).

## Consequences

**Positive:**
- Plaintext passwords are never written to storage; only the bcrypt hash is
  persisted (`docs/modules/app/technical.md`, `/api/auth/register` row).
- Every plan- and item-related route rejects unauthenticated requests
  uniformly via the shared `requireUserId()` helper before executing business
  logic (`docs/modules/app/technical.md`).
- Scoping plan lookups to the caller's `userId` and returning a uniform 404
  prevents one user from confirming the existence of, reading, or deleting
  another user's plan through the API (`docs/modules/app/technical.md`,
  `GET`/`DELETE /api/plans/{planId}` rows).
- Zod validation rejects malformed registration, plan-creation, and
  item-creation payloads before they reach Prisma, returning structured
  field-level errors to the caller (`docs/modules/app/technical.md`).

**Negative:**
- [NEEDS CLARIFICATION] `docs/modules/lib/technical.md` states that `src/lib/auth.ts` does not reference a NextAuth signing secret (e.g. an env var such as `NEXTAUTH_SECRET`) in the reviewed code, and no secrets configuration file was present in the `lib` module's inputs; whether a session-signing secret is configured elsewhere cannot be confirmed from this node's permitted read set.
- `src/app/logout/route.ts` builds its sign-out redirect against a hard-coded
  base URL of `http://localhost:3000` rather than a configured host
  (`docs/modules/app/technical.md`, "Notable hard-coded value"); this will not
  resolve correctly in any non-local deployment.
- [NEEDS CLARIFICATION] No test files, test scripts, or `package.json` were present in either the `app` or `lib` module's inputs (`docs/modules/app/technical.md` and `docs/modules/lib/technical.md`, Testing sections), so none of the security behaviors described above have confirmed automated test coverage within the permitted read set.
- [NEEDS CLARIFICATION] No Prisma schema file was present in the `app` or `lib` module's inputs, so DB-level constraints that back this baseline - for example whether `PlannedItem` rows cascade-delete when their parent `Plan` is deleted - cannot be confirmed (`docs/modules/app/technical.md`, `DELETE /api/plans/{planId}` row; `docs/modules/app/README.md`, Key Entities section).
