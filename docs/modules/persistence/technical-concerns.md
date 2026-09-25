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

# Technical Concerns

## technical-concerns.md

<!-- SLOT:content brief="Document content (technical-concerns.md)" -->
### Caching

**Caching Enabled:** No (no data/query caching layer is implemented).

**Technology:** Not applicable for data caching. `src/lib/db.ts` does implement a *client-instance* caching pattern: it stores the `PrismaClient` and `PrismaPg` adapter on `globalForPrisma` (a typed `globalThis`) and reuses them when `NODE_ENV !== "production"`, to avoid exhausting database connections across Next.js dev hot reloads. This is connection-instance reuse, not query/result caching.

**Cached Data:** No query-result or response caching is present in this module's inputs. `src/lib/db.ts` implements only a client-instance caching pattern (reusing the singleton `PrismaClient`/`PrismaPg` adapter via `globalForPrisma` across Next.js dev hot reloads), not caching of query results or responses; none of the API route handlers (`register/route.ts`, `plans/route.ts`, `plans/[planId]/route.ts`, `items/route.ts`) cache query results either.

**Cache Keys:** Not applicable - no cache-keying scheme exists in this module, since no query-result or response caching is implemented in `src/lib/db.ts` or the API route handlers under `src/app/api/**` (`register/route.ts`, `plans/route.ts`, `plans/[planId]/route.ts`, `items/route.ts`, `auth/[...nextauth]/route.ts`).

**Monitoring:** No caching-related metrics or alerts are present in this module's inputs; the only logging configured is Prisma's `log: ["error", "warn"]` option in `src/lib/db.ts`, which is unrelated to caching.

### Data Validation

**Validation Layers**

| Layer | Responsibility (as observed) |
|-------|-------------------------------|
| `authorize()` callback (`src/lib/auth.ts`) | Presence check on `email`/`password` (`if (!email \|\| !password) return null`); email normalization (lower-case, trim) |
| Database | [NEEDS CLARIFICATION] Constraints (uniqueness, NOT NULL, etc.) cannot be confirmed without `schema.prisma` |

No dedicated schema-validation library (e.g. Zod) is used in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`; validation there is a plain `if` guard (`if (!email || !password) return null`), not a declarative schema. Zod schemas are used elsewhere in this module's inputs, in the API route handlers (`register/route.ts`, `plans/route.ts`, `items/route.ts`).

**Field Validation Rules**

Beyond the presence check described above, field-level validation rules (format, length, range) do exist in this module's inputs: `register/route.ts` validates `email` via `z.string().email()` and `password` via `z.string().min(8, ...)`; `plans/route.ts` validates `year` (`min(2000).max(2100)`), `month` (`min(1).max(12)`), and `currency` (`min(3).max(3)`); `items/route.ts` validates `title` (`min(1).max(120)`), `amountCents` (`min(0)`), and `note` (`max(400)`).
Field-level validation rules beyond the auth presence check are enforced via Zod schemas: `RegisterSchema` in `register/route.ts` (`email()`, `password.min(8)`, `name.min(1).max(80)`), `CreatePlanSchema` in `plans/route.ts` (`year.min(2000).max(2100)`, `month.min(1).max(12)`, `currency.min(3).max(3)`), and `CreateItemSchema` in `items/route.ts` (`title.min(1).max(120)`, `amountCents.min(0)`, `note.max(400)`).

**Error Format**

`authorize()` (`src/lib/auth.ts`) communicates validation failure only by returning `null` (which NextAuth surfaces as a generic sign-in failure). Structured error-response JSON IS constructed elsewhere in this module: `register/route.ts`, `plans/route.ts`, `plans/[planId]/route.ts`, and `items/route.ts` each return `NextResponse.json({ error, details? }, { status })`, e.g. `{ error: "Invalid input", details: parsed.error.flatten() }` (400), `{ error: "Unauthorized" }` (401), and `{ error: "Not found" }` (404).
Structured error-response JSON is constructed by the API route handlers in this module: `register/route.ts` returns `{ error: "Invalid input", details: parsed.error.flatten() }` (400) and `{ error: "Email already exists" }` (409); `plans/route.ts` returns `{ error: "Unauthorized" }` (401), `{ error: "Invalid input", details: ... }` (400), and `{ error: "Plan for this month already exists" }` (409); `plans/[planId]/route.ts` and `items/route.ts` return `{ error: "Unauthorized" }` (401) and `{ error: "Not found" }` (404). Only the NextAuth `authorize()` callback in `src/lib/auth.ts` communicates failure solely via returning `null`, without a structured JSON body.

**Common Error Codes**

No formal error-code taxonomy (e.g. a stable enum of error codes) is defined in this module's inputs; API routes return ad hoc string error messages with HTTP status codes instead, such as `"Invalid input"` (400), `"Unauthorized"` (401), `"Not found"` (404), `"Email already exists"` (409), and `"Plan for this month already exists"` (409).

### Internationalization

**i18n Required:** Not indicated by `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts` - these files contain no user-facing strings other than the NextAuth provider label `"Credentials"` and field labels `"Email"` / `"Password"` (`src/lib/auth.ts`), none of which are localized in the code shown.

**Default Locale:** A default locale of `en` is declared at the application root: `src/app/layout.tsx` sets `<html lang="en">`. No locale-switching, negotiation, or module-specific default-locale configuration is present in `src/lib/auth.ts`, `src/lib/db.ts`, or `src/lib/requireUser.ts`.

**Supported Locales / Translatable Content / Key Naming / Locale-Specific Formatting:** None of Supported Locales, Translatable Content, Key Naming, or Locale-Specific Formatting are addressed by this module's code: no i18n/translation library or locale files are present, and numeric/currency values are formatted with plain `toFixed(2)` calls (e.g. `src/app/plans/page.tsx`, `src/app/plans/[planId]/page.tsx`) rather than locale-aware formatting (e.g. `Intl.NumberFormat`).
<!-- /SLOT:content -->
