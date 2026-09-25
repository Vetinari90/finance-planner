---
type: documentation
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/persistence/overview.md, ../modules/web-ui/overview.md]
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:482e4fdaa7468707c90cbef94244a1e7de37a0f7c489f1a7ebf9bb45578b81f8
---

# Data Handling

## security.md

<!-- SLOT:content brief="Document content (security.md)" -->
This document consolidates how finance-planner handles data across modules: what is
stored, how it is classified, how access to it is scoped and authenticated, and what
could not be confirmed from the inputs available to this generation run. It is
synthesized from the already-generated module overviews for
[auth](../modules/auth/overview.md), [plans](../modules/plans/overview.md),
[persistence](../modules/persistence/overview.md), and
[web-ui](../modules/web-ui/overview.md); the planned-items module overview
(`docs/modules/planned-items/overview.md`) was still an unfilled skeleton document at
[NEEDS CLARIFICATION] [REVIEW] consistency: This document asserts the planned-items module overview was an unfilled skeleton and could not be incorporated, but docs/modules/planned-items/overview.md (in the same docs tree) is fully populated with Purpose, Responsibilities, Boundaries, Key Entities, Dependencies, and Dependents content, contradicting this claim.
[NEEDS CLARIFICATION] [REVIEW] completeness: The document's stated premise that the planned-items module overview was still an unfilled skeleton and could not be incorporated is stale: docs/modules/planned-items/overview.md is fully populated. Multiple downstream subsections (Authorization Model, Data Sensitivity, Data Classification) that depend on this premise omit information that is actually available in that document.
the time this file was generated and could not be incorporated (see the relevant
subsections below). `README.md` is generic Next.js boilerplate with no
finance-planner-specific data-handling content and contributes no facts to this
document.

### Authentication and Authorization

#### Authentication Strategy

Authentication is credential-based (email + password) via the NextAuth
`CredentialsProvider`, configured in `authOptions` (owned by the persistence module,
per [persistence overview](../modules/persistence/overview.md)). Credential
verification compares the submitted password against the stored hash with
`bcrypt.compare`. There is no OAuth2/OIDC/SAML/API-key identity provider evidenced in
the reviewed inputs.

#### Token Management

The session strategy is JWT-based: `authOptions` uses a `jwt` session strategy, and
`jwt`/`session` callbacks propagate the authenticated user's ID onto the session
object (per [persistence overview](../modules/persistence/overview.md)).

[NEEDS CLARIFICATION] Concrete token lifetimes (access/session token expiry, refresh
behavior) and the storage location of the session token (cookie name, `httpOnly` /
`secure` / `sameSite` flags) are not established by any input available to this
generation run.

#### Authorization Model

Authorization is row-level ownership scoping rather than RBAC/ABAC: the
[plans module overview](../modules/plans/overview.md) states that listing, fetching,
and deleting a plan is scoped to "plans owned by the current user," and that plan
deletion is performed "after verifying ownership." The current user's ID is resolved
via `requireUserId()` (persistence module) for API routes, and via
`getServerSession(authOptions)` for server-rendered pages (auth and web-ui modules).

[NEEDS CLARIFICATION] Whether the planned-items module (item-level CRUD under
[NEEDS CLARIFICATION] [REVIEW] completeness: This section says whether planned-items re-verifies plan ownership 'could not be confirmed' because the planned-items overview was treated as an unfilled skeleton, but docs/modules/planned-items/api.md (a populated document) already documents the ownership check (prisma.plan.findFirst({ id: planId, userId } })) for the POST endpoint - material available in the input set was not incorporated.
`/api/plans/{planId}/items`, per the plans module overview) re-verifies plan
ownership before returning or mutating items could not be confirmed - its module
overview (`docs/modules/planned-items/overview.md`) is an unfilled skeleton document
in this generation run.

#### Permission Enforcement

Per [persistence overview](../modules/persistence/overview.md), `requireUserId()`
does not itself throw or redirect when no session is present - it only returns the
resolved user ID or `null`, leaving enforcement (e.g., returning a 401 response) to
each calling route handler. There is no evidence in the reviewed inputs of a single
centralized authorization middleware; enforcement is per-route.

#### Service-to-Service Auth

[NEEDS CLARIFICATION] No inter-service or service-to-service calls are evidenced in
the reviewed module overviews; finance-planner appears to be a single Next.js
full-stack application rather than a multi-service system, but no input explicitly
confirms or denies the presence of any external service integration.

### Audit Trail

