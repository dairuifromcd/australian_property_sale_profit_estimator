import type { Locale } from "./routing";

// Source text for both the checked-in share cards and their metadata.
export const shareCards: Record<Locale, { heading: readonly string[]; scope: string; alt: string }> = {
  "en-AU": {
    heading: ["Understand your", "property sale result"],
    scope: "Australian property calculator · Indicative estimates only",
    alt: "Property Sale Profit — understand your Australian property sale result. Indicative estimates only.",
  },
  "zh-Hans": {
    heading: ["了解您的", "澳洲卖房结果"],
    scope: "澳洲房产计算器 · 估算仅供参考",
    alt: "Property Sale Profit — 了解您的澳洲卖房结果。估算仅供参考。",
  },
  ko: {
    heading: ["호주 부동산", "매각 결과 이해하기"],
    scope: "호주 부동산 계산기 · 참고용 추정치",
    alt: "Property Sale Profit — 호주 부동산 매각 결과 이해하기. 참고용 추정치입니다.",
  },
};

export function shareCardPath(locale: Locale) {
  return `/share/${locale}.png`;
}
