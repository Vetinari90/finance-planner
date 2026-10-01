---
type: use-cases
audience: [developer]
language: en
links:
  - docs/modules/app/README.md
  - docs/modules/app/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Use Cases

Each use case below is grounded in a specific page/component and, where
applicable, the route handler it calls. File paths are given for traceability.

## UC-001: Register a new account

**Actor:** Unauthenticated visitor

**Steps:**
1. Visitor opens `/register` (`src/app/register/page.tsx`).
2. Visitor enters email, optional name, and password (min 8 characters, enforced client-side via `minLength={8}` and server-side via `RegisterSchema`).
3. Visitor submits the form, which `POST`s to `/api/auth/register` (`src/app/api/auth/register/route.ts`).
4. On success, the page immediately calls `signIn("credentials", ...)` to auto-login, then routes to `/plans`.

**Expected Result:** A new `User` row is created with a bcrypt-hashed password; on successful auto-login the visitor lands on `/plans`. If registration fails, the page shows the server's `error` message; if the auto-login step fails, the page shows "Registered, but login failed. Try logging in." and routes to `/login` instead (`src/app/register/page.tsx`).

---

## UC-002: Log in with credentials

**Actor:** Registered user

**Steps:**
1. User opens `/login` (`src/app/login/page.tsx`, rendered inside a `Suspense` boundary wrapping `src/app/login/LoginClient.tsx`).
2. User enters email and password.
3. User submits the form, which calls `signIn("credentials", { email, password, redirect: false, callbackUrl })` (`src/app/login/LoginClient.tsx`).
4. On success the client routes to `callbackUrl` (read from the `callbackUrl` query parameter, defaulting to `/plans`).

**Expected Result:** On success, the user is redirected to `callbackUrl` (default `/plans`). On failure, the message "Invalid email or password" is shown and the user stays on `/login` (`src/app/login/LoginClient.tsx`).

---

## UC-003: Land on the home route based on session state

**Actor:** Any visitor

**Steps:**
1. Visitor opens `/` (`src/app/page.tsx`).
2. The server component calls `getServerSession(authOptions)`.
3. The component redirects to `/plans` if a session exists, otherwise to `/login`.

**Expected Result:** Authenticated visitors are sent to `/plans`; unauthenticated visitors are sent to `/login` (`src/app/page.tsx`).

---

## UC-004: View the list of monthly plans

**Actor:** Authenticated user

**Steps:**
1. User opens `/plans` (`src/app/plans/page.tsx`).
2. The server component verifies the session (redirects to `/login` if absent) and queries `prisma.plan.findMany` scoped to the current `userId`, ordered by `year` desc then `month` desc, including `items`.
3. Each listed plan shows its title, `month.year`, currency, item count, and the sum of `amountCents` for its items (computed in the page, divided by 100 and formatted to two decimals).

**Expected Result:** The user sees all of their own plans with computed per-plan totals, plus a "No plans yet. Create one above." message when the list is empty (`src/app/plans/page.tsx`).

---

## UC-005: Create a new monthly plan

**Actor:** Authenticated user

**Steps:**
1. On `/plans`, the user fills in the "Create new plan" form (`src/app/plans/NewPlanForm.tsx`): optional title, year, month, and currency (select of `CZK`/`EUR`/`USD`, defaulting to `CZK`).
2. The form `POST`s to `/api/plans` (`src/app/api/plans/route.ts`).
3. On success, the form clears its title field and calls `router.refresh()` so the server component re-fetches the plan list.

**Expected Result:** A new `Plan` is created for the user's `(year, month)`. If a plan for that user/year/month already exists, the API returns `409` and the form shows "Plan for this month already exists" (`src/app/plans/NewPlanForm.tsx`, `src/app/api/plans/route.ts`).

---

## UC-006: View a single plan's detail and running total

**Actor:** Authenticated user

**Steps:**
1. User opens `/plans/{planId}` (`src/app/plans/[planId]/page.tsx`).
2. The server component verifies the session (redirects to `/login` if absent), then queries `prisma.plan.findFirst` scoped to `userId`, including `items` ordered by `createdAt` asc; calls Next.js `notFound()` if the plan does not exist or is not owned by the user.
3. The page computes and displays the total of all items' `amountCents` (divided by 100, formatted to two decimals) alongside the item count.

