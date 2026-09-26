---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 0dde214dca0f416a52323f6dd038033de480e56d
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technical Concerns

## technical-concerns.md

<!-- SLOT:content brief="Document content (technical-concerns.md)" -->
# Technical Concerns: web-ui

## Caching

### Overview

**Caching Enabled:** No evidence of caching in the reviewed scope.

**Technology:** N/A. No caching technology (Redis, in-memory, CDN configuration, `revalidate`/`fetchCache` export, or cache-control header code) appears in `src/app/layout.tsx` or `src/app/page.tsx`.

### Cached Data

| Data | Cache Type | TTL | Invalidation |
|------|------------|-----|--------------|
| N/A | Not evidenced | Not evidenced | Not evidenced |

### Cache Keys

N/A. No cache-key scheme is evidenced in the reviewed code.

### Monitoring

| Metric | Alert Threshold |
|--------|-----------------|
| N/A | No caching/monitoring configuration observed in inputs |

---

## Data Validation

### Validation Layers

| Layer | Responsibility |
|-------|----------------|
| Server-side | Zod schemas validate API request bodies via `safeParse` in `src/app/api/auth/register/route.ts` (`RegisterSchema`), `src/app/api/plans/route.ts` (`CreatePlanSchema`), and `src/app/api/plans/[planId]/items/route.ts` (`CreateItemSchema`), returning HTTP 400 with `{ error, details }` on failure. |
| Client-side | HTML5 `required` attributes on form inputs in `AddItemForm.tsx`, `NewPlanForm.tsx`, and `LoginClient.tsx`, plus a custom `toCents` decimal-amount parser in `AddItemForm.tsx` that rejects malformed input before submission. |
[NEEDS CLARIFICATION] [REVIEW] completeness: Validation Layers section restricts its scope statement to only layout.tsx/page.tsx and concludes no user-input surface exists, but this document's own codeFiles include multiple request-body zod schemas (CreatePlanSchema, RegisterSchema, CreateItemSchema) and client-side form validation (required/minLength attributes, custom amount parser) that were never covered.
Corrected: the web-ui module's reviewed scope does contain a user-input surface. Server-side zod schemas (`RegisterSchema`, `CreatePlanSchema`, `CreateItemSchema`) validate API request bodies in `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, and `src/app/api/plans/[planId]/items/route.ts`, and client-side HTML `required` attributes plus a custom amount parser validate form input in `AddItemForm.tsx`, `NewPlanForm.tsx`, and `LoginClient.tsx` before submission.

### Field Validation Rules

Concrete field-level validation rules are defined via zod schemas in the API routes: `RegisterSchema` (email must be a valid email address; password minimum 8 characters; optional name 1-80 characters) in `src/app/api/auth/register/route.ts`; `CreatePlanSchema` (optional title 1-80 characters; year integer 2000-2100; month integer 1-12; currency exactly 3 characters, defaulting to "CZK") in `src/app/api/plans/route.ts`; and `CreateItemSchema` (title required 1-120 characters; amountCents integer >= 0; optional/nullable categoryId; optional/nullable note up to 400 characters) in `src/app/api/plans/[planId]/items/route.ts`.
[NEEDS CLARIFICATION] [REVIEW] completeness: Field Validation Rules section says none are present, but this document's codeFiles contain concrete zod field-level rules (email format, password min length, string length/range bounds) that are absent from the doc.
Corrected: zod schemas do define concrete field validation rules. `RegisterSchema` in `src/app/api/auth/register/route.ts` requires a valid email format and a password of at least 8 characters (optional name 1-80 characters). `CreatePlanSchema` in `src/app/api/plans/route.ts` requires an integer year between 2000-2100, an integer month between 1-12, an optional title of 1-80 characters, and a 3-character currency code (default "CZK"). `CreateItemSchema` in `src/app/api/plans/[planId]/items/route.ts` requires a title of 1-120 characters, an integer `amountCents` >= 0, an optional/nullable `categoryId`, and an optional/nullable note up to 400 characters.

### Error Format

API routes consistently return a JSON error shape of `{ error: string, details?: object }`, e.g. `{ error: "Invalid input", details: parsed.error.flatten() }` on zod validation failures in `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, and `src/app/api/plans/[planId]/items/route.ts`, and `{ error: "Unauthorized" }` / `{ error: "Not found" }` for auth/lookup failures in `src/app/api/plans/[planId]/route.ts`.
[NEEDS CLARIFICATION] [REVIEW] completeness: Error Format section claims no error-response shape is evidenced, but the API route files in this document's own codeFiles show a consistent `{ error, details? }` JSON error shape used across register, plans, and items routes.
Corrected: the module's API routes consistently use a `{ error: string, details?: object }` JSON error shape, e.g. `{ error: "Invalid input", details: parsed.error.flatten() }` on zod validation failures in `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, and `src/app/api/plans/[planId]/items/route.ts`, and `{ error: "Unauthorized" }` / `{ error: "Not found" }` for auth/lookup failures in `src/app/api/plans/[planId]/route.ts`.

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Invalid input — request body failed zod schema validation (`{ error: "Invalid input", details }`) |
| 401 | Unauthorized — no valid session (`requireUserId()` returned null) |
| 404 | Not found — plan does not exist or does not belong to the authenticated user |
| 409 | Conflict — e.g. email already registered (register route) or a plan already exists for that year/month (plans route) |
| 201 | Created — resource (user, plan, or item) successfully created |
[NEEDS CLARIFICATION] [REVIEW] completeness: Common Error Codes table says nothing is evidenced, but the API route files in this document's own codeFiles evidence specific status codes (400, 401, 404, 409) with distinct meanings that are omitted from the table.
Corrected: the module's API routes evidence concrete status codes — 400 (invalid input, failed zod validation), 401 (unauthorized, no valid session), 404 (not found, plan missing or not owned by the user), 409 (conflict, e.g. duplicate email in register route or duplicate plan for a year/month in plans route), and 201 (created, on successful user/plan/item creation) — each with a `{ error: string }` JSON body, as seen in `src/app/api/auth/register/route.ts`, `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, and `src/app/api/plans/[planId]/items/route.ts`.

---

## Internationalization

### Overview

**i18n Required:** [NEEDS CLARIFICATION] `src/app/layout.tsx` hardcodes `<html lang="en">` and no internationalization library (e.g. `next-intl`, `react-intl`) is imported anywhere in the reviewed files, so whether i18n is planned or required is not evidenced.

**Default Locale:** `en` (from the literal `lang="en"` attribute in `src/app/layout.tsx`)

### Supported Locales

| Locale | Status |
|--------|--------|
| en | Only locale evidenced (hardcoded `<html lang="en">`) |

### Translatable Content

[NEEDS CLARIFICATION] No translation keys, message catalogs, or copy-extraction mechanism are present in the reviewed scope. `src/app/layout.tsx` sets static `Metadata` (`title: "Create Next App"`, `description: "Generated by create next app"`) directly as string literals; [NEEDS CLARIFICATION] whether these are the intended production values for finance-planner or leftover `create-next-app` scaffold defaults was not resolvable from the reviewed inputs.

### Key Naming

N/A -- no translation key naming convention exists, as no i18n library or message catalog is present in the reviewed code. Not evidenced.

### Locale-Specific Formatting

| Type | Varies By Locale |
|------|------------------|
| N/A | No date, number, or currency formatting code is present in `src/app/layout.tsx` or `src/app/page.tsx` |
<!-- /SLOT:content -->
