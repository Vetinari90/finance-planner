---
type: cross-cutting
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/planned-items/overview.md, ../modules/persistence/overview.md, ../modules/web-ui/overview.md]
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_branch: sdlc/20260925-1148
---

# Development Standards

This document synthesizes cross-cutting API, error-handling, logging, and configuration conventions for finance-planner. It is produced from `README.md` and the module-overview documents for `auth`, `plans`, `planned-items`, `persistence`, and `web-ui` ([auth overview](../modules/auth/overview.md), [plans overview](../modules/plans/overview.md), [planned-items overview](../modules/planned-items/overview.md), [persistence overview](../modules/persistence/overview.md), [web-ui overview](../modules/web-ui/overview.md)) — not from direct inspection of source code. `README.md` itself is generic Next.js `create-next-app` boilerplate and contributes no finance-planner-specific content.

---

## API Conventions

### Design Principles

[NEEDS CLARIFICATION] None of the synthesized module overviews or `README.md` state an explicit API design philosophy (consistency guidelines, developer-experience goals, backward-compatibility policy). The observed pattern, drawn from the routes documented across modules, is a set of Next.js App Router route handlers under `src/app/api/**`, each performing input validation with Zod before touching persistence — this recurs in the auth module (`POST /api/auth/register`, per [auth overview](../modules/auth/overview.md)), the plans module (`POST /api/plans`, per [plans overview](../modules/plans/overview.md)), and the planned-items module (`POST /api/plans/{planId}/items`, per [planned-items overview](../modules/planned-items/overview.md)). No formal principle statement beyond this recurring implementation pattern was found.

### REST Standards

The following endpoints are documented across the synthesized module overviews:

| Method | Path | Module | Source |
|--------|------|--------|--------|
| POST | `/api/auth/register` | auth | [auth overview](../modules/auth/overview.md) |
| (catch-all) | `/api/auth/[...nextauth]` | auth | [auth overview](../modules/auth/overview.md) |
| GET | `/logout` (redirects to `/api/auth/signout`) | auth | [auth overview](../modules/auth/overview.md) |
| GET, POST | `/api/plans` | plans | [plans overview](../modules/plans/overview.md) |
| GET, DELETE | `/api/plans/{planId}` | plans | [plans overview](../modules/plans/overview.md) |
| POST | `/api/plans/{planId}/items` | planned-items | [planned-items overview](../modules/planned-items/overview.md) |

Naming is partly resource-oriented: `plans` is a plural collection noun, and `items` is nested under a specific plan resource (`/api/plans/{planId}/items`), consistent with REST resource-nesting convention. `auth` and `logout` are not resource nouns; they are auth-flow endpoints layered on top of the NextAuth catch-all route rather than CRUD resources. [NEEDS CLARIFICATION] No document in the synthesized set states whether this mixed naming (resource nouns for `plans`/`items`, verb/flow-oriented paths for auth) is an intentional convention or an artifact of NextAuth's own routing requirements.

The [persistence overview](../modules/persistence/overview.md) and [web-ui overview](../modules/web-ui/overview.md) both explicitly state their modules do **not** define any HTTP route handlers or API endpoints themselves, so no additional endpoints are attributable to those two modules.

[NEEDS CLARIFICATION] Whether the planned-items module exposes additional endpoints (list, update, delete) is unresolved — the [planned-items overview](../modules/planned-items/overview.md) notes that a `use-cases/list-plan-items.md` node exists elsewhere in the doc tree but that no corresponding route handler was present in that module's own dispatch inputs.

### Response Format

[NEEDS CLARIFICATION] No response envelope structure, field-naming convention (camelCase vs. snake_case), or pagination format is documented in `README.md` or any of the five synthesized module overviews.

### HTTP Status Codes

[NEEDS CLARIFICATION] None of the synthesized module overviews states which HTTP status codes the route handlers actually return. The overviews describe validation (Zod), ownership checks (e.g., the plans module "verifying ownership" before delete, per [plans overview](../modules/plans/overview.md)), and duplicate-email checks (auth registration, per [auth overview](../modules/auth/overview.md)), which imply some 4xx-class responses exist for invalid or unauthorized requests, but the concrete status codes used are not established by these inputs.

### Versioning

