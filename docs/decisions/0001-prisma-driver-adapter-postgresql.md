---
type: decision
audience: [developer]
language: en
links: [docs/modules/lib/technical.md, docs/data-model.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:9f30162e9152d4b52e2413d4ede872778c281c3fb6b2a6184348cb2c223bfa93
---

# ADR: Prisma with PostgreSQL Driver Adapter

**Status:** Accepted (inferred from current implementation in code; no separate decision record was present in inputs)

## Context

The application needs a database client for its User/Plan/PlannedItem data.

## Decision

We will use Prisma with a PostgreSQL driver adapter: `PrismaClient` is instantiated with a `PrismaPg` adapter from `@prisma/adapter-pg`, configured from the `DATABASE_URL` environment variable (`src/lib/db.ts`). The generated Prisma client is imported from a custom output path `@/generated/prisma/client` rather than the default `@prisma/client` location.
[NEEDS CLARIFICATION] [REVIEW] accuracy: This paragraph asserts specific implementation facts about src/lib/db.ts (PrismaPg adapter, @prisma/adapter-pg, DATABASE_URL env var, custom @/generated/prisma/client output path) but src/lib/db.ts is not among this doc's inputs (codeFiles is empty; refFiles is only the generic README.md, which does not mention Prisma). These concrete claims are unsupported by any enumerated input for this generation.

## Consequences

**Positive:**
- A single shared `PrismaClient` instance is cached on `globalThis` outside production to avoid exhausting database connections during hot-reload (`src/lib/db.ts`).
[NEEDS CLARIFICATION] [REVIEW] accuracy: This claim about src/lib/db.ts caching a PrismaClient instance on globalThis outside production is not grounded in any provided input - src/lib/db.ts was not part of codeFiles or refFiles for this generation.

**Negative:**
- [NEEDS CLARIFICATION] The Prisma schema file (`schema.prisma`) defining the actual table structure, indexes, and migrations was not present in inputs.code; field-level constraints beyond what is inferable from query call sites could not be confirmed.
