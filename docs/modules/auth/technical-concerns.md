---
type: technical-concerns
audience: [developer]
language: en
links: [api.md]
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technical Concerns: Auth

## Caching

### Overview

**Caching Enabled:** [NEEDS CLARIFICATION] No caching code (Redis client, in-memory cache, CDN header, etc.) was found in any of the seven files in this dispatch's permitted read set.

**Technology:** [NEEDS CLARIFICATION]

### Cached Data

| Data | Cache Type | TTL | Invalidation |
|------|------------|-----|--------------|
| [NEEDS CLARIFICATION] | — | — | — |

### Monitoring

| Metric | Alert Threshold |
|--------|-----------------|
| [NEEDS CLARIFICATION] | — |

---

## Data Validation

### Validation Layers

| Layer | Responsibility |
|-------|----------------|
| API | `POST /api/auth/register` validates the request body with a Zod schema (`RegisterSchema`) before touching the database. |
| Client (HTML5) | `src/app/register/page.tsx` marks `email` and `password` as `required`, `password` additionally has `minLength={8}`; `src/app/login/LoginClient.tsx` marks both fields `required` with matching `type` attributes. No client-side schema library is used for login. |
| Service / Domain | [NEEDS CLARIFICATION] `authOptions` (credential-verification logic) is outside this dispatch's permitted read set. |
| Database | [NEEDS CLARIFICATION] The Prisma schema file (constraints) is outside this dispatch's permitted read set. |

### Field Validation Rules

#### User (registration input, `RegisterSchema` in `src/app/api/auth/register/route.ts`)

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| email | string | Yes | Must be a valid email address (`z.string().email()`) |
| password | string | Yes | Minimum 8 characters; the schema's custom message is the literal Czech-language string `"Minimálně 8 znaků"` |
| name | string | No | 1–80 characters when provided |

### Error Format

The actual shape returned by `POST /api/auth/register` on validation failure is:

```json
{
  "error": "Invalid input",
  "details": { }
}
```

where `details` is the object produced by Zod's `parsed.error.flatten()`. This differs from a nested `error.code` / `error.message` shape — `error` here is a flat string, and there is no `code` field.

### Common Error Codes

| Code | Meaning |
|------|---------|
| [NEEDS CLARIFICATION] | The register route returns free-text `error` strings (`"Invalid input"`, `"Email already exists"`), not an enumerated code scheme. No coded-error convention was found in the reviewed files. |

---

## Internationalization

### Overview

**i18n Required:** [NEEDS CLARIFICATION] The reviewed files show inconsistent language use rather than an established i18n strategy: all user-facing UI copy in `src/app/login/LoginClient.tsx` and `src/app/register/page.tsx` (e.g. "Login", "Sign in", "Register", "Invalid email or password") is in English, while the one server-side validation message in `src/app/api/auth/register/route.ts` (`"Minimálně 8 znaků"`) is in Czech. No i18n framework (e.g. `next-intl`, `react-i18next`) import was found in any of the seven files.

**Default Locale:** [NEEDS CLARIFICATION]

### Supported Locales

| Locale | Status |
|--------|--------|
| [NEEDS CLARIFICATION] | Not established — see the English/Czech inconsistency noted above. |

### Translatable Content

| Category | Examples |
|----------|----------|
| UI Labels | "Login", "Sign in", "Create new account" (`LoginClient.tsx`); "Register", "Create account", "I already have an account" (`register/page.tsx`) |
| Messages | "Invalid email or password" (`LoginClient.tsx`); "Registered, but login failed. Try logging in.", "Network error" (`register/page.tsx`); server-side "Minimálně 8 znaků" (`api/auth/register/route.ts`) |

### Locale-Specific Formatting

| Type | Varies By Locale |
|------|------------------|
| Dates | [NEEDS CLARIFICATION] — no date formatting occurs in the reviewed auth files. |
| Numbers | [NEEDS CLARIFICATION] |
| Currency | [NEEDS CLARIFICATION] |
