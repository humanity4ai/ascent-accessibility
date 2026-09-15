// Locale overlays for machine finding text. The engine rules (`rules/*.ts`) are
// the English source of truth; these overlays supply zh-Hans/zh-Hant
// translations for the user-facing `description`, `help`, and `failureSummary`
// strings keyed by rule id. Failure summaries are keyed by their canonical
// English string so shared summaries (e.g. "could not inspect stylesheets")
// translate once.
//
// Findings are persisted language-agnostically (ruleId + structured data), so
// these overlays localize at render time and retroactively cover old scans.

import { curatedRecommendation } from "@/lib/recommendations";
import { aiFindingLocaleText } from "@/lib/ai-review/sc-config-locales";

export interface FindingLocaleText {
  description: string;
  help: string;
  recommendation?: string;
  failureSummary?: Record<string, string>;
}

type FindingLocale = Record<string, FindingLocaleText>;

export const FINDING_LOCALES: Record<"zh-Hans" | "zh-Hant", FindingLocale> = {
  "zh-Hant": {
    "image-alt": {
      description: "確保 <img> 元素具有替代文字或裝飾性角色",
      help: "圖片必須具有替代文字",
      failureSummary: { "img element has no alt attribute": "img 元素沒有 alt 屬性" },
    },
    "input-image-alt": {
      description: "確保 <input type=\"image\"> 元素具有替代文字",
      help: "圖片按鈕必須具有替代文字",
      failureSummary: { "input[type=image] has no text alternative": "input[type=image] 沒有文字替代" },
    },
    "object-alt": {
      description: "確保 <object> 元素具有替代文字",
      help: "Object 元素必須具有替代文字",
    },
    "svg-img-alt": {
      description: "確保具有 img 角色的 <svg> 元素具有可存取名稱",
      help: "SVG 圖片必須具有可存取名稱",
    },
    "video-caption": {
      description: "確保 <video> 元素具有字幕",
      help: "影片元素必須具有字幕",
      failureSummary: { "video element has no captions track": "video 元素沒有字幕軌道" },
    },
    list: {
      description: "確保清單結構正確",
      help: "<ul> 和 <ol> 必須只直接包含 <li> 元素",
    },
    listitem: {
      description: "確保 <li> 元素以語意方式使用",
      help: "<li> 元素必須包含在 <ul> 或 <ol> 內",
    },
    dlitem: {
      description: "確保 <dt> 和 <dd> 元素包含在 <dl> 內",
      help: "<dt> 和 <dd> 必須位於 <dl> 內",
      failureSummary: { "dt/dd element is not inside a dl": "dt/dd 元素不在 dl 內" },
    },
    "definition-list": {
      description: "確保 <dl> 元素結構正確",
      help: "<dl> 必須只包含 <dt> 和 <dd> 群組",
    },
    region: {
      description: "確保所有頁面內容都包含在地標內",
      help: "所有頁面內容都應包含在地標內",
    },
    "landmark-unique": {
      description: "確保地標是唯一的",
      help: "重複的地標必須具有唯一的標籤",
    },
    "heading-order": {
      description: "確保標題順序語意正確",
      help: "標題層級只能逐級增加",
    },
    "empty-heading": {
      description: "確保標題具有可辨識的文字",
      help: "標題不得為空",
      failureSummary: { "heading element is empty": "標題元素為空" },
    },
    "meta-viewport": {
      description: "確保 <meta name=\"viewport\"> 不會停用用戶縮放",
      help: "不得停用縮放功能",
      failureSummary: {
        "user-scalable=no disables zoom": "user-scalable=no 停用縮放",
        "maximum-scale less than 2 disables zoom": "maximum-scale 小於 2 停用縮放",
      },
    },
    "document-title": {
      description: "確保每個 HTML 文件都包含非空 <title> 元素",
      help: "文件必須具有標題",
      failureSummary: { "document has no non-empty title": "文件沒有非空標題" },
    },
    "link-name": {
      description: "確保連結具有可辨識的文字",
      help: "連結必須具有可存取名稱",
    },
    "skip-link": {
      description: "確保提供繞過區塊的最佳實務機制",
      help: "頁面應提供跳至主要內容的跳過連結",
    },
    tabindex: {
      description: "確保 tabindex 屬性值不大於 0",
      help: "元素不應具有大於零的 tabindex",
    },
    "focus-visible": {
      description: "確保鍵盤焦點具有可見指示",
      help: "鍵盤焦點必須具有可見指示",
    },
    "html-has-lang": {
      description: "確保每個 HTML 文件都具有 lang 屬性",
      help: "<html> 元素必須具有 lang 屬性",
      failureSummary: { "html element has no lang attribute": "html 元素沒有 lang 屬性" },
    },
    "html-lang-valid": {
      description: "確保 <html> 元素的 lang 屬性具有有效值",
      help: "<html> 元素必須具有有效的 lang 值",
    },
    label: {
      description: "確保每個表格元素都具有標籤",
      help: "表格元素必須具有標籤",
    },
    "button-name": {
      description: "確保按鈕具有可辨識的文字",
      help: "按鈕必須具有可存取名稱",
    },
    "input-button-name": {
      description: "確保輸入按鈕具有可辨識的文字",
      help: "輸入按鈕必須具有可存取名稱",
    },
    "select-name": {
      description: "確保 select 元素具有可存取名稱",
      help: "Select 元素必須具有可存取名稱",
    },
    "frame-title": {
      description: "確保 <iframe> 和 <frame> 元素具有 title 屬性",
      help: "框架必須具有標題",
      failureSummary: { "frame element has no title": "frame 元素沒有標題" },
    },
    "aria-roles": {
      description: "確保所有具有 role 屬性的元素都使用有效值",
      help: "使用的 ARIA 角色必須符合有效值",
    },
    "aria-valid-attr-value": {
      description: "確保所有 ARIA 屬性都具有有效值",
      help: "ARIA 屬性必須具有有效值",
    },
    "aria-required-attr": {
      description: "確保具有 ARIA 角色的元素具有所有必要屬性",
      help: "ARIA 角色必須具有所有必要屬性",
    },
    "aria-required-children": {
      description: "確保具有 ARIA 角色的元素包含必要的子角色",
      help: "特定 ARIA 角色必須包含必要的子角色",
    },
    "aria-hidden-focus": {
      description: "確保 aria-hidden 元素不包含可聚焦元素",
      help: "ARIA-hidden 元素不得包含可聚焦元素",
    },
    "duplicate-id": {
      description: "確保每個 id 屬性值都是唯一的",
      help: "ID 屬性值必須唯一",
    },
    "color-contrast": {
      description: "確保前景與背景顏色之間的對比度符合 WCAG 2 AA 門檻",
      help: "文字必須具有足夠的顏色對比度",
      failureSummary: {
        "foreground color not computable": "無法計算前景顏色",
        "background color not computable": "無法計算背景顏色",
      },
    },
    "target-size": {
      description: "確保互動目標符合 24x24 CSS 像素的最低要求",
      help: "互動目標必須至少為 24x24 CSS 像素",
    },
    "meta-refresh": {
      description: "確保 <meta http-equiv=refresh> 不會自動重新導向或過快重新整理",
      help: "不得使用定時重新整理",
      failureSummary: { "meta refresh redirects to another page": "meta refresh 重新導向至其他頁面" },
    },
    "non-text-contrast": {
      description: "確保 UI 元件邊界符合 3:1 對比度最低要求",
      help: "UI 元件邊框和指示器必須具有 3:1 對比度",
      failureSummary: {
        "border or background color not computable": "無法計算邊框或背景顏色",
        "transparent background — contrast undecidable": "背景透明 — 對比度無法判斷",
      },
    },
    "click-events-have-key-events": {
      description: "確保具有點擊處理器的元素可透過鍵盤操作",
      help: "可點擊元素也必須可透過鍵盤操作",
    },
    "pointer-cancellation": {
      description: "確保動作在指標放開時觸發，而非按下時",
      help: "功能必須在指標放開時啟動，或可取消",
    },
    "dragging-movements": {
      description: "確保拖曳動作具有單一指標的替代方案",
      help: "拖曳動作必須具有單一指標的替代方案",
    },
    "no-autoplay-audio": {
      description: "確保自動播放媒體具有控制項，或播放時間少於 3 秒",
      help: "自動播放音訊在沒有控制項的情況下不得播放超過 3 秒",
      failureSummary: {
        "auto-playing media has no control and is not muted": "自動播放媒體沒有控制項且未靜音",
      },
    },
    orientation: {
      description: "確保內容不會限制檢視為單一方向",
      help: "內容必須在直向和橫向方向都能正常運作",
      failureSummary: {
        "could not inspect stylesheets": "無法檢查樣式表",
        "content is locked to a single orientation": "內容鎖定為單一方向",
      },
    },
    "autocomplete-valid": {
      description: "確保 autocomplete 屬性值有效",
      help: "輸入用途必須使用有效的 autocomplete 值",
    },
    "text-spacing": {
      description: "確保文字間距覆寫不會被 !important 阻止",
      help: "不得阻止行距/字距/字距覆寫",
      failureSummary: {
        "could not inspect stylesheets": "無法檢查樣式表",
        "text-spacing is locked with !important": "文字間距被 !important 鎖定",
      },
    },
    "lang-of-parts": {
      description: "確保外語段落具有 lang 屬性",
      help: "其他語言的段落必須以 lang 標示",
    },
    "pause-stop-hide": {
      description: "確保移動、閃爍或自動更新的內容可暫停",
      help: "移動內容必須可暫停",
    },
    "no-flashing": {
      description: "確保內容每秒閃爍不超過三次",
      help: "內容每秒不得閃爍超過三次",
      failureSummary: { "content flashes more than three times per second": "內容每秒閃爍超過三次" },
    },
    "media-transcript": {
      description: "確保純音訊/純影片媒體具有連結的文字稿",
      help: "純音訊/純影片媒體必須具有文字稿",
    },
    "label-in-name": {
      description: "確保可存取名稱包含可見標籤文字",
      help: "可存取名稱必須包含可見標籤",
    },
    "use-of-color": {
      description: "確保資訊不是僅以顏色傳達",
      help: "顏色不得是傳達資訊的唯一方式",
    },
    "contrast-enhanced": {
      description: "確保對比度符合 WCAG 2 AAA 門檻",
      help: "文字必須具有增強的顏色對比度（7:1，大型文字 4.5:1）",
      failureSummary: { "contrast not computable": "無法計算對比度" },
    },
    "target-size-enhanced": {
      description: "確保互動目標符合 44x44 CSS 像素的最低要求（AAA）",
      help: "互動目標必須至少為 44x44 CSS 像素",
    },
    "multiple-ways": {
      description: "確保頁面可透過多種導覽方式到達",
      help: "頁面必須可透過多種方式到達",
    },
    location: {
      description: "確保可辨識頁面在網站中的位置",
      help: "用戶必須可辨識其在網站中的位置",
    },
    "section-headings": {
      description: "確保內容區段以標題組織",
      help: "內容區段必須具有標題",
    },
    help: {
      description: "確保提供情境相關的協助",
      help: "必須提供情境相關的協助",
    },
    "redundant-entry": {
      description: "確保表格欄位使用 autocomplete 以避免重複輸入",
      help: "重複的資訊不得被不必要地重新輸入",
    },
    "no-timing": {
      description: "確保不施加時間限制（AAA）",
      help: "時間不得是內容的必要條件",
    },
    "focus-not-obscured": {
      description: "確保鍵盤焦點不會被黏性或固定覆蓋層完全遮住",
      help: "當元件獲得鍵盤焦點時，不得被作者建立的內容完全遮住",
    },
    "consistent-help": {
      description: "確保頁面上具有協助機制",
      help: "協助機制必須在一組頁面中於一致的位置提供",
    },
    "accessible-authentication": {
      description: "確保驗證不單獨依賴認知功能測試",
      help: "驗證不得在沒有替代機制的情況下要求認知功能測試",
    },
  },

  "zh-Hans": {
    "image-alt": {
      description: "确保 <img> 元素具有替代文本或装饰性角色",
      help: "图像必须具有替代文本",
      failureSummary: { "img element has no alt attribute": "img 元素没有 alt 属性" },
    },
    "input-image-alt": {
      description: "确保 <input type=\"image\"> 元素具有替代文本",
      help: "图像按钮必须具有替代文本",
      failureSummary: { "input[type=image] has no text alternative": "input[type=image] 没有文本替代" },
    },
    "object-alt": {
      description: "确保 <object> 元素具有替代文本",
      help: "Object 元素必须具有替代文本",
    },
    "svg-img-alt": {
      description: "确保具有 img 角色的 <svg> 元素具有可访问名称",
      help: "SVG 图像必须具有可访问名称",
    },
    "video-caption": {
      description: "确保 <video> 元素具有字幕",
      help: "视频元素必须具有字幕",
      failureSummary: { "video element has no captions track": "video 元素没有字幕轨道" },
    },
    list: {
      description: "确保列表结构正确",
      help: "<ul> 和 <ol> 必须只直接包含 <li> 元素",
    },
    listitem: {
      description: "确保 <li> 元素以语义方式使用",
      help: "<li> 元素必须包含在 <ul> 或 <ol> 内",
    },
    dlitem: {
      description: "确保 <dt> 和 <dd> 元素包含在 <dl> 内",
      help: "<dt> 和 <dd> 必须位于 <dl> 内",
      failureSummary: { "dt/dd element is not inside a dl": "dt/dd 元素不在 dl 内" },
    },
    "definition-list": {
      description: "确保 <dl> 元素结构正确",
      help: "<dl> 必须只包含 <dt> 和 <dd> 组",
    },
    region: {
      description: "确保所有页面内容都包含在地标内",
      help: "所有页面内容都应包含在地标内",
    },
    "landmark-unique": {
      description: "确保地标是唯一的",
      help: "重复的地标必须具有唯一的标签",
    },
    "heading-order": {
      description: "确保标题顺序语义正确",
      help: "标题层级只能逐级增加",
    },
    "empty-heading": {
      description: "确保标题具有可辨识的文本",
      help: "标题不得为空",
      failureSummary: { "heading element is empty": "标题元素为空" },
    },
    "meta-viewport": {
      description: "确保 <meta name=\"viewport\"> 不会禁用用户缩放",
      help: "不得禁用缩放功能",
      failureSummary: {
        "user-scalable=no disables zoom": "user-scalable=no 禁用缩放",
        "maximum-scale less than 2 disables zoom": "maximum-scale 小于 2 禁用缩放",
      },
    },
    "document-title": {
      description: "确保每个 HTML 文档都包含非空 <title> 元素",
      help: "文档必须具有标题",
      failureSummary: { "document has no non-empty title": "文档没有非空标题" },
    },
    "link-name": {
      description: "确保链接具有可辨识的文本",
      help: "链接必须具有可访问名称",
    },
    "skip-link": {
      description: "确保提供绕过区块的最佳实践机制",
      help: "页面应提供跳至主要内容的跳过链接",
    },
    tabindex: {
      description: "确保 tabindex 属性值不大于 0",
      help: "元素不应具有大于零的 tabindex",
    },
    "focus-visible": {
      description: "确保键盘焦点具有可见指示",
      help: "键盘焦点必须具有可见指示",
    },
    "html-has-lang": {
      description: "确保每个 HTML 文档都具有 lang 属性",
      help: "<html> 元素必须具有 lang 属性",
      failureSummary: { "html element has no lang attribute": "html 元素没有 lang 属性" },
    },
    "html-lang-valid": {
      description: "确保 <html> 元素的 lang 属性具有有效值",
      help: "<html> 元素必须具有有效的 lang 值",
    },
    label: {
      description: "确保每个表单元素都具有标签",
      help: "表单元素必须具有标签",
    },
    "button-name": {
      description: "确保按钮具有可辨识的文本",
      help: "按钮必须具有可访问名称",
    },
    "input-button-name": {
      description: "确保输入按钮具有可辨识的文本",
      help: "输入按钮必须具有可访问名称",
    },
    "select-name": {
      description: "确保 select 元素具有可访问名称",
      help: "Select 元素必须具有可访问名称",
    },
    "frame-title": {
      description: "确保 <iframe> 和 <frame> 元素具有 title 属性",
      help: "框架必须具有标题",
      failureSummary: { "frame element has no title": "frame 元素没有标题" },
    },
    "aria-roles": {
      description: "确保所有具有 role 属性的元素都使用有效值",
      help: "使用的 ARIA 角色必须符合有效值",
    },
    "aria-valid-attr-value": {
      description: "确保所有 ARIA 属性都具有有效值",
      help: "ARIA 属性必须具有有效值",
    },
    "aria-required-attr": {
      description: "确保具有 ARIA 角色的元素具有所有必需属性",
      help: "ARIA 角色必须具有所有必需属性",
    },
    "aria-required-children": {
      description: "确保具有 ARIA 角色的元素包含必要的子角色",
      help: "特定 ARIA 角色必须包含必要的子角色",
    },
    "aria-hidden-focus": {
      description: "确保 aria-hidden 元素不包含可聚焦元素",
      help: "ARIA-hidden 元素不得包含可聚焦元素",
    },
    "duplicate-id": {
      description: "确保每个 id 属性值都是唯一的",
      help: "ID 属性值必须唯一",
    },
    "color-contrast": {
      description: "确保前景与背景颜色之间的对比度符合 WCAG 2 AA 门槛",
      help: "文本必须具有足够的颜色对比度",
      failureSummary: {
        "foreground color not computable": "无法计算前景颜色",
        "background color not computable": "无法计算背景颜色",
      },
    },
    "target-size": {
      description: "确保交互目标符合 24x24 CSS 像素的最低要求",
      help: "交互目标必须至少为 24x24 CSS 像素",
    },
    "meta-refresh": {
      description: "确保 <meta http-equiv=refresh> 不会自动重定向或过快刷新",
      help: "不得使用定时刷新",
      failureSummary: { "meta refresh redirects to another page": "meta refresh 重定向至其他页面" },
    },
    "non-text-contrast": {
      description: "确保 UI 组件边界符合 3:1 对比度最低要求",
      help: "UI 组件边框和指示器必须具有 3:1 对比度",
      failureSummary: {
        "border or background color not computable": "无法计算边框或背景颜色",
        "transparent background — contrast undecidable": "背景透明 — 对比度无法判断",
      },
    },
    "click-events-have-key-events": {
      description: "确保具有点击处理器的元素可通过键盘操作",
      help: "可点击元素也必须可通过键盘操作",
    },
    "pointer-cancellation": {
      description: "确保动作在指针松开时触发，而非按下时",
      help: "功能必须在指针松开时启动，或可取消",
    },
    "dragging-movements": {
      description: "确保拖拽动作具有单指针的替代方案",
      help: "拖拽动作必须具有单指针的替代方案",
    },
    "no-autoplay-audio": {
      description: "确保自动播放媒体具有控件，或播放时间少于 3 秒",
      help: "自动播放音频在没有控件的情况下不得播放超过 3 秒",
      failureSummary: {
        "auto-playing media has no control and is not muted": "自动播放媒体没有控件且未静音",
      },
    },
    orientation: {
      description: "确保内容不会限制查看为单一方向",
      help: "内容必须在纵向和横向方向都能正常工作",
      failureSummary: {
        "could not inspect stylesheets": "无法检查样式表",
        "content is locked to a single orientation": "内容锁定为单一方向",
      },
    },
    "autocomplete-valid": {
      description: "确保 autocomplete 属性值有效",
      help: "输入用途必须使用有效的 autocomplete 值",
    },
    "text-spacing": {
      description: "确保文本间距覆盖不会被 !important 阻止",
      help: "不得阻止行距/字距/字距覆盖",
      failureSummary: {
        "could not inspect stylesheets": "无法检查样式表",
        "text-spacing is locked with !important": "文本间距被 !important 锁定",
      },
    },
    "lang-of-parts": {
      description: "确保外语段落具有 lang 属性",
      help: "其他语言的段落必须以 lang 标示",
    },
    "pause-stop-hide": {
      description: "确保移动、闪烁或自动更新的内容可暂停",
      help: "移动内容必须可暂停",
    },
    "no-flashing": {
      description: "确保内容每秒闪烁不超过三次",
      help: "内容每秒不得闪烁超过三次",
      failureSummary: { "content flashes more than three times per second": "内容每秒闪烁超过三次" },
    },
    "media-transcript": {
      description: "确保纯音频/纯视频媒体具有链接的文稿",
      help: "纯音频/纯视频媒体必须具有文稿",
    },
    "label-in-name": {
      description: "确保可访问名称包含可见标签文本",
      help: "可访问名称必须包含可见标签",
    },
    "use-of-color": {
      description: "确保信息不是仅以颜色传达",
      help: "颜色不得是传达信息的唯一方式",
    },
    "contrast-enhanced": {
      description: "确保对比度符合 WCAG 2 AAA 门槛",
      help: "文本必须具有增强的颜色对比度（7:1，大文本 4.5:1）",
      failureSummary: { "contrast not computable": "无法计算对比度" },
    },
    "target-size-enhanced": {
      description: "确保交互目标符合 44x44 CSS 像素的最低要求（AAA）",
      help: "交互目标必须至少为 44x44 CSS 像素",
    },
    "multiple-ways": {
      description: "确保页面可通过多种导航方式到达",
      help: "页面必须可通过多种方式到达",
    },
    location: {
      description: "确保可辨识页面在网站中的位置",
      help: "用户必须可辨识其在网站中的位置",
    },
    "section-headings": {
      description: "确保内容区段以标题组织",
      help: "内容区段必须具有标题",
    },
    help: {
      description: "确保提供上下文相关的帮助",
      help: "必须提供上下文相关的帮助",
    },
    "redundant-entry": {
      description: "确保表单字段使用 autocomplete 以避免重复输入",
      help: "重复的信息不得被不必要地重新输入",
    },
    "no-timing": {
      description: "确保不施加时间限制（AAA）",
      help: "时间不得是内容的必要条件",
    },
    "focus-not-obscured": {
      description: "确保键盘焦点不会被粘性或固定覆盖层完全遮住",
      help: "当组件获得键盘焦点时，不得被作者创建的内容完全遮住",
    },
    "consistent-help": {
      description: "确保页面上具有帮助机制",
      help: "帮助机制必须在一组页面中于一致的位置提供",
    },
    "accessible-authentication": {
      description: "确保验证不单独依赖认知功能测试",
      help: "验证不得在没有替代机制的情况下要求认知功能测试",
    },
  },
};

