---
type: use-cases
audience: [developer]
language: en
links: [docs/modules/app/README.md, docs/modules/lib/use-cases.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Use Cases

## UC-001: User Registration

**Actor:** Visitor (unauthenticated)

**Steps:**
1. Visitor opens `/register` (`src/app/register/page.tsx`) and enters email, optional name, and password.
2. Client submits `POST /api/auth/register` with the form data.
3. The API validates the body against `RegisterSchema` (email format, password min 8 characters, name max 80 characters), returning 400 on failure.
4. The API checks for an existing user with that email, returning 409 if one exists.
5. The API hashes the password with bcrypt and creates the user, returning 201 with the new user record.
6. The client then calls `signIn("credentials", ...)` to log the new user in automatically and redirects to `/plans`.

**Expected Result:** A new user account exists and the visitor is signed in and redirected to `/plans` (`src/app/register/page.tsx`).

---

## UC-002: User Login

**Actor:** Registered User

**Steps:**
1. User opens `/login` (`src/app/login/page.tsx` + `LoginClient.tsx`) and enters email and password.
2. Client calls `signIn("credentials", { email, password, redirect: false, callbackUrl })`.
3. NextAuth's `authorize()` callback (`src/lib/auth.ts`) verifies the credentials against the stored bcrypt hash.
4. On success, the client redirects to the `callbackUrl` (default `/plans`); on failure, an "Invalid email or password" message is shown (`src/app/login/LoginClient.tsx`).

**Expected Result:** User is redirected to `/plans` on success, or sees an inline error message on failure.

---

## UC-003: Create a Monthly Plan

**Actor:** Authenticated User

**Steps:**
1. User opens `/plans` (`src/app/plans/page.tsx`), which lists their existing plans.
2. User fills in year, month, currency, and optional title in `NewPlanForm` and submits.
3. Client calls `POST /api/plans`; the API validates the body and creates the plan for `userId` from the session.
4. If a plan already exists for that user/year/month, the API returns 409 "Plan for this month already exists" (`src/app/api/plans/route.ts`).

**Expected Result:** A new plan appears in the user's plan list, or an inline error is shown on conflict/validation failure (`src/app/plans/NewPlanForm.tsx`).

---

## UC-004: View Plan Detail and Add a Planned Item

**Actor:** Authenticated User

**Steps:**
1. User opens `/plans/{planId}` from the plan list (`src/app/plans/[planId]/page.tsx`); the server loads the plan and its items, scoped to the authenticated `userId`.
2. User enters a title and an amount (e.g. `1200.50`) in `AddItemForm`; the client converts the decimal string to integer cents via `toCents()` before submitting (`src/app/plans/[planId]/AddItemForm.tsx`).
3. Client calls `POST /api/plans/{planId}/items`; the API re-verifies plan ownership, validates the body with `CreateItemSchema`, and creates the item.
4. The page refreshes and shows the updated item list and running total (`totalCents` summed and divided by 100).

**Expected Result:** The new item appears in the plan's item list and the displayed total updates accordingly.

---

## UC-005: Delete a Plan

**Actor:** Authenticated User

**Steps:**
1. On `/plans/{planId}`, the user clicks "Delete plan" (`DeletePlanButton.tsx`), confirming via a browser `confirm()` dialog.
2. Client calls `DELETE /api/plans/{planId}`.
3. The API re-verifies plan ownership before deleting the plan (`src/app/api/plans/[planId]/route.ts`).
4. On success, the client navigates back to `/plans`.

**Expected Result:** The plan is removed and the user is returned to the plan list.

---

## UC-006: Logout

**Actor:** Authenticated User

**Steps:**
1. User clicks "Logout" on `/plans` (`src/app/plans/page.tsx`), which links to `/api/auth/signout?callbackUrl=/login`, or the app's `/logout` route redirects to the same NextAuth sign-out URL (`src/app/logout/route.ts`).
2. NextAuth clears the session.

**Expected Result:** User's session is cleared and they are redirected to `/login`.
