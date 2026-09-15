import type { Impact } from "@/lib/scoring";
import type { Finding } from "@/db/schema";
import { getSc, specUrl } from "@/lib/standards/wcag-sc";
import { verdictLabel } from "@/lib/site/labels";
import type { AiBudget, AiReview, VisionModel, VisionReviewTools } from "./types";
import { buildScPrompt, buildTriageSystemPrompt } from "./prompt";
import { getAiConfig } from "./config-store";
import type { ScAiConfig } from "./sc-config";
import { resolveSettings } from "./settings";

export const AI_CONFIDENCE_THRESHOLD = 0.8;

export type GetConfig = (sc: string) => Promise<ScAiConfig>;

// Locale-aware fallback reasoning for the no-model / error paths. These short
// strings are stored as finding reasoning and would otherwise render English.
const FALLBACK_REASONING: Record<string, Record<string, string>> = {
  en: {
    noVerdict: "no verdict returned",
    configDisabled: "config disabled",
    notJudgeable: "not judgeable from available evidence",
    modelError: "model or parse error",
    leaning: "model did not decide; leaning {lean}",
  },
  "zh-Hant": {
    noVerdict: "未回傳判定",
    configDisabled: "設定已停用",
    notJudgeable: "無法從現有證據判斷",
    modelError: "模型或解析錯誤",
    leaning: "模型未做決定；傾向判定為 {lean}",
  },
  "zh-Hans": {
    noVerdict: "未返回判定",
    configDisabled: "配置已禁用",
    notJudgeable: "无法从现有证据判断",
    modelError: "模型或解析错误",
    leaning: "模型未做决定；倾向判定为 {lean}",
  },
};

function fallbackReasoning(key: string, locale?: string, lean?: string): string {
  const map = FALLBACK_REASONING[locale ?? ""] ?? FALLBACK_REASONING["en"];
  const text = map?.[key] ?? FALLBACK_REASONING["en"]?.[key] ?? key;
  return lean !== undefined ? text.replace("{lean}", lean) : text;
}

export function resolveVerdict(
  sc: string,
  verdicts: readonly AiReview[],
  _threshold: number = AI_CONFIDENCE_THRESHOLD,
  locale?: string,
): AiReview {
  const found = verdicts.find((v) => v.sc === sc);
  if (!found) return { sc, verdict: "Failed", confidence: 0, reasoning: fallbackReasoning("noVerdict", locale) };
  if (found.verdict === "Passed" || found.verdict === "Failed") {
    // The agentic backstop always asserts a verdict — keep the model's judgment
    // regardless of confidence (single-source provenance, never "cannot tell").
    return found;
  }
  // The model returned "NotTested": lean toward the more likely outcome.
  const lean = found.confidence >= 0.5 ? "Passed" : "Failed";
  const localizedLean = locale === "zh-Hans" || locale === "zh-Hant" ? verdictLabel(lean, locale) : lean;
  return {
    sc,
    verdict: lean,
    confidence: found.confidence,
    reasoning: found.reasoning || fallbackReasoning("leaning", locale, localizedLean),
  };
}

export function impactForScLevel(sc: string): Impact {
  const level = getSc(sc)?.level;
  if (level === "A") return "serious";
  if (level === "AA") return "moderate";
  return "minor";
}

// Build a finding that matches the engine `Finding` shape: curated rule id,
// description, recommendation, and help from the config; the model's reasoning
// is preserved as evidence (instances/sources), never as prose.
export function aiFailToFinding(config: ScAiConfig, review: AiReview, pageUrl: string): Finding {
  const sc = getSc(config.sc);
  const impact = impactForScLevel(config.sc);
  return {
    ruleId: config.ruleId,
    impact,
    description: config.description,
    pageUrl,
    elementCount: 1,
    recommendation: config.recommendation,
    help: config.help,
    helpUrl: sc ? specUrl(sc) : "",
    wcagSc: [config.sc],
    wcagLevel: sc?.level ?? null,
    scTitle: sc?.title ?? config.sc,
    confidence: "single-source",
    sources: [{ tool: "ai", ruleId: config.ruleId, impact, message: review.reasoning }],
    instances: [
      {
        target: "",
        html: "",
        failureSummary: review.reasoning,
        evidenceId: review.evidenceId ?? null,
      },
    ],
  };
}

