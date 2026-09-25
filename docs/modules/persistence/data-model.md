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

# Data Model

## data-model.md

<!-- SLOT:content brief="Document content (data-model.md)" -->
### Overview

**Database:** PostgreSQL, accessed through Prisma ORM. `src/lib/db.ts` constructs a `PrismaPg` adapter from `DATABASE_URL` and passes it to `PrismaClient`; the generated client is imported from `@/generated/prisma/client` (a custom Prisma client output path).

**Schema:** [NEEDS CLARIFICATION] No `schema.prisma` file is present in this module's inputs (`src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/requireUser.ts`); the schema/migration source cannot be grounded from the available code.

### Entity-Relationship Diagram

[NEEDS CLARIFICATION] Cannot be constructed - the Prisma schema file that defines tables and relations is not part of this module's inputs.

### Tables

#### user (inferred accessor name, unconfirmed schema)

**Purpose:** Stores credentials-login accounts. Inferred solely from the Prisma model accessor `prisma.user` used in `src/lib/auth.ts`'s `authorize()` callback.

| Column | Type | Nullable | Description |
|--------|------|----------|--------------|
| id | [NEEDS CLARIFICATION] type not declared in inputs | Used non-null as `user.id` | Copied to `token.sub` / `session.user.id` on successful login |
| email | [NEEDS CLARIFICATION] type not declared in inputs | Used non-null as lookup key | Queried via `prisma.user.findUnique({ where: { email } })`; input is lower-cased/trimmed before lookup |
| password | [NEEDS CLARIFICATION] type not declared in inputs | Used non-null as `user.password` | Compared with `bcrypt.compare(password, user.password)`, implying a bcrypt hash is stored, not plaintext |
| name | [NEEDS CLARIFICATION] type not declared in inputs | Treated as optional (`user.name ?? undefined`) | Returned to the NextAuth session on successful login |

[NEEDS CLARIFICATION] The full column list, primary key, and constraints for this table are not available without `schema.prisma`; only the four fields referenced by `src/lib/auth.ts` could be confirmed.

**Key Indexes:**

[NEEDS CLARIFICATION] Not declared in this module's inputs.

**Foreign Keys:**

[NEEDS CLARIFICATION] Not declared in this module's inputs.

### Domain Mapping

[NEEDS CLARIFICATION] Cannot be produced without the Prisma schema; see [domain-model.md](domain-model.md) for the entities this module's code references.

### Data Retention

[NEEDS CLARIFICATION] No retention or archival policy is present in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.
<!-- /SLOT:content -->
