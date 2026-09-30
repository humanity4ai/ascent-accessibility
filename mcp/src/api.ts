/**
 * Pure, JSON-serializable data functions over the WCAG knowledge base. These
 * are the implementation of every MCP tool; keeping them free of any transport
 * or SDK dependency makes them directly unit-testable.
 */

import {
  DEFAULT_STANDARD_ID,
  EMPTY_FEATURES,
  STANDARDS,
  WCAG_SCS,
  checkScApplicability,
  communitiesAffectedBySc,
  getManualTest,
  getSc,
  getScRemediation,
  getStandard,
  guidelineName,
  guidelineOf,
  instructionsOf,
  naturesOf,
  principleName,
  scReviewer,
  scTitle,
  scsForStandard,
  specUrl,
  standardName,
  understandingFor,
  understandingHref,
  understandingUrl,
} from "./standards";
import type { PageFeatures, Standard, WcagLevel } from "./standards";

export type Locale = "en" | "zh-Hant" | "zh-Hans";

export interface StandardSummary {
  id: string;
  name: string;
  version: string;
  level: WcagLevel | null;
  tags: string[];
  successCriteriaCount: number;
}

export interface CriterionSummary {
  num: string;
  title: string;
  level: WcagLevel;
  principle: number;
  guideline: string;
  guidelineName: string;
}

export interface CriterionDetail extends CriterionSummary {
  principleName: string;
  introducedIn: string;
  removedIn: string | null;
  specUrl: string;
  understandingUrl: string;
  understandingHref: string;
  natures: string[];
  instructions: unknown[];
  manualTest: string;
  remediation: string;
  reviewer: { profile: string; why: string } | null;
  communities: string[];
}

function summarize(sc: {
  num: string;
  level: WcagLevel;
  principle: number;
}): CriterionSummary {
  const guideline = guidelineOf(sc.num);
  return {
    num: sc.num,
    title: scTitle(sc.num),
    level: sc.level,
    principle: sc.principle,
    guideline,
    guidelineName: guidelineName(guideline),
  };
}

export function listStandardsData(locale?: string): StandardSummary[] {
  return STANDARDS.map((s: Standard) => ({
    id: s.id,
    name: standardName(s.id, locale) || s.name,
    version: s.version,
    level: s.level,
    tags: s.tags,
    successCriteriaCount: s.level === null ? 0 : scsForStandard(s.version, s.level).length,
  }));
}

export interface ListCriteriaInput {
  standard?: string | undefined;
  version?: string | undefined;
  level?: WcagLevel | undefined;
  principle?: number | undefined;
}

export function listCriteriaData(
  input: ListCriteriaInput,
  locale?: string,
): CriterionSummary[] {
  // A named standard selects the cumulative criteria for its version + level.
  if (input.standard) {
    const standard = getStandard(input.standard);
    const level = standard?.level ?? null;
    if (!standard || level === null) return [];
    return scsForStandard(standard.version, level).map((sc) => ({
      ...summarize(sc),
      title: scTitle(sc.num, locale),
    }));
  }

  return WCAG_SCS.filter((sc) => {
    if (input.version && sc.introducedIn > input.version) return false;
    if (input.level && sc.level !== input.level) return false;
    if (input.principle && sc.principle !== input.principle) return false;
    // Never surface criteria withdrawn from the requested version.
    if (sc.removedIn && (!input.version || sc.removedIn <= input.version)) {
      return false;
    }
    return true;
  }).map((sc) => ({ ...summarize(sc), title: scTitle(sc.num, locale) }));
}

export function getCriterionData(num: string, locale?: string): CriterionDetail | null {
  const sc = getSc(num);
  if (!sc) return null;
  const guideline = guidelineOf(sc.num);
  const reviewer = scReviewer(num, locale) ?? null;
  return {
    num: sc.num,
    title: scTitle(num, locale),
    level: sc.level,
    principle: sc.principle,
    principleName: principleName(sc.principle, locale),
    guideline,
    guidelineName: guidelineName(guideline, locale),
    introducedIn: sc.introducedIn,
    removedIn: sc.removedIn ?? null,
    specUrl: specUrl(sc),
    understandingUrl: understandingUrl(sc),
    understandingHref: understandingHref(num, locale),
    natures: [...naturesOf(num)],
    instructions: instructionsOf(num),
    manualTest: getManualTest(num, locale),
    remediation: getScRemediation(num, locale),
    reviewer,
    communities: [...communitiesAffectedBySc(num)],
  };
}

export function searchCriteriaData(query: string, limit: number, locale?: string): CriterionSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const cap = Math.max(1, Math.min(limit, 50));
  return WCAG_SCS.filter((sc) => {
    const title = scTitle(sc.num, locale).toLowerCase();
    return sc.num.toLowerCase().includes(q) || title.includes(q) || sc.slug.includes(q);
  })
    .slice(0, cap)
    .map((sc) => ({ ...summarize(sc), title: scTitle(sc.num, locale) }));
}

export function getRemediationData(
  num: string,
  locale?: string,
): { num: string; title: string; remediation: string } | null {
  const sc = getSc(num);
  if (!sc) return null;
  return { num: sc.num, title: scTitle(num, locale), remediation: getScRemediation(num, locale) };
}

export function getUnderstandingData(
  num: string,
  locale: string,
): { num: string; href: string; understanding: unknown } | null {
  const sc = getSc(num);
  if (!sc) return null;
  const understanding = understandingFor(num, locale);
  if (!understanding) return null;
  return { num: sc.num, href: understandingHref(num, locale), understanding };
}

export interface ApplicabilityResult {
  num: string;
  title: string;
  applicability: "applicable" | "not-applicable";
}

export function checkApplicabilityData(
  num: string,
  features: Partial<PageFeatures>,
): ApplicabilityResult | null {
  const sc = getSc(num);
  if (!sc) return null;
  const merged: PageFeatures = { ...EMPTY_FEATURES, ...features };
  return {
    num: sc.num,
    title: scTitle(num),
    applicability: checkScApplicability(num, merged),
  };
}

/** Provenance surfaced as MCP server metadata. */
export const DEFAULT_STANDARD = DEFAULT_STANDARD_ID;
