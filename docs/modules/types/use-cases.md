---
type: use-cases
audience: [developer]
language: en
links: [docs/modules/types/README.md]
generated_from: c0f516fbb011babec018d5dc5191924f7ca3fed2
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:68be7ab88910ec0e327eb9a9a2cf9f641568123d13e77fa409d08720e56f824d
---

# Use Cases

## UC-001: Type-Safe Session User Id Access

**Actor:** Developer / TypeScript compiler

**Steps:**
1. The module augments `next-auth`'s `Session` interface via `declare module "next-auth"` (`src/types/next-auth.d.ts`), adding `user: { id: string; name?: string | null; email?: string | null }`.
2. Code across the app and lib modules (e.g. `src/lib/auth.ts`, `src/lib/requireUser.ts`, `src/app/plans/page.tsx`) reads `session.user.id` and `session.user.email`.
3. The TypeScript compiler type-checks these reads against the augmented interface rather than the base `next-auth` `Session` type.

**Expected Result:** Any code that reads `session.user.id` is type-checked at compile time, without needing a manual type assertion or `any` cast.
