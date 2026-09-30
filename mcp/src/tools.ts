/**
 * MCP surface: registers the WCAG knowledge-base tools, resources and prompt
 * on an `McpServer`. All logic lives in `./api` (pure) so it can be tested
 * without a transport.
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  checkApplicabilityData,
  getCriterionData,
  getRemediationData,
  getUnderstandingData,
  listCriteriaData,
  listStandardsData,
  searchCriteriaData,
  DEFAULT_STANDARD,
} from "./api";
import type { PageFeatures, WcagLevel } from "./standards";

const localeSchema = z
  .enum(["en", "zh-Hant", "zh-Hans"])
  .describe('Report language: "en" (default), "zh-Hant" (Traditional) or "zh-Hans" (Simplified).')
  .optional();

const levelSchema = z.enum(["A", "AA", "AAA"]).describe("WCAG conformance level filter.").optional();
const versionSchema = z.enum(["2.0", "2.1", "2.2"]).describe("WCAG version filter.").optional();

type ToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

function json(value: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

function notFound(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "list_standards",
    {
      title: "List standards",
      description:
        "List the accessibility standards Ascent Accessibility supports (WCAG 2.0/2.1/2.2 at A/AA/AAA), with tags and the number of success criteria each contains.",
      inputSchema: { locale: localeSchema },
    },
    ({ locale }) => json(listStandardsData(locale)),
  );

  server.registerTool(
    "list_success_criteria",
    {
      title: "List success criteria",
      description:
        'List WCAG success criteria. Pass a named `standard` (e.g. "wcag22aa") for the cumulative set it requires, or filter the full catalogue by `version`, `level` and/or `principle` (1=Perceivable, 2=Operable, 3=Understandable, 4=Robust).',
      inputSchema: {
        standard: z.string().describe('Standard id, e.g. "wcag22aa". Defaults to none (full catalogue).').optional(),
        version: versionSchema,
        level: levelSchema,
        principle: z.number().int().min(1).max(4).describe("WCAG principle number (1-4).").optional(),
        locale: localeSchema,
      },
    },
    ({ standard, version, level, principle, locale }) =>
      json(listCriteriaData({ standard, version, level: level as WcagLevel | undefined, principle }, locale)),
  );

  server.registerTool(
    "get_success_criterion",
    {
      title: "Get success criterion",
      description:
        'Full detail for one WCAG success criterion by number (e.g. "1.1.1" or "2.5.8"): title, level, principle, guideline, W3C spec and Understanding URLs, whether it is machine-testable / AI-detectable / manual-only, manual test guidance, remediation guidance, the human reviewer profile that fits it, and the disability communities affected by a failure.',
      inputSchema: {
        num: z.string().describe('Success criterion number, e.g. "1.4.3".'),
        locale: localeSchema,
      },
    },
    ({ num, locale }) => {
      const detail = getCriterionData(num, locale);
      return detail ? json(detail) : notFound(`Unknown success criterion "${num}".`);
    },
  );

  server.registerTool(
    "search_success_criteria",
    {
      title: "Search success criteria",
      description: "Case-insensitive search over WCAG success criterion numbers, titles and slugs.",
      inputSchema: {
        query: z.string().min(1).describe('Search text, e.g. "contrast" or "keyboard".'),
        limit: z.number().int().min(1).max(50).describe("Maximum results (default 10).").optional(),
        locale: localeSchema,
      },
    },
    ({ query, limit, locale }) => json(searchCriteriaData(query, limit ?? 10, locale)),
  );

  server.registerTool(
    "get_remediation",
    {
      title: "Get remediation guidance",
      description: 'Developer remediation guidance for a WCAG success criterion by number (e.g. "1.4.3").',
      inputSchema: {
        num: z.string().describe('Success criterion number, e.g. "1.4.3".'),
        locale: localeSchema,
      },
    },
    ({ num, locale }) => {
      const data = getRemediationData(num, locale);
      return data ? json(data) : notFound(`Unknown success criterion "${num}".`);
    },
  );

  server.registerTool(
    "get_understanding",
    {
      title: "Get Understanding doc",
      description:
        'Localised "Understanding" explanation for a success criterion (normative text, intent, benefits, examples). Only available for "zh-Hant" and "zh-Hans"; use the W3C URL from get_success_criterion for English.',
      inputSchema: {
        num: z.string().describe('Success criterion number, e.g. "2.4.7".'),
        locale: z.enum(["zh-Hant", "zh-Hans"]).describe("Required: the localised locale."),
      },
    },
    ({ num, locale }) => {
      const data = getUnderstandingData(num, locale);
      return data ? json(data) : notFound(`No localised Understanding content for "${num}" (${locale}).`);
    },
  );

  server.registerTool(
    "check_applicability",
    {
      title: "Check criterion applicability",
      description:
        "Decide whether a WCAG success criterion applies to a page given its features (e.g. hasVideo, hasForms, hasImages). Returns \"applicable\" or \"not-applicable\"; use get_success_criterion for the criterion's details.",
      inputSchema: {
        num: z.string().describe('Success criterion number, e.g. "1.2.2".'),
        features: z
          .record(z.boolean())
          .describe("Page feature flags, e.g. { \"hasVideo\": true, \"hasContent\": true }.")
          .optional(),
      },
    },
    ({ num, features }) => {
      const data = checkApplicabilityData(num, (features ?? {}) as Partial<PageFeatures>);
      return data ? json(data) : notFound(`Unknown success criterion "${num}".`);
    },
  );

  // ---- Resources -----------------------------------------------------------
  server.registerResource(
    "wcag-catalog",
    "wcag://catalog",
    {
      title: "WCAG catalogue",
      description: "The supported standards and the full WCAG 2.2 success-criteria catalogue (JSON).",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(
            {
              defaultStandard: DEFAULT_STANDARD,
              standards: listStandardsData(),
              criteria: listCriteriaData({}, undefined),
            },
            null,
            2,
          ),
        },
      ],
    }),
  );

  server.registerResource(
    "wcag-success-criterion",
    new ResourceTemplate("wcag://sc/{num}", { list: undefined }),
    {
      title: "WCAG success criterion",
      description: 'One success criterion as JSON; URI pattern "wcag://sc/{num}" (e.g. wcag://sc/1.1.1).',
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const raw = variables.num;
      const num = Array.isArray(raw) ? raw[0] : raw;
      const detail = num ? getCriterionData(num) : null;
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(detail, null, 2),
          },
        ],
      };
    },
  );

  // ---- Prompt --------------------------------------------------------------
  server.registerPrompt(
    "review-page-against-wcag",
    {
      title: "Review a page against WCAG",
      description:
        "Produce a step-by-step WCAG review plan for a page or component, grounding each step in the success criteria returned by these tools.",
      argsSchema: {
        target: z.string().describe("URL or short description of the page/component to review.").optional(),
        standard: z.string().describe('Standard id to review against, e.g. "wcag22aa".').optional(),
      },
    },
    ({ target, standard }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              `Review ${target ?? "the page"} against ${standard ?? DEFAULT_STANDARD.replace("22aa", " 2.2 AA")}.`,
              "",
              "Use the ascent-accessibility MCP tools:",
              "1. list_success_criteria for the standard, then focus on criteria whose page features apply.",
              "2. For each, call get_success_criterion to read the manual test, remediation and reviewer profile.",
              "3. Use check_applicability where a criterion may not apply.",
              "4. Group findings by principle and severity, cite the success criterion number, and give remediation steps.",
            ].join("\n"),
          },
        },
      ],
    }),
  );
}
