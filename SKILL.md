---
name: ascent-accessibility
description: >-
  Review web pages and UI against WCAG 2.2 (A/AA/AAA) using the Ascent
  Accessibility knowledge base. Use when auditing accessibility, checking
  conformance, explaining a success criterion, finding remediation steps for a
  barrier, deciding whether a criterion applies, or planning a manual
  accessibility review. Wraps the ascent-accessibility-mcp server (tools:
  list_standards, list_success_criteria, get_success_criterion,
  search_success_criteria, get_remediation, get_understanding,
  check_applicability).
license: MIT
---

# Ascent Accessibility (WCAG 2.2) skill

Use this skill for anything involving **WCAG conformance** or **accessibility
remediation**. It grounds answers in the same success-criteria catalogue the
Ascent Accessibility scanner uses, instead of paraphrasing WCAG from memory.

## When to use

- Auditing a page/component for accessibility barriers.
- Explaining a WCAG success criterion (e.g. "what does 1.4.3 require?").
- Producing remediation steps for a specific barrier.
- Deciding whether a criterion even applies to a page.
- Planning a manual review and identifying who a failure affects.

## Setup

The skill assumes the `ascent-accessibility` MCP server is connected:

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

## Workflow

1. **Scope the standard.** Call `list_standards`; pick the target (default
   `wcag22aa` = WCAG 2.2 AA).
2. **Enumerate criteria.** Call `list_success_criteria` with `standard` (or
   filter by `version`/`level`/`principle`).
3. **Rule out the inapplicable.** Use `check_applicability` with the page's
   feature flags (e.g. `{ "hasVideo": true }`) to drop criteria that cannot
   apply.
4. **Deep-dive each remaining criterion.** Call `get_success_criterion` for the
   manual test, remediation, machine/AI/manual nature, the human-reviewer
   profile, and the disability communities affected.
5. **Find guidance fast.** Use `search_success_criteria` for a keyword, and
   `get_remediation` when you only need the fix.
6. **Localised explanations.** Use `get_understanding` for `zh-Hant` / `zh-Hans`
   intent text; use the W3C Understanding URL from `get_success_criterion` for
   English.

## Output rules

- Cite the **success criterion number and title** for every finding.
- Distinguish what a machine can test from what needs **human review**
  (`get_success_criterion` → `natures` and `reviewer`).
- Group findings by WCAG principle (Perceivable, Operable, Understandable,
  Robust) and by severity.
- Never invent criterion numbers or remediation — always read them from the
  tools.
