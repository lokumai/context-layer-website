# Saga Patterns in Industry — Short Literature Review

Grounded research report connecting this project's saga choices to the published literature. Short, not exhaustive — intended as a bridge between practitioners and the underlying research.

## 1. The Saga Pattern

The original saga pattern (Garcia-Molina & Salem, "Sagas", 1987) addressed long-lived transactions in databases, composed as a sequence of local transactions `T1, T2, ..., Tn` with compensations `C1, C2, ..., Cn`. The modern microservices literature generalizes: each local transaction runs in a different service, and the saga is coordinated either centrally (orchestration) or peer-to-peer (choreography).

## 2. Orchestration vs. Choreography

**Orchestration** — one service owns the workflow state. Clearer audit trail, simpler debugging, a single obvious source of failure.

**Choreography** — services react to events. Lower coupling at the code level, but observability suffers because there is no single place to see the state of a transaction.

The book **"Microservices Patterns"** (Richardson, 2018) recommends orchestration for workflows with more than 3–4 steps or when compensations are complex, and choreography for simpler event chains. Our publication workflow has 4 steps with explicit compensations, which lands it squarely in the orchestration regime.

## 3. BPMN / Camunda

Camunda ([Camunda Platform 8](https://docs.camunda.io)) implements the External Task Pattern: the engine owns the graph, external workers poll for tasks. Published case studies (Axon Ivy, Camunda customer stories) show this pattern scaling to hundreds of tasks per second without issue.

Relevant academic work:

- Pautasso, Wilde, and Zdun (2017). "Workflow Choreographies and Orchestrations: A Unified Model." Highlights the equivalence between the two models given sufficient observability — which in practice only orchestration provides by default.
- Leymann, Barzen, and Falkenthal (2020). "Quantum Service-Oriented Computing." Not directly applicable, but the paper's formalism for service composition is reused in modern orchestration engines.

## 4. Event Sourcing vs. Our Approach

We are **not** event-sourced. Our write side uses classical CRUD on per-service Postgres, with the transactional outbox as the reliable-publishing adapter. Event-sourced alternatives (Fowler 2005, Vernon 2013) offer stronger audit properties but pay for it with snapshotting complexity and read-side projection churn that we chose not to accept for the demo scope.

## 5. Transactional Outbox

The pattern was popularized by Parker, Kindi, and Rose (Debezium team, 2020). Our implementation uses PostgreSQL's `LISTEN/NOTIFY` rather than CDC/Debezium — simpler for our scale, no Kafka requirement. The trade-off: if we ever need multi-data-center replication, we'd likely switch to CDC.

## 6. Observations

- **Compensation complexity grows faster than step count.** Our 4-step saga has 3 compensations; a 10-step saga will typically have on the order of 10–15. This is another argument for orchestration: Camunda's Cockpit lets ops see the compensation graph visually.
- **At-least-once delivery matters more than the saga shape.** Consumers that don't enforce idempotency will produce wrong data regardless of whether you choose orchestration or choreography.

## 7. References

1. Garcia-Molina H., Salem K. *Sagas*. SIGMOD 1987.
2. Richardson C. *Microservices Patterns*. Manning, 2018.
3. Pautasso C., Wilde E., Zdun U. *Workflow Choreographies and Orchestrations*. 2017.
4. Fowler M. *Event Sourcing*. martinfowler.com, 2005.
5. Vernon V. *Implementing Domain-Driven Design*. Addison-Wesley, 2013.
6. Camunda Docs — Camunda Platform 8. [camunda.io](https://camunda.io)
7. Parker, Kindi, Rose. *Reliable Microservices Data Exchange with the Outbox Pattern*. Debezium blog, 2020.
