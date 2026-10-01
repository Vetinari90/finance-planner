---
type: readme
audience: [developer]
language: en
links:
  - docs/modules/app/technical.md
  - docs/modules/app/use-cases.md
  - docs/modules/lib/README.md
  - docs/modules/lib/technical.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Module: app

## Purpose

The `app` module is the Next.js App Router layer of finance-planner. It owns the
page UI (login, register, plan list, plan detail) and the route handlers
(`src/app/api/**/route.ts`, `src/app/logout/route.ts`) that implement
authentication, monthly-plan creation, planned-item management, and client-side
CSV export of a plan's items. The module itself holds no business logic beyond
request validation and HTTP status handling — it delegates authentication
config, the database client, and the session-helper to the `lib` module
(imports of `@/lib/auth`, `@/lib/db`, `@/lib/requireUser` are present throughout
`src/app/api/**/route.ts`, `src/app/page.tsx`, `src/app/plans/page.tsx`, and
`src/app/plans/[planId]/page.tsx`).

## Key Entities

The `app` module does not define these entities (no Prisma schema file was
present in this module's inputs); it consumes them through the `prisma` client
re-exported by `@/lib/db`. The field names below are the ones directly read or
written by `app` module code.

| Entity | Description |
|--------|-------------|
| User | Accessed via `prisma.user`. Fields observed in `src/app/api/auth/register/route.ts`: `email`, `password` (bcrypt hash), `name` (optional). Session shape `session.user.id` / `session.user.email` is read in `src/app/plans/page.tsx` and `src/app/plans/[planId]/page.tsx`. |
| Plan | Accessed via `prisma.plan`. Fields observed in `src/app/api/plans/route.ts` and `src/app/api/plans/[planId]/route.ts`: `id`, `userId`, `year`, `month`, `currency`, `title`, and an `items` relation. |
| PlannedItem | Accessed via `prisma.plannedItem`. Fields observed in `src/app/api/plans/[planId]/items/route.ts` and rendered in `src/app/plans/[planId]/page.tsx`: `id`, `planId`, `title`, `amountCents`, `categoryId` (optional), `note` (optional), `createdAt`. |

[NEEDS CLARIFICATION] Exact column types, nullability, and any `@@map`/`@@unique` directives are defined by the Prisma schema, which was not part of this module's inputs. See the lib module's own documentation for the authoritative schema.

## Data Storage

**Database:** [NEEDS CLARIFICATION] The app module accesses storage exclusively through the `prisma` client imported from `@/lib/db` (see `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, `src/app/api/plans/[planId]/items/route.ts`, `src/app/api/auth/register/route.ts`). The underlying database engine, connection configuration, and schema file were not present in this module's inputs.

| Table/Collection | Stores |
|------------------|--------|
| User (via `prisma.user`) | Account records used for registration (`src/app/api/auth/register/route.ts`) and session identity. |
| Plan (via `prisma.plan`) | One record per user/year/month monthly plan, created in `src/app/api/plans/route.ts` (`POST`), listed in the same file (`GET`), read/deleted in `src/app/api/plans/[planId]/route.ts`. |
| PlannedItem (via `prisma.plannedItem`) | Line items belonging to a plan, created in `src/app/api/plans/[planId]/items/route.ts` and displayed/exported in `src/app/plans/[planId]/page.tsx` and `src/app/plans/[planId]/ExportCsvButton.tsx`. |

## Dependencies

| Module | Purpose |
|--------|---------|
| lib | Supplies the Prisma client (`@/lib/db`, used across every `app` route handler), the NextAuth configuration object `authOptions` (`@/lib/auth`, used in `src/app/api/auth/[...nextauth]/route.ts`, `src/app/page.tsx`, `src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx`), and the `requireUserId` session helper (`@/lib/requireUser`, used in every `src/app/api/plans/**/route.ts` handler). |

The module also imports the following third-party packages directly (observed
via `import` statements in the files listed; no `package.json` was part of this
module's inputs, so exact installed versions cannot be confirmed from here):

- `next-auth` / `next-auth/react` — `signIn`, `getServerSession` (`src/app/api/auth/[...nextauth]/route.ts`, `src/app/login/LoginClient.tsx`, `src/app/register/page.tsx`, `src/app/page.tsx`, `src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx`).
- `zod` — request body validation (`RegisterSchema` in `src/app/api/auth/register/route.ts`, `CreatePlanSchema` in `src/app/api/plans/route.ts`, `CreateItemSchema` in `src/app/api/plans/[planId]/items/route.ts`).
- `bcryptjs` — password hashing in `src/app/api/auth/register/route.ts`.

[NEEDS CLARIFICATION] No `package.json` or lockfile was included in this module's inputs, so dependency version numbers cannot be grounded and are omitted.
