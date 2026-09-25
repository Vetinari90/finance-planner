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
    auth:
      - src/app/api/auth
      - src/app/login
      - src/app/register
      - src/app/logout
    plans:
      - src/app/api/plans
      - src/app/plans
    planned-items: src/app/api/plans/[planId]/items
    persistence: src/lib/db.ts
recipe-library:
  source: /opt/asr/workspace/364ff20d-60d0-41bc-a402-b80ba345622e/831187c8-70c2-4406-a502-a4dbe477b170/sdlc-artifact-templates/templates/mid
tree:
  - path: docs/
    children:
      - path: modules/
        children:
          - path: auth/
            children:
              - path: api.md
                recipe: docs/modules/_template/api.md
                children: []
              - path: behavior/
                children:
                  - path: credentials-sign-in.md
                    recipe: docs/modules/_template/behavior/_template.md
                    children: []
              - path: data-model.md
                recipe: docs/modules/_template/data-model.md
                children: []
              - path: deployment.md
                description: Deployment of the auth module.
                recipe: docs/modules/_template/deployment.md
                children: []
              - path: domain-model.md
                recipe: docs/modules/_template/domain-model.md
                children: []
              - path: overview.md
                recipe: docs/modules/_template/overview.md
                inputs:
                  references:
                    - README.md
                  module-docs:
                    - docs/modules/auth/overview.md
                    - docs/modules/plans/overview.md
                    - docs/modules/planned-items/overview.md
                    - docs/modules/web-ui/overview.md
                    - docs/modules/persistence/overview.md
                children: []
              - path: technical-concerns.md
                recipe: docs/modules/_template/technical-concerns.md
                children: []
              - path: testing.md
                recipe: docs/modules/_template/testing.md
                children: []
              - path: use-cases/
                children:
                  - path: register-account.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
                  - path: sign-in.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
                  - path: sign-out.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
          - path: persistence/
            children:
              - path: api.md
                description: Api of the persistence module.
                recipe: docs/modules/_template/api.md
                children: []
              - path: behavior/
                description: Behavior instances of the persistence module.
                recipe: docs/modules/_template/behavior/_template.md
                children: []
              - path: data-model.md
                recipe: docs/modules/_template/data-model.md
                children: []
              - path: deployment.md
                recipe: docs/modules/_template/deployment.md
                children: []
              - path: domain-model.md
                description: Domain Model of the persistence module.
                recipe: docs/modules/_template/domain-model.md
                children: []
              - path: overview.md
                recipe: docs/modules/_template/overview.md
                children: []
              - path: technical-concerns.md
                recipe: docs/modules/_template/technical-concerns.md
                children: []
              - path: testing.md
                recipe: docs/modules/_template/testing.md
                children: []
              - path: use-cases/
                description: Use Cases instances of the persistence module.
                recipe: docs/modules/_template/use-cases/_template.md
                children: []
          - path: planned-items/
            children:
              - path: api.md
                recipe: docs/modules/_template/api.md
                children: []
              - path: behavior/
                description: Behavior instances of the planned-items module.
                recipe: docs/modules/_template/behavior/_template.md
                children: []
              - path: data-model.md
                recipe: docs/modules/_template/data-model.md
                children: []
              - path: deployment.md
                description: Deployment of the planned-items module.
                recipe: docs/modules/_template/deployment.md
                children: []
              - path: domain-model.md
                recipe: docs/modules/_template/domain-model.md
                children: []
              - path: overview.md
                recipe: docs/modules/_template/overview.md
                children: []
              - path: technical-concerns.md
                recipe: docs/modules/_template/technical-concerns.md
                children: []
              - path: testing.md
                recipe: docs/modules/_template/testing.md
                children: []
              - path: use-cases/
                children:
                  - path: add-planned-item.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
                  - path: list-plan-items.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
          - path: plans/
            children:
              - path: api.md
                recipe: docs/modules/_template/api.md
                children: []
              - path: behavior/
                children:
                  - path: plan-lifecycle.md
                    recipe: docs/modules/_template/behavior/_template.md
                    children: []
              - path: data-model.md
                recipe: docs/modules/_template/data-model.md
                children: []
              - path: deployment.md
                description: Deployment of the plans module.
                recipe: docs/modules/_template/deployment.md
                children: []
              - path: domain-model.md
                recipe: docs/modules/_template/domain-model.md
                children: []
              - path: overview.md
                recipe: docs/modules/_template/overview.md
                children: []
              - path: technical-concerns.md
                recipe: docs/modules/_template/technical-concerns.md
                children: []
              - path: testing.md
                recipe: docs/modules/_template/testing.md
                children: []
              - path: use-cases/
                children:
                  - path: create-monthly-plan.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
                  - path: delete-plan.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
                  - path: list-plans.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
                  - path: view-plan-detail.md
                    recipe: docs/modules/_template/use-cases/_template.md
                    children: []
          - path: web-ui/
            children:
              - path: testing.md
                recipe: docs/modules/_template/testing.md
                children: []
              - path: overview.md
                recipe: docs/modules/_template/overview.md
                children: []
              - path: technical-concerns.md
                recipe: docs/modules/_template/technical-concerns.md
                children: []
              - path: behavior/
                children:
                  - path: server-client-rendering.md
                    recipe: docs/modules/_template/behavior/_template.md
                    children: []
      - path: risks.md
        inputs:
          references: []
          module-docs:
            - docs/modules/auth/technical-concerns.md
            - docs/modules/plans/technical-concerns.md
            - docs/modules/planned-items/technical-concerns.md
            - docs/modules/web-ui/technical-concerns.md
            - docs/modules/persistence/technical-concerns.md
            - docs/modules/auth/testing.md
            - docs/modules/plans/testing.md
            - docs/modules/planned-items/testing.md
            - docs/modules/web-ui/testing.md
            - docs/modules/persistence/testing.md
        children: []
      - path: business/
        children:
          - path: user-journeys/
            children:
              - path: _template.md
                children: []
              - path: plan-a-month.md
                recipe: docs/business/user-journeys/_template.md
                children: []
              - path: first-time-signup.md
                recipe: docs/business/user-journeys/_template.md
                children: []
          - path: business-context.md
            children: []
      - path: decisions/
        children:
          - path: _template.md
            children: []
          - path: 0004-store-money-as-integer-cents.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0001-credentials-auth-jwt-sessions.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0003-prisma-postgresql-with-pg-adapter.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0005-scope-all-queries-by-session-user.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0001-nextjs-app-router-fullstack-monolith.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0002-credentials-provider-with-jwt-sessions.md
            recipe: docs/decisions/_template.md
            children: []
          - path: 0006-zod-request-validation-at-route-boundary.md
            recipe: docs/decisions/_template.md
            children: []
      - path: glossary.md
        inputs:
          references: []
          module-docs:
            - docs/modules/plans/domain-model.md
            - docs/modules/plans/data-model.md
            - docs/modules/planned-items/domain-model.md
            - docs/modules/planned-items/data-model.md
            - docs/modules/auth/domain-model.md
            - docs/modules/persistence/data-model.md
        children: []
      - path: operations/
        children:
          - path: ci-cd.md
            children: []
          - path: runbooks/
            children:
              - path: _template.md
                children: []
              - path: vercel-deploy.md
                recipe: docs/operations/runbooks/_template.md
                children: []
              - path: backup-restore.md
                recipe: docs/operations/runbooks/_template.md
                children: []
              - path: secret-rotation.md
                recipe: docs/operations/runbooks/_template.md
                children: []
              - path: database-migration.md
                recipe: docs/operations/runbooks/_template.md
                children: []
              - path: rotate-auth-secret.md
                recipe: docs/operations/runbooks/_template.md
                children: []
              - path: local-environment-setup.md
                recipe: docs/operations/runbooks/_template.md
                children: []
          - path: infrastructure.md
            children: []
          - path: incident-response.md
            children: []
      - path: overview.md
        children: []
      - path: requirements/
        children:
          - path: _template.md
            children: []
          - path: business-rules.md
            recipe: docs/requirements/_template.md
            children: []
          - path: non-functional.md
            recipe: docs/requirements/_template.md
            children: []
          - path: functional-account-access.md
            recipe: docs/requirements/_template.md
            children: []
          - path: functional-monthly-planning.md
            recipe: docs/requirements/_template.md
            children: []
      - path: cross-cutting/
        children:
          - path: security.md
            children: []
          - path: standards.md
            children: []
          - path: threat-model.md
            recipe: docs/cross-cutting/security.md
            children: []
          - path: configuration.md
            recipe: docs/cross-cutting/standards.md
            children: []
          - path: data-handling.md
            recipe: docs/cross-cutting/security.md
            children: []
          - path: error-handling.md
            recipe: docs/cross-cutting/standards.md
            children: []
          - path: api-conventions.md
            recipe: docs/cross-cutting/standards.md
            children: []
      - path: integration-tests/
        children:
          - path: _template.md
            children: []
          - path: auth-to-plans-flow.md
            recipe: docs/integration-tests/_template.md
            children: []
          - path: plan-item-lifecycle.md
            recipe: docs/integration-tests/_template.md
            children: []
          - path: cross-user-isolation.md
            recipe: docs/integration-tests/_template.md
            children: []
          - path: authorization-isolation.md
            recipe: docs/integration-tests/_template.md
            children: []
      - path: executive-summary.md
        inputs:
          references:
            - README.md
          module-docs:
            - docs/modules/auth/overview.md
            - docs/modules/plans/overview.md
            - docs/modules/planned-items/overview.md
            - docs/modules/web-ui/overview.md
            - docs/modules/persistence/overview.md
        children: []
      - path: quality-attributes.md
        inputs:
          references: []
          module-docs:
            - docs/modules/auth/technical-concerns.md
            - docs/modules/plans/technical-concerns.md
            - docs/modules/planned-items/technical-concerns.md
            - docs/modules/web-ui/technical-concerns.md
            - docs/modules/persistence/technical-concerns.md
            - docs/modules/persistence/deployment.md
        children: []
      - path: technology-context.md
        inputs:
          references:
            - README.md
          module-docs:
            - docs/modules/web-ui/technical-concerns.md
            - docs/modules/persistence/technical-concerns.md
            - docs/modules/persistence/deployment.md
            - docs/modules/auth/technical-concerns.md
            - docs/modules/plans/technical-concerns.md
            - docs/modules/planned-items/technical-concerns.md
        children: []
---
