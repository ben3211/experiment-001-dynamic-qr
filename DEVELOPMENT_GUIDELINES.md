# Development Guidelines

Universal engineering rules for all projects. These principles apply regardless of language, framework, or domain.

---

## 1. Clean Architecture (Without Overengineering)

**Goal:** Code that is easy to understand, change, and test — not a textbook implementation of every pattern.

### Principles

- **Start simple.** Add layers and abstractions only when a concrete problem demands them.
- **Organize by responsibility**, not by technical novelty. A folder named `services/` is fine; a folder named `orchestration-facade-adapters/` probably is not.
- **Dependencies point inward.** Domain/business logic must not depend on frameworks, databases, or UI details.
- **Keep modules small and focused.** If a file does more than one clear job, split it.
- **Avoid premature generalization.** Do not build plugin systems, event buses, or factory hierarchies until you have at least two real use cases.

### Practical structure (adapt to your stack)

```
src/
  domain/        # Business rules, entities, use cases
  application/   # Orchestration, ports/interfaces
  infrastructure/# DB, HTTP clients, file I/O, external APIs
  presentation/  # UI, CLI, HTTP handlers, routes
```

Not every project needs all four layers on day one. Grow into them.

---

## 2. Separation of Concerns

- Each module owns one reason to change.
- **Presentation** handles input/output formatting — not business rules.
- **Domain** holds invariants and decisions — not SQL or HTTP status codes.
- **Infrastructure** implements technical details behind interfaces defined by the application layer.
- Do not mix configuration, logging, validation, and business logic in the same function.
- Shared utilities belong in a clearly named place; avoid a catch-all `utils/` dumping ground.

---

## 3. Dependency Injection

- **Depend on abstractions** (interfaces, protocols, traits), not concrete implementations.
- **Inject dependencies** through constructors, factory parameters, or a minimal DI container — never instantiate infrastructure inside domain code.
- **Prefer explicit wiring** in a composition root (`main`, `app bootstrap`, `container setup`) over hidden global singletons.
- **Scope matters:** request-scoped for per-request state; singleton for stateless services; avoid static mutable globals.
- In tests, replace real dependencies with fakes, stubs, or mocks at the boundary — not deep inside domain logic.

---

## 4. Configuration and Secrets

- **Never commit secrets.** API keys, passwords, tokens, and private keys belong in environment variables or a secrets manager — not in source control.
- **Separate config from code.** Use `.env.example` (or equivalent) documenting required variables without values.
- **Validate configuration at startup.** Fail fast with a clear message if required settings are missing or malformed.
- **Use sensible defaults** for non-sensitive, environment-agnostic settings only.
- **Do not log secrets.** Redact tokens, passwords, and PII from logs and error messages.
- Treat `.env`, credential files, and local overrides as gitignored (see project `.gitignore`).

---

## 5. Git Practices and Commit Quality

- **Commit often, in logical units.** One commit = one coherent change (feature slice, bug fix, refactor).
- **Write meaningful commit messages:**
  - Subject: imperative mood, ~50 chars, no trailing period (`Add user session validation`)
  - Body (when needed): explain *why*, not just *what*
- **Do not commit generated artifacts**, dependencies (`node_modules/`, `vendor/`), build output, or IDE-specific junk unless explicitly required.
- **Branch for non-trivial work.** Use descriptive branch names (`feature/`, `fix/`, `refactor/`).
- **Review before merge.** Even solo projects benefit from a self-review pass or diff read.
- **Never force-push shared branches** without team agreement.
- **Keep history clean enough to bisect.** If a commit breaks the build, fix forward or revert — do not leave `main` red.

---

## 6. Testing

- **Test behavior, not implementation details.** Assert outcomes and contracts, not internal call order unless necessary.
- **Pyramid balance:** many fast unit tests, fewer integration tests, minimal end-to-end tests — adjust per project risk.
- **Tests must be deterministic.** No reliance on wall-clock timing, randomness without seeding, or external network unless isolated.
- **Name tests clearly:** `should_return_404_when_user_not_found` beats `test1`.
- **Cover critical paths first:** auth, payments, data integrity, public APIs.
- **Run tests before pushing.** CI is the safety net; local runs are the first line of defense.
- **Do not skip or disable tests** to greenwash CI without fixing the root cause or documenting a tracked exception.

---

## 7. Logging

- **Use structured logging** where the stack supports it (JSON fields, key-value context).
- **Log levels consistently:**
  - `DEBUG` — diagnostic detail for development
  - `INFO` — normal lifecycle events (startup, job completed)
  - `WARN` — recoverable anomalies
  - `ERROR` — failures requiring attention
- **Include correlation IDs** for request-scoped or job-scoped tracing.
- **Log at boundaries:** entry/exit of external calls, auth decisions, state transitions — not every loop iteration.
- **Never log secrets or full PII.** Truncate or hash identifiers when needed for debugging.

---

## 8. Validation

- **Validate at system boundaries:** HTTP input, CLI args, message payloads, file imports.
- **Fail early with actionable errors.** Tell the caller *what* is wrong and *where*, not a generic "invalid input."
- **Separate validation from business rules.** Format/range checks belong at the edge; domain invariants belong in domain code.
- **Use schema validation tools** when available (JSON Schema, Zod, Pydantic, Bean Validation, etc.) instead of hand-rolled checks scattered everywhere.
- **Do not trust client-side validation alone.** Always re-validate on the server or trusted backend.

