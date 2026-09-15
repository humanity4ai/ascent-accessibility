// The "decision-point contract" for AI-assisted human review. Every success
// criterion the AI cannot resolve maps to a `whyNotAi` category (why a machine
// can't decide — yet), a concrete `humanDecisionPoint` (the exact question the
// reviewer answers), and — per the "no permanently human" principle — a
// `pathToAi` naming the enhancement that would move the category into AI-review.
//
// `HUMAN_DECISION_SCS` is a *snapshot* of the residual human set after the AI
// enhancement phase; it is expected to shrink over time, never to grow
// permanently. `RECLASSIFIED_SCS` is the migration record of SCs that already
// left human review.

export type HumanDecisionCategory =
  | "interaction"
  | "temporal"
  | "dynamic-state"
  | "multipage"
  | "editorial"
  | "domain";

export interface HumanDecisionCategoryDef {
  /** Why the AI cannot decide this category (yet). */
  whyNotAi: string;
  /** The future enhancement that would move this category into AI-review. */
  pathToAi: string;
}

export interface HumanDecisionSc {
  category: HumanDecisionCategory;
  /** The exact question the reviewer answers (English canonical). */
  humanDecisionPoint: string;
}

export const HUMAN_DECISION_CATEGORIES: Record<HumanDecisionCategory, HumanDecisionCategoryDef> = {
  interaction: {
    whyNotAi:
      "Synthetic events in one browser can't reproduce a real user's keyboard/gesture/motion/shortcut input, nor a screen reader's actual announcement order.",
    pathToAi: "Deeper browser/AT automation (real keyboard/gesture emulation, screen-reader output capture).",
  },
  temporal: {
    whyNotAi:
      "The agent evaluates a static snapshot; it can't sit through a session (timeout/interruption) or measure the ≤3 Hz flash threshold.",
    pathToAi: "Session simulation + timed observation + flash-frequency analysis.",
  },
  "dynamic-state": {
    whyNotAi:
      "The crawl can't reliably force every invalid submission, so the error/status state may never exist to evidence.",
    pathToAi: "Full form automation (enumerate + drive every invalid path).",
  },
  multipage: {
    whyNotAi: "Scoring is per-page today; cross-page comparison isn't wired.",
    pathToAi: "Multi-page AI context (crawl-wide evidence in the tool loop).",
  },
  editorial: {
    whyNotAi:
      '"Meaningful / clear / plain / appropriate reading level" is audience-relative; a wrong PASS is worse than a flag.',
    pathToAi: "Calibrated language-model judgment with audience context.",
  },
  domain: {
    whyNotAi:
      '"Substantial legal/financial commitment" / "cognitive function test" requires the site owner\'s domain knowledge.',
    pathToAi: "Domain-aware classification config (owner-declared flow intent).",
  },
};

// Residual SCs a human must still decide after the AI-enhancement phase,
// keyed by SC number. This is a snapshot, not a permanent division.
export const HUMAN_DECISION_SCS: Record<string, HumanDecisionSc> = {
  "1.1.1": {
    category: "editorial",
    humanDecisionPoint:
      "Is the alternative text a faithful, meaningful description of each image's content/function, with a longer description where needed?",
  },
  "1.2.8": {
    category: "editorial",
    humanDecisionPoint: "Does the text alternative present equivalent information to the prerecorded media?",
  },
  "1.3.1": {
    category: "interaction",
    humanDecisionPoint: "Does a screen reader announce the relationships/structure correctly?",
  },
  "1.4.8": {
    category: "editorial",
    humanDecisionPoint: "Do the visual-presentation controls meet the required thresholds?",
  },
  "2.1.3": {
    category: "interaction",
    humanDecisionPoint: "Can the entire content be operated from the keyboard alone, with no exception?",
  },
  "2.1.4": {
    category: "interaction",
    humanDecisionPoint: "Do single-character shortcuts meet the turn-off/remap/active-only rule?",
  },
  "2.2.4": {
    category: "temporal",
    humanDecisionPoint: "Can interruptions be postponed or suppressed by the user?",
  },
  "2.2.5": {
    category: "temporal",
    humanDecisionPoint: "Is entered data preserved when re-authenticating after a session expiry?",
  },
  "2.2.6": {
    category: "temporal",
    humanDecisionPoint: "Is the timeout essential, or does the user get a warning/extension?",
  },
  "2.3.1": {
    category: "temporal",
    humanDecisionPoint: "Does anything flash more than three times per second?",
  },
  "2.3.2": {
    category: "temporal",
    humanDecisionPoint: "Does anything flash more than three times per second?",
  },
  "2.5.1": {
    category: "interaction",
    humanDecisionPoint: "Is a single-pointer alternative available for every path-based gesture?",
  },
  "2.5.4": {
    category: "interaction",
    humanDecisionPoint: "Is motion actuation non-essential, or is an alternative provided / can it be disabled?",
  },
  "2.5.6": {
    category: "interaction",
    humanDecisionPoint: "Can the user use concurrent input mechanisms (e.g. touch + keyboard)?",
  },
  "3.1.5": {
    category: "editorial",
    humanDecisionPoint:
      "Is the prose at an appropriate reading level for the audience (or is a plain-language version provided)?",
  },
  "3.1.6": {
    category: "editorial",
    humanDecisionPoint: "Where pronunciation affects meaning, is a mechanism provided?",
  },
  "3.2.3": {
    category: "multipage",
    humanDecisionPoint: "Is the navigation order/position consistent across pages?",
  },
  "3.2.4": {
    category: "multipage",
    humanDecisionPoint: "Are components with the same function identified consistently across pages?",
  },
  "3.2.5": {
    category: "interaction",
    humanDecisionPoint: "Is a change of context initiated only on user request, or can it be turned off?",
  },
  "3.3.4": {
    category: "domain",
    humanDecisionPoint:
      "Does this flow involve a legal/financial/data commitment requiring reversible, checked, confirmed submission?",
  },
  "3.3.6": {
    category: "domain",
    humanDecisionPoint:
      "Does this flow involve a legal/financial/data commitment requiring reversible, checked, confirmed submission?",
  },
  "3.3.8": {
    category: "domain",
    humanDecisionPoint: "Does the login use a cognitive-function test? Is an alternative or object-recognition method present?",
  },
  "3.3.9": {
    category: "domain",
    humanDecisionPoint: "Does the login use a cognitive-function test? Is an alternative or object-recognition method present?",
  },
  "4.1.2": {
    category: "interaction",
    humanDecisionPoint: "Does a screen reader announce the name/role/value correctly?",
  },
  "4.1.3": {
    category: "dynamic-state",
    humanDecisionPoint: "When dynamic content changes, is a status/alert/live region present?",
  },
};

