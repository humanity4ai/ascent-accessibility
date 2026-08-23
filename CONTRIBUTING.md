# Contributing

Thanks for helping improve the Ascent Accessibility engine.

## Getting started
1. Fork and clone the repo.
2. `pnpm install` (Playwright is the only runtime dependency).
3. `pnpm exec tsc --noEmit` to type-check.

## Architecture (see `docs/`)
- `src/lib/engine` — the clean-room WCAG rule engine (atomic rules → registry → runner).
- `src/lib/ai-review` — the AI-assisted review (one criterion per call, confidence fail-safe).
- `src/lib/standards` — the WCAG catalog, nature taxonomy, manual tests, remediation.

## Principles
- **Clean-room only**: never copy rule logic from third-party engines.
- **Fail-safe**: uncertainty stays `CannotTell`; a wrong PASS is worse than an unresolved item.
- **Deterministic**: fixed settings for reproducible extractions.

## Submitting changes
- Open an issue first for anything beyond a small fix.
- PRs should include a short description and, where relevant, a test.