None of the documented paths (`/api/auth/register`, `/api/plans`, `/api/plans/{planId}`, `/api/plans/{planId}/items`) carry a version segment (e.g., no `/api/v1/...` prefix appears anywhere in the synthesized inputs). [NEEDS CLARIFICATION] No explicit versioning approach or deprecation policy is documented; the absence of a version prefix may be intentional (single-version API) or simply unaddressed — this dispatch's inputs do not distinguish between the two.

---

## Error Handling

### Principles

[NEEDS CLARIFICATION] No explicit error-handling philosophy (fail-fast vs. fail-safe, expected vs. unexpected error taxonomy) is documented in `README.md` or the synthesized module overviews. The recurring use of Zod validation at the API boundary (auth registration, plan creation, planned-item creation, per the respective module overviews) suggests input is rejected before reaching business logic, but no document states this as a stated design principle.

### Error Classification

[NEEDS CLARIFICATION] No error-classification scheme (validation vs. business-rule vs. authentication vs. authorization vs. not-found vs. infrastructure) is documented anywhere in the synthesized inputs. The [persistence overview](../modules/persistence/overview.md) notes that `requireUserId()` returns `null` rather than throwing when no session is present, "leaving enforcement (e.g. returning a 401) to its callers" — but it also flags that the calling API routes which perform that enforcement are outside its own module's reviewed scope, so the resulting classification/status mapping is unconfirmed.

### Error Response Format

[NEEDS CLARIFICATION] No standard error-response body structure is documented in `README.md` or the synthesized module overviews.

### Recovery Strategies

[NEEDS CLARIFICATION] No retry policy, circuit-breaker pattern, or graceful-degradation approach is documented in the synthesized inputs.

---

## Logging

### Principles

[NEEDS CLARIFICATION] No logging goals (debugging, monitoring, compliance) or structured-logging/correlation-ID requirement are documented in `README.md` or the synthesized module overviews.

### Log Levels

[NEEDS CLARIFICATION] No log-level scheme is documented in the synthesized inputs.

### Required Fields

[NEEDS CLARIFICATION] No mandatory log-field set is documented in the synthesized inputs.

### Sensitive Data

No explicit "never log" policy is documented, but the following is grounded in the synthesized module overviews: passwords are never handled in plaintext at the points described — the auth module "hashes the password with `bcryptjs` (cost factor 12)" before persistence during registration, and the persistence module's `authOptions` "verifies email/password against `prisma.user` with `bcrypt.compare`" during sign-in (both per their respective overviews). [NEEDS CLARIFICATION] Whether raw passwords, session tokens, or other sensitive fields are excluded from application logs specifically is not addressed by any of the synthesized inputs.

---

## Configuration

### Principles

[NEEDS CLARIFICATION] No configuration philosophy (12-factor, environment-based config, configuration-as-code) is documented in `README.md` or the synthesized module overviews.

### Source Hierarchy

[NEEDS CLARIFICATION] No configuration source-priority hierarchy (environment variables vs. secrets manager vs. config files vs. defaults) is documented in the synthesized inputs.

### Environment Variables

One required environment variable is grounded in the [persistence overview](../modules/persistence/overview.md): the module "fail[s] fast at module load if `DATABASE_URL` is not set" (`src/lib/db.ts`). [NEEDS CLARIFICATION] No naming convention for environment variables, and no other required variables (for example a NextAuth secret, which the [auth overview](../modules/auth/overview.md) separately flags as unconfirmed), are documented in the synthesized inputs.
[NEEDS CLARIFICATION] [REVIEW] consistency: This line attributes the 'NextAuth secret unconfirmed' flag to the auth overview (../modules/auth/overview.md), but that document never mentions a NextAuth secret; the flag actually appears in docs/modules/auth/deployment.md, a different document not linked here. Sibling cross-cutting docs (error-handling.md, configuration.md) state the opposite: that none of the five module overviews name this variable at all.

### Secrets Management

[NEEDS CLARIFICATION] No secrets-storage approach or rotation requirement is documented in the synthesized inputs beyond `DATABASE_URL` being read as an environment variable; how that variable itself is provisioned or rotated is not addressed.

### Feature Flags

[NEEDS CLARIFICATION] No feature-flag usage, naming convention, or lifecycle management is documented in any of the synthesized module overviews.
