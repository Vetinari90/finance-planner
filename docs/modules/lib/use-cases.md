---
type: use-cases
audience: [developer]
language: en
links:
  - docs/modules/lib/README.md
  - docs/modules/lib/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Use Cases

## UC-001: Credentials Login

**Actor:** Registered user (a person with an existing record in the `user` table, found via `prisma.user.findUnique`).

**Steps:**
1. User submits email and password through the `Credentials` provider configured in `authOptions` (`src/lib/auth.ts`).
2. The `authorize` callback normalizes the email (`toLowerCase().trim()`) and returns `null` immediately if either the email or password is missing.
3. The system looks up the user by email via `prisma.user.findUnique({ where: { email } })`; it returns `null` if no matching user is found.
4. The system compares the submitted password against the stored `user.password` hash using `bcrypt.compare`; it returns `null` on mismatch.
5. On success, `authorize` returns `{ id: user.id, email: user.email, name: user.name ?? undefined }`; the `jwt` callback copies `user.id` into `token.sub`, and the `session` callback copies `token.sub` into `session.user.id`.

**Expected Result:** A JWT-based session is established with `session.user.id` set to the authenticated user's id. Any failure path (missing credentials, unknown email, or password mismatch) causes `authorize` to return `null`, which NextAuth treats as a failed sign-in; `authOptions.pages.signIn` routes unauthenticated users to `/login`.

---

## UC-002: Resolve the Authenticated User's Id

**Actor:** Server-side caller (e.g. an API route or server action) that needs to know whether the current request is authenticated.

**Steps:**
1. Caller invokes `requireUserId()` (`src/lib/requireUser.ts`).
2. `requireUserId` calls `getServerSession(authOptions)` to read the current NextAuth session for the request.
3. It reads `session?.user?.id`.

**Expected Result:** If `session.user.id` is present, `requireUserId` returns that id string. If it is absent, the function returns `null` rather than throwing an error. [NEEDS CLARIFICATION] Despite its name, `requireUserId` does not itself enforce authentication (it does not throw or redirect on a missing session) based on the body of `src/lib/requireUser.ts`; confirm whether enforcement is expected to happen in each caller, since no caller code is present in this module's inputs.
