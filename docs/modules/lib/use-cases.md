---
type: use-cases
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Use Cases

## UC-001: Authorize an incoming request

**Actor:** `app` module route handler

**Steps:**
1. Handler calls `requireUserId()` (`src/lib/requireUser.ts`).
2. The function calls `getServerSession(authOptions)`.
3. It returns `session.user.id`, or `null` if there is no session.

**Expected Result:** The route handler receives a user id to scope its database queries, or returns HTTP 401 when the result is `null` (as done in every plan/item route in `src/app/api/plans/**`).

---

## UC-002: Verify user credentials during sign-in

**Actor:** NextAuth `CredentialsProvider` (invoked via `/api/auth/[...nextauth]`)

**Steps:**
1. `authorize()` in `src/lib/auth.ts` receives the submitted `email`/`password`.
2. It looks up the user via `prisma.user.findUnique({ where: { email } })`.
3. It compares the submitted password with the stored hash via `bcrypt.compare`.
4. It returns `{ id, email, name }` on a match, or `null` otherwise.

**Expected Result:** A session/JWT is only issued when the submitted credentials match a stored, bcrypt-hashed password.

---

## UC-003: Obtain a database connection

**Actor:** Any server-side code needing persistence

**Steps:**
1. Import `prisma` from `src/lib/db.ts`.
2. The module constructs (or reuses a `globalThis`-cached) `PrismaClient` configured with the `PrismaPg` adapter and `DATABASE_URL`.

**Expected Result:** A singleton Prisma client is available for queries; outside of production, the client and adapter are cached on `globalThis` to avoid creating new connection pools on every module reload.
