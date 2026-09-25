---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 99b58cc116906f3d728fdedc7889dc5d68bb4c02
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:46d0ac250ad2a72f1e43ff8a158cd1807522a5e39dc0463b5d9d6f6367d46c72
---

# Local Environment Setup

## _template.md

<!-- SLOT:content brief="Document content (_template.md)" -->
## Overview

**Type:** Service-Specific (local development environment bring-up)
**Target Environment:** Local developer workstation
**Estimated Duration:** [NEEDS CLARIFICATION] No timing information for a full local setup was present in `README.md` or in the module overview docs.
**Who Can Execute:** Any developer working on finance-planner.

finance-planner is a Next.js App Router application (per `README.md`, bootstrapped with `create-next-app`). Its authenticated pages and API routes depend on a PostgreSQL database reached through Prisma (per [persistence module overview](../../modules/persistence/overview.md): a singleton `PrismaClient` bound to PostgreSQL through a `PrismaPg` adapter) and on NextAuth credentials-based sign-in (also owned by the persistence module's `authOptions`, per the same overview). Use this runbook to bring up a working local copy of the app for development.

Use this procedure when: onboarding a new developer, or recreating a broken local environment.

## Prerequisites

- [ ] [NEEDS CLARIFICATION] A specific Node.js version is not declared in `README.md` or in any module overview available to this dispatch; no `package.json`/`.nvmrc` was among the inputs.
- [ ] A reachable PostgreSQL instance and its connection string. [NEEDS CLARIFICATION] `README.md` and the module overviews do not document how to provision PostgreSQL locally (e.g. a Docker Compose file); the [persistence module overview](../../modules/persistence/overview.md) only confirms that the app fails fast at load if `DATABASE_URL` is unset (`src/lib/db.ts`).
- [ ] One of npm, Yarn, pnpm, or Bun installed, per the package-manager options shown in `README.md`.

## Procedure Steps

### Step 1: Install project dependencies

**Command:**
```bash
[NEEDS CLARIFICATION] No dependency-installation command is documented in README.md (it only documents the dev-server run step below); no package.json was available to this dispatch to confirm the expected install command.
```

**Expected output:**
[NEEDS CLARIFICATION] Not documented in the available inputs.

**Duration:** [NEEDS CLARIFICATION] Not documented in the available inputs.

### Step 2: Configure environment variables

**Command:**
```bash
[NEEDS CLARIFICATION] The persistence module overview confirms the application requires DATABASE_URL (src/lib/db.ts fails fast if it is unset), and its NextAuth configuration (src/lib/auth.ts) implies a session secret is needed, but neither README.md nor the module overviews document the exact environment-variable names/values (e.g. NEXTAUTH_SECRET, NEXTAUTH_URL) or where to place them (e.g. .env / .env.local).
```

**Expected output:**
Not applicable (configuration step).

**Duration:** [NEEDS CLARIFICATION] Not documented in the available inputs.

### Step 3: Prepare the database schema

**Command:**
```bash
[NEEDS CLARIFICATION] The persistence module overview notes that src/lib/db.ts imports the generated Prisma client from `@/generated/prisma/client`, but the Prisma schema source (schema.prisma) and any migration/generate command were explicitly called out there as not confirmed. No Prisma CLI command can be grounded from the available inputs.
```

**Expected output:**
[NEEDS CLARIFICATION] Not documented in the available inputs.

**Duration:** [NEEDS CLARIFICATION] Not documented in the available inputs.

### Step 4: Start the development server

**Command:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

**Expected output:**
A running local development server reachable at [http://localhost:3000](http://localhost:3000), per `README.md`.

**Duration:** [NEEDS CLARIFICATION] Not documented in the available inputs.

### Step 5: Open the application

Open [http://localhost:3000](http://localhost:3000) in a browser, per `README.md`. Per the [web-ui module overview](../../modules/web-ui/overview.md), the root route (`src/app/page.tsx`) performs a server-side session check and redirects to `/plans` if authenticated or `/login` if not.

## Verification

- [ ] Health check: the root route (`/`) loads and redirects to `/login` (no session) or `/plans` (session present), per the [web-ui module overview](../../modules/web-ui/overview.md).
- [ ] Smoke test: register a new account via `/register`, which per the [auth module overview](../../modules/auth/overview.md) calls `POST /api/auth/register` (`src/app/api/auth/register/route.ts`) and auto-signs the new user in; then confirm sign-in works via `/login`, which calls NextAuth's `credentials` provider (`signIn("credentials", ...)`).
- [ ] Smoke test: after signing in, confirm the plans list page (`/plans`) loads, per the [plans module overview](../../modules/plans/overview.md).
- [ ] Metrics normal: [NEEDS CLARIFICATION] No local-environment metrics or health-check endpoints were documented in the available inputs.

## If Something Goes Wrong

**Rollback trigger criteria:**
- The development server fails to start, or the app cannot reach the database (per the [persistence module overview](../../modules/persistence/overview.md), `src/lib/db.ts` fails fast at load when `DATABASE_URL` is not set).

**Recovery steps:**
1. [NEEDS CLARIFICATION] No documented recovery/reset procedure (e.g. clearing a local database, resetting Prisma migrations, or clearing build caches) was present in `README.md` or the module overviews available to this dispatch.

## Troubleshooting

- **Server fails to start / database errors at load time:** Per the [persistence module overview](../../modules/persistence/overview.md), `src/lib/db.ts` fails fast if `DATABASE_URL` is not set — confirm the environment variable is present before starting the dev server (Step 2 above, currently unresolved).
- **Sign-in does not persist a session:** The [persistence module overview](../../modules/persistence/overview.md) documents `authOptions` as `jwt`-strategy with `jwt`/`session` callbacks in `src/lib/auth.ts`; [NEEDS CLARIFICATION] the exact session-secret environment variable required for this to work locally is not confirmed in the available inputs.
- **Registration succeeds but sign-in fails:** Per the [auth module overview](../../modules/auth/overview.md), registration hashes passwords with `bcryptjs` (cost factor 12) before calling `prisma.user.create`; a mismatch here would point at the `CredentialsProvider`'s `bcrypt.compare` check in `src/lib/auth.ts` (per the [persistence module overview](../../modules/persistence/overview.md)).
<!-- /SLOT:content -->
