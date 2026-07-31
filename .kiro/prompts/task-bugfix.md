# SIGNL — Bug Fix Prompt

## TASK TYPE: Bug Fix

Follow the mandatory pipeline:

1. **Understand** — Reproduce the bug. Identify the exact symptom and affected file(s).
2. **Verify** — Read the relevant code. Confirm the root cause with evidence.
3. **Plan** — State the fix approach. Identify blast radius.
4. **Implement** — Fix the root cause, not just the symptom.
5. **Validate** — Run typecheck + build. Confirm the fix resolves the issue.
6. **Test** — Run existing tests. Add a regression test if the bug was logic-related.
7. **Review** — Ensure no side effects. Check related code paths.
8. **Proceed** — Report: root cause, fix applied, validation results.

## RULES

- Never guess the cause. Read the code first.
- Fix the root cause. If a workaround is faster, flag it as tech debt.
- Existing tests must still pass.
- The fix must not change unrelated behaviour.