export async function applyAiVerdicts(
  findings: Finding[],
  passedScs: ReadonlySet<string>,
  verdicts: readonly AiReview[],
  pageUrl: string,
  getConfig: GetConfig = getAiConfig,
): Promise<{ findings: Finding[]; passedScs: Set<string> }> {
  const nextFindings = [...findings];
  const nextPassed = new Set(passedScs);
  for (const review of verdicts) {
    if (review.verdict === "Passed") nextPassed.add(review.sc);
    else if (review.verdict === "Failed") {
      const config = await getConfig(review.sc);
      nextFindings.push(aiFailToFinding(config, review, pageUrl));
    }
  }
  return { findings: nextFindings, passedScs: nextPassed };
}

export interface TriageInput {
  model: VisionModel;
  image: Buffer;
  unresolvedScs: string[];
  incompleteContext?: string[] | undefined;
  threshold?: number | undefined;
  getConfig?: GetConfig | undefined;
  locale?: string | undefined;
  pageLanguages?: string[] | undefined;
  tools?: VisionReviewTools | undefined;
}

export interface TriageOutput {
  reviews: AiReview[];
  budget: AiBudget;
}

// Run `fn` over `items` with bounded concurrency, preserving input order in the
// output. Each worker pulls the next item from a shared cursor.
async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, async () => {
    for (;;) {
      const i = cursor++;
      if (i >= items.length) break;
      results[i] = await fn(items[i]!);
    }
  });
  await Promise.all(workers);
  return results;
}

// Concurrency for the per-SC model calls. When browser tools are present the
// agentic loop drives a single shared page, so it stays serialized; otherwise a
// screenshot-only review is a stateless HTTP call that parallelizes safely.
const AI_REVIEW_CONCURRENCY = Math.max(1, Number(process.env.AI_REVIEW_CONCURRENCY ?? 4));

// One model call per judgeable criterion, each with its own config-driven
// prompt + settings. Non-judgeable/disabled criteria are not-tested with zero
// calls; a model/parse error retries once, then fails safe to NotTested.
export async function runTriage(input: TriageInput): Promise<TriageOutput> {
  const unresolved = input.unresolvedScs;
  if (unresolved.length === 0) {
    return { reviews: [], budget: { calls: 0, images: 0 } };
  }

  const concurrency = input.tools ? 1 : AI_REVIEW_CONCURRENCY;

  const results = await mapWithConcurrency(unresolved, concurrency, async (sc) => {
    const config = await (input.getConfig ?? getAiConfig)(sc);

    if (!config.enabled) {
      return { review: { sc, verdict: "NotTested", confidence: 0, reasoning: fallbackReasoning("configDisabled", input.locale) } as AiReview, called: false };
    }
    // With browser tools available, criteria that a screenshot alone can't decide
    // (DOM order, focus/hover, error states, status messages) become judgeable.
    const judgeable = config.judgeable || input.tools !== undefined;
    if (!judgeable) {
      return { review: { sc, verdict: "NotTested", confidence: 0, reasoning: fallbackReasoning("notJudgeable", input.locale) } as AiReview, called: false };
    }

    const settings = resolveSettings(config.settings);
    const prompt = buildScPrompt(config, input.locale);
    const system = buildTriageSystemPrompt(input.locale, input.pageLanguages);

    let raw: AiReview[] | null = null;
    for (let attempt = 0; attempt <= settings.retries && raw === null; attempt++) {
      try {
        raw = await input.model.review({ image: input.image, prompt, system, settings, tools: input.tools });
      } catch {
        raw = null;
      }
    }

    if (raw === null) {
      return { review: { sc, verdict: "NotTested", confidence: 0, reasoning: fallbackReasoning("modelError", input.locale) } as AiReview, called: true };
    }
    return { review: resolveVerdict(sc, raw, settings.confidenceThreshold, input.locale), called: true };
  });

  const reviews = results.map((r) => r.review);
  const calls = results.reduce((sum, r) => sum + (r.called ? 1 : 0), 0);
  return { reviews, budget: { calls, images: calls } };
}
