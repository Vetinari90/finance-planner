---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Api of the persistence module.

## api.md

<!-- SLOT:content brief="Api of the persistence module. (api.md)" -->
### Summary

The `persistence` module (`src/lib/`) is an internal infrastructure module, not an HTTP-facing module. It exposes no routes of its own; instead it provides the shared Prisma database client, the NextAuth credentials configuration, and a session-to-user-id helper that other modules' API routes (out of this module's scope) import and use.

### Base Path

[NEEDS CLARIFICATION] Not applicable - this module defines no HTTP routes. No `/api/...` base path is declared in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.

### Authentication

| Requirement | Details |
|-------------|---------|
| Method | Credentials (email + password) via NextAuth `CredentialsProvider`, session strategy `jwt` (`src/lib/auth.ts`) |
| Required Scopes | [NEEDS CLARIFICATION] No scope/permission model was found in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts` |

`src/lib/auth.ts` defines `authOptions: NextAuthOptions` with a single `CredentialsProvider` whose `authorize(credentials)` callback:
1. Lower-cases and trims the submitted email.
2. Returns `null` if email or password is missing.
3. Looks up the user via `prisma.user.findUnique({ where: { email } })`.
4. Returns `null` if no user is found.
5. Compares the submitted password against `user.password` with `bcrypt.compare`.
6. Returns `{ id, email, name }` on success, `null` otherwise.

The `jwt` callback copies `user.id` onto `token.sub`; the `session` callback copies `token.sub` onto `session.user.id`. The sign-in page is configured as `/login` (`pages.signIn`).

### Endpoints

This module declares no HTTP endpoints in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`. [NEEDS CLARIFICATION] The route handlers that consume this module's exports live outside this module's manifest scope (e.g. under `src/app/api/auth`, per the project's module-source-map) and are out of scope for this document.

### Common Patterns

[NEEDS CLARIFICATION] No pagination or error-response envelope is defined in this module's code; these concepts do not apply to a module with no HTTP surface.

### Key Exports

Instead of HTTP endpoints, this module's "API" is a set of exported symbols consumed by other modules:

| Export | File | Signature | Purpose |
|--------|------|-----------|---------|
| `authOptions` | `src/lib/auth.ts` | `NextAuthOptions` | NextAuth configuration: credentials provider, JWT session strategy, `/login` sign-in page |
| `prisma` | `src/lib/db.ts` | `PrismaClient` | Shared, hot-reload-safe singleton Prisma client bound to PostgreSQL via a `PrismaPg` adapter |
| `requireUserId` | `src/lib/requireUser.ts` | `async function requireUserId(): Promise<string \| null>` | Resolves the current authenticated user's ID from the server session, or `null` if unauthenticated |

**Error Codes:**

[NEEDS CLARIFICATION] No error-code taxonomy is defined by this module; `requireUserId()` communicates the absence of a session only via a `null` return value, not a thrown error or code, and `authorize()` communicates failure only via a `null` return.
<!-- /SLOT:content -->
