---
type: use-cases
audience: [developer]
language: en
links: []
generated_from: 0b7a27903123c3dfbbd218b19f18de5be68d5d28
generated_by: sdlc-doc-toolkit@3.89.0
generated_branch: main
generated_inputs: sha256:458bf88c80431f3d037bd6cc625590bac268ac93527295dbdd7f2b62ac372b58
---

# Use Cases

## UC-001: Developer accesses `session.user.id` with type safety

**Actor:** Developer / TypeScript compiler

**Steps:**
1. Code calls `getServerSession(authOptions)`.
2. The result's `session.user.id` is accessed (e.g. `src/lib/requireUser.ts`, `src/app/plans/page.tsx`).
3. The TypeScript compiler resolves `id` against the augmented `Session` interface declared in `src/types/next-auth.d.ts`.

**Expected Result:** No TypeScript error is raised for `session.user.id`. Without this augmentation, the default `next-auth` `Session.user` type would not include an `id` field.
