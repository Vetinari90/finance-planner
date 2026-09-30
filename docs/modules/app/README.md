---
type: readme
audience: [developer]
language: en
links: [docs/modules/lib/README.md, docs/modules/types/README.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Module: app

## Purpose

The `app` module (`src/app`) is the Next.js App Router layer of finance-planner. It provides the entire HTTP-facing surface of the system: page components (registration, login, plan list, plan detail) and API route handlers (authentication, plan CRUD, item creation) that together let an authenticated user manage monthly financial plans and their line items.

## Key Entities

The `app` module does not define its own persistence entities; it reads and writes entities owned by the `lib` module's Prisma client. Based on the fields referenced in `app`'s route handlers:

| Entity | Description |
|--------|-------------|
| User | Referenced by `email`/`password`/`name` in `src/app/api/auth/register/route.ts`. |
| Plan | Referenced by `id`, `userId`, `year`, `month`, `currency`, `title` in `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts`. |
| PlannedItem | Referenced by `id`, `planId`, `title`, `amountCents`, `categoryId`, `note` in `src/app/api/plans/[planId]/items/route.ts`. |

[NEEDS CLARIFICATION] No `schema.prisma` file is present in inputs.code, so the canonical entity definitions (types, constraints, relations) could not be confirmed beyond what is used in TypeScript query calls.

## Data Storage

**Database:** PostgreSQL (inferred from `src/lib/db.ts`'s use of `@prisma/adapter-pg` and `DATABASE_URL`; the `app` module itself contains no direct database configuration).

| Table/Collection | Stores |
|------------------|--------|
| user | Accessed via `prisma.user.findUnique` / `prisma.user.create` in `src/app/api/auth/register/route.ts`. |
| plan | Accessed via `prisma.plan.findMany` / `findFirst` / `create` / `delete` in `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts`. |
| plannedItem | Accessed via `prisma.plannedItem.create` in `src/app/api/plans/[planId]/items/route.ts`. |

## Dependencies

| Module | Purpose |
|--------|---------|
| lib | Supplies the Prisma client (`src/lib/db.ts`), NextAuth `authOptions` (`src/lib/auth.ts`), and the `requireUserId()` authorization helper (`src/lib/requireUser.ts`) used by every plan/item route. |
| types | The `Session.user.id` field read throughout `app` (e.g. `src/app/plans/page.tsx`) is only valid TypeScript because of the augmentation declared in `src/types/next-auth.d.ts`. |

[NEEDS CLARIFICATION] No `package.json` is present in inputs.code, so external package dependencies (`next-auth`, `zod`, `bcryptjs`, etc. imported directly in this module's files) cannot be confirmed against a build manifest.
