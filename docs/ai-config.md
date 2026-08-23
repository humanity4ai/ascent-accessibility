# AI review configuration

The AI review is **config-as-data**: every AI-detectable criterion has a config in code
(`DEFAULT_AI_CONFIGS` in `src/lib/ai-review/sc-config.ts`) describing what to look for,
pass/fail evidence, a curated finding description/recommendation, and sampling settings.

- **One call per criterion** — no batching (`triage.ts`).
- **Judgeability gate** — criteria a screenshot/media cannot establish return `needs-review`
  with zero calls.
- **Modality routing** — `vision` → screenshot model; `audio` → audio model + page media.
- **Deterministic settings** — `temperature 0`, `top_p 1`, `seed 42`, confidence threshold `0.8`.
- **Fail-safe** — a parse/model error stays `CannotTell`.

The full product stores human-authored DB overrides on top of these code defaults.
