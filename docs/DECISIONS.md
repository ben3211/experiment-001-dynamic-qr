# Architectural Decision Records (ADRs)

> **Template:** Log significant technical decisions here. One entry per decision. Keep entries short and durable.

**Format:** Each ADR has a status, context, decision, and consequences.

**Status values:** `Proposed` | `Accepted` | `Deprecated` | `Superseded by ADR-XXX`

---

## Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADR-001 | `[SHORT_TITLE]` | `[STATUS]` | `[YYYY-MM-DD]` |
| ADR-002 | `[SHORT_TITLE]` | `[STATUS]` | `[YYYY-MM-DD]` |

---

## ADR-001: `[DECISION_TITLE]`

**Status:** `[Proposed / Accepted / Deprecated / Superseded]`  
**Date:** `[YYYY-MM-DD]`  
**Deciders:** `[NAMES]`  
**Tags:** `[architecture, database, api, etc.]`

### Context

<!-- What problem or question prompted this decision? -->

`[DESCRIBE_CONTEXT_AND_FORCES]`

### Decision

<!-- What was decided? State clearly and concisely. -->

We will `[DECISION_STATEMENT]`.

### Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| `[OPTION_A]` | `[PROS]` | `[CONS]` |
| `[OPTION_B]` | `[PROS]` | `[CONS]` |

### Consequences

**Positive:**

- `[CONSEQUENCE_1]`
- `[CONSEQUENCE_2]`

**Negative / trade-offs:**

- `[TRADE_OFF_1]`
- `[TRADE_OFF_2]`

**Follow-up:**

- [ ] `[ACTION_ITEM_IF_ANY]`

---

## ADR-002: `[DECISION_TITLE]`

**Status:** `[STATUS]`  
**Date:** `[YYYY-MM-DD]`  
**Deciders:** `[NAMES]`  
**Tags:** `[TAGS]`

### Context

`[CONTEXT]`

### Decision

`[DECISION]`

### Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| `[OPTION_A]` | | |
| `[OPTION_B]` | | |

### Consequences

**Positive:**

- `[ITEM]`

**Negative / trade-offs:**

- `[ITEM]`

---

## How to Add a New ADR

1. Copy the ADR-002 section above as a template.
2. Assign the next sequential ID (`ADR-003`, etc.).
3. Add a row to the index table.
4. Set status to `Proposed` until reviewed, then `Accepted`.
5. If a later decision replaces this one, set status to `Superseded by ADR-XXX` — do not delete old entries.

---

## Template (copy for new entries)

```markdown
## ADR-XXX: [TITLE]

**Status:** Proposed
**Date:** YYYY-MM-DD
**Deciders:** [NAMES]
**Tags:** [tags]

### Context

[What is the issue?]

### Decision

[What is the change?]

### Alternatives considered

| Option | Pros | Cons |
|--------|------|------|
| | | |

### Consequences

**Positive:**
-

**Negative / trade-offs:**
-
```
