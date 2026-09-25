---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:46d0ac250ad2a72f1e43ff8a158cd1807522a5e39dc0463b5d9d6f6367d46c72
---

# First Time Signup

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
### Overview

A new visitor creates a finance-planner account and reaches the point where they can start managing their own monthly financial plans. This journey is synthesized from `docs/modules/auth/overview.md`, `docs/modules/persistence/overview.md`, `docs/modules/web-ui/overview.md`, and `docs/modules/plans/overview.md` (`README.md` is generic `create-next-app` boilerplate and contributes no finance-planner-specific business content).

[NEEDS CLARIFICATION] No input establishes the underlying business motivation for signup (e.g. why a user chooses finance-planner, any onboarding/marketing context, or acquisition channel) — only the technical registration and redirect mechanics are grounded.

### Actor

A new, unauthenticated user of finance-planner who does not yet hold an account. [NEEDS CLARIFICATION] No input describes this actor's role, demographic, or specific motivation beyond "a person who wants to use finance-planner to manage monthly plans" (inferred from the module purposes in `docs/modules/auth/overview.md` and `docs/modules/plans/overview.md`); no dedicated persona or business document was available.

### Steps

1. **Submit registration**: The user submits an email and password to `POST /api/auth/register` (`src/app/api/auth/register/route.ts`, per `docs/modules/auth/overview.md`). The route validates the input with a Zod schema and checks for an existing account via `prisma.user.findUnique`.
2. **Account creation**: If the email is not already registered, the route hashes the password with `bcryptjs` (cost factor 12) and creates the user record via `prisma.user.create` (`docs/modules/auth/overview.md`).
3. **Automatic sign-in**: The post-registration flow (`src/app/register/page.tsx`) calls `signIn("credentials", { email, password, redirect: false, ... })` from `next-auth/react` to establish a session immediately after registration, without a separate manual sign-in step (`docs/modules/auth/overview.md`).
4. **Session-aware landing**: [NEEDS CLARIFICATION] The exact client-side navigation performed by `src/app/register/page.tsx` immediately after a successful `signIn` call is not established by the grounded module docs. What is established is that finance-planner's root route (`src/app/page.tsx`, `docs/modules/web-ui/overview.md`) is a server component that calls `getServerSession(authOptions)` and redirects to `/plans` when a session exists, or to `/login` otherwise — so once the new session is active, navigating to `/` (or being routed there) lands the user on `/plans`.
5. **First view of the plans area**: On `/plans`, the now-authenticated user reaches the plans list page, rendered by the `plans` module, which lists all plans owned by the current user and exposes a "new plan" form (`docs/modules/plans/overview.md`). For a first-time user this list is expected to be empty, though no grounded input explicitly describes empty-state UI behavior. [NEEDS CLARIFICATION] Empty-state presentation on `/plans` is not confirmed by any input.

### Success Outcome

The user has a `User` record (with hashed password, per `docs/modules/auth/overview.md` and `docs/modules/persistence/overview.md`) and an active authenticated session (JWT-strategy session per `docs/modules/persistence/overview.md`'s description of `authOptions`), and is positioned on `/plans` to create their first monthly plan. Creation of that first plan itself is a separate journey and is out of scope here.

### Notes

- `docs/modules/auth/overview.md` explicitly notes that password reset and email verification are not implemented ("no such code path was found in the reviewed files"), so this journey has no alternate recovery path if the user mistypes their email or forgets their password during this first signup.
- `docs/modules/persistence/overview.md` notes that `requireUserId()` only returns `null` when no session exists rather than throwing or redirecting itself, leaving enforcement of the authenticated boundary to callers; for this journey, the relevant enforcement point on the root route is the redirect described in Step 4 above.
- [NEEDS CLARIFICATION] No input describes error-path UI behavior (e.g. what the user sees if `POST /api/auth/register` rejects a duplicate email or fails Zod validation).
<!-- /SLOT:content -->
