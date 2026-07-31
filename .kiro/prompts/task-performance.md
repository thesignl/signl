# SIGNL — Performance & Optimization Prompt

## TASK TYPE: Performance Improvement

Follow the mandatory pipeline:

1. **Understand** — Identify the bottleneck. Measure before optimizing.
2. **Verify** — Get baseline metrics (bundle size, query time, LCP, CLS, etc.).
3. **Plan** — State the optimization strategy and expected impact.
4. **Implement** — Apply the optimization. Prefer algorithmic fixes over caching hacks.
5. **Validate** — Build passes. Measure the "after" metrics.
6. **Test** — No regressions. Functionality unchanged.
7. **Review** — Is the optimization maintainable? Does it add complexity?
8. **Proceed** — Report: before/after metrics, approach, files changed.

## RULES

- Measure before and after. No unmeasured "optimizations".
- Don't sacrifice readability for marginal gains.
- Prefer server components over client for data-fetching.
- Lazy-load below-the-fold content.
- Database: use indexed queries. No N+1s.
