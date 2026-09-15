import {
  mapViolations,
  mapRuleSummary,
  ScanFailedError,
  type RawScanResult,
  type ScanResult,
  type ScannerPage,
} from "@/lib/scanner";
import type { PageFeatures } from "@/lib/standards/sc-applicability";

export async function runEngine(
  url: string,
  tags: string[],
  page: ScannerPage,
): Promise<ScanResult> {
  let response: { status(): number } | null;
  try {
    response = await page.goto(url, { timeout: 45_000, waitUntil: "domcontentloaded" });
  } catch (error) {
    throw new ScanFailedError(`Could not load ${url}: ${(error as Error).message}`);
  }

  const status = response?.status();
  if (status !== undefined && (status < 200 || status >= 400)) {
    throw new ScanFailedError(`Could not load ${url}: HTTP ${status}`);
  }

  // Wait for the `load` event (bounded) so client-rendered content settles, then a
  // short settle for post-load microtasks. `networkidle` is deliberately avoided —
  // it is unreliable on streaming/polling/analytics pages. Never wait indefinitely.
  const loadTimeoutMs = Number(process.env.SCAN_LOAD_TIMEOUT_MS ?? 3000);
  await page.waitForLoadState("load", { timeout: loadTimeoutMs }).catch(() => {
    /* load never fired within the budget — proceed with the DOM we have */
  });
  const settleMs = Number(process.env.SCAN_SETTLE_MS ?? 500);
  await new Promise((resolve) => setTimeout(resolve, settleMs));

  const result = (await page.evaluate((runTags) => {
    const engine = (
      globalThis as { __apfEngine?: { run: (t: string[]) => unknown } }
    ).__apfEngine;
    if (!engine) throw new Error("Ascent Accessibility engine failed to load");
    return engine.run(runTags);
  }, tags)) as RawScanResult & { features: PageFeatures };

  return {
    url,
    violations: mapViolations(result),
    passes: (result.passes ?? []).map(mapRuleSummary),
    incomplete: (result.incomplete ?? []).map(mapRuleSummary),
    inapplicable: (result.inapplicable ?? []).map(mapRuleSummary),
    features: result.features,
    mediaUrls: result.mediaUrls ?? [],
    errors: (result.errors ?? []).map((e) => ({
      ruleId: e.ruleId,
      phase: e.phase === "check" ? "check" : "extract",
      message: e.message,
    })),
  };
}
