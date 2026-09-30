# ascent-accessibility-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes the **WCAG 2.2 success-criteria knowledge base** used by [Ascent Accessibility](https://accessibility.ascent.partners) — the catalogue, manual-test guidance, remediation steps, human-reviewer profiles, localised *Understanding* content, and applicability logic.

It is **pure and offline**: no network calls, no browser, no credentials. All data is bundled from the MIT-licensed clean-room engine source in [`src/lib/standards`](https://github.com/humanity4ai/ascent-accessibility/tree/main/src/lib/standards).

## Tools

| Tool | Purpose |
| --- | --- |
| `list_standards` | Supported standards (WCAG 2.0/2.1/2.2 × A/AA/AAA) with tags and criteria counts |
| `list_success_criteria` | Criteria for a named standard, or filtered by version / level / principle |
| `get_success_criterion` | Full detail for one criterion (spec + Understanding URLs, nature, manual test, remediation, reviewer, affected communities) |
| `search_success_criteria` | Case-insensitive search over numbers, titles and slugs |
| `get_remediation` | Developer remediation guidance for one criterion |
| `get_understanding` | Localised *Understanding* content (`zh-Hant` / `zh-Hans`) |
| `check_applicability` | Whether a criterion applies to a page given its feature flags |

Plus one resource catalogue (`wcag://catalog`), a per-criterion resource (`wcag://sc/{num}`, e.g. `wcag://sc/1.1.1`) and a `review-page-against-wcag` prompt.

## Install

### Claude Desktop / Cursor / VS Code (stdio)

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

- **Cursor**: *Settings → Features → MCP → + Add New MCP Server* (or `~/.cursor/mcp.json`).
- **Claude Desktop**: *Settings → Developer → Edit Config* (`claude_desktop_config.json`).
- **Claude Code**: `claude mcp add ascent-accessibility npx -y ascent-accessibility-mcp`.
- **VS Code**: Command Palette → `MCP: Add Server`.

## Docker

```bash
docker build -f mcp/Dockerfile -t ascent-accessibility-mcp .
docker run -i --rm ascent-accessibility-mcp
```

## Develop

```bash
cd mcp
npm install
npm run check   # tsc --noEmit
npm test        # vitest
npm run build   # esbuild bundle -> dist/server.js
```

`npm run build` bundles the catalogue from `../src/lib/standards` into a self-contained `dist/server.js`; only `@modelcontextprotocol/sdk` and `zod` stay external.

## License

MIT. The accessibility engine source it is built from is also MIT (`humanity4ai/ascent-accessibility`). WCAG content is © W3C, used under the [W3C Document License](https://www.w3.org/copyright/document-license/).
