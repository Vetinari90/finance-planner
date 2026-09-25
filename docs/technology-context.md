---
type: documentation
audience: [developer]
language: en
links: []
generated_from: c463ecf1207700db0662008d5c205be97027b77e
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: sdlc/20260925-1148
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Technology Context

## technology-context.md

<!-- SLOT:content brief="Document content (technology-context.md)" -->
## Summary

The finance-planner application is a [Next.js](https://nextjs.org) project bootstrapped with `create-next-app` (`README.md`). It is deployed on the Vercel platform (`README.md`, "Deploy on Vercel" section). At the module level, request-body validation across the reviewed modules is performed with Zod, and the plans module's data-access errors indicate use of the Prisma ORM. Several other technology-context inputs (the persistence module's technical concerns and deployment docs, the planned-items module's technical concerns doc, and the web-ui module's technical concerns doc) were not yet generated at the time this document was produced and are marked below.

## Technology Stack

### Application Framework

- **Framework:** Next.js, bootstrapped via `create-next-app` (`README.md`).
- **Font optimization:** `next/font`, loading the Geist font family (`README.md`).
- [NEEDS CLARIFICATION] The specific Next.js version, the routing mode (Pages Router vs. App Router), and the React version are not stated in `README.md` or in any of the available module technical-concerns docs (`docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`).

### Request Validation

- **Library:** Zod.
  - Auth module: `RegisterSchema` validates the registration request body in `POST /api/auth/register` (`docs/modules/auth/technical-concerns.md`).
  - Plans module: `CreatePlanSchema` validates `title`, `year`, `month`, and `currency` on `POST /api/plans` (`docs/modules/plans/technical-concerns.md`).
- [NEEDS CLARIFICATION] Whether Zod (or any other validation library) is used at the API boundary of the planned-items and web-ui modules cannot be confirmed: `docs/modules/planned-items/technical-concerns.md` and `docs/modules/web-ui/technical-concerns.md` are unfilled at the time of this generation.

### Persistence / Data Access

- **ORM:** Prisma is used for data access in the plans module; the `POST /api/plans` handler's `409` response is described as resulting from "Prisma create failed (inferred unique constraint)" (`docs/modules/plans/technical-concerns.md`).
- [NEEDS CLARIFICATION] The underlying database engine, connection/pooling configuration, and any backup or migration tooling cannot be confirmed here: `docs/modules/persistence/technical-concerns.md` and `docs/modules/persistence/deployment.md` are both unfilled at the time of this generation.

### Authentication / Session Handling

- The plans module's route handlers call a `requireUserId()` helper to establish the current user and return `401 Unauthorized` when it yields no user (`docs/modules/plans/technical-concerns.md`).
- The auth module's registration flow validates credentials via Zod and references an `authOptions` object described as containing "credential-verification logic" (`docs/modules/auth/technical-concerns.md`), but that doc explicitly notes the object itself is outside its dispatch's reviewed files.
- [NEEDS CLARIFICATION] The specific authentication technology or library (e.g., a named session/JWT provider) backing `requireUserId()` and `authOptions` is not named in either available technical-concerns doc.

### Caching

- Neither of the two available technical-concerns docs found a caching layer: the auth module doc states no Redis client, in-memory cache, or CDN header was found in its reviewed files, and the plans module doc likewise found no caching layer, `Cache-Control` header, or in-memory/Redis client, noting instead that `NewPlanForm.tsx` and `DeletePlanButton.tsx` call `router.refresh()` to re-fetch server data after a mutation (`docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`).
- [NEEDS CLARIFICATION] Whether the persistence or web-ui modules introduce caching cannot be confirmed: their technical-concerns docs are unfilled at the time of this generation.

### Internationalization

- Both available technical-concerns docs flag inconsistent, rather than deliberate, language handling: the auth module doc notes English UI copy alongside one Czech-language server-side validation message ("Minimálně 8 znaků"), and the plans module doc similarly notes hardcoded English UI strings alongside Czech-language source comments. Neither doc found an i18n framework import (e.g. `next-intl`, `react-i18next`) (`docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`).
- [NEEDS CLARIFICATION] No default locale or i18n strategy is established in either available doc.

## Deployment Platform

- The recommended deployment target is the Vercel platform, per the README's "Deploy on Vercel" section, which points to the Vercel "Next.js deployment documentation" (`README.md`).
- [NEEDS CLARIFICATION] Whether this project is actually deployed to Vercel in practice (as opposed to the README's generic `create-next-app` boilerplate guidance), and any project-specific deployment configuration, cannot be confirmed: `docs/modules/persistence/deployment.md` is unfilled at the time of this generation, and no other deployment-specific reference was supplied to this node.

## External Systems and Dependencies

[NEEDS CLARIFICATION] No external system, third-party API, or managed service (other than the Vercel hosting platform and the `next/font` Geist font mentioned in `README.md`) is named in the inputs available to this node (`README.md`, `docs/modules/auth/technical-concerns.md`, `docs/modules/plans/technical-concerns.md`). Confirming any additional external dependencies would require the persistence, planned-items, and web-ui module docs, which are unfilled.

## Inputs Not Yet Available

The following module-docs named as inputs to this synthesis node had not been generated (they remain unfilled `[UNFILLED]` skeletons) at the time this document was produced, and their content could therefore not be incorporated:

- `docs/modules/persistence/technical-concerns.md`
- `docs/modules/persistence/deployment.md`
- `docs/modules/planned-items/technical-concerns.md`
- `docs/modules/web-ui/technical-concerns.md`

[NEEDS CLARIFICATION] Regenerate or re-run this synthesis node once the modules above have been generated, so their content can be incorporated into the technology context.
<!-- /SLOT:content -->
