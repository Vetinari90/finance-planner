---
type: documentation
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/web-ui/overview.md]
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:c570623018befaf06912252ebc777c39c0f38664ad5cf303bf17f184e1f10d59
---

# 0002 Credentials Provider With Jwt Sessions

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Status

[NEEDS CLARIFICATION] No ADR status field (e.g. Proposed / Accepted / Superseded) or decision date was present in `README.md` or in any of the referenced module-docs (`docs/modules/auth/overview.md`, `docs/modules/plans/overview.md`, `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`).

### Context

The finance-planner application needs to authenticate users so that the `plans` module can scope monthly financial plans to the current account and the `web-ui` root route can gate entry into the authenticated area of the app.

- The [auth module overview](../modules/auth/overview.md) confirms the application integrates NextAuth: a catch-all route handler, `src/app/api/auth/[...nextauth]/route.ts`, delegates to `NextAuth(authOptions)`, and both the sign-in UI (`src/app/login/LoginClient.tsx`) and the post-registration auto-login (`src/app/register/page.tsx`) call `signIn("credentials", { email, password, redirect: false, ... })` from `next-auth/react` — i.e. NextAuth's built-in `credentials` provider is used for sign-in.
- The [plans module overview](../modules/plans/overview.md) confirms this authentication result is consumed elsewhere in the app: its API routes resolve the current user via `requireUserId()` and its server-rendered pages via `getServerSession(authOptions)`, redirecting unauthenticated visitors to `/login`.
- The [web-ui module overview](../modules/web-ui/overview.md) confirms the same pattern at the application root: `src/app/page.tsx` calls `getServerSession(authOptions)` and redirects to `/plans` (authenticated) or `/login` (unauthenticated).
- A `next-auth` module augmentation in `src/types/next-auth.d.ts`, per the auth module overview, declares the authenticated session's `user` shape (`id`, optional `name`, optional `email`).

[NEEDS CLARIFICATION] The actual provider configuration inside `authOptions` (imported from `@/lib/auth` in `src/app/api/auth/[...nextauth]/route.ts`) — including the session strategy (JWT vs. database), token lifetime, and the credential-verification logic that would justify the "JWT sessions" half of this decision's title — was out of scope for the `auth` module dispatch and is not established by any input available to this synthesis. `docs/modules/persistence/overview.md`, which per the auth module overview is the document that could resolve this (`@/lib/auth` resolves under `src/lib`, mapped to the `persistence` module in `generation.module-source-map`), is still an unfilled skeleton document (`[UNFILLED]`) as of this generation run, as is `docs/modules/planned-items/overview.md`. `README.md` is generic `create-next-app` boilerplate with no finance-planner-specific content and does not address this decision.

### Decision

Confirmed by inputs: the application uses NextAuth's `credentials` provider (email + password submitted via `signIn("credentials", ...)`) as its authentication mechanism, backed by a catch-all NextAuth route handler and a `User` record whose password is checked against a stored hash (per the auth module overview, registration hashes the password with `bcryptjs` before storing it via `prisma.user.create`).

[NEEDS CLARIFICATION] Whether the session strategy configured in `authOptions` is specifically JWT-based (as opposed to a database-backed session store) is not confirmed by any input in this synthesis's read set. No input document states the `session.strategy` value passed to `NextAuth()`, nor gives a rationale for choosing JWT sessions over the alternative. This must be confirmed against the actual `authOptions` configuration (expected under `src/lib/auth`, owned by the `persistence` module) before this decision record can be considered fully grounded.

### Consequences

- Confirmed: because sign-in flows through `next-auth`'s `credentials` provider rather than a custom implementation, the `plans` and `web-ui` modules can uniformly rely on `getServerSession(authOptions)` (server-rendered pages) and a `requireUserId()` helper (API routes) to resolve the current user, per the plans and web-ui module overviews.
- [NEEDS CLARIFICATION] Consequences that are specific to a JWT session strategy (e.g. stateless scaling, inability to server-side revoke a session before token expiry, token payload size/claims, refresh behavior) cannot be documented here because the session strategy itself is unconfirmed by inputs. Once `docs/modules/persistence/overview.md` and the `authOptions` configuration are available, this section should be revisited.

### Alternatives Considered

[NEEDS CLARIFICATION] No input (README.md or any referenced module-doc) records what alternative authentication mechanisms or session strategies (e.g. database-backed sessions, a third-party OAuth-only provider, a custom auth service) were considered or rejected.
<!-- /SLOT:content -->
