---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:24ae02e6e3c7a1bb5dae6246c6238647f6a66d1dd5f40aa5227168a368a14598
---

# 0001 Nextjs App Router Fullstack Monolith

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
## Status

Accepted. This decision is inferred from the implemented codebase rather than from an explicit status declaration: every reviewed module overview (auth, persistence, plans, planned-items, web-ui) describes a single, already-built Next.js App Router application, not a proposed or superseded design.

[NEEDS CLARIFICATION] No explicit ADR log, meeting note, or commit message confirming an original "Proposed" state or an approval date was present in `README.md` or the module overview docs used as input to this synthesis.

## Context

`README.md` is generic `create-next-app` boilerplate and states no finance-planner-specific rationale for the framework or architecture choice.

The choice of architecture can nonetheless be reconstructed from the already-generated module overviews, which consistently describe one Next.js project that hosts both HTTP API route handlers and server-rendered pages side by side under a single `src/app` tree:

- The auth module implements both API route handlers (`src/app/api/auth/register/route.ts`, the NextAuth catch-all `src/app/api/auth/[...nextauth]/route.ts`, `src/app/logout/route.ts`) and pages (`src/app/login`, `src/app/register`), per [docs/modules/auth/overview.md](../modules/auth/overview.md).
- The plans module implements both API route handlers (`src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`) and server-rendered pages with client forms (`src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx`), per [docs/modules/plans/overview.md](../modules/plans/overview.md).
- The planned-items module implements an API route handler nested under the plans page/route tree (`src/app/api/plans/[planId]/items`), per [docs/modules/planned-items/overview.md](../modules/planned-items/overview.md).
- The web-ui module implements the root layout and root route (`src/app/layout.tsx`, `src/app/page.tsx`) that session-gates and redirects into the rest of the same application, per [docs/modules/web-ui/overview.md](../modules/web-ui/overview.md).
- The persistence module provides a single shared Prisma client and NextAuth `authOptions` (`src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/requireUser.ts`) consumed by both the API route handlers and the server-rendered pages across the other modules, per [docs/modules/persistence/overview.md](../modules/persistence/overview.md).

Together these describe a single deployable Next.js application in which API endpoints and UI pages/components are colocated in one `src/app` tree and share one data-access layer, rather than a separately deployed frontend and backend.

[NEEDS CLARIFICATION] The business or technical drivers that led to choosing this fullstack-monolith shape (e.g. team size, time-to-market, deployment simplicity, hosting constraints) are not stated in `README.md` or in any of the module overview docs used as input to this synthesis.

## Decision

Based on the observed structure described above, finance-planner is built as a single Next.js App Router application in which:

- API route handlers (`route.ts` files under `src/app/api/**`) and page/UI code (`page.tsx` and related client components under `src/app/**`) are colocated in one `src/app` tree, rather than split into separate frontend and backend codebases or deployables.
- All modules share one persistence layer: the singleton Prisma client and NextAuth `authOptions` exposed by the persistence module (`src/lib/db.ts`, `src/lib/auth.ts`), per [docs/modules/persistence/overview.md](../modules/persistence/overview.md).
- Session/authentication state, established by NextAuth, is consumed uniformly by both API route handlers (via `requireUserId()`) and server-rendered pages (via `getServerSession(authOptions)`), per [docs/modules/plans/overview.md](../modules/plans/overview.md) and [docs/modules/web-ui/overview.md](../modules/web-ui/overview.md).

[NEEDS CLARIFICATION] No input document states this as an explicit, deliberated decision statement ("We will use Next.js App Router as a fullstack monolith because...") - the statement above is reconstructed from the observed, already-implemented module boundaries rather than quoted from a decision record.

## Consequences

### Positive

- A single deployable unit: one Next.js application serves both the API surface and the UI, avoiding the coordination overhead of two separately deployed services, as evidenced by every reviewed module (auth, plans, planned-items, web-ui) contributing both route handlers and pages to the same `src/app` tree.
- Shared, centralized data access and session logic: all modules reuse the same Prisma client and `authOptions` from the persistence module instead of each maintaining its own, per [docs/modules/persistence/overview.md](../modules/persistence/overview.md) and [docs/modules/auth/overview.md](../modules/auth/overview.md).
- Consistent session handling across both API routes and server-rendered pages via the shared `requireUserId()` helper and `getServerSession(authOptions)`, per [docs/modules/plans/overview.md](../modules/plans/overview.md).

### Negative

- Module boundaries are enforced only by convention (the project's `generation.module-source-map`) rather than by physical/deployment separation. Several module overviews flag ownership ambiguity that stems directly from this: `requireUserId()` lives under `src/lib` (mapped to the persistence module) despite being functionally an authentication concern, per [docs/modules/auth/overview.md](../modules/auth/overview.md) and [docs/modules/planned-items/overview.md](../modules/planned-items/overview.md).
- The auth module's internal `authOptions` implementation (provider configuration, session strategy, credential verification) is defined outside the auth module itself, in the persistence module's `src/lib/auth.ts`, per [docs/modules/auth/overview.md](../modules/auth/overview.md) and [docs/modules/persistence/overview.md](../modules/persistence/overview.md) - a coupling that a fullstack-monolith layout with shared `src/lib` code makes easy to introduce.
- [NEEDS CLARIFICATION] Scaling, deployment, and operational trade-offs of this monolithic shape (e.g. independent scaling of API vs. UI traffic, blast radius of a single deploy) are not addressed in `README.md` or in the module overview docs used as input to this synthesis.

## Alternatives Considered

[NEEDS CLARIFICATION] No alternative architectures (e.g. a separate backend API service with a distinct frontend application, or a different framework) are discussed in `README.md` or in any of the module overview docs used as input to this synthesis.

## References

- [docs/modules/auth/overview.md](../modules/auth/overview.md)
- [docs/modules/persistence/overview.md](../modules/persistence/overview.md)
- [docs/modules/plans/overview.md](../modules/plans/overview.md)
- [docs/modules/planned-items/overview.md](../modules/planned-items/overview.md)
- [docs/modules/web-ui/overview.md](../modules/web-ui/overview.md)
- [README.md](../../README.md) - generic `create-next-app` boilerplate; contains no finance-planner-specific architectural rationale.
<!-- /SLOT:content -->