// SCs that left human review in the AI-enhancement phase (migration record).
export const RECLASSIFIED_SCS: readonly string[] = ["3.2.1", "3.2.2"];

export function humanDecisionFor(sc: string): HumanDecisionSc | undefined {
  return HUMAN_DECISION_SCS[sc];
}

// Locale overlays for the category rationale shown to end users ("why AI can't
// decide this"). The reviewer-facing `humanDecisionPoint` stays English as the
// internal review contract.
const CATEGORY_LOCALES: Record<
  string,
  Record<HumanDecisionCategory, { whyNotAi: string; pathToAi: string }>
> = {
  "zh-Hant": {
    interaction: {
      whyNotAi: "單一瀏覽器中的合成事件無法重現真實用戶的鍵盤/手勢/動作/快捷鍵輸入，也無法重現屏幕閱讀器的實際播報順序。",
      pathToAi: "更深入的瀏覽器/輔助科技自動化（真實鍵盤/手勢模擬、屏幕閱讀器輸出擷取）。",
    },
    temporal: {
      whyNotAi: "代理程式評估的是靜態快照，無法完整經歷一個工作階段（逾時/中斷），也無法量測 ≤3 Hz 的閃爍門檻。",
      pathToAi: "工作階段模擬 + 定時觀察 + 閃爍頻率分析。",
    },
    "dynamic-state": {
      whyNotAi: "爬蟲無法可靠地觸發每一次無效提交，因此錯誤/狀態狀態可能從未出現以供取證。",
      pathToAi: "完整的表格自動化（列舉並驅動每一個無效路徑）。",
    },
    multipage: {
      whyNotAi: "目前評分是逐頁進行；跨頁比較尚未串接。",
      pathToAi: "多頁 AI 上下文（工具迴圈中納入整個爬蟲範圍的證據）。",
    },
    editorial: {
      whyNotAi: "「有意義 / 清楚 / 平易 / 適當的閱讀程度」會因受眾而異；錯誤的通過比標記更糟。",
      pathToAi: "校準過的語言模型判斷，並帶有受眾上下文。",
    },
    domain: {
      whyNotAi: "「重大的法律/財務承諾」 / 「認知功能測試」需要網站擁有者的領域知識。",
      pathToAi: "領域感知的分類設定（擁有者宣告的流程意圖）。",
    },
  },
  "zh-Hans": {
    interaction: {
      whyNotAi: "单一浏览器中的合成事件无法重现真实用户的键盘/手势/动作/快捷键输入，也无法重现屏幕阅读器的实际播报顺序。",
      pathToAi: "更深入的浏览器/辅助技术自动化（真实键盘/手势模拟、屏幕阅读器输出捕获）。",
    },
    temporal: {
      whyNotAi: "代理程序评估的是静态快照，无法完整经历一个会话（超时/中断），也无法测量 ≤3 Hz 的闪烁门槛。",
      pathToAi: "会话模拟 + 定时观察 + 闪烁频率分析。",
    },
    "dynamic-state": {
      whyNotAi: "爬虫无法可靠地触发每一次无效提交，因此错误/状态状态可能从未出现以供取证。",
      pathToAi: "完整的表单自动化（列举并驱动每一个无效路径）。",
    },
    multipage: {
      whyNotAi: "目前评分是逐页进行；跨页比较尚未连接。",
      pathToAi: "多页 AI 上下文（工具循环中纳入整个爬虫范围的证据）。",
    },
    editorial: {
      whyNotAi: "“有意义 / 清楚 / 平易 / 适当的阅读程度”会因受众而异；错误的通过比标记更糟。",
      pathToAi: "校准过的语言模型判断，并带有受众上下文。",
    },
    domain: {
      whyNotAi: "“重大的法律/财务承诺” / “认知功能测试”需要网站拥有者的领域知识。",
      pathToAi: "领域感知的分类设置（拥有者声明的流程意图）。",
    },
  },
};

export function categoryLocale(
  category: HumanDecisionCategory,
  locale?: string,
): { whyNotAi: string; pathToAi: string } | undefined {
  if (!locale || locale === "en") return undefined;
  return CATEGORY_LOCALES[locale]?.[category];
}
