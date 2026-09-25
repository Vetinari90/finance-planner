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

# Risks

## risks.md

<!-- SLOT:content brief="Document content (risks.md)" -->
This document synthesizes technical and testing risks across the finance-planner modules, drawn exclusively from each module's `technical-concerns.md` and `testing.md` documentation (auth, plans, planned-items, web-ui, persistence). No additional source code or reference material was read to produce this synthesis.

## Documentation Coverage Gap

[NEEDS CLARIFICATION] The `technical-concerns.md` and `testing.md` documents for the **planned-items** and **persistence** modules (`docs/modules/planned-items/technical-concerns.md`, `docs/modules/planned-items/testing.md`, `docs/modules/persistence/technical-concerns.md`, `docs/modules/persistence/testing.md`) had not been authored at the time this synthesis was produced (each contains only the `[UNFILLED]` sentinel). No risk content could be derived for these two modules. This document should be regenerated once those module docs are filled in.
[NEEDS CLARIFICATION] [REVIEW] consistency: risks.md's Documentation Coverage Gap claims the planned-items and persistence technical-concerns.md/testing.md files each contain only an `[UNFILLED]` sentinel and were not authored, but those four files (readable in docs/modules/) are fully authored with substantive Caching/Data Validation/Testing/CI-CD sections - this contradicts the other generated docs in the same doc set.
[NEEDS CLARIFICATION] [REVIEW] completeness: Risk Register omits planned-items and persistence entirely, citing missing module docs, but the actual source code for both modules (items/route.ts, db.ts, requireUser.ts) is present among this doc's own code inputs, so risk-relevant facts (e.g. no caching in db.ts, flat non-coded error shape in items/route.ts, DATABASE_URL-unset failure mode) could have been derived directly from code rather than left as an unfilled gap.
[NEEDS CLARIFICATION] [REVIEW] accuracy: Claims the planned-items and persistence technical-concerns.md/testing.md files 'had not been authored' and 'each contains only the [UNFILLED] sentinel'. This is factually wrong: all four files exist and are fully authored with substantive, module-specific content (caching, validation layers, field rules, error formats, test levels/categories/scenarios, etc.), not a bare sentinel.

## Risk Register

| ID | Risk | Affected Module(s) | Severity (qualitative) | Evidence |
|----|------|---------------------|-------------------------|----------|
| R1 | No automated test files, test-runner configuration, or CI/CD pipeline configuration were found for auth, plans, or web-ui; test scenarios in each module's `testing.md` are proposed candidates, not confirmed existing tests. | auth, plans, web-ui | High | `docs/modules/auth/testing.md`, `docs/modules/plans/testing.md`, `docs/modules/web-ui/testing.md` all state "No test files... were present" and "No CI/CD configuration file was present." |
| R2 | Database-level constraint enforcement (e.g. a unique index on `(userId, year, month)` for plans) is inferred only from observed HTTP `409` handling, not confirmed against a Prisma schema file, which was outside the reviewed modules' input scope. | plans | Medium | `docs/modules/plans/technical-concerns.md`, "Database | [NEEDS CLARIFICATION] Constraint enforcement... is inferred only from the `409` handling... the schema itself is not in this module's inputs." |
| R3 | API error response shape is inconsistent with a generic structured-error convention (`error.code`/`error.message`/`error.details`): both auth and plans return a flat `{ "error": "<string>", "details": {...} }` shape, and there is no enumerated error-code scheme in either module. Consumers written against a coded-error contract could mishandle these responses. | auth, plans | Medium | `docs/modules/auth/technical-concerns.md` ("Common Error Codes" table: "The register route returns free-text `error` strings... not an enumerated code scheme"); `docs/modules/plans/technical-concerns.md` ("Both plans API routes return a flat error shape, not the recipe's generic `error.code`/`error.message`/`error.details` envelope"). |
| R4 | Client-side item-amount validation in the plans module (`AddItemForm.tsx` regex `^(\d+)(\.(\d{1,2})?)?$`) is stated to be re-validated server-side in the planned-items module, but the planned-items module's own technical-concerns/testing documentation is not yet available (see Documentation Coverage Gap above), so this server-side re-validation claim is unconfirmed from this synthesis's inputs. | plans, planned-items | Medium | `docs/modules/plans/technical-concerns.md`: "This is client-side only in this module's files; server-side re-validation of the amount happens in the planned-items module, outside this manifest." |
[NEEDS CLARIFICATION] [REVIEW] consistency: R4 asserts the planned-items module's technical-concerns/testing docs are unavailable to confirm server-side amount re-validation, but docs/modules/planned-items/technical-concerns.md is authored and documents an `amountCents` Zod validation rule (integer, minimum 0), contradicting the 'not yet available' premise.
[NEEDS CLARIFICATION] [REVIEW] accuracy: R4 asserts the server-side re-validation claim is 'unconfirmed' because planned-items documentation 'is not yet available', but docs/modules/planned-items/technical-concerns.md is fully authored and does document server-side validation (Zod CreateItemSchema, amountCents integer/minimum 0), so this risk's premise is inaccurate.
| R5 | Inconsistent language usage across user-facing and server-facing text: UI copy in the auth and plans modules is hardcoded English, while one server-side validation message in auth (`"Minimálně 8 znaků"`) is Czech, and no i18n framework is used anywhere in the reviewed modules. This is documented as an inconsistency rather than a deliberate localization strategy. | auth, plans, web-ui | Low | `docs/modules/auth/technical-concerns.md` ("Internationalization" section, "inconsistent language use rather than an established i18n strategy"); `docs/modules/plans/technical-concerns.md` (same finding, plus Czech-language developer comments); `docs/modules/web-ui/technical-concerns.md` ("whether i18n is planned or required is not evidenced"). |
| R6 | The web-ui module's page metadata (`title: "Create Next App"`, `description: "Generated by create next app"` in `src/app/layout.tsx`) matches `create-next-app` scaffold defaults rather than application-specific content; whether this is intentional or an unreplaced placeholder is unresolved. | web-ui | Low | `docs/modules/web-ui/technical-concerns.md`: "[NEEDS CLARIFICATION] whether these are the intended production values for finance-planner or leftover `create-next-app` scaffold defaults was not resolvable from the reviewed inputs." |
| R7 | No caching layer, technology, or monitoring is evidenced in any of the three reviewed modules (auth, plans, web-ui); whether this is an intentional architectural choice or a gap could not be determined from the reviewed documentation. | auth, plans, web-ui | Low | `docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`, `docs/modules/web-ui/technical-concerns.md` (all "Caching" sections report no caching evidence). |

