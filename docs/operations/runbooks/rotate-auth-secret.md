---
type: documentation
audience: [developer]
language: en
links: [../../modules/auth/overview.md]
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:c570623018befaf06912252ebc777c39c0f38664ad5cf303bf17f184e1f10d59
---

# Rotate Auth Secret

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Summary

This runbook is intended to cover rotating the authentication secret used by finance-planner's sign-in / session mechanism. Grounding for this dispatch was limited to `README.md` and the `auth`, `plans`, `planned-items`, `persistence`, and `web-ui` module overview documents; none of them name a specific secret (environment variable, secrets-manager entry, or configuration key), its storage location, or a rotation procedure. Most procedural steps below are therefore marked `[NEEDS CLARIFICATION]` rather than invented.

### What is known

- Authentication is implemented via NextAuth.js. The catch-all route handler `src/app/api/auth/[...nextauth]/route.ts` delegates all auth sub-routes (sign-in, sign-out, session, CSRF, callback) to `NextAuth(authOptions)` (per [`docs/modules/auth/overview.md`](../../modules/auth/overview.md)).
- `authOptions` — the object that would configure the credentials provider and any JWT/session signing secret — is imported from `@/lib/auth`, which falls outside the `auth` module's own read scope (it maps to the `persistence` / `src/lib` scope per the project's `generation.module-source-map`). Its internal configuration is not established by this dispatch's inputs.
- Sign-in is performed via the NextAuth `credentials` provider: `src/app/login/LoginClient.tsx` and the post-registration auto-login in `src/app/register/page.tsx` both call `signIn("credentials", { email, password, redirect: false, ... })` (per `docs/modules/auth/overview.md`).
- Account registration (`POST /api/auth/register`) hashes passwords with `bcryptjs` before persisting the user via Prisma (per `docs/modules/auth/overview.md`); this is a separate credential (the user's password hash) from any session-signing secret and is not itself the subject of this runbook.
- The root route `src/app/page.tsx` (web-ui module) calls `getServerSession(authOptions)` and redirects to `/plans` or `/login` based on session presence (per `docs/modules/web-ui/overview.md`), confirming that a server-evaluated session check gates the application, but not revealing how the underlying session token is signed or where its secret lives.

[NEEDS CLARIFICATION] Whether NextAuth is configured here with the JWT session strategy (in which case rotating a signing secret invalidates all existing sessions, forcing every user to re-authenticate) or the database session strategy (in which case rotation impact differs) is unconfirmed — the module doc that would resolve this, `docs/modules/persistence/overview.md`, is still an unfilled skeleton (`[UNFILLED]`) as of this generation run.

### Preconditions

[NEEDS CLARIFICATION] No input describes preconditions for a secret rotation (e.g. required approvals, a maintenance window, or an expected active-session count).

### Procedure

[NEEDS CLARIFICATION] No input names the actual secret (its environment variable name, secrets-manager entry, or configuration key), where it is stored, or the commands/steps needed to generate and deploy a new value. `README.md` is generic Next.js `create-next-app` boilerplate (getting-started, `npm run dev`, and a generic "Deploy on Vercel" pointer) and contains no finance-planner-specific secrets or deployment procedure. No `package.json`, `.env` file, or deployment configuration was part of this dispatch's inputs.

### Impact of rotation

[NEEDS CLARIFICATION] The consequence of rotating the secret (e.g. forced re-authentication of all users, in-flight request failures) depends on the session strategy noted above, which is not confirmed by this dispatch's inputs.

### Rollback

[NEEDS CLARIFICATION] No input describes a rollback procedure for a rotation that causes an outage or authentication failure.

### Related

- [Auth module overview](../../modules/auth/overview.md)
<!-- /SLOT:content -->
