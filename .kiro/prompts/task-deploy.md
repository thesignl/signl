# SIGNL — Deployment & Infrastructure Prompt

## TASK TYPE: Deployment or Infrastructure Change

Follow the mandatory pipeline:

1. **Understand** — Map the current deployment topology, env vars, and dependencies.
2. **Verify** — Confirm the production config. Check secrets are not exposed.
3. **Plan** — State the change, rollback strategy, and blast radius.
4. **Implement** — Make the change. Document any new env vars required.
5. **Validate** — Build passes locally. Health check endpoints respond.
6. **Test** — Staging verification if available. Smoke test critical paths.
7. **Review** — Security: no secrets in code. CORS, CSP, HSTS correct.
8. **Proceed** — Report: change summary, env vars added/changed, rollback plan.

## RULES

- Never commit secrets.
- All env vars documented in .env.example files.
- Database migrations must be backwards-compatible (deploy before code).
- Prefer zero-downtime deployments.
