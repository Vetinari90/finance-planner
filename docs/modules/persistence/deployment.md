---
type: documentation
audience: [developer]
language: en
links: []
generated_from: f42c2544c64f0a192045ac5c7a007738e9faaa58
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Deployment

## deployment.md

<!-- SLOT:content brief="Document content (deployment.md)" -->
### Overview

**Deployment Type:** [NEEDS CLARIFICATION] Not stated in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`. The module is part of a Next.js application (per the top-level `README.md`, a `create-next-app` project); README.md's "Deploy on Vercel" section is default `create-next-app` scaffolding text and is not confirmed as this project's actual deployment target within this module's inputs.

### Configuration

#### Environment Variables

**Required**

| Variable | Type | Description | Example |
|----------|------|--------------|---------|
| `DATABASE_URL` | string | PostgreSQL connection string; `src/lib/db.ts` throws `"DATABASE_URL is not set"` at module load if absent | [NEEDS CLARIFICATION] no example value present in inputs |

**Optional**

| Variable | Type | Default | Description |
|----------|------|---------|--------------|
| `NODE_ENV` | string | [NEEDS CLARIFICATION] not defaulted in this module's code | `src/lib/db.ts` only caches the Prisma client/adapter on `globalThis` when `NODE_ENV !== "production"` |

[NEEDS CLARIFICATION] `src/lib/auth.ts` configures NextAuth (`CredentialsProvider`, `jwt` session strategy) but does not itself read any environment variable in the code available to this module; NextAuth's own required configuration (e.g. a session-signing secret) is not visible in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.

#### Secrets

[NEEDS CLARIFICATION] No secret is explicitly read in this module's inputs beyond `DATABASE_URL` (a connection string, not a rotated secret).

#### Feature Flags

[NEEDS CLARIFICATION] None found in this module's inputs.

### Health Checks

[NEEDS CLARIFICATION] No health-check endpoints, liveness/readiness handlers, or dependency-check logic are present in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.

### Resource Requirements

[NEEDS CLARIFICATION] No compute or storage sizing information is present in this module's inputs.

### Scaling

[NEEDS CLARIFICATION] No scaling triggers or instance limits are present in this module's inputs.

### External Dependencies

| Service | Purpose | Required |
|---------|---------|----------|
| PostgreSQL | Primary data store, accessed via Prisma with a `PrismaPg` adapter (`src/lib/db.ts`) | Yes - module load throws if `DATABASE_URL` is unset |
<!-- /SLOT:content -->
