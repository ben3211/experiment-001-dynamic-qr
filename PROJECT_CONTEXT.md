# Project Context

> **Template:** Replace all `[PLACEHOLDER]` values when starting a new project. Delete this block once filled in.

---

## Overview

| Field | Value |
|-------|-------|
| **Project name** | `[PROJECT_NAME]` |
| **One-line description** | `[ONE_LINE_DESCRIPTION]` |
| **Status** | `[IDEA / ACTIVE / MAINTENANCE / ARCHIVED]` |
| **Primary language(s)** | `[e.g. TypeScript, Python, Go]` |
| **Repository** | `[REPO_URL or local-only]` |

## Purpose

<!-- Why does this project exist? What problem does it solve? -->

`[DESCRIBE_THE_PROBLEM_AND_GOAL]`

## Target Users

<!-- Who uses this? Internal team, end users, other services? -->

- `[USER_OR_STAKEHOLDER_1]`
- `[USER_OR_STAKEHOLDER_2]`

## Scope

### In scope

- `[FEATURE_OR_CAPABILITY_1]`
- `[FEATURE_OR_CAPABILITY_2]`

### Out of scope

- `[EXPLICIT_NON_GOAL_1]`
- `[EXPLICIT_NON_GOAL_2]`

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Runtime | `[e.g. Node 22, Python 3.12]` | |
| Framework | `[e.g. FastAPI, Next.js, none]` | |
| Database | `[e.g. PostgreSQL, SQLite, none]` | |
| Hosting / deployment | `[e.g. Docker, Vercel, bare metal]` | |
| CI/CD | `[e.g. GitHub Actions]` | |

## Prerequisites

<!-- Tools and versions required to develop locally -->

```bash
# Example — replace with real commands
# [RUNTIME] --version   # >= [MIN_VERSION]
# [PACKAGE_MANAGER] install
# cp .env.example .env
```

Required environment variables (see `.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `[VAR_NAME]` | Yes/No | `[DESCRIPTION]` |

## Key Commands

```bash
# Install dependencies
[INSTALL_COMMAND]

# Run locally
[DEV_COMMAND]

# Run tests
[TEST_COMMAND]

# Build
[BUILD_COMMAND]

# Lint / format
[LINT_COMMAND]
```

## Repository Layout

```
[PROJECT_ROOT]/
├── src/                      # [DESCRIBE — create when you add code]
├── tests/                    # [DESCRIBE]
├── docs/                     # Architecture, ADRs
├── README.md                 # Project overview
├── START_NEW_PROJECT.md      # Bootstrap workflow (from template)
├── CHANGELOG.md              # Release history
├── PROJECT_CONTEXT.md        # This file
├── CURRENT_STATE.md          # Live project status
├── ROADMAP.md                # Planned work
├── DEVELOPMENT_GUIDELINES.md # Universal engineering rules
├── .env.example              # Environment variable template
└── .cursor/rules/            # Cursor AI rules
```

## Conventions

<!-- Project-specific naming, branching, or coding conventions beyond DEVELOPMENT_GUIDELINES.md -->

- **Branch naming:** `[e.g. feature/, fix/, chore/]`
- **Default branch:** `[main / master]`
- **Code style:** `[e.g. Prettier + ESLint, Black + Ruff]`

## Contacts and Ownership

| Role | Name | Contact |
|------|------|---------|
| Owner | `[NAME]` | `[EMAIL or handle]` |
| Maintainers | `[NAMES]` | |

## Related Resources

- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Decisions: [docs/DECISIONS.md](docs/DECISIONS.md)
- Current status: [CURRENT_STATE.md](CURRENT_STATE.md)
- Roadmap: [ROADMAP.md](ROADMAP.md)
- Engineering rules: [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md)
