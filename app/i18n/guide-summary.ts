import type { Locale } from "./routing";

export const guideSummary: Record<Locale, {
  metadata: { title: string; description: string };
  link: string;
  newTab: string;
}> = {
  "en-AU": {
    metadata: {
      title: "Australian Property Selling Costs Guide | Property Sale Profit",
      description: "Understand entered selling costs, transaction profit, cash after loan payout and break-even sale prices with a fictional Australian property example.",
    },
    link: "Selling costs and profit guide",
    newTab: "(opens in new tab)",
  },
  "zh-Hans": {
    metadata: { title: "澳洲卖房费用指南 | Property Sale Profit", description: "通过虚构的澳洲房产案例，了解已输入的卖房费用、交易利润、还贷后现金及保本售价。" },
    link: "卖房费用与收益指南",
    newTab: "（在新标签页中打开）",
  },
  ko: {
    metadata: { title: "호주 부동산 매각 비용 안내 | Property Sale Profit", description: "가상 호주 부동산 사례를 통해 입력한 매각 비용, 거래 이익, 대출 상환 후 현금과 손익분기 매각가를 이해하세요." },
    link: "매각 비용과 거래 이익 안내",
    newTab: "(새 탭에서 열림)",
  },
};
