---
type: documentation
audience: [developer]
language: en
links: []
generated_from: 983341781c05105b2104725ca48c43ffa23ea03a
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technical Concerns

## technical-concerns.md

<!-- SLOT:content brief="Document content (technical-concerns.md)" -->
### Caching

**Caching Enabled:** No. No caching layer, `Cache-Control` header, or in-memory/Redis client is present in `src/app/api/plans/route.ts`, `src/app/api/plans/[planId]/route.ts`, or the plans UI files. `NewPlanForm.tsx` and `DeletePlanButton.tsx` call `router.refresh()` to re-fetch server data after a mutation instead of relying on a client cache.

### Data Validation

#### Validation Layers

| Layer | Responsibility (as observed) |
|-------|-------------------------------|
| API | `CreatePlanSchema` (Zod, in `src/app/api/plans/route.ts`) validates `title`, `year`, `month`, `currency` on `POST /api/plans` |
| Client | `AddItemForm.tsx` validates the amount format client-side with a regex (`^(\d+)(\.(\d{1,2})?)?$`) before submitting |
| Database | [NEEDS CLARIFICATION] Constraint enforcement (e.g. the presumed unique index on `(userId, year, month)`) is inferred only from the `409` handling in `POST /api/plans`; the schema itself is not in this module's inputs |

#### Field Validation Rules

##### Plan (`CreatePlanSchema`, `src/app/api/plans/route.ts`)

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| title | string | No | min 1, max 80 chars when present |
| year | number (int) | Yes | min 2000, max 2100 |
| month | number (int) | Yes | min 1, max 12 |
| currency | string | No | exactly 3 chars; defaults to `"CZK"` |

##### Item amount (`AddItemForm.tsx`, client-side only)

The `toCents()` helper accepts values matching `/^(\d+)(\.(\d{1,2})?)?$/` after normalizing a comma decimal separator to a dot, and rejects (with the message "Amount must be a number with max 2 decimals (e.g. 1200 or 1200.50)") anything else. This is client-side only in this module's files; server-side re-validation of the amount happens in the planned-items module, outside this manifest.

### Error Format

Both plans API routes return a flat error shape, not the recipe's generic `error.code`/`error.message`/`error.details` envelope:

```json
{
  "error": "Invalid input",
  "details": { "fieldErrors": { "year": ["..."] } }
}
```

`details` is present only on the `400` response from `POST /api/plans` (`parsed.error.flatten()`); all other error responses (`401`, `404`, `409`) return only `{ "error": "<message>" }`.

### Common Error Codes (HTTP status + message, not a symbolic code)

| Status | Message | Meaning |
|--------|---------|---------|
| 400 | `Invalid input` | Zod validation failed on `POST /api/plans` |
| 401 | `Unauthorized` | `requireUserId()` returned no user |
| 404 | `Not found` | Plan not found for `{ id, userId }` |
| 409 | `Plan for this month already exists` | Prisma create failed (inferred unique constraint) |

### Internationalization

**i18n Required:** [NEEDS CLARIFICATION] No i18n framework (e.g. `next-intl`, `react-i18next`) is imported by any file in this module. All user-facing UI strings observed (`"Your plans"`, `"Create new plan"`, `"Add item"`, `"Delete plan"`, `"No plans yet. Create one above."`, etc., in `src/app/plans/page.tsx`, `NewPlanForm.tsx`, `AddItemForm.tsx`) are hardcoded English literals.

**Default Locale:** [NEEDS CLARIFICATION] Not configured in this module; only inferred from the hardcoded English strings.

Note: several source code comments in this module are written in Czech (e.g. `AddItemForm.tsx`: `// jednoduchý převod: "123.45" -> 12345 (bez magických floatů)`; `src/app/api/plans/route.ts`: `// unikát (userId, year, month)`). These are developer-facing comments, not user-facing translated strings, and do not indicate an i18n mechanism.
<!-- /SLOT:content -->
