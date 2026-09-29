---
type: readme
audience: [developer]
language: en
links: [docs/modules/app/technical.md, docs/modules/app/use-cases.md, docs/modules/lib/README.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Module: App (src/app)

## Purpose

The app module is the Next.js App Router application: it renders all user-facing pages (login, register, plan list, plan detail) and exposes the HTTP API routes consumed by those pages and by NextAuth (`src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`, `src/app/logout/route.ts`). It lets an authenticated user create monthly financial plans and add planned items to them.

## Key Entities

| Entity | Description |
|--------|-------------|
| Plan | A monthly financial plan owned by a user, identified by year, month, and currency (`src/app/api/plans/route.ts`, `src/app/plans/[planId]/page.tsx`). |
Note: the Plan's actual unique identifying key is (`userId`, `year`, `month`), enforced by a database uniqueness constraint in `src/app/api/plans/route.ts` (comment: "unikát (userId, year, month)"; a conflicting create returns HTTP 409). `currency` is a stored attribute of the Plan and is not part of what identifies/distinguishes it - two plans for the same user/year/month cannot coexist even with different currencies.
Correction: `src/app/api/plans/route.ts` enforces a unique constraint on (`userId`, `year`, `month`) - see the code comment "unikát (userId, year, month)" - so the Plan's actual identifying combination is (userId, year, month), not year/month/currency; `currency` is merely a stored field on the Plan record.
| PlannedItem | A single planned expense/income line on a Plan, with a title, an integer `amountCents`, an optional category, and an optional note (`src/app/api/plans/[planId]/items/route.ts`). |
| User (session) | The authenticated principal, identified by `session.user.id`, resolved on every protected route via `requireUserId()` (`src/lib/requireUser.ts`, used throughout `src/app/api/...` and `src/app/plans/...`). |
Correction: `requireUserId()` is used throughout the API routes under `src/app/api/...`, but the protected pages `src/app/plans/page.tsx` and `src/app/plans/[planId]/page.tsx` resolve the session directly via `getServerSession(authOptions)` and do not call `requireUserId()`.

## Data Storage

**Database:** PostgreSQL (inferred from the `@prisma/adapter-pg` driver adapter instantiated in `src/lib/db.ts`); no `schema.prisma` file was present in the app module's inputs, and the app module itself contains no direct database configuration of its own.

| Table/Collection | Stores |
|------------------|--------|
| Plan (via Prisma) | Plan records read/written by `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts` (`year`, `month`, `currency`, `title`, `userId`). |
| PlannedItem (via Prisma) | Planned items read/written by `src/app/api/plans/[planId]/items/route.ts` (`title`, `amountCents`, `categoryId`, `note`, `planId`). |
[NEEDS CLARIFICATION] [REVIEW] completeness: The Data Storage table lists only Plan and PlannedItem but omits the User table, even though `src/app/api/auth/register/route.ts` (a listed input) directly reads and writes `prisma.user` records (email, password, name).

## Dependencies

| Module | Purpose |
|--------|---------|
| lib | Provides the Prisma client (`@/lib/db`), the NextAuth configuration (`@/lib/auth`), and the `requireUserId()` session helper (`@/lib/requireUser`) used by every API route and protected page in this module. |
Correction: `requireUserId()` (`@/lib/requireUser`) is used by every API route in this module, but the two protected pages - `src/app/plans/page.tsx` and `src/app/plans/[planId]/page.tsx` - resolve the session directly via `getServerSession(authOptions)` rather than calling `requireUserId()`.
| types | Provides the `next-auth` `Session.user` type augmentation (adds a required `id: string` field) via `src/types/next-auth.d.ts`; as a TypeScript ambient declaration file it is applied automatically by the compiler across `src/app/*` without any explicit import statement. |
