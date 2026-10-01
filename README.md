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
- **`mcp/`** — `ascent-accessibility-mcp`, a Model Context Protocol server exposing the WCAG
  knowledge base to AI agents.

## MCP server

[`ascent-accessibility-mcp`](mcp/) wraps `src/lib/standards` in an
[MCP](https://modelcontextprotocol.io) server so AI assistants can look up WCAG success
criteria, remediation, manual tests, human-reviewer profiles and applicability — grounded in
the same catalogue the scanner uses. It is pure and offline: no network, browser or
credentials.

Tools: `list_standards`, `list_success_criteria`, `get_success_criterion`,
`search_success_criteria`, `get_remediation`, `get_understanding`, `check_applicability`,
plus the `wcag://catalog` and `wcag://sc/{num}` resources and a `review-page-against-wcag`
prompt.

Add it to any MCP client:

```json
{
  "mcpServers": {
    "ascent-accessibility": {
      "command": "npx",
      "args": ["-y", "ascent-accessibility-mcp"]
    }
  }
}
```

Or build and run the Docker image (build context is the repository root):

```bash
docker build -f mcp/Dockerfile -t ascent-accessibility-mcp .
docker run -i --rm ascent-accessibility-mcp
```

See [`mcp/README.md`](mcp/README.md) for all tools and client config, and
[`SKILL.md`](SKILL.md) for the bundled Agent Skill.

## Layout note

This is a source release extracted from the full product. Module paths use the `@/` alias
(mapping to `src/`) — see `tsconfig.json`. A few engine types reference the product's
`src/db/schema.ts` (PostgreSQL record shapes); those are included for completeness.

## Source & sync

This repo is the MIT-licensed engine source release. It is synced automatically from the
private product repository by a GitHub Actions workflow: `src/lib/{engine, ai-review,
standards, scanner, scoring}`, `mcp/`, `glama.json` and `SKILL.md` are mirrored —
application, account, and training (exam/answer) code are never copied. Contributions
should target the upstream product repository.

## License

MIT — see [LICENSE](LICENSE).

## Contact

Ascent Partners Foundation — [accessibility.ascent.partners](https://accessibility.ascent.partners).
