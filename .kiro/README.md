# .kiro/ — SIGNL Project Intelligence Configuration

This directory configures Kiro CLI to operate as the SIGNL production execution system.

## How It Works

When you run `kiro-cli chat` from this project root, the following happens automatically:

1. **Workspace settings** (`.kiro/settings/cli.json`) set `signl` as the default agent.
2. **Agent config** (`.kiro/agents/signl.json`) loads:
   - The master system prompt from `.kiro/prompts/signl-system.md`
   - Context files (schema, package.json, types) for immediate project awareness
   - Hooks that run `git log` + `git status` on spawn (project memory init)
   - A validation reminder after every response (pipeline enforcement)
3. The agent enters the session with full project context and the mandatory pipeline active.

## Mandatory Execution Pipeline

Every task follows this sequence — no exceptions:

```
Understand → Verify → Plan → Implement → Validate → Test → Review → Proceed
```

## Files

| File | Purpose |
|------|---------|
| `prompts/signl-system.md` | Master system prompt (the full operating system) |
| `prompts/task-bugfix.md` | Pipeline-specific rules for bug fixes |
| `prompts/task-feature.md` | Pipeline-specific rules for new features |
| `prompts/task-refactor.md` | Pipeline-specific rules for refactoring |
| `prompts/task-ui.md` | Pipeline-specific rules for UI/UX changes |
| `prompts/task-performance.md` | Pipeline-specific rules for performance work |
| `prompts/task-deploy.md` | Pipeline-specific rules for deployment/infra |
| `agents/signl.json` | Kiro agent config (tools, hooks, resources) |
| `settings/cli.json` | Workspace settings (default agent, code intel) |
| `settings/lsp.json` | LSP configuration for code intelligence |

## Using Task Prompts

When starting a task, reference the appropriate prompt:

```
@task-bugfix Fix the login redirect loop on /editor
@task-feature Add reading history to the account page
@task-ui Improve the analysis card visual hierarchy
@task-refactor Extract the view-counting logic into a shared service
@task-performance Reduce the homepage LCP below 2.5s
@task-deploy Configure PM2 for zero-downtime restarts
```

The task prompt composes with the master system prompt — you get the full project
intelligence plus task-specific pipeline enforcement.

## Modifying

- Edit `prompts/signl-system.md` to update the master operating instructions.
- Add new `prompts/task-*.md` files for additional task types.
- Edit `agents/signl.json` to change tools, hooks, or loaded resources.
- The system is designed to evolve with the project.
