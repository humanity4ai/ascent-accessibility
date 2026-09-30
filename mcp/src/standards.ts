/**
 * Single import surface over the (MIT-licensed) WCAG knowledge base that lives
 * in `src/lib/standards`. Every re-export here is pure data / pure functions —
 * no browser, no database, no network — so it bundles cleanly into the
 * published `ascent-accessibility-mcp` server.
 *
 * Imports are relative (`../../src/...`) and alias-based (`@/...`), both of
 * which resolve in the private repo, in the public engine repo, and at esbuild
 * bundle time via `tsconfig.json` paths.
 */

export {
  DEFAULT_STANDARD_ID,
  STANDARDS,
  getDefaultStandard,
  getStandard,
  listStandards,
  wcagReference,
} from "../../src/lib/standards/catalog";
export type { Standard, WcagLevel } from "../../src/lib/standards/catalog";

export { scsForStandard } from "../../src/lib/standards/version";

export {
  WCAG_GUIDELINES,
  WCAG_SCS,
  getSc,
  guidelineName,
  guidelineOf,
  guidelinePrinciple,
  principleName,
  scFromTag,
  scTitle,
  scsForTags,
  specUrl,
  understandingUrl,
} from "../../src/lib/standards/wcag-sc";
export type { WcagGuideline, WcagSc, WcagVersion } from "../../src/lib/standards/wcag-sc";

export { STANDARD_STRINGS, standardName, standardsFor } from "../../src/lib/standards/standards-locales";
export type { StandardStrings } from "../../src/lib/standards/standards-locales";

export { getManualTest } from "../../src/lib/standards/sc-manual-tests";
export { getScRemediation } from "../../src/lib/standards/sc-remediation";

export { reviewableScs, scReviewer } from "../../src/lib/standards/sc-reviewers";
export type { ReviewerProfile, ScReviewer } from "../../src/lib/standards/sc-reviewers";

export { NOT_APPLICABLE, instructionsOf, naturesOf } from "../../src/lib/standards/nature";
export type { AiModality, Instruction, ScNature } from "../../src/lib/standards/nature";

export { isInternalHref, understandingFor, understandingHref } from "../../src/lib/standards/understanding";
export type { UnderstandingSc } from "../../src/lib/standards/understanding";

export {
  EMPTY_FEATURES,
  checkScApplicability,
  mergeFeatures,
} from "../../src/lib/standards/sc-applicability";
export type { Applicability, PageFeatures } from "../../src/lib/standards/sc-applicability";

export { SC_AFFECTED_COMMUNITIES, communitiesAffectedBySc } from "../../src/lib/standards/sc-communities";
export type { CommunityId } from "../../src/lib/standards/sc-communities";
