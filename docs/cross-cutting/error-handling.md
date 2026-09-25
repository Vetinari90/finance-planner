---
type: cross-cutting
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/planned-items/overview.md, ../modules/persistence/overview.md, ../modules/web-ui/overview.md, standards.md]
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:46d0ac250ad2a72f1e43ff8a158cd1807522a5e39dc0463b5d9d6f6367d46c72
---

# Error Handling

This document is a synthesis node: it is grounded exclusively in `README.md` and
the five module overview documents (`docs/modules/auth/overview.md`,
`docs/modules/plans/overview.md`, `docs/modules/planned-items/overview.md`,
`docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`), not
in raw source code. Its section list follows the `## ` headings of the
`docs/cross-cutting/standards.md` recipe. Where the module overviews do not
establish a project-wide error-handling standard, a `[NEEDS CLARIFICATION]`
marker is used instead of an invented convention.

---

## API Conventions

### Design Principles

Every mutation-facing route confirmed across the module overviews validates its
input with a Zod schema before doing any persistence work:

- `POST /api/auth/register` "validates input with a Zod schema" (auth overview).
- `POST /api/plans` validates `title`/`year`/`month`/`currency` "with Zod" (plans overview).
- `POST /api/plans/{planId}/items` applies "field-level validation (via Zod) before persistence" (planned-items overview).

A second recurring principle is ownership-scoping: reads and mutations are
consistently scoped to the resource owner. The plans overview states plans are
"owned by the current user" for list/get/delete, and the planned-items overview
states a planned item "can only be created under a plan owned by the
authenticated user."

[NEEDS CLARIFICATION] No explicit statement of a broader API design philosophy
(consistency guarantees, developer-experience goals, backward-compatibility
policy) was found in the five module overviews or `README.md` (`README.md` is
generic Next.js/`create-next-app` boilerplate with no finance-planner-specific
content).

### REST Standards

The confirmed API style is REST, implemented as Next.js App Router route
handlers. The following endpoints are confirmed across the module overviews:

- `POST /api/auth/register` (auth overview)
- NextAuth-managed sub-routes served by the catch-all handler at
  `src/app/api/auth/[...nextauth]/route.ts` (auth overview)
- `GET /logout`, a convenience route redirecting to NextAuth's `/api/auth/signout` (auth overview)
- `POST /api/plans` (plans overview)
- `GET /api/plans` (plans overview)
- `GET /api/plans/{planId}` (plans overview)
- `DELETE /api/plans/{planId}` (plans overview)
- `POST /api/plans/{planId}/items` (planned-items overview)

The confirmed paths use plural-noun collections (`/api/plans`) and nested
resource identifiers (`/api/plans/{planId}/items`), consistent with
conventional REST resource naming.

[NEEDS CLARIFICATION] No `PUT`/`PATCH` route for updating an existing plan or
planned item is confirmed in any of the five module overviews; the
planned-items overview explicitly notes that "no corresponding route handler
was present" for listing, updating, or deleting planned items in its reviewed
inputs, despite a sibling `use-cases/list-plan-items.md` doc tree node implying
that capability exists.

### Response Format

[NEEDS CLARIFICATION] None of the five module overview documents describe a
standard JSON response envelope, field-naming casing convention
(camelCase/snake_case), or pagination format used by finance-planner's API
routes.

### HTTP Status Codes

[NEEDS CLARIFICATION] None of the five module overview documents state which
HTTP status codes individual finance-planner routes actually return (for
example, what `POST /api/plans` returns on Zod validation failure, or what
`POST /api/plans/{planId}/items` returns when the plan is not owned by the
caller). A generic HTTP status-code reference table cannot be presented as a
confirmed finance-planner convention without this information.

### Versioning

[NEEDS CLARIFICATION] No API versioning scheme (URL path, header, or query
parameter) or deprecation policy is documented in the five module overviews or
`README.md`. All confirmed endpoints above use unversioned paths (e.g.
`/api/plans`, not `/api/v1/plans`).

---

## Error Handling

### Principles

Two grounded, project-specific patterns emerge from the persistence overview:

- **Fail-fast at load time for missing configuration:** the Prisma client
  (`src/lib/db.ts`) "Fail[s] fast at module load if `DATABASE_URL` is not set"
  (persistence overview, Responsibilities).
