---
type: documentation
audience: [developer]
language: en
links: []
generated_from: e9427eb628c7bd0263034f7b39829026b6935d52
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:be70e56cf13a6a6d46a56c3b9a73343a5445547498bf19feb637d0805163bf7b
---

# Business Context

## business-context.md

<!-- SLOT:content brief="Document content (business-context.md)" -->
### Purpose

finance-planner is a personal monthly financial-planning web application. Per [`docs/modules/auth/overview.md`](../modules/auth/overview.md) and [`docs/modules/plans/overview.md`](../modules/plans/overview.md), the product lets an individual register an account, sign in, and then create, list, view, and delete monthly financial plans scoped to that account.

`README.md`, the only reference document available for this synthesis, is generic `create-next-app` boilerplate (framework getting-started instructions, links to Next.js documentation, and Vercel deployment pointers). It contains no finance-planner-specific business narrative, target market, pricing, or company information.

[NEEDS CLARIFICATION] No reference document establishes the business rationale for the product (target market, monetization model, competitive context, or the organization operating it).

### Business Capabilities

The two module overviews with content available at the time of this synthesis describe the following capabilities:

- **Account registration and sign-in** (`auth` module): `POST /api/auth/register` creates a new account (Zod-validated input, `bcryptjs`-hashed password); the NextAuth `credentials` provider (`signIn("credentials", ...)`) authenticates a returning user. See [`docs/modules/auth/overview.md`](../modules/auth/overview.md).
- **Monthly plan management** (`plans` module): `POST /api/plans` creates a plan for a given year/month, defaulting `title` to `${month}.${year}` and `currency` to `CZK` when not supplied; `GET /api/plans` lists a user's plans ordered by year/month descending; `GET /api/plans/{planId}` returns a single plan with its items; `DELETE /api/plans/{planId}` deletes a plan after verifying ownership. See [`docs/modules/plans/overview.md`](../modules/plans/overview.md).
- Per the `plans` module overview's Dependents section, individual plan items are created and read in the context of a `planId` owned by the `plans` module, via a separate endpoint (`/api/plans/{planId}/items`) posted to from `AddItemForm.tsx`. This indicates a monthly plan is further broken down into line items, but the business meaning of an "item" (category, amount semantics, running-total calculation) is owned by the planned-items module.

[NEEDS CLARIFICATION] `docs/modules/planned-items/overview.md`, `docs/modules/persistence/overview.md`, and `docs/modules/web-ui/overview.md` — three of the five module-docs named as inputs for this synthesis — were still unfilled skeleton documents (`[UNFILLED]` sentinel) at the time this file was generated. Business context that would come from those modules (the detailed shape and business rules of a "planned item", the persistence/hosting model, and the end-user presentation/UX) could not be incorporated here.

### Business Rules Observed

- A plan and its items are only visible to and modifiable by the account that owns them: the `plans` module resolves the current user via `requireUserId()` (API routes) or `getServerSession(authOptions)` (server-rendered pages), both owned by the `auth` module, and `DELETE /api/plans/{planId}` verifies ownership before deleting.
- New plans default to a currency of `CZK` when the requester does not supply one, per the `plans` module's Zod validation defaults.

[NEEDS CLARIFICATION] Whether the `CZK` default currency reflects an intended target market (e.g., Czech users) or is simply an arbitrary implementation default is not established by any input; no reference document addresses target market or localization intent.

### Stakeholders / Users

The available inputs describe a single user role: an individual who registers their own account and manages their own monthly plans. No input names distinct stakeholder roles (e.g., administrators, support staff, or organizational customers).

[NEEDS CLARIFICATION] No reference document identifies the business owner, sponsoring organization, or intended user base size for finance-planner.
<!-- /SLOT:content -->
