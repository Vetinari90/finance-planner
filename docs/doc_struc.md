---
schema-version: '3.0'
project: finance-planner
language: en
inputs:
  code:
    - src/app
    - src/lib
    - src/types
  references:
    - README.md
generation:
  ai-mode: autonomous
  audience-default: developer
  per-node-scoping: true
  module-source-map:
    app: src/app
    lib: src/lib
    types: src/types
recipe-library:
  source: /opt/asr/workspace/aa0a3e85-8497-42c0-9178-6ce61189bb95/64a10439-b998-4434-9fd0-dcccb8e98fc0/sdlc-artifact-templates/templates/min
tree:
  - path: docs/
    children:
      - path: modules/
        children:
          - path: app/
            description: Documentation for the app module.
            children:
              - path: README.md
                description: README of the app module.
                recipe: docs/modules/_template/README.md
                children: []
              - path: technical.md
                description: Technical of the app module.
                recipe: docs/modules/_template/technical.md
                children: []
              - path: use-cases.md
                description: Use Cases of the app module.
                recipe: docs/modules/_template/use-cases.md
                children: []
          - path: lib/
            description: Documentation for the lib module.
            children:
              - path: README.md
                description: README of the lib module.
                recipe: docs/modules/_template/README.md
                children: []
              - path: technical.md
                description: Technical of the lib module.
                recipe: docs/modules/_template/technical.md
                children: []
              - path: use-cases.md
                description: Use Cases of the lib module.
                recipe: docs/modules/_template/use-cases.md
                children: []
          - path: types/
            description: Documentation for the types module.
            children:
              - path: README.md
                description: README of the types module.
                recipe: docs/modules/_template/README.md
                children: []
              - path: technical.md
                description: Technical of the types module.
                recipe: docs/modules/_template/technical.md
                children: []
              - path: use-cases.md
                description: Use Cases of the types module.
                recipe: docs/modules/_template/use-cases.md
                children: []
      - path: decisions/
        inputs:
          references:
            - README.md
          module-docs:
            - docs/modules/app/README.md
            - docs/modules/app/technical.md
            - docs/modules/lib/README.md
            - docs/modules/lib/technical.md
        children:
          - path: _template.md
            children: []
          - path: 0001-security-baseline.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0005-per-user-tenant-isolation.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0003-store-money-as-integer-cents.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0001-prisma-driver-adapter-postgresql.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0004-zod-validation-and-error-envelope.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0002-credentials-auth-with-jwt-sessions.md
            recipe: docs/decisions/_template.md
            children: []
      - path: overview.md
        inputs:
          references:
            - README.md
          module-docs:
            - docs/modules/app/README.md
            - docs/modules/app/technical.md
            - docs/modules/app/use-cases.md
            - docs/modules/lib/README.md
            - docs/modules/lib/technical.md
            - docs/modules/types/README.md
        children: []
      - path: security.md
        recipe: docs/standards.md
        inputs:
          references: []
          module-docs:
            - docs/modules/lib/README.md
            - docs/modules/lib/technical.md
            - docs/modules/app/README.md
            - docs/modules/app/technical.md
        children: []
      - path: standards.md
        inputs:
          references: []
          module-docs:
            - docs/modules/app/technical.md
            - docs/modules/lib/README.md
            - docs/modules/lib/technical.md
            - docs/modules/app/README.md
        children: []
      - path: data-model.md
        recipe: docs/modules/_template/README.md
        inputs:
          references: []
          module-docs:
            - docs/modules/lib/README.md
            - docs/modules/lib/technical.md
            - docs/modules/app/README.md
        children: []
      - path: data-protection.md
        recipe: docs/standards.md
        inputs:
          references: []
          module-docs:
            - docs/modules/lib/technical.md
            - docs/modules/app/technical.md
        children: []
---
