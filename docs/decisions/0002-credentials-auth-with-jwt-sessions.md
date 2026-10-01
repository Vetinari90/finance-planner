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

# ADR: Credentials Auth with JWT Sessions

**Status:** [NEEDS CLARIFICATION] This node's `inputs.references` is empty and no decision-record status (Proposed / Accepted / Deprecated) appears in the four module-docs it synthesizes from (`docs/modules/app/README.md`, `docs/modules/app/technical.md`, `docs/modules/lib/README.md`, `docs/modules/lib/technical.md`); status cannot be grounded from the permitted read set for this node.

## Context

finance-planner needs to authenticate a caller before letting them read or
write their own monthly plans and planned items. The `app` module's route
handlers hold no authentication logic of their own; every plans/items route
delegates session resolution to the `lib` module via `@/lib/requireUser`, and
the sign-in flow itself is delegated to `@/lib/auth` (`docs/modules/app/README.md`,
Purpose and Dependencies sections). The `lib` module, in turn, configures a
NextAuth `CredentialsProvider` in `src/lib/auth.ts` that resolves a user by
email via `prisma.user.findUnique` and checks the submitted password against
a stored bcrypt hash with `bcrypt.compare` (`docs/modules/lib/README.md`, Key
Entities section). A decision was needed on how a caller proves their
identity on sign-in, and how that identity is subsequently carried on each
request to the `/api/plans` family of endpoints.

[NEEDS CLARIFICATION] No discussion of alternatives considered (for example a database-backed session store via a Prisma adapter, OAuth providers, or a custom token scheme) was present in this node's `inputs.references` or in the four module-docs; only the resulting implementation is documented here.

## Decision

Based on the implementation documented in the `app` and `lib` module docs, the
following authentication/session approach is in place:

- **Sign-in mechanism:** a NextAuth `CredentialsProvider` is configured as
  `authOptions` in `src/lib/auth.ts`. It is mounted by the catch-all route
  handler `src/app/api/auth/[...nextauth]/route.ts`, which re-exports the
  `NextAuth(authOptions)` handler as both `GET` and `POST`
  (`docs/modules/app/technical.md`, `/api/auth/[...nextauth]` row).
- **Credential verification:** on sign-in, the provider resolves the user via
  `prisma.user.findUnique({ where: { email } })` and compares the submitted
  password against the stored bcrypt hash with `bcrypt.compare`
  (`docs/modules/lib/README.md`, Key Entities section).
- **Session identity resolution:** every plan- and item-related route handler
  (`GET`/`POST /api/plans`, `GET`/`DELETE /api/plans/{planId}`,
  `POST /api/plans/{planId}/items`) calls `requireUserId()` from
  `src/lib/requireUser.ts` before running any business logic, and the page
  components (`src/app/page.tsx`, `src/app/plans/page.tsx`,
  `src/app/plans/[planId]/page.tsx`) read `session.user.id` /
  `session.user.email` off the resolved session
  (`docs/modules/app/README.md`, Purpose section;
  `docs/modules/app/technical.md`, corresponding endpoint rows).
- **Sign-out:** `src/app/logout/route.ts` redirects to NextAuth's built-in
  `/api/auth/signout` endpoint rather than invoking the client-side `signOut`
  function directly, because `signOut` is a client-side-only API
  (`docs/modules/app/technical.md`, `/logout` row).

[NEEDS CLARIFICATION] Neither `docs/modules/lib/README.md` nor `docs/modules/lib/technical.md` states the NextAuth `session.strategy` value (e.g. `"jwt"` vs. a database-backed session) configured in `authOptions`, nor any `session.maxAge` or JWT callback customization. This node's title names "JWT sessions," but that specific configuration detail is not present in the permitted module-docs read set and cannot be confirmed here; the `lib` module's own documentation would need to state it explicitly, or the underlying `src/lib/auth.ts` source would need to be in scope for this node.

## Consequences

**Positive:**
- Credential verification and session identity resolution are centralized in
  the `lib` module (`src/lib/auth.ts`, `src/lib/requireUser.ts`) and consumed
  uniformly by every `app`-module route handler, rather than each route
  re-implementing its own check (`docs/modules/app/README.md`, Dependencies
  section).
- Plaintext passwords are never compared or stored directly; verification
  goes through `bcrypt.compare` against a stored hash
  (`docs/modules/lib/README.md`, Key Entities section).
- Unauthenticated requests to any plan or item endpoint are rejected
  uniformly via the shared `requireUserId()` helper before business logic
  runs (`docs/modules/app/technical.md`, `/api/plans` and
  `/api/plans/{planId}` rows).

**Negative:**
- [NEEDS CLARIFICATION] `docs/modules/lib/technical.md` states that no NextAuth signing secret (e.g. an env var such as `NEXTAUTH_SECRET`) was referenced in the reviewed `src/lib/auth.ts` code, and no secrets configuration file was present in the `lib` module's inputs; whether and how a session-signing secret is configured cannot be confirmed from this node's permitted read set.
- `src/app/logout/route.ts` builds its sign-out redirect against a hard-coded
  base URL of `http://localhost:3000` rather than a configured host
  (`docs/modules/app/technical.md`, "Notable hard-coded value"); this will not
  resolve correctly in any non-local deployment.
- [NEEDS CLARIFICATION] No test files, test scripts, or `package.json` were present in either the `app` or `lib` module's inputs (`docs/modules/app/technical.md` and `docs/modules/lib/technical.md`, Testing sections), so the sign-in, session-resolution, and sign-out behaviors described above have no confirmed automated test coverage within the permitted read set.
- [NEEDS CLARIFICATION] The exact session token lifetime, renewal behavior, and whether the session cookie is refreshed on activity are determined by NextAuth configuration in `src/lib/auth.ts`, which is outside this node's permitted module-docs read set.
</content>