- **Delegated enforcement for absent sessions:** `requireUserId()`
  (`src/lib/requireUser.ts`) "does not throw or redirect when no session is
  present; `requireUserId()` only returns `null`, leaving enforcement (e.g.
  returning a 401) to its callers" (persistence overview, Boundaries). The
  persistence overview itself flags that the calling API routes which perform
  this enforcement were outside that module's own dispatch scope.

[NEEDS CLARIFICATION] Beyond these two points, no centralized error-handling
middleware, custom error-class hierarchy, or documented distinction between
"expected" and "unexpected" errors is described in the five module overviews or
`README.md`.

### Error Classification

| Category | Description | Confirmed in finance-planner inputs |
|----------|-------------|--------------------------------------|
| Validation | Zod-based validation failures at the request boundary | Validation itself is confirmed (auth register, plans create, planned-items create all validate with Zod per their overviews). [NEEDS CLARIFICATION] The resulting HTTP status code is not documented in any overview. |
| Authorization / ownership | Requests scoped to the authenticated user's own resources | Ownership-scoping is confirmed: plans overview - "Delete a plan owned by the current user, after verifying ownership"; planned-items overview - "Enforce that a planned item can only be created under a plan owned by the authenticated user." [NEEDS CLARIFICATION] The resulting HTTP status code on an ownership failure is not documented. |
| Authentication | Absent or invalid session | Confirmed pattern: `requireUserId()` returns `null` rather than throwing (persistence overview); [NEEDS CLARIFICATION] the status code returned by the calling routes on `null` is outside this synthesis node's inputs. |
| Infrastructure | Missing required configuration | Confirmed: the Prisma client module "Fail[s] fast at module load if `DATABASE_URL` is not set" (persistence overview) - this is a process/module-load-time failure, not a per-request HTTP response. |
| Not Found | Resource does not exist | [NEEDS CLARIFICATION] No overview states how a not-found plan, planned item, or user is reported to the caller. |

### Error Response Format

[NEEDS CLARIFICATION] None of the five module overview documents describe a
standard JSON error-response shape (error code, message, field-level
validation details, request ID) returned by finance-planner's routes.

### Recovery Strategies

[NEEDS CLARIFICATION] No retry policy, circuit-breaker pattern, or graceful
degradation approach is documented in the five module overviews or
`README.md`.

---

## Logging

### Principles

[NEEDS CLARIFICATION] No logging goals, structured-logging approach, or
correlation-ID usage is documented in the five module overview documents or
`README.md`.

### Log Levels

[NEEDS CLARIFICATION] No log-level usage or environment-specific logging
policy is documented in the available inputs.

### Required Fields

[NEEDS CLARIFICATION] No mandatory log-field list is documented in the
available inputs.

### Sensitive Data

[NEEDS CLARIFICATION] None of the five module overview documents or
`README.md` state an explicit sensitive-data logging policy. Two related,
grounded facts are available as context rather than as a logging policy:
the auth overview confirms passwords are hashed with `bcryptjs` (cost factor
12) before storage (`src/app/api/auth/register/route.ts`), and the persistence
overview confirms password verification uses `bcrypt.compare` against the
stored hash (`src/lib/auth.ts`) - i.e., plaintext passwords are not persisted.
Whether plaintext credentials could appear in application logs is not
addressed by any of the five overviews.

---

## Configuration

### Principles

[NEEDS CLARIFICATION] No configuration philosophy (12-factor, environment-based
configuration, configuration-as-code) is documented in the five module
overview documents or `README.md`.

### Source Hierarchy

[NEEDS CLARIFICATION] No documented precedence between environment variables,
a secrets manager, configuration files, and default values was found in the
available inputs.

### Environment Variables

One environment variable is confirmed: `DATABASE_URL`, required by the Prisma
client at module load (`src/lib/db.ts`, per the persistence overview's
Responsibilities section - "Fail fast at module load if `DATABASE_URL` is not
set"). [NEEDS CLARIFICATION] No other environment variable names (for example a
NextAuth secret) and no environment-variable naming convention are confirmed
in the five module overviews or `README.md`.

### Secrets Management

[NEEDS CLARIFICATION] No secrets-storage approach or rotation requirement is
documented in the five module overview documents or `README.md`.

### Feature Flags

[NEEDS CLARIFICATION] No feature-flag usage is mentioned in any of the five
module overview documents or `README.md`.
