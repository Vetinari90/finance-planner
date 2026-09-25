---
type: data-model
audience: [developer]
language: en
links: [domain-model.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Data Model: Auth

## Overview

**Database:** [NEEDS CLARIFICATION] Not established by this dispatch's inputs. The code accesses a `prisma` client imported from `@/lib/db` (`src/app/api/auth/register/route.ts`: `prisma.user.findUnique`, `prisma.user.create`), confirming Prisma ORM usage, but the underlying database engine and the Prisma schema file (typically owned by the `persistence` module / `src/lib`) were not part of this dispatch's permitted inputs.

**Schema:** [NEEDS CLARIFICATION] Not visible in the reviewed files.

## Entity-Relationship Diagram

Only the fields directly observed in `src/app/api/auth/register/route.ts` and `src/types/next-auth.d.ts` can be shown; other columns are unconfirmed.

```mermaid
erDiagram
    USER {
        string id
        string email
        string password
        string name
    }
```

[NEEDS CLARIFICATION] Column types (e.g. whether `id` is a UUID or auto-increment integer), nullability, and any additional columns (timestamps, etc.) are not established by the reviewed files.

## Tables

### User (Prisma model, accessed as `prisma.user`)

**Purpose:** Stores account credentials used for sign-in.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | [NEEDS CLARIFICATION] | NO | Selected in the response of `POST /api/auth/register` (`select: { id: true, ... }`); underlying type not shown. |
| email | string | NO | Looked up via `prisma.user.findUnique({ where: { email } })`; stored lowercased and trimmed by the register route. |
| password | string | NO | Stores a bcrypt hash (`bcrypt.hash(password, 12)`), never the plaintext password. |
| name | string | YES | Optional (`z.string().min(1).max(80).optional()` in the register route's Zod schema). |
| created_at | [NEEDS CLARIFICATION] | — | Not referenced by any file in this dispatch's inputs. |
| updated_at | [NEEDS CLARIFICATION] | — | Not referenced by any file in this dispatch's inputs. |

**Key Indexes:**

| Columns | Purpose |
|---------|---------|
| [NEEDS CLARIFICATION] | Email uniqueness is checked at the application level (`findUnique` before `create`) but a database-level unique index/constraint is not confirmed by the reviewed files. |

**Foreign Keys:**

| Column | References | On Delete |
|--------|------------|-----------|
| [NEEDS CLARIFICATION] | — | — |

---

## Domain Mapping

| Domain Entity | Table | Notes |
|---------------|-------|-------|
| User | User (Prisma model `user`) | Accessor name `prisma.user` strongly suggests a Prisma model literally named `User`, but the schema file itself was not in scope for this dispatch. |

## Data Retention

| Table | Retention | Strategy |
|-------|-----------|----------|
| User | [NEEDS CLARIFICATION] | No retention or deletion logic for user accounts was found in the reviewed files. |
