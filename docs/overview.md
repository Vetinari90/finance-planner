---
type: overview
audience: [developer]
language: en
links: [docs/modules/app/README.md, docs/modules/lib/README.md, docs/modules/types/README.md, docs/decisions/0002-credentials-auth-with-jwt-sessions.md, docs/decisions/0003-store-money-as-integer-cents.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Project Overview

## Summary

Finance Planner is a Next.js (App Router) web application that lets an authenticated user create monthly financial plans (identified by year, month, and currency) and add planned items (title, amount, optional note/category) to each plan (`src/app/plans/*`, `src/app/api/plans/*`; see `docs/modules/app/README.md`).

## Purpose

Finance Planner is a single-tenant personal budgeting tool: each authenticated individual manages only their own data. A user registers with an email and password (`src/app/register/page.tsx`) or logs in, then creates monthly plans identified by year, month, and currency, scoped strictly to that user (`src/app/api/plans/route.ts`, `src/lib/requireUser.ts`). Within a plan, the user records planned items (title, amount in cents, optional category and note) via `src/app/api/plans/[planId]/items/route.ts`, and views a running total per plan on `src/app/plans/[planId]/page.tsx`. There is no cross-user sharing, invitation, or collaboration logic anywhere in the code; the plan currency defaults to CZK (`src/app/api/plans/route.ts`), indicating the target users are individuals tracking their own monthly budget, primarily in Czech koruna.

## Modules

| Module | Role |
|--------|------|
| app (`src/app`) | Pages and API routes: registration, login/logout, plan list, plan detail, item creation (see `docs/modules/app/README.md`). |
| lib (`src/lib`) | Shared infrastructure: NextAuth configuration, Prisma client, `requireUserId()` helper (see `docs/modules/lib/README.md`). |
| types (`src/types`) | TypeScript ambient type augmentation for the NextAuth `Session` type (see `docs/modules/types/README.md`). |

## Key User Flows
[NEEDS CLARIFICATION] [REVIEW] completeness: The Key User Flows section enumerates only 5 flows (register, login, create plan, add item, delete plan) and silently omits the Logout flow (UC-006), even though the source use-cases.md documents it and the doc's own Modules table already credits the app module with 'login/logout'.

1. Register (`/register`) then auto-login then redirect to `/plans` (see `docs/modules/app/use-cases.md`, UC-001).
2. Login (`/login`) then redirect to `/plans` (see `docs/modules/app/use-cases.md`, UC-002).
3. Create a monthly plan on `/plans` (see `docs/modules/app/use-cases.md`, UC-003).
4. Open a plan and add planned items on `/plans/{planId}` (see `docs/modules/app/use-cases.md`, UC-004).
5. Delete a plan (see `docs/modules/app/use-cases.md`, UC-005).

## Data Storage

PostgreSQL via Prisma with a `PrismaPg` driver adapter, configured from `DATABASE_URL` (see `docs/modules/lib/technical.md`). [NEEDS CLARIFICATION] No `schema.prisma` was present in inputs.code; the full data model (constraints, indexes, migrations) could not be confirmed (see `docs/data-model.md`).
