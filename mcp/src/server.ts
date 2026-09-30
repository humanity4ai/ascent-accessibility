#!/usr/bin/env node
/**
 * Ascent Accessibility MCP server — a pure WCAG 2.2 knowledge-base server.
 *
 * Speaks the Model Context Protocol over stdio. It performs no network or
 * browser work: every tool reads from the static standards catalogue.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerTools } from "./tools";

const server = new McpServer({
  name: "ascent-accessibility",
  version: "0.1.0",
});

registerTools(server);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr only — stdout is reserved for JSON-RPC framing.
  console.error("ascent-accessibility-mcp ready (stdio)");
}

main().catch((error: unknown) => {
  console.error("ascent-accessibility-mcp fatal error:", error);
  process.exit(1);
});
