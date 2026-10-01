---
type: overview
audience: [developer]
language: en
links:
  - docs/modules/app/README.md
  - docs/modules/app/technical.md
  - docs/modules/app/use-cases.md
  - docs/modules/lib/README.md
  - docs/modules/lib/technical.md
  - docs/modules/types/README.md
generated_from: 3c4d318aadaba596a8df2151c7cdc717b8515f22
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20261001-2017
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Project Overview

## Summary

Finance Planner is a Next.js App Router application for personal monthly budget
tracking. An authenticated individual creates monthly plans (identified by
year, month, and currency) and records planned items (title, amount in cents,
optional category/note) inside each plan (`docs/modules/app/README.md`,
`docs/modules/app/use-cases.md`).

## Purpose

The `app` module owns the page UI (registration, login, plan list, plan
detail) and the API route handlers that implement authentication,
monthly-plan creation, planned-item management, and client-side CSV export;
it delegates the database client, NextAuth configuration, and the
session-helper to the `lib` module (`docs/modules/app/README.md`). Each user's
plans and items are scoped to that user via a session-derived `userId` check
on every plan/item route (`docs/modules/app/technical.md`,
`docs/modules/app/use-cases.md`, UC-004 through UC-009). No cross-user
sharing, invitation, or collaboration feature is documented in the `app`
module's use cases.

