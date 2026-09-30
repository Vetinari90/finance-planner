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

## UC-001: Register a new account

**Actor:** New user

**Steps:**
1. User opens `/register` (`src/app/register/page.tsx`).
2. User enters email, optional name, and a password (minimum 8 characters).
3. Client submits `POST /api/auth/register`.
4. Server validates input with `RegisterSchema` (zod), rejects if the email already exists (409), otherwise hashes the password with bcrypt and creates the user.
5. Client automatically calls `signIn("credentials", ...)` with the same email/password.

**Expected Result:** Account is created and the user is authenticated and redirected to `/plans`. On registration failure or auto-login failure, an inline error message is shown (`src/app/register/page.tsx`).

---

## UC-002: Log in with email and password

**Actor:** Registered user

**Steps:**
1. User opens `/login` (`src/app/login/page.tsx` + `LoginClient.tsx`).
2. User enters email and password.
3. Client calls `signIn("credentials", { email, password, redirect: false, callbackUrl })`.
4. NextAuth's `CredentialsProvider` validates the credentials via `authorize()` in `src/lib/auth.ts` (`bcrypt.compare`).

**Expected Result:** On success, the user is redirected to `callbackUrl` (default `/plans`). On failure, `LoginClient.tsx` shows "Invalid email or password".

---

## UC-003: Create a monthly plan

**Actor:** Authenticated user

**Steps:**
1. On `/plans`, the user fills in `NewPlanForm.tsx` (year, month, currency, optional title).
2. Client submits `POST /api/plans`.
3. Server validates via `CreatePlanSchema` and requires an authenticated session (`requireUserId()`).
4. Server creates the plan; a duplicate plan for the same user/year/month returns HTTP 409.

**Expected Result:** The new plan appears in the "Existing plans" list on `/plans` after `router.refresh()`.

---

## UC-004: Add a planned item to a plan

**Actor:** Authenticated user (plan owner)

**Steps:**
1. User opens a plan detail page `/plans/{planId}` (`src/app/plans/[planId]/page.tsx`).
2. User fills in `AddItemForm.tsx` with a title and an amount; the client converts the entered decimal amount into integer cents via `toCents()`.
3. Client submits `POST /api/plans/{planId}/items`.
4. Server verifies the requesting user owns the plan before creating the `PlannedItem`.

**Expected Result:** The item appears in the plan's item list and the displayed total updates after `router.refresh()`.

---

## UC-005: Export plan items as CSV

**Actor:** Authenticated user

**Steps:**
1. On the plan detail page, the user clicks "Export CSV" (`ExportCsvButton.tsx`); the button is disabled when the plan has no items.
2. The client builds an RFC 4180 CSV (Title, Note, Amount columns, plus a Total row) entirely in the browser.
3. The client triggers a file download named after the plan's title (slugified).

**Expected Result:** A CSV file downloads locally. No server request is made; the export is generated client-side from data already rendered on the page.

---

## UC-006: Delete a plan

**Actor:** Authenticated user (plan owner)

**Steps:**
1. User clicks "Delete plan" (`DeletePlanButton.tsx`) on the plan detail page.
2. User confirms via the browser's `confirm()` dialog.
3. Client sends `DELETE /api/plans/{planId}`.
4. Server verifies ownership, then deletes the plan.

**Expected Result:** The plan is removed and the user is redirected back to `/plans`.