export function findingLocaleText(ruleId: string, locale?: string): FindingLocaleText | undefined {
  if (!locale || locale === "en") return undefined;
  const table = FINDING_LOCALES[locale as "zh-Hans" | "zh-Hant"];
  return table?.[ruleId] ?? aiFindingLocaleText(ruleId, locale);
}

// Minimal structural contract so both the DB `Finding` and the client-side
// `Finding` (components/assessment/types.ts) satisfy it without a cast.
export interface LocalizableFinding {
  ruleId: string;
  impact: string;
  description: string;
  recommendation: string;
  help?: string;
  instances?: Array<{ failureSummary: string }>;
}

/**
 * Returns a localized copy of a machine finding, leaving the stored (English)
 * record untouched. Only engine rules with an overlay are translated; AI
 * findings and unknown rules fall back to their stored text.
 */
export function localizedFinding<F extends LocalizableFinding>(finding: F, locale?: string): F {
  if (!locale || locale === "en") return finding;
  const text = findingLocaleText(finding.ruleId, locale);
  if (!text) return finding;
  const curated = curatedRecommendation(finding.ruleId, locale);
  const instances = finding.instances?.map((inst) => {
    const localizedSummary = inst.failureSummary ? text.failureSummary?.[inst.failureSummary] : undefined;
    return localizedSummary ? { ...inst, failureSummary: localizedSummary } : inst;
  });
  return {
    ...finding,
    description: text.description,
    help: text.help,
    recommendation: text.recommendation ?? curated ?? finding.recommendation,
    ...(instances ? { instances } : {}),
  };
}
