---
type: decision
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Credentials Provider with JWT Sessions

**Status:** Accepted

## Context

The application needs to authenticate users with an email/password login (no external OAuth identity providers are configured) while resolving the current user's id in each app/API route.

## Decision

We will use NextAuth's `CredentialsProvider` (`src/lib/auth.ts`) as the sole authentication provider, verifying the submitted password against the stored bcrypt hash with `bcrypt.compare`. We will use JWT-based sessions (`session: { strategy: "jwt" }`) rather than database-backed sessions. The `jwt` callback copies the authenticated user's id onto `token.sub`; the `session` callback copies `token.sub` onto `session.user.id`, which is only valid TypeScript because of the `Session` augmentation in `src/types/next-auth.d.ts`. The custom sign-in page is set to `/login` via `pages: { signIn: "/login" }`.

## Consequences

**Positive:**
- No dependency on an external identity provider or a database-backed sessions table.
- Stateless JWT sessions avoid a database round-trip to validate a session on every request.

**Negative:**
- [NEEDS CLARIFICATION] No `NEXTAUTH_SECRET` (or equivalent JWT signing secret) is referenced anywhere in inputs.code; how the JWT is signed in this deployment was not confirmed.
- Revoking a single active session before its JWT expires is not directly supported by a stateless JWT approach; no revocation mechanism was found in inputs.code.
