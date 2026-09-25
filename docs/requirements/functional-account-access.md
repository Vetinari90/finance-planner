---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:c570623018befaf06912252ebc777c39c0f38664ad5cf303bf17f184e1f10d59
---

# Functional Account Access

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

Finance-planner gates access to a user's monthly plans behind a credential-based
account: a visitor must register, then sign in, before any plan data becomes
reachable, and every plan operation is scoped to the signed-in account. The
functional requirements below are synthesized from the `auth`, `plans`, and
`web-ui` module overviews. The `planned-items` and `persistence` module
overviews declared as inputs for this document were still unfilled skeleton
documents (`[UNFILLED]`) at the time this document was generated and could not
be incorporated; `README.md` (the other declared input) is generic Next.js
boilerplate with no finance-planner-specific account-access content.

### Functional Requirements

**FR-1 — Account registration.** A visitor can register a new account by
submitting credentials to `POST /api/auth/register`. The request is validated
with a Zod schema, the email is checked for an existing account via
`prisma.user.findUnique`, the password is hashed with `bcryptjs` (cost factor
12), and the account is created via `prisma.user.create`.
(Source: [modules/auth/overview.md](../modules/auth/overview.md))

**FR-2 — Credential-based sign-in.** A registered user can sign in with the
NextAuth `credentials` provider. Both the sign-in UI
(`src/app/login/LoginClient.tsx`) and the post-registration auto-login
(`src/app/register/page.tsx`) invoke `signIn("credentials", { email, password,
redirect: false, ... })` from `next-auth/react`.
(Source: [modules/auth/overview.md](../modules/auth/overview.md))

[NEEDS CLARIFICATION] The exact credential-verification logic invoked by the
`credentials` provider (how the submitted password is checked against the
stored hash) is implemented in `authOptions`, imported from `@/lib/auth`. That
file falls under the `persistence` module scope per the project's
module-source-map, and `docs/modules/persistence/overview.md` was still an
unfilled skeleton at generation time, so this requirement's verification step
cannot be confirmed here.

**FR-3 — Session issuance and session-gated access.** All NextAuth-managed
sub-routes (sign-in, sign-out, session, CSRF, callback) are served through the
catch-all handler `src/app/api/auth/[...nextauth]/route.ts`, delegating to
`NextAuth(authOptions)`. The `plans` module gates its API routes and
server-rendered pages behind this session: it calls `requireUserId()` (API
routes) or `getServerSession(authOptions)` (pages), redirecting unauthenticated
visitors to `/login`. The application's root route
(`src/app/page.tsx`, web-ui module) performs the same session check and
redirects to `/plans` when a session exists, or to `/login` when it does not.
(Sources: [modules/auth/overview.md](../modules/auth/overview.md),
[modules/plans/overview.md](../modules/plans/overview.md),
[modules/web-ui/overview.md](../modules/web-ui/overview.md))

[NEEDS CLARIFICATION] The session strategy (JWT vs. database-backed) and token
lifetime are configured inside `authOptions`, which was outside this
dispatch's permitted read scope for the `auth` module and whose owning module
(`persistence`) has an unfilled overview document; these details are
unconfirmed.

**FR-4 — Sign-out.** A signed-in user can sign out via `GET /logout`
(`src/app/logout/route.ts`), which redirects to NextAuth's built-in
`/api/auth/signout` endpoint.
(Source: [modules/auth/overview.md](../modules/auth/overview.md))

**FR-5 — Per-account data ownership scoping.** Once signed in, a user's plan
operations are scoped to their own account: creating a plan (`POST
/api/plans`), listing plans (`GET /api/plans`), fetching a single plan (`GET
/api/plans/{planId}`), and deleting a plan (`DELETE /api/plans/{planId}`) are
all performed against the current user resolved via `requireUserId()` /
`getServerSession(authOptions)`, and plan deletion additionally verifies
ownership before proceeding.
(Source: [modules/plans/overview.md](../modules/plans/overview.md))

[NEEDS CLARIFICATION] Whether `planned-items` operations (adding/listing items
under a plan) are likewise scoped to the owning account could not be confirmed:
`docs/modules/planned-items/overview.md`, declared as an input for this
document, was still an unfilled skeleton at generation time.

### Out of Scope / Unconfirmed

- Password reset and email verification: no such code path was identified in
  the reviewed `auth` module files.
  (Source: [modules/auth/overview.md](../modules/auth/overview.md))
- [NEEDS CLARIFICATION] Multi-tenant, privacy, or compliance rationale for why
  account-gated access exists was not established by any of the reviewed
  inputs.
<!-- /SLOT:content -->
