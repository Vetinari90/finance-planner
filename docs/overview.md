---
type: overview
audience: [developer]
language: en
links: [docs/modules/app/README.md, docs/modules/lib/README.md, docs/modules/types/README.md, docs/decisions/0002-credentials-auth-with-jwt-sessions.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Overview

## Summary

finance-planner is a Next.js application that lets an authenticated user manage personal monthly financial plans: creating a plan for a given month/year and currency, adding planned items with monetary amounts, viewing a running total, exporting items to CSV, and deleting plans. This description is derived from the observed application code (page and route handlers in `src/app`). [NEEDS CLARIFICATION] The project's `README.md` reference is the default `create-next-app` boilerplate and does not itself describe finance-planner's business purpose, intended users, or scope.

## Architecture

The application is a single Next.js (App Router) project structured into three source areas: `src/app` (pages and API route handlers), `src/lib` (auth configuration, Prisma client, request-scoped user helper), and `src/types` (NextAuth type augmentation). Persistence is via PostgreSQL, accessed through Prisma Client with the `@prisma/adapter-pg` driver adapter (see [modules/lib/README.md](modules/lib/README.md)). Authentication uses NextAuth's Credentials provider with JWT sessions (see [decisions/0002-credentials-auth-with-jwt-sessions.md](decisions/0002-credentials-auth-with-jwt-sessions.md)).

## Modules

| Module | Responsibility | Documentation |
|---|---|---|
| app | Pages and API route handlers | [modules/app/README.md](modules/app/README.md) |
| lib | Auth configuration, Prisma client, session helper | [modules/lib/README.md](modules/lib/README.md) |
| types | NextAuth `Session` type augmentation | [modules/types/README.md](modules/types/README.md) |

## Key Capabilities

- User registration and credential-based login (`src/app/api/auth/register/route.ts`, `src/app/login`).
- Create, list, and delete monthly financial plans, isolated per user (`src/app/api/plans`).
- Add planned items to a plan, with amounts stored as integer cents (`src/app/api/plans/[planId]/items/route.ts`).
- Client-side CSV export of a plan's items (`src/app/plans/[planId]/ExportCsvButton.tsx`).

[NEEDS CLARIFICATION] No business metrics, user counts, or deployment/hosting details were present in inputs.code or inputs.references.
