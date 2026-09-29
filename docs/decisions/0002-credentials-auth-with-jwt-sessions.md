---
type: decision
audience: [developer]
language: en
links: [docs/modules/lib/technical.md, docs/modules/lib/use-cases.md, docs/security.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Credentials Authentication with JWT Sessions

**Status:** Accepted (inferred from current implementation in code; no separate decision record was present in inputs)

## Context

The application needs to authenticate users without a third-party identity provider and needs API routes to identify the current user on every request.

## Decision

We will authenticate users with NextAuth's `CredentialsProvider` (email + password) and `session: { strategy: "jwt" }` (`src/lib/auth.ts`). The `authorize()` callback looks up the user by email via `prisma.user.findUnique` and verifies the password with `bcrypt.compare`. The `jwt` callback stores the user id in `token.sub`; the `session` callback copies `token.sub` into `session.user.id`, which is consumed by `requireUserId()` (`src/lib/requireUser.ts`) in every protected API route and server page.

## Consequences

**Positive:**
- No server-side session store is required since sessions are encoded as JWTs.
- `session.user.id` is available consistently to all protected routes via `requireUserId()`.

**Negative:**
- [NEEDS CLARIFICATION] No explicit `NEXTAUTH_SECRET` (or equivalent JWT signing secret) configuration was found in inputs.code; the signing-key source could not be confirmed.
