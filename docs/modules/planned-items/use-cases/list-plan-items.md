---
type: use-case
audience: [developer, qa, business]
language: en
links: []
generated_from: 39f2f753a6dbde2c5b34c6281adeeab77b7a87d5
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# UC-002: List Plan Items

## Summary

[NEEDS CLARIFICATION] No route handler for listing the planned items of a plan (e.g. a `GET /api/plans/{planId}/items` handler) was present in this module's inputs (`src/app/api/plans/[planId]/items` contained only `route.ts` with a `POST` handler). This use case is declared in the documentation tree but could not be grounded in this dispatch's inputs.

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| [NEEDS CLARIFICATION] | Primary | Presumed to be the authenticated owner of the plan, by analogy with the grounded `POST` handler, but not confirmed |

## Preconditions

[NEEDS CLARIFICATION] Not grounded in inputs.
[NEEDS CLARIFICATION] [REVIEW] completeness: The Main Flow (and similarly Preconditions/Postconditions/Alternative Flows/Error Handling) sections are left as bare 'not grounded' placeholders, but src/app/plans/[planId]/page.tsx contains a grounded listing flow: it queries the plan with its items (ordered by createdAt asc) scoped to the authenticated userId, returns 404 via notFound() if the plan isn't found/owned, and renders the items (title, note, amount) with a computed total. This input-evident material is absent from the documented flow sections despite being available in codeFiles.

## Postconditions

[NEEDS CLARIFICATION] Not grounded in inputs.

## Main Flow

[NEEDS CLARIFICATION] Not grounded in inputs.

## Alternative Flows

[NEEDS CLARIFICATION] Not grounded in inputs.

## Error Handling

[NEEDS CLARIFICATION] Not grounded in inputs.

## Acceptance Criteria

[NEEDS CLARIFICATION] Not grounded in inputs; no listing endpoint was present in the code available to this dispatch.
