---
type: cross-cutting
audience: [developer]
language: en
links: [docs/security.md, docs/decisions/0004-zod-validation-and-error-envelope.md, docs/modules/app/technical.md]
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Standards

## Authentication

This codebase's authentication mechanism (NextAuth `CredentialsProvider`, JWT sessions, bcrypt password hashing) is detailed in [security.md](security.md). Every route that needs the current user follows the single pattern of calling `requireUserId()` (`src/lib/requireUser.ts`) before performing any database read/write scoped to the caller.

## API Conventions

Resources are exposed under `/api/plans` (collection) and `/api/plans/{planId}` (item), with a nested `/api/plans/{planId}/items` collection, following REST verb-to-HTTP-method conventions: GET (read), POST (create), DELETE (remove) - see [modules/app/technical.md](modules/app/technical.md) for the full endpoint table. No PUT/PATCH update endpoint exists for plans or items in inputs.code. [NEEDS CLARIFICATION] whether plan/item editing is planned; no route implements it in inputs.code.

## Error Handling

All observed API routes return JSON of the shape `{ error: string }` (optionally with a `details` object from zod's `flatten()`), using status codes 400/401/404/409 as itemized in [security.md](security.md). See [decisions/0004-zod-validation-and-error-envelope.md](decisions/0004-zod-validation-and-error-envelope.md) for the rationale and a noted deviation from a more structured error-code convention.

## Logging

Only the Prisma client's built-in `error`/`warn` log levels are configured (`src/lib/db.ts`). Only the Prisma client's built-in `error`/`warn` log levels are configured (`src/lib/db.ts`). No structured application-level logging (INFO/DEBUG) - no `console.*` calls, and no logging library such as winston or pino - was found anywhere in `src/` in inputs.code.
