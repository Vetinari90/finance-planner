---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:482e4fdaa7468707c90cbef94244a1e7de37a0f7c489f1a7ebf9bb45578b81f8
---

# Threat Model

## security.md

<!-- SLOT:content brief="Document content (security.md)" -->
### Authentication and Authorization

#### Authentication Strategy

Authentication is implemented via NextAuth's `CredentialsProvider`. `authOptions` (defined in `src/lib/auth.ts`, per [docs/modules/persistence/overview.md](../modules/persistence/overview.md)) verifies an email/password pair against `prisma.user` using `bcrypt.compare`, uses a JWT-strategy session, and propagates the user ID onto the session via `jwt`/`session` callbacks. A custom `/login` sign-in page is configured.

Registration hashes the new password with `bcryptjs` at cost factor 12 before persisting the user, and validates registration input with a Zod schema (`POST /api/auth/register`, `src/app/api/auth/register/route.ts`, per [docs/modules/auth/overview.md](../modules/auth/overview.md)). The sign-in UI and post-registration auto-login both call `signIn("credentials", { email, password, redirect: false, ... })` from `next-auth/react`. All NextAuth sub-routes (sign-in, sign-out, session, CSRF, callback) are served by the catch-all handler `src/app/api/auth/[...nextauth]/route.ts`, which delegates to `NextAuth(authOptions)`.

**Threat:** single-factor authentication (email + password only). [NEEDS CLARIFICATION] Whether multi-factor authentication is planned or explicitly out of scope was not stated in any reviewed input.

**Threat:** password-guessing / brute-force. [NEEDS CLARIFICATION] No rate-limiting, account-lockout, or password-complexity policy is documented in `docs/modules/auth/overview.md`, `docs/modules/persistence/overview.md`, or `README.md` (the latter is generic Next.js boilerplate with no finance-planner-specific content).

#### Token / Session Management

The session strategy is JWT-based (per `docs/modules/persistence/overview.md`). [NEEDS CLARIFICATION] Token/cookie lifetime, refresh behavior, and cookie flags (`httpOnly`, `secure`, `sameSite`) are not documented in any reviewed module overview or `README.md`; asserting specific values would be fabrication.

#### Authorization Model

Authorization follows a per-resource ownership pattern rather than a documented RBAC/ABAC model: `docs/modules/plans/overview.md` states that `DELETE /api/plans/{planId}` verifies ownership before deleting, and that `GET`/reads for a plan are scoped to "a plan owned by the current user." The current-user ID is resolved via `requireUserId()` (`src/lib/requireUser.ts`, from `@/lib/requireUser`), which calls `getServerSession(authOptions)` and returns the session user's ID or `null` if there is none.

**Threat (authorization-bypass-by-omission):** `docs/modules/persistence/overview.md` explicitly documents that `requireUserId()` does **not** itself throw or redirect when no session is present - it only returns `null`, "leaving enforcement (e.g. returning a 401) to its callers." A route handler that fails to check for a `null` return would silently proceed without an authenticated user. [NEEDS CLARIFICATION] Whether every route handler across the auth, plans, and planned-items modules consistently checks for a `null` `requireUserId()` result could not be confirmed: the calling route implementations are outside this synthesis node's inputs (it draws only on module-level overview docs, not raw route source), and `docs/modules/planned-items/overview.md` - one of the module-docs named as input to this node - is still an unfilled skeleton (`[UNFILLED]`) in this generation run, so the planned-items module's enforcement pattern in particular is unconfirmed.

[NEEDS CLARIFICATION] No admin, elevated, or multi-role model is documented in any reviewed module overview; whether such a role exists could not be confirmed or ruled out from the inputs available to this node.

#### Permission Enforcement

Enforcement appears to be performed per-route (call `requireUserId()`, then scope Prisma queries by the resolved user ID) rather than via centralized middleware or a policy-evaluation layer. No `middleware.ts` or centralized authorization policy is referenced in any of the five module overview docs available to this node. [NEEDS CLARIFICATION] Confirm whether a Next.js `middleware.ts` or equivalent centralized enforcement layer exists; this synthesis node's inputs (module-docs and `README.md`) do not cover it.

#### Service-to-Service Auth

No inter-service or third-party service integration (e.g., email delivery, payment processing) is documented in `README.md` or any of the five module overview docs; finance-planner is described consistently across those overviews as a single Next.js application. [NEEDS CLARIFICATION] Confirm whether any external service integrations exist that would require service-to-service authentication.

---

### Audit Trail

[NEEDS CLARIFICATION] No audit-logging mechanism, auditable-event list, audit record format, or retention policy is described in `README.md` or in any of the module overview docs available to this node (`docs/modules/auth/overview.md`, `docs/modules/plans/overview.md`, `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`). The only related, grounded fact is that registration passwords are hashed with `bcryptjs` before storage rather than stored or logged in plaintext (per [docs/modules/auth/overview.md](../modules/auth/overview.md)); whether any audit trail captures authentication events, authorization decisions, or data changes is unconfirmed.

---

### Security Practices

Grounded practices observed in the reviewed module overviews:

- **Input validation:** Zod schemas validate registration input (`POST /api/auth/register`, per [docs/modules/auth/overview.md](../modules/auth/overview.md)) and plan-creation input - `title`/`year`/`month`/`currency` (`POST /api/plans`, per [docs/modules/plans/overview.md](../modules/plans/overview.md)).
- **Password storage:** passwords are hashed with `bcryptjs` at cost factor 12 before being persisted via `prisma.user.create` (per [docs/modules/auth/overview.md](../modules/auth/overview.md)).
- **Credential verification:** sign-in compares the submitted password against the stored hash with `bcrypt.compare` inside `authOptions` (per [docs/modules/persistence/overview.md](../modules/persistence/overview.md)).
- **Configuration handling:** `src/lib/db.ts` fails fast at module load if `DATABASE_URL` is not set (per [docs/modules/persistence/overview.md](../modules/persistence/overview.md)), indicating environment-variable-based configuration for the database connection.

Known data fields, as an informal sensitivity indicator: the `User` entity carries `id`, `email`, a hashed `password`, and an optional `name` (per [docs/modules/auth/overview.md](../modules/auth/overview.md) and [docs/modules/persistence/overview.md](../modules/persistence/overview.md)); the password field is the most sensitive and is stored hashed, not in plaintext.

[NEEDS CLARIFICATION] `docs/modules/persistence/overview.md` itself notes that the Prisma schema source (`schema.prisma`) was not part of its module's inputs, so the full set of stored fields (and therefore the complete data-sensitivity picture) cannot be confirmed from this synthesis node's inputs either.

[NEEDS CLARIFICATION] No dependency-scanning (SAST/DAST/SCA) process, no vulnerability-remediation SLA, and no secrets-manager or vault integration is documented in `README.md` or any of the five module overview docs.

---

### Monitoring and Observability

[NEEDS CLARIFICATION] No logging, metrics, tracing, health-check endpoint, or alerting mechanism is described in `README.md` or in any of the module overview docs available to this node (`docs/modules/auth/overview.md`, `docs/modules/plans/overview.md`, `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`). Observability pillars, SLIs/SLOs, health-check format, and alerting thresholds cannot be stated without inventing values.
<!-- /SLOT:content -->