**Expected Result:** The authenticated owner sees the plan's title, month/year, currency, computed total, and its list of items (or "No items yet." when empty) (`src/app/plans/[planId]/page.tsx`).

---

## UC-007: Add a planned item to a plan

**Actor:** Authenticated user (plan owner)

**Steps:**
1. On a plan's detail page, the user fills in the "Add item" form (`src/app/plans/[planId]/AddItemForm.tsx`): title, amount (free-text, e.g. `1200` or `1200.50`, accepting `,` as a decimal separator), and an optional note.
2. The client converts the amount text to integer cents via its own `toCents()` parser (matches `^(\d+)(\.(\d{1,2}))?$` after normalizing `,` to `.`); if parsing fails, the form shows "Amount must be a number with max 2 decimals (e.g. 1200 or 1200.50)" without calling the API.
3. On successful parse, the form `POST`s `{ title, amountCents, note, categoryId: null }` to `/api/plans/{planId}/items` (`src/app/api/plans/[planId]/items/route.ts`).
4. On success, the form clears its fields and calls `router.refresh()`.

**Expected Result:** A new `PlannedItem` is created under the plan (after the API re-verifies plan ownership), and the refreshed plan detail page shows it in the items list and in the running total. Server-side validation errors or ownership failures surface via the API's `400`/`404` responses and are shown in the form.

---

## UC-008: Export a plan's items as CSV

**Actor:** Authenticated user (plan owner)

**Steps:**
1. On the plan detail page, the user clicks "Export CSV" (`src/app/plans/[planId]/ExportCsvButton.tsx`). The button is disabled when the plan has zero items.
2. The client builds a CSV in-browser (`buildCsv`): header row `Title, Note, Amount (<currency>)`, one row per item (values quoted per RFC 4180, amounts divided by 100 and fixed to two decimals), plus a trailing `Total` row summing all `amountCents`. A UTF-8 BOM is prefixed so non-ASCII titles render correctly in Excel.
3. The client creates a `Blob`, generates an object URL, and triggers a browser download named from a slugified plan title (e.g. `fileNameFor` lower-cases, replaces non-alphanumerics with `-`, trims leading/trailing `-`, defaulting to `plan` if the slug is empty).

**Expected Result:** A `.csv` file download is triggered client-side with no server round-trip; the button briefly shows "Exported ✓" for 2 seconds after the click (`src/app/plans/[planId]/ExportCsvButton.tsx`).

---

## UC-009: Delete a plan

**Actor:** Authenticated user (plan owner)

**Steps:**
1. On the plan detail page, the user clicks "Delete plan" (`src/app/plans/[planId]/DeletePlanButton.tsx`).
2. The browser's native `confirm("Delete this plan? This cannot be undone.")` dialog must be accepted to proceed.
3. The client sends `DELETE` to `/api/plans/{planId}` (`src/app/api/plans/[planId]/route.ts`).
4. On success, the client routes to `/plans` and calls `router.refresh()`. On failure, it shows a native `alert("Delete failed")`.

**Expected Result:** The plan is removed via `prisma.plan.delete`, and the user returns to the `/plans` list.
[NEEDS CLARIFICATION] Whether the plan's `PlannedItem` rows are cascade-deleted or must be removed separately is defined by the Prisma schema's relation configuration, which was not part of this module's inputs.

---

## UC-010: Log out

**Actor:** Authenticated user

**Steps:**
1. From `/plans`, the user clicks the "Logout" link, which points to `/api/auth/signout?callbackUrl=/login` (`src/app/plans/page.tsx`).
2. Alternatively, a request to `/logout` (`src/app/logout/route.ts`) issues a server-side redirect to the same `/api/auth/signout?callbackUrl=/login` URL (built against a hard-coded `http://localhost:3000` base).

**Expected Result:** The user's session is ended via NextAuth's built-in sign-out flow and they are returned to `/login`.
