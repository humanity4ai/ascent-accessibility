import { describe, expect, it } from "vitest";

import {
  checkApplicabilityData,
  getCriterionData,
  getRemediationData,
  getUnderstandingData,
  listCriteriaData,
  listStandardsData,
  searchCriteriaData,
} from "../src/api";

describe("listStandardsData", () => {
  it("includes the default WCAG 2.2 AA standard with a criteria count", () => {
    const standards = listStandardsData();
    const aa = standards.find((s) => s.id === "wcag22aa");
    expect(aa).toBeDefined();
    expect(aa?.successCriteriaCount).toBeGreaterThan(40);
    expect(aa?.tags).toContain("wcag22aa");
  });

  it("localises standard names when a locale is supplied", () => {
    const zh = listStandardsData("zh-Hant").find((s) => s.id === "wcag22aa");
    expect(zh?.name).toBeTruthy();
  });
});

describe("listCriteriaData", () => {
  it("returns the cumulative set for a named standard", () => {
    const criteria = listCriteriaData({ standard: "wcag22aa" });
    expect(criteria.length).toBeGreaterThan(40);
    expect(criteria.some((c) => c.num === "1.1.1")).toBe(true);
  });

  it("omits success criteria removed from the requested version", () => {
    const criteria = listCriteriaData({ version: "2.2" });
    expect(criteria.some((c) => c.num === "4.1.1")).toBe(false);
  });

  it("filters by level", () => {
    const aaa = listCriteriaData({ level: "AAA" });
    expect(aaa.length).toBeGreaterThan(0);
    expect(aaa.every((c) => c.level === "AAA")).toBe(true);
  });

  it("returns an empty list for an unknown standard", () => {
    expect(listCriteriaData({ standard: "does-not-exist" })).toEqual([]);
  });
});

describe("getCriterionData", () => {
  it("returns full detail for a known criterion", () => {
    const detail = getCriterionData("1.1.1");
    expect(detail).not.toBeNull();
    expect(detail?.title.length).toBeGreaterThan(0);
    expect(detail?.specUrl).toMatch(/^https:\/\/www\.w3\.org\//);
    expect(detail?.natures.length).toBeGreaterThan(0);
    expect(detail?.remediation.length).toBeGreaterThan(0);
    expect(detail?.communities.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown criterion", () => {
    expect(getCriterionData("9.9.9")).toBeNull();
  });
});

describe("searchCriteriaData", () => {
  it("finds a criterion by title keyword", () => {
    const hits = searchCriteriaData("contrast", 10);
    expect(hits.some((c) => c.num === "1.4.3")).toBe(true);
  });

  it("respects the result limit", () => {
    expect(searchCriteriaData("a", 3).length).toBeLessThanOrEqual(3);
  });

  it("returns nothing for an empty query", () => {
    expect(searchCriteriaData("   ", 10)).toEqual([]);
  });
});

describe("getRemediationData", () => {
  it("returns remediation for a known criterion", () => {
    const data = getRemediationData("1.4.3");
    expect(data?.remediation.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown criterion", () => {
    expect(getRemediationData("9.9.9")).toBeNull();
  });
});

describe("getUnderstandingData", () => {
  it("returns localised Understanding content for zh-Hant", () => {
    const data = getUnderstandingData("1.1.1", "zh-Hant");
    expect(data).not.toBeNull();
    expect(data?.understanding).toBeTruthy();
  });

  it("returns null when no localised content exists", () => {
    expect(getUnderstandingData("1.1.1", "en")).toBeNull();
  });
});

describe("checkApplicabilityData", () => {
  it("marks a video criterion applicable when video is present", () => {
    const result = checkApplicabilityData("1.2.2", { hasVideo: true });
    expect(result?.applicability).toBe("applicable");
  });

  it("returns null for an unknown criterion", () => {
    expect(checkApplicabilityData("9.9.9", {})).toBeNull();
  });
});
