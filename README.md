# Ascent Accessibility Engine

Open-source machine scan engine and AI scan engine powering the Ascent Accessibility
assessment platform ([accessibility.ascent.partners](https://accessibility.ascent.partners)),
by the Ascent Partners Foundation.

## What's here

- **`src/lib/engine`** — the clean-room WCAG rule engine (atomic rules, registry, runner,
  interaction scan, contrast analysis). No third-party accessibility scanners.
- **`src/lib/ai-review`** — the AI-assisted review engine (provider-agnostic adapters,
  one-criterion-per-call triage, confidence-gated fail-safe, vision + audio).
- **`src/lib/standards`** — the WCAG 2.0/2.1/2.2 + Section 508 catalog, the nature taxonomy
  (machine-testable / ai-detectable / manual-only), manual tests, remediation, and the
  localized standards/Understanding content.

## Layout note

This is a source release extracted from the full product. Module paths use the `@/` alias
(mapping to `src/`) — see `tsconfig.json`. A few engine types reference the product's
`src/db/schema.ts` (PostgreSQL record shapes); those are included for completeness.

## License

MIT — see [LICENSE](LICENSE).

## Contact

Ascent Partners Foundation — [accessibility.ascent.partners](https://accessibility.ascent.partners).