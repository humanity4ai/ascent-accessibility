# Rule catalogue

Rules are atomic and each maps to a WCAG success criterion. See `src/lib/engine/rules/` —
grouped by principle:

- `perceivable.ts` — alt text, contrast, media, reflow.
- `operable.ts` — keyboard, focus, timing, target size.
- `understandable.ts` — language, forms, error handling.
- `robust.ts` — name/role/value, status messages.
- `interaction.ts` + `rendering.ts` + `additional.ts` — interaction/render/supplementary checks.

Each rule declares a `description`, `help`, `extract` (what it reads from the DOM), and `check`
(the pass/fail logic). New rules are registered in `registry.ts`; tags map to SC numbers via
`scFromTag` in `src/lib/standards/wcag-sc.ts`.
