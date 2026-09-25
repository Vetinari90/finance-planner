---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Overview

## overview.md

<!-- SLOT:content brief="Document content (overview.md)" -->
# Module: web-ui

## Purpose

The web-ui module provides the Next.js App Router root shell for the finance-planner application: the global HTML layout, global CSS theme, and the root route (`/`). The root route performs a server-side session check and redirects the browser to either `/plans` (authenticated) or `/login` (unauthenticated), so it acts as the entry gate into the rest of the application.

## Responsibilities

- Root HTML layout (`src/app/layout.tsx`): defines the `<html>`/`<body>` shell, loads the `Geist` and `Geist_Mono` fonts via `next/font/google`, sets page `Metadata`, and imports `globals.css`.
- Global CSS reset and CSS custom-property theme (`src/app/globals.css`), including a dark-mode variant selected via the `prefers-color-scheme` media query.
- Root route session-aware redirect (`src/app/page.tsx`): an `async` Server Component that calls `getServerSession(authOptions)` and calls `redirect(session ? "/plans" : "/login")`.

## Boundaries

**This module does NOT:**

- Implement the `/login`, `/register`, or `/logout` pages themselves. Per `doc_struc.md` `generation.module-source-map`, `src/app/login`, `src/app/register`, and `src/app/logout` are owned by the auth module.
- Implement the `/plans` pages or plan-related UI. `src/app/plans` is owned by the plans module.
- Implement any API route handlers. `src/app/api/*` is split across the auth, plans, and planned-items modules per the module-source-map.
- No additional shared UI components, layout primitives, or client-side state exist under `src/app` outside `layout.tsx`/`page.tsx`. The rest of the `src/app` tree is fully accounted for by the auth, plans, and API-route modules already listed above: `src/app/login/LoginClient.tsx`, `src/app/login/page.tsx`, `src/app/logout/route.ts`, `src/app/register/page.tsx` (auth); `src/app/plans/page.tsx`, `src/app/plans/NewPlanForm.tsx`, `src/app/plans/[planId]/page.tsx`, `src/app/plans/[planId]/AddItemForm.tsx`, `src/app/plans/[planId]/DeletePlanButton.tsx` (plans); and `src/app/api/*` (auth/plans/planned-items API routes). There is no separate shared-components directory under `src/app`.

## Key Entities

No domain entities are defined or owned by this module within the reviewed scope.

| Entity | Description |
|--------|-------------|
| None | No domain entity is declared in `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, or `src/app/page.module.css`. |

## Dependencies

| Module | Purpose |
|--------|---------|
| persistence | `src/app/page.tsx` imports `authOptions` from `@/lib/auth`, which resolves under `src/lib` (owned by the persistence module per `generation.module-source-map`), and passes it to `getServerSession(authOptions)`. |
| next-auth (external package) | `getServerSession` is imported directly from `next-auth` in `src/app/page.tsx` to read the current session server-side. [NEEDS CLARIFICATION] No `package.json` was present in this module's manifest inputs to confirm the installed `next-auth` version. |

## Dependents

| Module | Uses For |
|--------|----------|
| None | No module-source-map entry or reviewed code shows another module importing from `src/app/layout.tsx` or `src/app/page.tsx`. As Next.js App Router convention files, they are invoked by the framework's file-based router rather than imported directly by other module code. |
<!-- /SLOT:content -->
