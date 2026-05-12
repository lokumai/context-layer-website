# Demo Stories: "Without vs. With" Context Layer

This document provides step-by-step copy-paste scripts to demonstrate the value of the Context Layer. To make the contrast clear, we use a **Siloed Agent Persona** to simulate the friction of a real enterprise environment.

---

## Setup

### 1. Start the Context Layer server

From the `context-layer-website` repo:

```sh
bun dev
# MCP server starts automatically on http://localhost:8765/mcp
```

### 2. Register the MCP server with Claude Code

```sh
claude mcp add --transport http context-layer http://localhost:8765/mcp
```

Verify: `claude mcp list` → `context-layer … ✓ Connected`

### 3. Open the demo target repo

```sh
cd /path/to/microservices-product-catalog
claude  # opens Claude Code in that repo
```

### 4. Brief the agent with the Siloed Persona

Paste the `--- BEGIN SILOED-AGENT-PERSONA ---` block from [`AGENTS.md`](../AGENTS.md) into the Claude Code prompt. This puts the agent in "Without" mode.

---

## 🎭 The "Siloed Agent" Setup

Before running these stories, ensure the AI agent (Claude Code, Cursor, etc.) is briefed with the **Siloed Agent Persona** defined in [`AGENTS.md`](../AGENTS.md). 

> [!IMPORTANT]
> In "Without" mode, the agent MUST act as if it's blind to sibling directories and sibling repositories. It should complain about the lack of visibility and refuse to make guesses.

---

## 📖 Story 1: The "Blind" Saga Trace (Multi-Repo Visibility)

**Goal:** Show how Context Layer links "invisible" logic across repositories.

### Phase A: WITHOUT Context Layer
**Prompt:**
> "I'm working in `api-gateway`. I see that when a new order is placed, an `ORDER_CREATED` event is emitted. Can you trace exactly which service consumes this event and what logic it triggers?"

**Expected Agent Behavior:**
- Agent looks only inside `api-gateway`.
- Agent finds the event emission code.
- Agent says: *"I see the event `ORDER_CREATED` being emitted here, but since I'm siloed in this repository, I have no visibility into other services. I don't know who consumes it. In a real environment, I'd have to manually search dozens of other repos or ask a senior dev. I'm stuck."*

### Phase B: WITH Context Layer
**Prompt:**
> "Use Context Layer. Check the Workspace Narrative to trace the `ORDER_CREATED` event."

**Action:** Agent calls `get_wiki_content(scope: "workspace")`.

**Expected Agent Behavior:**
- Agent reads the Workspace Narrative / Saga Flows.
- Agent says: *"Now that I have the Context Layer's workspace-wide view, I can see that `ORDER_CREATED` is consumed by the `inventory-service`. It triggers the `ReserveStockHandler`. I also notice that the `billing-service` was supposed to listen for this but doesn't have a handler registered. I've identified a cross-repo bug that was invisible before."*

---

## 🛡️ Story 2: The "Multi-Repo Minefield" (Security & Health)

**Goal:** Show strategic governance that a per-repo AI cannot see.

### Phase A: WITHOUT Context Layer
**Prompt:**
> "Review the `catalog-service` for any critical security vulnerabilities or architectural technical debt."

**Expected Agent Behavior:**
- Agent reviews the code in `catalog-service`.
- Agent says: *"The code in `catalog-service` looks clean. The dependencies are up to date within this repo's context, and the business logic follows standard patterns. No critical issues found."*

### Phase B: WITH Context Layer
**Prompt:**
> "Run a cross-repo intelligence audit using Context Layer."

**Action:** Agent calls `get_code_intelligence(topic: "overview")`.

**Expected Agent Behavior:**
- Agent reads the cross-repo security and health dashboards.
- Agent says: *"Wait, while `catalog-service` is 'clean' locally, the Intelligence dashboard shows that the `identity-service` (which Catalog depends on for auth) has a **Critical CVE** in its core JWT library. Your 'clean' service is actually exposing user data because the underlying auth layer is compromised. You need to patch `identity-service` immediately."*

---

## 🧪 Story 3: The "Black Box" Library (Internal Shared SDK)

**Goal:** Show "Intelligence without Indexing" for internal frameworks or large SDKs.

### Phase A: WITHOUT Context Layer
**Prompt:**
> "I need to implement a new Saga in the `pricing-service` using our internal `AmirkiaSDK`. How do I use the `SagaManager` to ensure idempotency?"

**Expected Agent Behavior:**
- Agent searches `pricing-service` but finds only usage examples, not the SDK source.
- Agent says: *"I see `AmirkiaSDK` being used, but I don't have the documentation for it. I'll have to guess the API. It looks like I should call `SagaManager.start()`. (Note: This might be wrong and cause a build failure if the actual method is `.execute()` with a mandatory `StrictIdempotencyKey`)."*

### Phase B: WITH Context Layer
**Prompt:**
> "Ask the Context Layer Knowledge Base about how to use SagaManager in AmirkiaSDK."

**Action:** Agent calls `ask_context_layer(question: "How to use SagaManager in AmirkiaSDK?")`.

**Expected Agent Behavior:**
- Agent gets the grounded answer from the indexed knowledge.
- Agent says: *"According to the Context Layer Knowledge Base, `SagaManager.start()` is deprecated. You MUST use `.execute()` and it requires a `StrictIdempotencyKey` as the second argument to prevent duplicate billing. Here is the correct code snippet... I saved you from a potential production incident."*