#### Auditable Events

[NEEDS CLARIFICATION] No audit-logging mechanism (for authentication events,
authorization decisions, or data changes such as plan create/update/delete) is
described in any of the reviewed module overviews.

#### Audit Record Format

[NEEDS CLARIFICATION] No audit record format or schema was found in the reviewed
inputs.

#### Data Sensitivity

The following data elements were confirmed across the module overviews:

| Element | Handling observed | Source |
|---------|-------------------|--------|
| User password | Hashed with `bcryptjs` at registration (cost factor 12); verified at sign-in with `bcrypt.compare` against the stored hash. Plaintext password is never persisted. | [auth overview](../modules/auth/overview.md), [persistence overview](../modules/persistence/overview.md) |
| User email / name | Stored on the `User` record; projected onto the authenticated session (`id`, optional `name`, optional `email`) via the NextAuth type augmentation in `src/types/next-auth.d.ts`. | [auth overview](../modules/auth/overview.md) |
| Plan (year, month, currency, title) | Owned by a single user; all reads/writes scoped to the current user's plans. `currency` defaults to `CZK` when not supplied at creation. | [plans overview](../modules/plans/overview.md) |

[NEEDS CLARIFICATION] Item-level financial data (e.g., individual planned-item amount,
category, or description fields) could not be confirmed: the planned-items module
overview is an unfilled skeleton document in this generation run.
[NEEDS CLARIFICATION] [REVIEW] consistency: This document claims item-level financial data could not be confirmed because the planned-items module overview is an unfilled skeleton, but that overview document actually names the concrete fields (title, amountCents, categoryId, note), contradicting the premise.

[NEEDS CLARIFICATION] Whether logs, error messages, or any other output mask
passwords, session tokens, or other sensitive fields is not established by any
reviewed input.

#### Retention

[NEEDS CLARIFICATION] No data retention period, account-deletion behavior, or data
purge policy is described in any of the reviewed module overviews or in `README.md`.

### Security Practices

#### Data Classification

Based only on what the module overviews confirm:

| Level | Data | Basis |
|-------|------|-------|
| Restricted | User password hash | Hashed with `bcryptjs` (cost factor 12) at registration; never stored or transmitted in plaintext per [auth overview](../modules/auth/overview.md). |
| Confidential | User email, name; Plan (year, month, currency, title) | Scoped to the owning user across listing, fetching, and deletion per [plans overview](../modules/plans/overview.md). |
| [NEEDS CLARIFICATION] | Planned-item fields (amount, category, description, etc.) | Not confirmed - planned-items module overview is an unfilled skeleton document. |

No "Public" or "Internal" (non-user-scoped, non-sensitive) data category is evidenced
in the reviewed inputs.

#### Secure Development

Input validation at the request boundary is confirmed for two flows: account
registration validates its payload with a Zod schema before checking for an existing
email and creating the user (per [auth overview](../modules/auth/overview.md)), and
plan creation validates `title`/`year`/`month`/`currency` with Zod before persisting
(per [plans overview](../modules/plans/overview.md)). All confirmed data access goes
through the shared Prisma client (`@/lib/db`, persistence module), which parameterizes
queries by construction; no input evidences a raw/string-concatenated SQL query path.

[NEEDS CLARIFICATION] No dependency-scanning, SAST/DAST tooling, or broader
secure-coding checklist adherence is described in the reviewed inputs.

#### Vulnerability Management

[NEEDS CLARIFICATION] No vulnerability-scanning approach or remediation SLA is
described in any reviewed input.

### Monitoring and Observability

#### Observability Pillars

[NEEDS CLARIFICATION] No metrics, logging, or tracing stack is described in the
reviewed module overviews or in `README.md`.

#### Service Level Indicators / Objectives

[NEEDS CLARIFICATION] No SLI/SLO targets (availability, latency, error rate) are
established by any reviewed input.

#### Health Checks

[NEEDS CLARIFICATION] No liveness/readiness probe or health-check endpoint is
described in the reviewed inputs. The [persistence overview](../modules/persistence/overview.md)
does note that the shared Prisma client fails fast at module load if `DATABASE_URL` is
unset, which is a startup-time check but not a described runtime health endpoint.

#### Alerting

[NEEDS CLARIFICATION] No alerting strategy or severity/response mapping is described
in any reviewed input.

#### Required Metrics

[NEEDS CLARIFICATION] No standard metrics (request rate, error rate, duration) are
described in any reviewed input.
<!-- /SLOT:content -->
