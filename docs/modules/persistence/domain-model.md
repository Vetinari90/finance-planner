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

### Class Diagram

[NEEDS CLARIFICATION] A full class/entity diagram requires the Prisma schema (`schema.prisma`), which is not part of this module's inputs (`src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/requireUser.ts`).

### Entities

#### User (referenced, not owned by this module)

**Purpose:** The credentials-login account looked up during authentication.

**Key Attributes (observed from code usage only):**

| Attribute | Type | Description |
|-----------|------|--------------|
| id | [NEEDS CLARIFICATION] | Unique identifier; propagated to the NextAuth JWT (`token.sub`) and session (`session.user.id`) in `src/lib/auth.ts` |
| email | [NEEDS CLARIFICATION] | Login identifier; looked up case-insensitively (lower-cased/trimmed before query) |
| password | [NEEDS CLARIFICATION] | Stored as a bcrypt hash - compared via `bcrypt.compare(password, user.password)`, never compared in plaintext |
| name | [NEEDS CLARIFICATION] | Optional; falls back to `undefined` if absent (`user.name ?? undefined`) |

**Invariants (rules that must always hold):**

- A session is only issued when `bcrypt.compare(password, user.password)` succeeds against an existing `prisma.user` row (`src/lib/auth.ts`).
- [NEEDS CLARIFICATION] Any invariant enforced at the database/schema level (uniqueness of `email`, NOT NULL constraints, etc.) cannot be confirmed without `schema.prisma`.

**Relationships:**

[NEEDS CLARIFICATION] Not visible without the Prisma schema; this module's code performs no relational (`include`/`select`) queries beyond the flat `prisma.user.findUnique({ where: { email } })` call.

### Value Objects

[NEEDS CLARIFICATION] None identified in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.

### Domain Events

[NEEDS CLARIFICATION] None identified; this module emits no events in the code available to it.
<!-- /SLOT:content -->
