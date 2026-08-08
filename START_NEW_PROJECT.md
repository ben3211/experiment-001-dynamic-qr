# Start a New Project

Complete workflow from this template to your first development commit.

**Estimated time:** 15–30 minutes for setup, then you write code.

---

## 1. Create the repository

### From GitHub (recommended)

1. Open the template repository on GitHub.
2. Click **Use this template** → **Create a new repository**.
3. Name the repository (e.g. `my-api`, `dashboard-app`).
4. Choose public or private.
5. Do **not** initialize with a README (this template already has one — replace or rewrite it for your project).
6. Clone locally:

```bash
git clone https://github.com/[YOUR_USER]/[YOUR_REPO].git
cd [YOUR_REPO]
```

### From a local copy

```bash
git clone https://github.com/[YOUR_ORG]/AI-Project-Template.git my-new-project
cd my-new-project
rm -rf .git          # Linux/macOS
# Remove-Item -Recurse -Force .git   # Windows PowerShell
git init
```

---

## 2. Define the project

Open `PROJECT_CONTEXT.md` and replace every `[PLACEHOLDER]`:

| Section | What to write |
|---------|---------------|
| Overview | Name, one-line description, languages, repo URL |
| Purpose | Problem statement and goal |
| Scope | In scope / out of scope |
| Tech stack | Runtime, framework, database, hosting |
| Prerequisites | Tools, versions, install commands |
| Key commands | install, dev, test, build, lint |
| Conventions | Branch naming, default branch, formatters |

Delete the template callout at the top when done.

---

## 3. Set initial status

Open `CURRENT_STATE.md`:

- Set **Last updated** to today's date.
- Write a short **Summary** (e.g. "Greenfield project, docs initialized, no code yet").
- List **What Works** (likely empty or "Documentation scaffold").
- Add **Next Steps** aligned with your first milestone.
- Set build/test status to `➖` until you add a stack.

---

## 4. Plan the work

Open `ROADMAP.md`:

- Fill in **Vision** and **Guiding Principles**.
- Define **Phase 0 — Foundation** (repo, CI, hello-world).
- Define **Phase 1 — MVP** with concrete features and exit criteria.
- Leave later phases rough — refine as you learn.

---

## 5. Configure environment

```bash
cp .env.example .env      # Linux/macOS
# Copy-Item .env.example .env   # Windows
```

Edit `.env` with local values. **Never commit `.env`.**

Update `.env.example` with every variable your project needs (no secret values — descriptions only).

---

## 6. Add your code structure

Create directories for your stack. Example for a typical backend:

```
src/
  domain/
  application/
  infrastructure/
  presentation/
tests/
```

Or use your framework's default layout. Document the choice in `docs/ARCHITECTURE.md`.

---

## 7. Customize for your project

| File | Action |
|------|--------|
| `README.md` | Rewrite for your project (keep or remove template sections) |
| `docs/ARCHITECTURE.md` | Sketch initial layer model and module map |
| `docs/DECISIONS.md` | Add ADR-001 for major stack choices (optional but useful) |
| `.gitignore` | Add stack-specific entries if needed |
| `.cursor/rules/project-context.mdc` | Usually keep as-is; extend only if you add new core docs |

---

## 8. Initial commit

```bash
git add .
git commit -m "Initialize project from AI Project Template v1.0.0"
git branch -M main
git remote add origin https://github.com/[YOUR_USER]/[YOUR_REPO].git
git push -u origin main
```

---

## 9. Open in Cursor

1. **File → Open Folder** → select your project root.
2. Confirm `.cursor/rules/project-context.mdc` is present (rules load automatically).
3. Start Agent mode with context, for example:

> Read DEVELOPMENT_GUIDELINES.md, PROJECT_CONTEXT.md, and CURRENT_STATE.md. Then scaffold [first feature] in `src/`.

Cursor will follow the rule and read docs before significant work.

---

## 10. Ongoing habits

| When | Update |
|------|--------|
| After merging a feature | `CURRENT_STATE.md` |
| After structural changes | `docs/ARCHITECTURE.md` |
| After a meaningful technical choice | `docs/DECISIONS.md` (new ADR) |
| When priorities shift | `ROADMAP.md` |
| When stack or commands change | `PROJECT_CONTEXT.md` |

---

## Checklist

- [ ] Repository created from template
- [ ] `PROJECT_CONTEXT.md` filled in
- [ ] `CURRENT_STATE.md` reflects day-one status
- [ ] `ROADMAP.md` has Phase 0 and MVP defined
- [ ] `.env.example` updated; `.env` created locally and gitignored
- [ ] Code directory structure created
- [ ] `README.md` rewritten for the project
- [ ] Initial commit pushed
- [ ] Project opened in Cursor; rules verified

---

## Troubleshooting

**Cursor ignores project docs**  
Ensure the workspace root contains `.cursor/rules/`. Rules do not apply if you open a subfolder only.

**Placeholder text left in files**  
Search for `[` in the repo before your first push to catch missed placeholders.

**Parent git repo conflicts**  
If `git status` shows unrelated sibling projects, run `git init` inside your project folder only — not in a parent directory that holds multiple projects.
