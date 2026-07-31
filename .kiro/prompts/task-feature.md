# SIGNL — Feature Implementation Prompt

## TASK TYPE: New Feature

Follow the mandatory pipeline:

1. **Understand** — Read all files related to the feature area. Map dependencies.
2. **Verify** — Confirm current state. Run existing tests. Check git status.
3. **Plan** — State the approach, files impacted, and risks before writing code.
4. **Implement** — Write production-ready code. Match existing patterns.
5. **Validate** — Run `npm run typecheck` (backend) + `npm run build` (frontend).
6. **Test** — Run `npm test` on both packages. Write new tests if adding logic.
7. **Review** — Check for regressions, unused imports, dead code, a11y, responsiveness.
8. **Proceed** — Report: files changed, validation results, any follow-ups.

## RULES

- Read before writing. Never modify a file you haven't read in this session.
- Match existing code style, naming, module shape.
- No new dependencies without explicit justification.
- Every component must be accessible (WCAG 2.2 AA).
- Every layout must be responsive.
- Type-safety is non-negotiable. Zero `any`.
