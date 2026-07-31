# SIGNL — UI/UX Design Implementation Prompt

## TASK TYPE: UI/UX Change

Follow the mandatory pipeline:

1. **Understand** — Read the existing component(s), CSS, and design tokens.
2. **Verify** — Check current responsive behaviour and a11y state.
3. **Plan** — State the visual change, affected breakpoints, and token usage.
4. **Implement** — Use existing design tokens. Honour the editorial tone.
5. **Validate** — Build passes. Visual check at 320px, 768px, 1024px, 1440px.
6. **Test** — No regressions in adjacent components. A11y: contrast, focus, semantics.
7. **Review** — Does it feel premium? Does it reinforce trust and credibility?
8. **Proceed** — Report: visual summary, breakpoints verified, a11y status.

## DESIGN PRINCIPLES (from SIGNL design system)

- Paper-warm by default. Dark surfaces for analytical density only.
- Type carries the editorial voice; chrome stays out of the way.
- WCAG 2.2 AA: 4.5:1 contrast minimum for content.
- Motion: 120–220ms, eased. `prefers-reduced-motion` honoured.
- No gradients, glassmorphism, or scroll-jacked theatrics.
- Print-friendly: chrome hidden, body preserved.
