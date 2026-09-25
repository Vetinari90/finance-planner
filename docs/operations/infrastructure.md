---
type: documentation
audience: [developer]
language: en
links: [../modules/auth/overview.md, ../modules/plans/overview.md, ../modules/web-ui/overview.md, runbooks/vercel-deploy.md, ../decisions/0003-prisma-postgresql-with-pg-adapter.md]
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:c570623018befaf06912252ebc777c39c0f38664ad5cf303bf17f184e1f10d59
---

# Infrastructure

## infrastructure.md

<!-- SLOT:content brief="Document content (infrastructure.md)" -->
### Summary

finance-planner is a single Next.js application (App Router) that serves both the
UI and its API routes from one codebase. The application uses Prisma as its
database access layer and NextAuth.js for authentication. The project's
`README.md` is the generic boilerplate produced by `create-next-app` and does not
carry finance-planner-specific infrastructure facts beyond generic Next.js /
Vercel guidance; most of the infrastructure detail below is inferred from module
overview documents rather than from an infrastructure-specific reference.

[NEEDS CLARIFICATION] No infrastructure-as-code files, deployment manifests,
environment-variable lists, or hosting configuration were present among this
node's declared inputs (`README.md` plus the auth, plans, web-ui, planned-items,
and persistence module overview docs). The statements below describe what the
application code and NextAuth/Prisma usage imply, not a confirmed production
topology.

### Hosting and Deployment Platform

`README.md` states: "The easiest way to deploy your Next.js app is to use the
Vercel Platform from the creators of Next.js," and includes a "Deploy on Vercel"
section linking to Next.js's own deployment documentation. This is the standard
`create-next-app` boilerplate text, not a finance-planner-specific confirmation
that production runs on Vercel.

[NEEDS CLARIFICATION] Whether finance-planner is actually deployed on Vercel (or
elsewhere) in production is not confirmed by any input read for this node. A
Vercel-specific deployment runbook is declared elsewhere in the documentation
tree (see runbooks/vercel-deploy.md); its content was outside this node's
declared inputs, so it could not be used to confirm the point here.

### Application Runtime

The application is a Next.js App Router project. Per the module-source-map in
`doc_struc.md`, the runtime is organized as:

- `src/app/api/auth`, `src/app/login`, `src/app/register`, `src/app/logout`,
  `src/types` — auth module (see [auth overview](../modules/auth/overview.md)).
- `src/app/api/plans`, `src/app/plans` — plans module (see
  [plans overview](../modules/plans/overview.md)).
- `src/app/api/plans/[planId]/items` — planned-items module.
- `src/lib` — persistence module (shared Prisma client `@/lib/db` and shared
  auth configuration `@/lib/auth`).
- `src/app` (root layout, global CSS, root route) — web-ui module (see
  [web-ui overview](../modules/web-ui/overview.md)).

[NEEDS CLARIFICATION] `docs/modules/persistence/overview.md` and
[NEEDS CLARIFICATION] [REVIEW] consistency: infrastructure.md asserts docs/modules/persistence/overview.md and docs/modules/planned-items/overview.md were still unfilled skeleton documents (`[UNFILLED]` sentinel) at generation time, but both documents are fully generated with substantive content in the current docs tree, contradicting the claim and leaving stale unresolved markers for facts (database engine, session strategy) that are actually confirmed elsewhere in the tree.
[NEEDS CLARIFICATION] [REVIEW] completeness: The doc claims docs/modules/persistence/overview.md and docs/modules/planned-items/overview.md were 'still unfilled skeleton documents ([UNFILLED] sentinel, no generated content)', but both files are fully generated with substantive content. This false premise causes the Data Storage, Authentication Infrastructure, and Environment Configuration sections below to omit persistence-derived facts (PostgreSQL engine, JWT session strategy, DATABASE_URL requirement) that were actually available in the doc tree.
`docs/modules/planned-items/overview.md`, both declared as inputs for this node,
were still unfilled skeleton documents (`[UNFILLED]` sentinel, no generated
content) at the time this file was generated, so no persistence- or
planned-items-specific infrastructure detail could be drawn from them.

### Data Storage

The plans, auth, and web-ui module overviews each describe reads/writes going
through a shared Prisma client imported as `prisma` from `@/lib/db` (owned by
the persistence module). None of the module overview docs available to this
node state which underlying database engine Prisma is configured against.
[NEEDS CLARIFICATION] [REVIEW] consistency: infrastructure.md claims no available module overview states the underlying database engine, but docs/modules/persistence/overview.md (which infrastructure.md itself lists as a declared input) explicitly states the Prisma client is bound to PostgreSQL via a PrismaPg adapter.

A project decision record with the filename
`0003-prisma-postgresql-with-pg-adapter.md` exists in the documentation tree
(see the tree in `doc_struc.md`), whose title suggests a PostgreSQL database
accessed via a `pg` adapter. That record's content was not among this node's
declared inputs, so this document does not assert PostgreSQL as the confirmed
database engine.

[NEEDS CLARIFICATION] The concrete database engine, hosting/managed-service
[NEEDS CLARIFICATION] [REVIEW] completeness: The database engine is directly named as PostgreSQL in docs/modules/persistence/overview.md and docs/modules/persistence/deployment.md, contradicting the claim here that 'the concrete database engine ... [is] not confirmed by this node's inputs'.
provider, connection-pooling configuration, and any backup/replication topology
for the Prisma-backed data store are not confirmed by this node's inputs.

### Authentication Infrastructure

Per [auth overview](../modules/auth/overview.md), authentication is handled by
NextAuth.js: a credentials provider is invoked via `signIn("credentials", ...)`
from `next-auth/react`, and all NextAuth-managed sub-routes are served through a
catch-all route handler (`src/app/api/auth/[...nextauth]/route.ts`) that
delegates to `NextAuth(authOptions)`. Passwords are hashed with `bcryptjs`
(cost factor 12) before being stored via `prisma.user.create`.

[NEEDS CLARIFICATION] The `auth` module overview states that `authOptions`
(provider configuration, session strategy, JWT/callback logic) is defined in
`@/lib/auth`, which falls under the persistence module's source scope
(`src/lib`) rather than the auth module's. Since `docs/modules/persistence/overview.md`
is still an unfilled skeleton, the session strategy (JWT vs. database-backed
[NEEDS CLARIFICATION] [REVIEW] consistency: infrastructure.md states the session strategy (JWT vs. database-backed) could not be confirmed because docs/modules/persistence/overview.md was an unfilled skeleton, but that document is not a skeleton - it explicitly states authOptions uses a jwt-strategy session, directly resolving the claimed gap.
[NEEDS CLARIFICATION] [REVIEW] accuracy: The document claims docs/modules/persistence/overview.md 'is still an unfilled skeleton' and that the session strategy 'could not be confirmed for this infrastructure document,' but persistence/overview.md (a declared input of this document) is fully populated and explicitly states the session uses a 'jwt-strategy', contradicting the claim that this could not be confirmed.
session) and token lifetime used in production could not be confirmed for this
infrastructure document.

### Environment Configuration

[NEEDS CLARIFICATION] No `.env` file, `.env.example`, or environment-variable
documentation was present among this node's declared inputs, so required
runtime configuration (database connection string, NextAuth secret, any
third-party API keys) cannot be enumerated here.

### Local Development

`README.md` documents the local development workflow generically: run
`npm run dev` (or the `yarn dev` / `pnpm dev` / `bun dev` equivalents) to start
the development server, then open `http://localhost:3000`. This is
`create-next-app` boilerplate and describes local development only, not
production infrastructure.
<!-- /SLOT:content -->
