# AI Project Template

A minimal, documentation-first starter for software projects — optimized for human developers and AI assistants (Cursor).

**Version:** 1.0.0

---

## Purpose

Every new project starts with the same questions: What are we building? What works today? What did we decide and why? How should we write code?

This template answers those questions with a small set of markdown files and one Cursor rule. No framework lock-in, no boilerplate code, no ceremony. Clone it, fill in the placeholders, and start building.

Use it when you want:

- Consistent engineering standards across projects
- Context that survives between coding sessions
- AI assistants that read your docs before making changes
- A structure that scales from weekend scripts to production apps

---

## Philosophy

1. **Docs before code.** A few living documents beat a wiki nobody updates.
2. **Simple beats clever.** Clean architecture principles without enterprise theater.
3. **Placeholders over presets.** You choose the stack; the template stays universal.
4. **AI-aware by design.** Cursor rules point agents at the right files in the right order.
5. **Evolve, don't freeze.** Version 1.0 is intentionally small. Extend it as your needs grow.

---

## Folder structure

```
.
├── README.md                    # You are here — template overview
├── START_NEW_PROJECT.md         # Step-by-step workflow for new projects
├── CHANGELOG.md                 # Template version history
├── DEVELOPMENT_GUIDELINES.md    # Universal engineering rules
├── PROJECT_CONTEXT.md           # Project identity, stack, commands (fill in)
├── CURRENT_STATE.md             # Live status: what works, issues, blockers (fill in)
├── ROADMAP.md                   # Phased plan and priorities (fill in)
├── docs/
│   ├── ARCHITECTURE.md          # System design (fill in as you build)
│   └── DECISIONS.md             # Architectural decision records (ADRs)
├── .env.example                 # Environment variable template
├── .gitignore                   # Safe defaults for secrets and artifacts
└── .cursor/
    └── rules/
        └── project-context.mdc  # Tells Cursor to read project docs first
```

There is no `src/` folder on purpose. Add your code structure when you know what you're building.

---

## How to start a new project

### Option A — GitHub template (recommended)

1. On GitHub, click **Use this template** → **Create a new repository**.
2. Clone your new repository locally.
3. Follow [START_NEW_PROJECT.md](START_NEW_PROJECT.md) from step 2 onward.

### Option B — Clone directly

```bash
git clone https://github.com/[YOUR_ORG]/AI-Project-Template.git my-new-project
cd my-new-project
rm -rf .git
git init
git add .
git commit -m "Initial commit from AI Project Template v1.0.0"
```

Then follow [START_NEW_PROJECT.md](START_NEW_PROJECT.md).

### First 15 minutes

| Step | File | Action |
|------|------|--------|
| 1 | `PROJECT_CONTEXT.md` | Name, purpose, stack, commands |
| 2 | `CURRENT_STATE.md` | Initial status and next steps |
| 3 | `ROADMAP.md` | Phase 0 / MVP milestones |
| 4 | `.env.example` | Copy to `.env`, add real values locally |
| 5 | Your code | Create `src/` (or equivalent) and begin |

---

## How to use Cursor with this template

This template ships a Cursor rule at `.cursor/rules/project-context.mdc` with `alwaysApply: true`.

**What it does:** Before non-trivial work, Cursor reads your project documentation in this order:

1. `DEVELOPMENT_GUIDELINES.md`
2. `PROJECT_CONTEXT.md`
3. `CURRENT_STATE.md`
4. `ROADMAP.md`
5. `docs/ARCHITECTURE.md` and `docs/DECISIONS.md` when relevant

**What you should do:**

- Keep the four core docs accurate as the project evolves.
- Open the project root in Cursor so rules are picked up automatically.
- After significant changes, ask Cursor to update `CURRENT_STATE.md` — or update it yourself.

**Tip:** In Agent mode, reference docs explicitly when starting a new feature: *"Read PROJECT_CONTEXT and CURRENT_STATE, then implement X."*

---

## Publishing this as a GitHub template

After pushing to GitHub:

1. Go to **Repository settings** → **General**.
2. Check **Template repository**.
3. New projects can then use **Use this template** on the repo homepage.

---

## What's not included (by design)

- Application code or framework scaffolding
- CI/CD pipelines (add when you pick a stack)
- Issue/PR templates (add when a team needs them)
- License file (add the license you prefer)

Keep the template lean. Fork or extend it for your organization if you need more.

---

## Related documents

- [START_NEW_PROJECT.md](START_NEW_PROJECT.md) — full bootstrap workflow
- [DEVELOPMENT_GUIDELINES.md](DEVELOPMENT_GUIDELINES.md) — engineering standards
- [CHANGELOG.md](CHANGELOG.md) — template release notes
