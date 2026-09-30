---
type: decision
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Prisma with PostgreSQL Driver Adapter
[NEEDS CLARIFICATION] [REVIEW] consistency: ADR numbering collision: this decision is numbered 0001, the same number used by docs/decisions/0001-security-baseline.md. Every other decision in the set (0002-0005) has a unique number, so two ADRs sharing 0001 is an inconsistency in the decision-record numbering scheme.

**Status:** Accepted

## Context

The application needs a type-safe database client for PostgreSQL.

## Decision

We will use Prisma Client with the `@prisma/adapter-pg` driver adapter rather than relying solely on Prisma's default connection handling. `src/lib/db.ts` constructs `new PrismaPg({ connectionString })` from `process.env.DATABASE_URL` and passes it as the `adapter` option to `new PrismaClient({ adapter, log: ["error", "warn"] })`. The generated Prisma Client is imported from a non-default path, `@/generated/prisma/client`, rather than the standard `@prisma/client` package location. [NEEDS CLARIFICATION] The `schema.prisma` file that configures this custom `generator client { output = ... }` block, and the exact Prisma package version in use, are not present in inputs.code. The client instance is cached on `globalThis` outside of production to avoid exhausting database connections during development hot-reload.

## Consequences

**Positive:**
- Driver adapters allow Prisma Client to operate without Prisma's native query-engine binary, which can simplify deployment to constrained runtimes.
- Caching the client on `globalThis` avoids creating a new connection pool on every module reload in development.

**Negative:**
- [NEEDS CLARIFICATION] No `schema.prisma`, migration files, or Prisma version pin were present in inputs.code, so exact adapter/engine compatibility requirements could not be confirmed.