## Testing Risk Summary

- **auth**: No test files present in the module's inputs; proposed unit/integration/E2E scenarios exist only as documentation candidates. Test environment dependency on a Prisma-backed database is explicitly deferred to the persistence module, whose testing documentation is not yet available (Documentation Coverage Gap above).
- **plans**: No test files, no test runner configuration referenced in `README.md`. Candidate scenarios cover create/list/view/delete plan flows and validation boundaries (`year` 2000-2100, `month` 1-12, 3-character `currency`), but none are confirmed as implemented tests.
- **web-ui**: No test files or test-framework configuration found. The only documented behavior candidate for testing is the root-route session redirect (`src/app/page.tsx`) to `/plans` or `/login`.
- **planned-items / persistence**: [NEEDS CLARIFICATION] Testing risk cannot be assessed; `docs/modules/planned-items/testing.md` and `docs/modules/persistence/testing.md` are unfilled.
[NEEDS CLARIFICATION] [REVIEW] consistency: This line states the planned-items and persistence testing.md files are unfilled, but both files contain full authored content (test levels, categories, key scenarios, etc.), contradicting the claim and the parallel claim in the Documentation Coverage Gap section.
[NEEDS CLARIFICATION] [REVIEW] completeness: The Testing Risk Summary declares planned-items/persistence testing risk entirely unassessable, but items/route.ts (a provided codeFile) exposes concrete testable branches (auth failure, ownership failure, validation failure, happy path) that mirror the level of detail given for auth/plans/web-ui elsewhere in this same document, so this section under-covers material that was available.
[NEEDS CLARIFICATION] [REVIEW] accuracy: Repeats the same inaccurate 'unfilled' claim in the Testing Risk Summary: both docs/modules/planned-items/testing.md and docs/modules/persistence/testing.md are fully authored (e.g. planned-items/testing.md lists concrete happy-path and authorization/validation-failure test cases), so testing risk for these modules could in fact be assessed from available inputs.

## Recommended Follow-Up

[NEEDS CLARIFICATION] No explicit risk-mitigation plan, remediation owner, or target timeline was present in the reviewed module documentation or in this node's declared references. A prioritized remediation plan (e.g. establishing a test suite and CI/CD pipeline before production release) would need to be confirmed with the project stakeholders.
<!-- /SLOT:content -->