A new monthly plan's currency defaults to `CZK`, with `EUR` and `USD` also
selectable in the plan-creation form (`docs/modules/app/use-cases.md`,
UC-005). [NEEDS CLARIFICATION] No input establishes the target user base or
market beyond this currency default; a firmer statement about intended users
would require product/business reference material, which was not present in
`inputs.references` for this node (only the generic project `README.md` was
supplied, and it contains no product-purpose content — see "Local
Development" below).

## Modules

| Module | Role |
|--------|------|
| `app` (`src/app`) | Pages and API route handlers: registration, login/logout, home redirect, plan list, plan detail, planned-item creation, client-side CSV export (`docs/modules/app/README.md`, `docs/modules/app/technical.md`). |
| `lib` (`src/lib`) | Shared infrastructure: NextAuth credentials configuration, a PostgreSQL-backed Prisma client, and a `requireUserId()` session helper (`docs/modules/lib/README.md`, `docs/modules/lib/technical.md`). |
| `types` (`src/types`) | TypeScript ambient type augmentation only — extends the `next-auth` `Session` interface so `session.user.id` is typed as `string` (`docs/modules/types/README.md`). Contributes no runtime behavior. |

## Key User Flows

The following flows are grounded in `docs/modules/app/use-cases.md` (UC-001
through UC-010):

1. **Register** (`/register`) — create an account, then auto-login via
   `signIn("credentials", ...)` and redirect to `/plans` (UC-001).
2. **Log in** (`/login`) — authenticate with credentials and redirect to the
   `callbackUrl` (default `/plans`) (UC-002).
3. **Home routing by session state** (`/`) — redirects to `/plans` if a
   session exists, otherwise to `/login` (UC-003).
4. **View the list of monthly plans** (`/plans`) — lists the user's own
   plans with per-plan item counts and computed totals (UC-004).
5. **Create a new monthly plan** — via the "Create new plan" form on
   `/plans`; returns `409` if a plan already exists for that user/year/month
   (UC-005).
6. **View a plan's detail and running total** (`/plans/{planId}`) — shows
   title, month/year, currency, computed total, and item list (UC-006).
7. **Add a planned item** to a plan, with client-side amount parsing to
   integer cents (UC-007).
8. **Export a plan's items as CSV** — built entirely client-side, no server
   round-trip (UC-008).
9. **Delete a plan** — confirmation dialog, then `DELETE` to
   `/api/plans/{planId}` (UC-009).
10. **Log out** — via the "Logout" link or a `/logout` server redirect, both
    resolving to NextAuth's built-in sign-out flow (UC-010).

## Key Entities

| Entity | Description |
|--------|-------------|
| User | Accessed via `prisma.user`. Fields observed across modules: `email`, `password` (bcrypt hash), `name` (optional), `id` (`docs/modules/app/README.md`, `docs/modules/lib/README.md`). |
| Plan | Accessed via `prisma.plan`. Fields: `id`, `userId`, `year`, `month`, `currency`, `title`, and an `items` relation (`docs/modules/app/README.md`). |
| PlannedItem | Accessed via `prisma.plannedItem`. Fields: `id`, `planId`, `title`, `amountCents`, `categoryId` (optional), `note` (optional), `createdAt` (`docs/modules/app/README.md`). |
| Session (augmented) | The `next-auth` `Session` interface, overridden in `src/types/next-auth.d.ts` so `session.user` includes `id: string` (`docs/modules/types/README.md`). |

[NEEDS CLARIFICATION] No Prisma schema file (`schema.prisma`) was present in
any node's inputs, so authoritative column types, nullability, indexes, and
relation/cascade behavior for `User`, `Plan`, and `PlannedItem` cannot be
confirmed here (both `docs/modules/app/README.md` and
`docs/modules/lib/README.md` flag the same gap).

## Data Storage

PostgreSQL, accessed through the `@prisma/adapter-pg` driver adapter and a
generated Prisma Client imported from `@/generated/prisma/client`
(`docs/modules/lib/technical.md`). The connection string is read from the
`DATABASE_URL` environment variable; `src/lib/db.ts` throws at module-load
time if it is unset (`docs/modules/lib/technical.md`).

[NEEDS CLARIFICATION] No `schema.prisma` or migration files were present in
this node's inputs, so the complete set of tables/models managed by the
application cannot be enumerated beyond the `user`, `plan`, and
`plannedItem` models referenced directly in `app` and `lib` module code
(`docs/modules/lib/README.md`, `docs/modules/app/README.md`).

## Dependencies

The following third-party packages are referenced via `import` statements in
the `app` and `lib` modules (`docs/modules/app/README.md`,
`docs/modules/lib/README.md`):

| Package | Used for |
|---------|----------|
| `next-auth` / `next-auth/react` | Credentials-based authentication: `signIn`, `getServerSession`, `NextAuthOptions`, `CredentialsProvider` (`app`, `lib`). |
| `zod` | Request-body validation schemas (`RegisterSchema`, `CreatePlanSchema`, `CreateItemSchema`) in `app` route handlers. |
| `bcryptjs` | Password hashing (registration) and verification (credentials `authorize`) in `app` and `lib`. |
| `@prisma/adapter-pg` | PostgreSQL driver adapter wiring the generated Prisma Client (`lib`). |
| `@/generated/prisma/client` | Generated Prisma Client type/class (`lib`). |

[NEEDS CLARIFICATION] No `package.json` or lockfile was present in any
node's inputs, so exact installed version numbers for the packages above
cannot be confirmed (both `docs/modules/app/README.md` and
`docs/modules/lib/README.md` flag the same gap). Per the dependency-grounding
rule, no build-manifest-backed call graph between `app`, `lib`, and `types`
beyond these import-level observations can be asserted here.

## Local Development

The project root `README.md` is the unmodified scaffold generated by
`create-next-app` and contains only generic Next.js tooling instructions, not
project-specific facts: it documents starting a development server with
`npm run dev` / `yarn dev` / `pnpm dev` / `bun dev` and viewing the result at
`http://localhost:3000` (`README.md`). It also references the generic Vercel
deployment path used by the `create-next-app` template.

[NEEDS CLARIFICATION] Whether this project is actually deployed to Vercel (or
any other platform), and any project-specific environment/CI configuration,
is not established by this generic scaffold README or by any other input
available to this node; a deployment-specific reference document would be
needed to confirm.

[NEEDS CLARIFICATION] No test files, test scripts, or `package.json` were
present in the `app` or `lib` module inputs, so no project-wide test command
or coverage figure can be stated here (`docs/modules/app/technical.md`,
`docs/modules/lib/technical.md`).
