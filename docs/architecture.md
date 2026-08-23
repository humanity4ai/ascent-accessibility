# Architecture

The engine has three layers, each pure and independently testable:

1. **`src/lib/engine`** — the machine scan engine. Atomic, evidence-backed rules are organised
   into a registry (`registry.ts`) and run by `runner.ts`. `interaction-scan.ts` performs
   keyboard/focus probing; `contrast.ts` computes WCAG contrast ratios.

2. **`src/lib/ai-review`** — the AI scan engine. One model call per judgeable criterion
   (`triage.ts`), provider-agnostic adapters (OpenAI/Anthropic/Gemini/custom), a confidence
   fail-safe (`confidence < 0.8` → `CannotTell`), and vision + audio modalities.

3. **`src/lib/standards`** — the shared data: the version-aware WCAG catalog (`wcag-sc.ts`,
   `catalog.ts`), the per-instruction testability taxonomy (`nature.ts`), manual tests, and
   remediation guidance.

## Scoring contract
Every criterion resolves to a **verdict** (`Passed` / `Failed` / `CannotTell` / `NotPresent` /
`NotChecked`). The machine engine only issues substantive verdicts it can evidence; everything
else escalates to AI, then to human review.
