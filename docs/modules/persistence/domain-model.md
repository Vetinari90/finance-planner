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

# Domain Model of the persistence module.

## domain-model.md

<!-- SLOT:content brief="Domain Model of the persistence module. (domain-model.md)" -->
### Overview

This module (`src/lib/`) does not include its own Prisma schema among the files available to it; it wires a shared database client and authentication configuration for the rest of the application. The one domain concept it references directly is the authenticated **User**, via `prisma.user` lookups in `src/lib/auth.ts` and the session identity resolved by `src/lib/requireUser.ts`.
[NEEDS CLARIFICATION] [REVIEW] completeness: The Entities section documents only User, and the Overview asserts User is 'the one domain concept it references directly'. But the input set given to this doc includes src/app/api/plans/route.ts, src/app/api/plans/[planId]/route.ts, and src/app/api/plans/[planId]/items/route.ts, which use prisma.plan and prisma.plannedItem extensively (fields userId, year, month, currency, title / planId, title, amountCents, categoryId, note). Plan and PlannedItem (and a categoryId-referenced Category) are domain entities evidenced by these inputs but are entirely missing from the Entities section.

### Class Diagram

A full class/entity diagram requires the Prisma schema (`schema.prisma`), which is not part of this module's inputs (`src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/requireUser.ts`).

### Entities

#### User (referenced, not owned by this module)

**Purpose:** The credentials-login account looked up during authentication.

**Key Attributes (observed from code usage only):**

| Attribute | Type | Description |
|-----------|------|--------------|
| id | [NEEDS CLARIFICATION] | Unique identifier; propagated to the NextAuth JWT (`token.sub`) and session (`session.user.id`) in `src/lib/auth.ts` |
| email | string | Login identifier; looked up case-insensitively (lower-cased/trimmed before query) |
| password | string | Stored as a bcrypt hash - compared via `bcrypt.compare(password, user.password)`, never compared in plaintext |
| name | string (optional) | Optional; falls back to `undefined` if absent (`user.name ?? undefined`) |

**Invariants (rules that must always hold):**

- A session is only issued when `bcrypt.compare(password, user.password)` succeeds against an existing `prisma.user` row (`src/lib/auth.ts`).
- Email uniqueness is checked at the application level: `src/app/api/auth/register/route.ts` calls `prisma.user.findUnique({ where: { email } })` before `prisma.user.create(...)` and returns a 409 response if a match already exists. Whether a database-level UNIQUE or NOT NULL constraint also exists cannot be confirmed without `schema.prisma`, which is not part of this module's inputs.

**Relationships:**

Referenced by `Plan.userId`: `src/app/api/plans/route.ts` creates each `Plan` via `prisma.plan.create({ data: { userId, ... } })` and lists a user's plans via `prisma.plan.findMany({ where: { userId } })`; `src/app/api/plans/[planId]/route.ts` further scopes lookups by `{ id: planId, userId }`. The exact foreign-key/cardinality definition is set in `schema.prisma`, which is not part of this module's inputs.

### Value Objects

None identified in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.

### Domain Events

None identified; this module emits no events in the code available to it.
<!-- /SLOT:content -->
