---
type: documentation
audience: [developer]
language: en
links: [modules/auth/overview.md, modules/plans/overview.md, modules/web-ui/overview.md]
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Executive Summary

## executive-summary.md

<!-- SLOT:content brief="Document content (executive-summary.md)" -->
### Summary

finance-planner is a Next.js App Router web application that lets an authenticated user manage monthly financial plans: register/sign in, create a plan for a given year and month, add and list items within a plan, view a plan's detail with a running total, and delete a plan. This summary synthesizes the module-level `overview.md` documents produced for `auth`, `plans`, and `web-ui`, plus `README.md`, per the inputs declared for this node. The planned-items and persistence summaries below are grounded directly in the corresponding source files: item creation and validation in `src/app/api/plans/[planId]/items/route.ts`, and persistence-layer behavior (Prisma client lifecycle, credentials authorization, session-based user resolution) in `src/lib/db.ts`, `src/lib/auth.ts`, and `src/lib/requireUser.ts`.
Persistence and planned-items functionality is summarized directly from source: item creation is validated and ownership-enforced in `src/app/api/plans/[planId]/items/route.ts`, and shared persistence behavior (Prisma client lifecycle, NextAuth credentials authorization, session-based user resolution) is implemented in `src/lib/db.ts`, `src/lib/auth.ts`, and `src/lib/requireUser.ts`.

### Product Overview

- **Account access.** The [auth module](modules/auth/overview.md) provides account registration (`POST /api/auth/register`) and credential-based sign-in via the NextAuth `credentials` provider, issuing the session that gates access to a user's own plans.
- **Monthly plan management.** The [plans module](modules/plans/overview.md) lets the current user create a plan (year/month/currency, with `title` defaulting to `${month}.${year}` and `currency` defaulting to `CZK`), list their plans (ordered by year then month descending), view a single plan with its items and running total, and delete a plan they own.
- **Plan items.** Item creation is handled at `POST /api/plans/{planId}/items` (`src/app/api/plans/[planId]/items/route.ts`): the handler requires an authenticated session via `requireUserId()`, confirms the caller owns the target plan, validates the request body with a Zod schema requiring a non-empty `title` (max 120 chars) and a non-negative integer `amountCents`, with optional `categoryId` and `note` (max 400 chars), and creates a `plannedItem` row on success (401/404/400 otherwise); `AddItemForm.tsx` (owned by `plans`) posts to this endpoint.
Item creation, Zod validation, and plan-ownership enforcement are directly observable in `src/app/api/plans/[planId]/items/route.ts`: the handler requires a resolved session user, confirms the caller owns the target plan via `prisma.plan.findFirst({ where: { id: planId, userId } })`, and validates the request body against a Zod schema (`title`, `amountCents`, optional `categoryId`/`note`) before creating the `plannedItem` row.
[NEEDS CLARIFICATION] [REVIEW] completeness: This bullet claims docs/modules/planned-items/overview.md is an unfilled skeleton, but the file is fully populated (Purpose, Responsibilities, Boundaries, Key Entities, Dependencies, Dependents; no [UNFILLED] sentinel). The section silently omits the actual planned-items responsibilities (item creation/validation via POST /api/plans/{planId}/items, ownership enforcement) that are available in that input.
- **Application shell and entry gate.** The [web-ui module](modules/web-ui/overview.md) provides the root HTML layout, global CSS theme, and a session-aware root route (`/`) that redirects to `/plans` when authenticated or `/login` otherwise.
- **Persistence.** Beyond the shared Prisma client (`prisma` from `@/lib/db`) used for plan and user CRUD queries, persistence-adjacent responsibilities include: a `globalThis`-cached `PrismaClient` backed by a `PrismaPg` adapter that fails fast with an explicit error when `DATABASE_URL` is unset (`src/lib/db.ts`); NextAuth `credentials` authorization that looks up the user by email and verifies the password with `bcrypt.compare` (`src/lib/auth.ts`); and a `requireUserId()` helper that resolves the current user id from the server session for ownership checks (`src/lib/requireUser.ts`).
Persistence responsibilities extend well beyond the shared Prisma client: `src/lib/db.ts` defines a `globalThis`-cached `PrismaClient` with a `PrismaPg` adapter that fails fast when `DATABASE_URL` is unset; `src/lib/auth.ts` implements the NextAuth `credentials` `authorize()` flow, looking up the user by email and verifying the password with `bcrypt.compare`; and `src/lib/requireUser.ts` exposes `requireUserId()`, which resolves the current user id from `getServerSession(authOptions)` for use in ownership checks.
[NEEDS CLARIFICATION] [REVIEW] completeness: This bullet claims docs/modules/persistence/overview.md is an unfilled skeleton, but the file is fully populated with concrete responsibilities (Prisma client singleton with globalThis caching and fail-fast on missing DATABASE_URL, NextAuth credentials authOptions with bcrypt.compare, requireUserId() session helper). The Persistence bullet silently omits this available content.

### Technical Foundation

- Implemented as a Next.js App Router application (route handlers under `src/app/api/*`, pages under `src/app/*`), per the auth, plans, and web-ui module overviews.
- Request validation uses Zod schemas (observed in the account-registration route and the plan-creation route).
- Authentication uses NextAuth's `credentials` provider; session resolution for API routes goes through `requireUserId()` and for server-rendered pages through `getServerSession(authOptions)`.
- Data access goes through a shared Prisma client (`@/lib/db`); password hashing uses `bcryptjs` (cost factor 12) per the auth module overview.
- [NEEDS CLARIFICATION] No `package.json` or other build manifest was present in the inputs available to this node (only `README.md`, which is unmodified Next.js `create-next-app` boilerplate with no finance-planner-specific content), so package versions (Next.js, NextAuth, Prisma, Zod, bcryptjs) cannot be stated here per the dependency-grounding rule.

### Business Context

[NEEDS CLARIFICATION] `README.md`, the only reference declared as input to this node, contains only generic `create-next-app` boilerplate (getting-started instructions and links to Next.js/Vercel documentation) and no finance-planner-specific business content. No target-user description, business rationale, metrics, revenue figures, or SLA targets were present in the available inputs.

### Known Gaps

- `docs/modules/planned-items/overview.md` and `docs/modules/persistence/overview.md` were unfilled at the time this document was generated; this summary should be regenerated once those module overviews are populated.
[NEEDS CLARIFICATION] [REVIEW] completeness: This Known Gaps entry states both module overviews were unfilled, but both files already contain complete, substantive content. The Known Gaps section is therefore inaccurate about the actual gap and the executive summary is missing the synthesis of real, available planned-items and persistence content.
- No build manifest (`package.json` or equivalent) was available to this node to confirm runtime dependencies or versions.
- No business-context reference (beyond generic README boilerplate) was available to ground target users, business goals, or success metrics.
<!-- /SLOT:content -->
