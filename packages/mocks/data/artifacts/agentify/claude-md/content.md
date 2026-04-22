# CLAUDE.md

Claude-specific conventions for the Microservices Product Catalog workspace.

## Project Essentials

- Monorepo with 9 logical sources (7 Python services + 1 Next.js app + 1 shared Python library).
- Read `docs/wiki/workspace/narrative.md` before making architectural judgments.

## Commands You'll Use

- **Install**: `bun install` (frontend) and `uv sync` (Python services).
- **Run stack**: `make infra-up && make dev`.
- **Run tests in one service**: `cd services/<name> && pytest`.
- **Run frontend tests**: `bun run test` in `web-ui/`.
- **Lint**: `make lint` (runs `ruff` + `biome`).
- **Format**: `make format`.
- **Type-check**: `make type-check` (runs `mypy` per service + `tsc` in frontend).

## Code Style

- Python: ruff-formatted, 88-col, type-hinted everywhere. No `Any` without a reason.
- TypeScript: biome-formatted, 100-col, `strict: true`. No `any`; use `unknown` plus narrowing.
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).

## Architectural Boundaries

Respect the three-layer split: domain → application → infrastructure. The domain layer must not import FastAPI, SQLAlchemy, or any framework. The application layer can import from the domain but not from FastAPI. Only the infrastructure layer touches frameworks.

Every write service imports `common.*` from `libs/common-python`. Don't duplicate chassis logic.

## Where To Put Things

- **A new endpoint on an existing service** → `services/<name>/src/main.py` + handler in the application layer.
- **A new write event** → emit via the outbox, never directly to RabbitMQ. Add the payload to the shared schema docs (`docs/events/`).
- **A new read-side projection** → consumer under `services/store-query-service/src/infrastructure/consumers/` + projection in `.../application/projections/`.
- **A new chassis utility** → `libs/common-python/src/common/<module>.py` + add exports to `__init__.py`.
- **A new saga** → BPMN under `services/offering-service/bpmn/` plus a dedicated external-task worker in each participating service.

## What To Test

- **Domain logic** — always, in unit tests, no mocks needed.
- **Outbox emission** — always, in an integration test that asserts a row appears in the outbox table.
- **Saga compensation** — always, in component tests with stubbed Camunda.
- **Search / projection** — always, with source services mocked via httpx.

## Things To Avoid

- Don't add a new synchronous HTTP dependency from a write service to another write service without a compensation plan.
- Don't write domain code in `main.py`.
- Don't bypass the chassis by importing RabbitMQ or JWT libraries directly.
- Don't commit RSA keys.

## Fast Answers

- **"How does publication work?"** → `docs/wiki/workspace/saga-flows.md`.
- **"Why does store-query fetch via HTTP instead of using event payloads?"** → to avoid stale projections on out-of-order events. See the store-query wiki.
- **"Why aren't payloads versioned?"** → known gap, tracked in tech-debt-audit.
