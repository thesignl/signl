# SIGNL — Refactor / Architecture Prompt

## TASK TYPE: Refactor or Architectural Change

Follow the mandatory pipeline:

1. **Understand** — Map the full surface area of the refactor. Identify all consumers.
2. **Verify** — Confirm current behaviour with tests/build. Document the "before" state.
3. **Plan** — Propose the new architecture. List every file impacted. State migration strategy.
4. **Implement** — Execute incrementally. Keep the app buildable after each step.
5. **Validate** — Typecheck + build after every major step, not just at the end.
6. **Test** — All existing tests pass. New tests for new abstractions.
7. **Review** — Diff check: no dead code, no unused imports, no regressions.
8. **Proceed** — Report: before/after architecture, files changed, validation, risks.

## RULES

- Refactors must be behaviour-preserving unless explicitly stated otherwise.
- Never leave the codebase in a broken intermediate state.
- Prefer small, reviewable steps over one massive change.
- If the refactor touches public APIs, update the documentation.
