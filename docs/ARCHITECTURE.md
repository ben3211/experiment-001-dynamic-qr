# Architecture

> **Template:** Document how the system is designed. Update when structure or major flows change.

**Last updated:** `[YYYY-MM-DD]`  
**Applies to version:** `[v0.0.0 or commit range]`

---

## System Overview

<!-- High-level description: what the system does and major components -->

`[SYSTEM_OVERVIEW]`

### Context Diagram

```
                    ┌─────────────────┐
                    │  [EXTERNAL_ACTOR] │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  [THIS_SYSTEM]  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌───────▼──────┐  ┌───▼────────┐
     │ [DEP_1]    │  │ [DEP_2]      │  │ [DEP_3]    │
     └────────────┘  └──────────────┘  └────────────┘
```

Replace the diagram above with your actual architecture (Mermaid, ASCII, or linked diagram).

---

## Goals and Constraints

| Goal | Approach |
|------|----------|
| `[GOAL_1]` | `[HOW_ARCHITECTURE_SUPPORTS_IT]` |
| `[GOAL_2]` | `[HOW_ARCHITECTURE_SUPPORTS_IT]` |

| Constraint | Implication |
|------------|-------------|
| `[CONSTRAINT_1 — e.g. must run offline]` | `[DESIGN_CHOICE]` |
| `[CONSTRAINT_2 — e.g. <100ms p95]` | `[DESIGN_CHOICE]` |

---

## Layer Model

Describe how clean architecture maps to this repo:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Domain | `[PATH e.g. src/domain/]` | `[ENTITIES, RULES, USE CASES]` |
| Application | `[PATH]` | `[ORCHESTRATION, PORTS]` |
| Infrastructure | `[PATH]` | `[DB, HTTP, FILE I/O]` |
| Presentation | `[PATH]` | `[API, UI, CLI]` |

**Dependency rule:** outer layers depend on inner layers; domain depends on nothing external.

---

## Module Map

```
[ROOT]/
├── [MODULE_A]/     # [PURPOSE]
├── [MODULE_B]/     # [PURPOSE]
└── [MODULE_C]/     # [PURPOSE]
```

| Module | Purpose | Key types / entry points |
|--------|---------|--------------------------|
| `[MODULE_A]` | `[PURPOSE]` | `[FILES OR CLASSES]` |
| `[MODULE_B]` | `[PURPOSE]` | `[FILES OR CLASSES]` |

---

## Core Flows

### Flow 1: `[FLOW_NAME — e.g. User registration]`

1. `[STEP_1 — e.g. HTTP POST /users]`
2. `[STEP_2 — e.g. Validate payload]`
3. `[STEP_3 — e.g. Create user via UserService]`
4. `[STEP_4 — e.g. Persist via UserRepository]`
5. `[STEP_5 — e.g. Return 201 + user DTO]`

**Error paths:** `[DESCRIBE FAILURE MODES AND HANDLING]`

### Flow 2: `[FLOW_NAME]`

`[DESCRIBE OR LINK TO SEQUENCE DIAGRAM]`

---

## Data Model

<!-- Schema, entities, relationships — link to migrations or ERD if available -->

| Entity | Description | Storage |
|--------|-------------|---------|
| `[ENTITY_1]` | `[DESCRIPTION]` | `[TABLE / COLLECTION / FILE]` |
| `[ENTITY_2]` | `[DESCRIPTION]` | `[TABLE / COLLECTION / FILE]` |

**Relationships:** `[DESCRIBE OR EMBED DIAGRAM]`

---

## External Integrations

| Service | Purpose | Auth | Failure handling |
|---------|---------|------|------------------|
| `[SERVICE_1]` | `[WHY]` | `[API key / OAuth / etc.]` | `[RETRY / CIRCUIT BREAKER / FAIL FAST]` |
| `[SERVICE_2]` | `[WHY]` | | |

---

## Configuration

| Source | Contents | Loaded when |
|--------|----------|-------------|
| Environment variables | `[LIST OR REF .env.example]` | Startup |
| Config files | `[PATHS]` | `[WHEN]` |

See [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) for required variables.

---

## Cross-Cutting Concerns

| Concern | Implementation |
|---------|----------------|
| Logging | `[LIBRARY / FORMAT / LEVELS]` |
| Authentication | `[MECHANISM]` |
| Authorization | `[MODEL — RBAC, ABAC, etc.]` |
| Validation | `[WHERE AND HOW]` |
| Error handling | `[GLOBAL HANDLER / PATTERN]` |
| Caching | `[IF ANY]` |

---

## Deployment Topology

```
[DESCRIBE: single container, k8s, serverless, monolith, etc.]
```

| Environment | URL / target | Notes |
|-------------|--------------|-------|
| Local | `[URL]` | |
| Staging | `[URL]` | |
| Production | `[URL]` | |

---

## Security Notes

- `[TRUST_BOUNDARIES]`
- `[SECRET_HANDLING]`
- `[INPUT_VALIDATION_STRATEGY]`
- `[AUDIT OR COMPLIANCE REQUIREMENTS IF ANY]`

---

## Performance and Scaling

| Bottleneck | Current approach | Future option |
|------------|------------------|---------------|
| `[AREA]` | `[APPROACH]` | `[IF NEEDED]` |

---

## Related Documents

- [docs/DECISIONS.md](DECISIONS.md) — why specific choices were made
- [DEVELOPMENT_GUIDELINES.md](../DEVELOPMENT_GUIDELINES.md) — engineering standards
- [CURRENT_STATE.md](../CURRENT_STATE.md) — live status
