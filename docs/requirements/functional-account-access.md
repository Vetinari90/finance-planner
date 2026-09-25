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
[NEEDS CLARIFICATION] [REVIEW] consistency: The Summary states the planned-items and persistence module overviews were still unfilled `[UNFILLED]` skeletons and could not be incorporated, but both docs/modules/persistence/overview.md and docs/modules/planned-items/overview.md are now fully filled documents elsewhere in the same docs tree, contradicting this doc's account of what was available.
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
[NEEDS CLARIFICATION] [REVIEW] consistency: FR-2's clarification claims the credential-verification logic cannot be confirmed because docs/modules/persistence/overview.md was an unfilled skeleton, but that overview is now filled and explicitly states the CredentialsProvider verifies email/password via bcrypt.compare - contradicting the 'cannot be confirmed here' claim.
unfilled skeleton at generation time, so this requirement's verification step
[NEEDS CLARIFICATION] [REVIEW] completeness: FR-2's [NEEDS CLARIFICATION] says the credential-verification logic can't be confirmed because docs/modules/persistence/overview.md was 'still an unfilled skeleton at generation time'. That file is currently present and fully filled, and states the CredentialsProvider verifies the password with bcrypt.compare - this content is available and missing from FR-2.
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
[NEEDS CLARIFICATION] [REVIEW] consistency: FR-3's clarification says the session strategy (JWT vs. database-backed) is unconfirmed because persistence's overview was unfilled, but docs/modules/persistence/overview.md is now filled and states the session uses a jwt-strategy - contradicting this doc's 'unconfirmed' claim for the strategy portion.
lifetime are configured inside `authOptions`, which was outside this
dispatch's permitted read scope for the `auth` module and whose owning module
(`persistence`) has an unfilled overview document; these details are
[NEEDS CLARIFICATION] [REVIEW] completeness: FR-3's [NEEDS CLARIFICATION] says the session strategy (JWT vs. database-backed) is unconfirmed because persistence's overview document is unfilled. docs/modules/persistence/overview.md is present and filled, and explicitly states the session uses a jwt strategy - this answer is missing from FR-3.
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
[NEEDS CLARIFICATION] [REVIEW] consistency: FR-5's clarification says whether planned-items operations are scoped to the owning account could not be confirmed because docs/modules/planned-items/overview.md was an unfilled skeleton, but that overview is now filled and explicitly confirms planned-item creation is scoped to plans owned by the authenticated user - contradicting the claimed unconfirmed status.
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