---

## 9. Error Handling

- **Use typed or categorized errors** so callers can decide retry vs. fail vs. user message.
- **Never swallow exceptions silently.** Log and rethrow, wrap with context, or handle explicitly.
- **User-facing messages** must be safe and helpful; **internal logs** carry full diagnostic detail.
- **Distinguish expected failures** (not found, validation) from unexpected ones (null pointer, timeout).
- **Clean up resources** in `finally` blocks, defer statements, or language equivalents.
- **At HTTP/API boundaries**, map internal errors to appropriate status codes without leaking stack traces in production.

---

## 10. Documentation Maintenance

- **Treat docs as part of the deliverable.** Outdated docs are worse than no docs.
- **Update in the same PR/commit** when behavior, APIs, or architecture changes.
- **Project-specific docs live in:**
  - `PROJECT_CONTEXT.md` — what the project is and why
  - `CURRENT_STATE.md` — what works today, known issues, recent changes
  - `ROADMAP.md` — planned work and priorities
  - `docs/ARCHITECTURE.md` — system design
  - `docs/DECISIONS.md` — architectural decision records (ADRs)
- **Prefer small, living documents** over massive wikis nobody reads.
- **Link to code, not duplicate it.** Docs explain intent and trade-offs; code shows implementation.

---

## 11. Safe Refactoring

- **Refactor in small steps** with a green build and passing tests between each step.
- **One kind of change per commit:** do not mix feature work with large renames or formatting sweeps.
- **Use automated refactors** (IDE, codemods) for renames and moves; verify with tests afterward.
- **Preserve behavior** unless the change is explicitly documented (see `docs/DECISIONS.md`).
- **Delete dead code** when you confirm it is unused — do not comment it out "just in case."
- **If a refactor touches many files**, communicate scope in the PR description and update `CURRENT_STATE.md` if user-visible behavior shifts.

---

## 12. Build Verification

- **The default branch must always build and pass tests.**
- **Run the full local build** before opening a PR: compile, lint, test, and any type-check step your project defines.
- **CI must mirror local commands** so "works on my machine" is caught early.
- **Pin or lock dependencies** for reproducible builds (`package-lock.json`, `poetry.lock`, etc.).
- **Fix broken builds immediately** — do not merge around red CI.
- **Document build prerequisites** in `PROJECT_CONTEXT.md` (runtime versions, tools, env vars).

---

## 13. Keeping Current State Updated

`CURRENT_STATE.md` is the single source of truth for "where we are right now."

- **Update after every significant merge or release:** what shipped, what broke, what is blocked.
- **Include:** working features, known bugs, technical debt worth noting, environment status, and last verified date.
- **Remove stale entries** — if a bug was fixed, delete it from "Known Issues."
- **Agents and contributors should read `CURRENT_STATE.md` before starting non-trivial work** to avoid duplicating effort or breaking in-progress changes.

---

## 14. AI Engineering Best Practices

Rules for projects that use LLMs, speech, image, or other AI providers.

### Prompt management

- **Never hardcode prompts inside source code.** Load them from external files or a dedicated prompt store.
- **Store prompts as versioned external files** (e.g. `prompts/summarize/v1.txt`) — not scattered string literals.
- **Version prompts instead of overwriting them.** Create `v2` when behavior changes; keep `v1` until the new version is proven.
- **Test prompt changes on multiple examples** before replacing a previous version. Include edge cases and failure modes.
- **Keep prompts modular by responsibility.** One prompt per task (summarize, classify, extract) — not one mega-prompt that does everything.

### Provider and cost discipline

- **Track AI costs** across providers (OpenAI, Claude, ElevenLabs, image models, etc.). Log token usage, call counts, and estimated spend per feature.
- **Keep AI providers replaceable through abstraction.** Domain code calls a port/interface; infrastructure implements OpenAI, Anthropic, or others behind it.
- **Prefer deterministic code when AI is unnecessary.** Regex, rules engines, and lookups are cheaper, faster, and easier to test than an LLM call.

### Output safety

- **Validate every AI output before using it.** Parse into a schema, check types/ranges, reject malformed responses — never trust raw model output.
- **Handle provider failures explicitly:** timeouts, rate limits, empty responses, and hallucinated structure.

### Documentation

- **Record important prompt and AI architecture decisions in `docs/DECISIONS.md`.** Include model choice, prompt versioning strategy, cost trade-offs, and fallback behavior.

### AI Feature Completion Checklist

Before merging an AI-powered feature:

- [ ] Prompt updated (new version file created if behavior changed)
- [ ] Prompt tested on multiple representative examples
- [ ] AI output validated (schema, bounds, error paths)
- [ ] Cost acceptable (estimated per call and at expected volume)
- [ ] Documentation updated (`docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, or `CURRENT_STATE.md` as needed)

---

## Quick Checklist (Before Opening a PR)

- [ ] Code follows separation of concerns and project structure
- [ ] No secrets or credentials in diff
- [ ] Tests added or updated for changed behavior
- [ ] Build, lint, and tests pass locally
- [ ] Logs and errors are appropriate (no secrets, useful context)
- [ ] Input validated at boundaries
- [ ] Docs updated if behavior or architecture changed
- [ ] `CURRENT_STATE.md` updated if the change affects project status
