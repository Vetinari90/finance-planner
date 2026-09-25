---
type: documentation
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/planned-items/overview.md, ../modules/persistence/overview.md, ../modules/web-ui/overview.md]
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:24ae02e6e3c7a1bb5dae6246c6238647f6a66d1dd5f40aa5227168a368a14598
---

# Standards

## standards.md

<!-- SLOT:content brief="Document content (standards.md)" -->
This document consolidates cross-cutting development conventions observed across finance-planner's modules, synthesized from the already-generated module overview documents ([auth](../modules/auth/overview.md), [plans](../modules/plans/overview.md), [planned-items](../modules/planned-items/overview.md), [persistence](../modules/persistence/overview.md), [web-ui](../modules/web-ui/overview.md)) and `README.md`. `README.md` is the generic Next.js `create-next-app` scaffold text and contains no finance-planner-specific standards, so it does not ground any claim below.

### API Conventions

- Server-side behavior is implemented as Next.js App Router Route Handlers under `src/app/api/**`, one directory per resource: `POST /api/auth/register` and the NextAuth catch-all `/api/auth/[...nextauth]` (per [auth overview](../modules/auth/overview.md)); `GET`/`POST /api/plans` and `GET`/`DELETE /api/plans/{planId}` (per [plans overview](../modules/plans/overview.md)); `POST /api/plans/{planId}/items` (per [planned-items overview](../modules/planned-items/overview.md)).
- All observed routes are unprefixed by a version segment (e.g. `/api/plans`, not `/api/v1/plans`).
- Request bodies are validated with Zod schemas at the route boundary before any persistence call: registration input in the auth module, plan `title`/`year`/`month`/`currency` in the plans module, and planned-item `title`/`amountCents`/`categoryId`/`note` in the planned-items module (per their respective overview documents).
- [NEEDS CLARIFICATION] No standardized success/error response envelope (field naming, pagination shape) could be confirmed across modules from the available inputs.

### Authentication & Session Conventions

- Authentication configuration is centralized in the persistence module (`src/lib/auth.ts`): a NextAuth `CredentialsProvider` verifies email/password against `prisma.user` with `bcrypt.compare`, using a `jwt`-strategy session with `jwt`/`session` callbacks that propagate the user ID onto the session (per [persistence overview](../modules/persistence/overview.md)).
- API route handlers resolve the current user via `requireUserId()` (`@/lib/requireUser.ts`, persistence module), which returns `null` rather than throwing when there is no session - per persistence/overview.md, enforcement of a 401/redirect on a missing session is left to each caller, and the callers that do this enforcement were outside that module's own manifest scope.
- Server-rendered pages resolve the session directly via `getServerSession(authOptions)` (observed in the web-ui root route and in the plans module's pages, per their overview documents) and redirect unauthenticated visitors to `/login`.
- Passwords are hashed with `bcryptjs` (cost factor 12, per [auth overview](../modules/auth/overview.md)) at registration and verified with `bcrypt.compare` at sign-in (per [persistence overview](../modules/persistence/overview.md)).
- [NEEDS CLARIFICATION] No package manifest (e.g. `package.json`) was present in any module's inputs, so the `next-auth`, `bcryptjs`, and `zod` package versions could not be confirmed, per the dependency-grounding rule.

### Data Access Conventions

- Every module that touches the database does so exclusively through a single shared Prisma client (`@/lib/db`, owned by the persistence module) - no module instantiates its own client (per auth, plans, planned-items, and persistence overview documents).
- The Prisma client is bound to PostgreSQL via a `PrismaPg` adapter and fails fast at module load if `DATABASE_URL` is unset (per [persistence overview](../modules/persistence/overview.md), `src/lib/db.ts`).
- Ownership scoping by the authenticated user is an observed convention in the two modules that expose it: plans list/fetch/delete operations are scoped to the current user, and planned-item creation is scoped to a plan owned by the authenticated user via `prisma.plan.findFirst` (per [plans overview](../modules/plans/overview.md) and [planned-items overview](../modules/planned-items/overview.md)).
- [NEEDS CLARIFICATION] Whether user-scoping is enforced as a documented project-wide rule (versus an incidental pattern in these two modules) was not established from the available inputs.

### Error Handling

[NEEDS CLARIFICATION] No standardized error-response shape, error code taxonomy, or fail-fast/fail-safe policy was found in `inputs.code` or `inputs.references`. Each module overview document notes only per-route Zod validation; none describes a shared error-handling convention.

### Logging

[NEEDS CLARIFICATION] No logging library, log-level convention, correlation-ID convention, or sensitive-data redaction rule was found in `inputs.code` or `inputs.references`.

### Configuration

- `DATABASE_URL` is a required environment variable; the persistence module fails fast at module load when it is unset (per [persistence overview](../modules/persistence/overview.md), `src/lib/db.ts`).
- [NEEDS CLARIFICATION] No other environment-variable naming convention, secrets-management approach, or feature-flag convention was found in `inputs.code` or `inputs.references`. A NextAuth session-signing secret (commonly `NEXTAUTH_SECRET`) is implied by the JWT-strategy session described in [persistence overview](../modules/persistence/overview.md), but no module's inputs confirmed its name or storage mechanism.

### Versioning

[NEEDS CLARIFICATION] No API versioning policy was found in `inputs.code` or `inputs.references`; all observed routes are unprefixed by a version segment.
<!-- /SLOT:content -->
