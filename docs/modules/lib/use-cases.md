---
type: use-cases
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/app/use-cases.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Use Cases

## UC-001: Authorize Credentials Login

**Actor:** NextAuth (Credentials Provider)

**Steps:**
1. NextAuth invokes `authorize({ email, password })` in `src/lib/auth.ts`.
2. The function lowercases/trims the email and looks up the user via `prisma.user.findUnique({ where: { email } })`.
3. If a user is found, `bcrypt.compare(password, user.password)` verifies the password.
4. If either step fails, `authorize()` returns `null`.

**Expected Result:** Returns `{ id, email, name }` on success, or `null` on any failure, which NextAuth surfaces to the client as a login error (see `docs/modules/app/use-cases.md`, UC-002).

---

## UC-002: Establish JWT Session

**Actor:** NextAuth (JWT session strategy)

**Steps:**
1. On successful `authorize()`, the `jwt` callback sets `token.sub = user.id` (`src/lib/auth.ts`).
2. On each request, the `session` callback copies `token.sub` into `session.user.id`.

**Expected Result:** `session.user.id` is available to every server component and API route without a server-side session store, since `session: { strategy: "jwt" }` is configured.

---

## UC-003: Resolve Current User Id for a Protected Route

**Actor:** App module API route or server page

**Steps:**
1. Caller invokes `requireUserId()` (`src/lib/requireUser.ts`).
2. The function calls `getServerSession(authOptions)` and reads `session?.user?.id`.
3. If no id is present, it returns `null`.

**Expected Result:** Callers (e.g. `src/app/api/plans/route.ts`) receive either the authenticated user's id or `null`, and respond with 401 Unauthorized when `null` is returned.
