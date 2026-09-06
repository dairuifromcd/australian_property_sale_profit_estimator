import type { Locale } from "./routing";

type GuideMessages = {
  title: string;
  intro: string;
  calculator: string;
  updated: string;
  sections: readonly { id: string; title: string; paragraphs: readonly string[] }[];
};

export const guideMessages: Record<Locale, GuideMessages> = {
  "en-AU": {
    title: "Australian property selling costs: profit and cash explained",
    intro: "Selling a property involves more than comparing its sale price with its purchase price. This guide explains the calculator’s entered-cost model. All amounts are AUD; examples are fictional, not typical fees or property valuations.",
    calculator: "Estimate your sale result",
    updated: "Method explained: 5 September 2026. Based on this calculator’s formulas; not a market-fee survey or professional review.",
    sections: [
      { id: "selling-costs", title: "What selling costs should I enter?", paragraphs: [
        "The calculator adds percentage agent commission, other selling costs and optional sale preparation costs. Enter the commission rate including GST from your own quote; this tool does not estimate a rate for you.",
        "Use other selling costs for your entered selling expenses, such as marketing or conveyancing. Buying costs and renovations have separate fields because they affect transaction profit but are not deducted again from sale proceeds.",
        "Count each expense once. If work belongs in sale preparation, do not also include the same amount under renovations or holding costs. These categories organise this estimate; they do not classify expenses for tax or accounting.",
      ] },
      { id: "profit-and-cash", title: "Why are transaction profit and cash different?", paragraphs: [
        "Transaction profit = sale price − agent commission − other selling costs − sale preparation − purchase price − buying costs − renovations and improvements.",
        "Optional overall pre-tax result = transaction profit + entered rental income − entered holding costs. Do not include loan principal repayments in holding costs: the purchase price is already counted in transaction profit.",
        "Simplified cash after loan payout = sale price − entered selling costs − entered loan payout. Purchase price is not deducted from this cash figure. Loan payout changes this cash figure, not transaction profit. Tax and unentered settlement adjustments are excluded.",
      ] },
      { id: "worked-example", title: "Worked example: a $1,000,000 sale", paragraphs: [
        "Assume a $1,000,000 sale, $650,000 purchase price, 2.2% commission including GST, $5,000 other selling costs and $400,000 loan payout. All other costs and holding cash flows are zero in this fictional example.",
        "Commission: $1,000,000 × 2.2% = $22,000. Selling costs: $22,000 + $5,000 = $27,000. Amount after selling costs: $1,000,000 − $27,000 = $973,000.",
        "Transaction profit: $973,000 − $650,000 = $323,000. Simplified cash after loan payout: $973,000 − $400,000 = $573,000. Neither result is after-tax profit or a complete settlement statement.",
      ] },
      { id: "compare-quotes", title: "Does lower commission always mean lower selling costs?", paragraphs: [
        "Compare total entered costs at the same sale price. At $1,000,000, fictional quote A with 2.2% commission and $5,000 other costs totals $27,000. Quote B with 1.8% commission and $9,000 other costs also totals $27,000.",
        "Those totals are equal only for these inputs. Different sale prices change the percentage commission. The calculator does not compare service quality, contract terms or predict what an agent will achieve.",
      ] },
      { id: "planning", title: "How are break-even and target sale prices calculated?", paragraphs: [
        "Add purchase price, buying costs, renovations, other selling costs and sale preparation. Divide that sum by (1 − commission rate as a decimal) to find the entered-cost transaction break-even price. For a target transaction profit, add the target to the numerator before dividing.",
        "The calculator rounds required prices up to a whole dollar; an exact whole-dollar result is unchanged. Commission is recalculated at that required price. Rental income, holding costs and loan payout do not change these transaction-profit targets. These are calculations from entered costs, not valuations or forecasts.",
      ] },
      { id: "already-sold", title: "Can I use this after selling?", paragraphs: [
        "Yes. Enter the actual sale price in the sale-price field and your actual known costs in their corresponding fields to revisit the transaction. An omitted cost still makes the result incomplete. This does not turn the estimate into an accounting or settlement statement.",
      ] },
      { id: "scope", title: "What is outside this estimate?", paragraphs: [
        "The model does not calculate CGT, income tax, taxable gains, accounting profit, after-tax profit, complete settlement adjustments, annualised returns or market value. Results cover the whole property, without allocating shares among owners.",
        "Use your own documented amounts. This is an indicative educational tool, not financial, legal, tax, valuation, accounting or settlement advice. Calculator figures stay in your browser; see the privacy notice for anonymous usage events and hosting information.",
      ] },
    ],
  },
  "zh-Hans": {
    title: "澳洲卖房费用：交易利润与现金的区别",
    intro: "卖房结果不只是售价减去买价。本指南解释计算器如何使用您输入的费用。所有金额均为澳元；案例完全虚构，不代表常见收费或房产估值。",
    calculator: "估算您的卖房结果",
    updated: "方法说明日期：2026年9月5日。依据本计算器的公式编写，并非市场收费调查或专业审核。",
    sections: [
      { id: "selling-costs", title: "应该输入哪些卖房费用？", paragraphs: ["计算器将按比例计算的中介佣金、其他出售费用和可选的出售准备费用相加。请根据您自己的报价输入含 GST 的佣金比例；本工具不会为您估算费率。", "广告营销或过户等已知出售支出可填入其他出售费用。购入费用与装修改善另有输入项，因为它们影响交易利润，但不会从出售所得中再次扣除。", "每笔费用只填一次。同一笔工程支出如果已计入出售准备费用，就不要再填入装修改善或持有费用。这些分类仅用于整理估算，不用于税务或会计分类。"] },
      { id: "profit-and-cash", title: "为什么交易利润与现金不同？", paragraphs: ["交易利润 = 售价 − 中介佣金 − 其他出售费用 − 出售准备费用 − 买价 − 购入费用 − 装修改善。", "可选的整体税前结果 = 交易利润 + 已输入的租金收入 − 已输入的持有费用。持有费用不应包含偿还贷款本金，因为买价已计入交易利润。", "还贷后简化现金 = 售价 − 已输入的出售费用 − 已输入的贷款清偿额。该现金金额不再减去买价。贷款清偿额只改变现金，不改变交易利润。税款和未输入的结算调整不在其中。"] },
      { id: "worked-example", title: "计算案例：以 $1,000,000 出售", paragraphs: ["假设售价 $1,000,000、买价 $650,000、含 GST 佣金 2.2%、其他出售费用 $5,000、贷款清偿额 $400,000。本虚构案例中的所有其他费用及持有期间现金流均为零。", "佣金：$1,000,000 × 2.2% = $22,000。出售费用：$22,000 + $5,000 = $27,000。扣除出售费用后金额：$1,000,000 − $27,000 = $973,000。", "交易利润：$973,000 − $650,000 = $323,000。还贷后简化现金：$973,000 − $400,000 = $573,000。两者均不是税后利润，也不是完整结算单。"] },
      { id: "compare-quotes", title: "佣金更低是否一定代表卖房费用更低？", paragraphs: ["在同一售价下比较已输入的总费用。售价为 $1,000,000 时，虚构报价 A 为 2.2% 佣金加 $5,000 其他费用，总计 $27,000；报价 B 为 1.8% 佣金加 $9,000 其他费用，也为 $27,000。", "仅在这些输入条件下，两者总额相等。售价不同，按比例计算的佣金也会改变。计算器不比较服务质量、合同条款，也不预测中介能实现的售价。"] },
      { id: "planning", title: "保本售价和目标售价如何计算？", paragraphs: ["将买价、购入费用、装修改善、其他出售费用和出售准备费用相加，再除以（1 − 以小数表示的佣金比例），得到基于已输入费用的交易保本售价。计算目标交易利润所需售价时，先将目标利润加入分子，再进行除法。", "所需售价向上取整至整数澳元；结果已为整数澳元时保持不变。佣金按该所需售价重新计算。租金、持有费用和贷款清偿额不改变这些交易利润目标。这些是基于输入费用的计算，不是估值或预测。"] },
      { id: "already-sold", title: "已经卖房后还能使用吗？", paragraphs: ["可以。在售价栏输入实际成交价，并在相应费用栏输入已知的实际费用，即可回顾交易。遗漏任何费用仍会使结果不完整；这不会将估算变为会计报表或结算单。"] },
      { id: "scope", title: "哪些内容不在估算范围内？", paragraphs: ["本模型不计算资本利得税（CGT）、所得税、应税收益、会计利润、税后利润、完整结算调整、年化回报或市场价值。结果针对整套房产，不按各业主份额分摊。", "请使用您自己的书面资料中的金额。本工具仅供参考和学习，不构成金融、法律、税务、估值、会计或结算建议。计算器金额保留在浏览器中；匿名使用事件和托管信息请参阅隐私说明。"] },
    ],
  },
  ko: {
    title: "호주 부동산 매각 비용: 거래 이익과 현금 이해하기",
    intro: "매각 결과는 매각가에서 매입가를 빼는 것만으로 알 수 없습니다. 이 안내는 입력한 비용을 사용하는 계산 방식을 설명합니다. 모든 금액은 AUD이며 사례는 가상입니다. 일반적인 수수료나 부동산 감정가를 나타내지 않습니다.",
    calculator: "매각 결과 추정하기",
    updated: "계산 방식 설명일: 2026년 9월 5일. 이 계산기의 공식을 기준으로 작성했으며 시장 수수료 조사나 전문가 검토가 아닙니다.",
    sections: [
      { id: "selling-costs", title: "어떤 매각 비용을 입력하나요?", paragraphs: ["계산기는 비율로 계산한 중개 수수료, 기타 매각 비용과 선택 입력한 매각 준비 비용을 합산합니다. 본인의 견적에 나온 GST 포함 수수료율을 입력하세요. 이 도구는 수수료율을 추정하지 않습니다.", "광고나 소유권 이전 업무 등 본인이 파악한 매각 지출은 기타 매각 비용에 입력할 수 있습니다. 매입 비용과 개조 및 개선 비용은 거래 이익에 영향을 주지만 매각 대금에서 다시 차감하지 않으므로 별도 항목입니다.", "각 비용은 한 번만 입력하세요. 매각 준비 비용에 넣은 공사비를 개조 및 개선 비용이나 보유 비용에도 중복 입력하지 마세요. 이 분류는 추정치를 정리하기 위한 것으로 세무 또는 회계 분류가 아닙니다."] },
      { id: "profit-and-cash", title: "거래 이익과 현금은 왜 다른가요?", paragraphs: ["거래 이익 = 매각가 − 중개 수수료 − 기타 매각 비용 − 매각 준비 비용 − 매입가 − 매입 비용 − 개조 및 개선 비용.", "선택 항목인 종합 세전 결과 = 거래 이익 + 입력한 임대 수입 − 입력한 보유 비용. 매입가가 거래 이익에 이미 반영되므로 대출 원금 상환액은 보유 비용에 포함하지 마세요.", "대출 상환 후 간소화된 현금 예상치 = 매각가 − 입력한 매각 비용 − 입력한 대출 상환액. 이 현금에서 매입가를 차감하지 않습니다. 대출 상환액은 현금만 바꾸며 거래 이익은 바꾸지 않습니다. 세금과 입력하지 않은 정산 조정액은 제외됩니다."] },
      { id: "worked-example", title: "계산 예시: $1,000,000에 매각", paragraphs: ["매각가 $1,000,000, 매입가 $650,000, GST 포함 수수료율 2.2%, 기타 매각 비용 $5,000, 대출 상환액 $400,000을 가정합니다. 이 가상 사례에서 나머지 비용과 보유 기간 현금 흐름은 모두 0입니다.", "수수료: $1,000,000 × 2.2% = $22,000. 매각 비용: $22,000 + $5,000 = $27,000. 매각 비용 차감 후 금액: $1,000,000 − $27,000 = $973,000.", "거래 이익: $973,000 − $650,000 = $323,000. 대출 상환 후 간소화된 현금: $973,000 − $400,000 = $573,000. 두 결과 모두 세후 이익이나 완전한 정산 명세서가 아닙니다."] },
      { id: "compare-quotes", title: "수수료율이 낮으면 매각 비용도 항상 낮나요?", paragraphs: ["같은 매각가에서 입력한 총비용을 비교하세요. $1,000,000 매각 시 가상 견적 A의 수수료율 2.2%와 기타 비용 $5,000은 총 $27,000입니다. 견적 B의 1.8%와 $9,000도 총 $27,000입니다.", "이 입력값에서만 두 총액이 같습니다. 매각가가 달라지면 비율 수수료도 달라집니다. 계산기는 서비스 품질이나 계약 조건을 비교하지 않으며 중개인이 달성할 매각가를 예측하지 않습니다."] },
      { id: "planning", title: "손익분기 매각가와 목표 매각가는 어떻게 계산하나요?", paragraphs: ["매입가, 매입 비용, 개조 및 개선 비용, 기타 매각 비용과 매각 준비 비용을 더하고 (1 − 소수로 표시한 수수료율)로 나누면 입력 비용 기준 거래 손익분기 매각가가 됩니다. 목표 거래 이익이 있다면 나누기 전에 분자에 목표 금액을 더합니다.", "필요한 매각가는 정수 달러 단위로 올림하며 이미 정수 달러인 결과는 그대로 유지합니다. 수수료는 그 매각가로 다시 계산합니다. 임대 수입, 보유 비용과 대출 상환액은 이 거래 이익 목표를 바꾸지 않습니다. 이는 입력 비용에 따른 계산이며 감정가나 예측이 아닙니다."] },
      { id: "already-sold", title: "이미 매각한 후에도 사용할 수 있나요?", paragraphs: ["네. 매각가 항목에는 실제 매각가를, 각 비용 항목에는 확인된 실제 비용을 입력하여 거래를 돌아볼 수 있습니다. 비용을 빠뜨리면 결과는 여전히 불완전합니다. 이 추정치가 회계 또는 정산 명세서로 바뀌는 것은 아닙니다."] },
      { id: "scope", title: "추정 범위에 포함되지 않는 것은 무엇인가요?", paragraphs: ["이 모델은 CGT, 소득세, 과세 대상 자본이득, 회계상 이익, 세후 이익, 완전한 정산 조정, 연환산 수익률이나 시장 가치를 계산하지 않습니다. 결과는 부동산 전체에 대한 것이며 소유자별 지분을 배분하지 않습니다.", "본인의 증빙에 있는 금액을 사용하세요. 참고 및 교육용 도구이며 금융, 법률, 세무, 감정평가, 회계 또는 정산 자문이 아닙니다. 계산기 금액은 브라우저에 남습니다. 익명 사용 이벤트와 호스팅 정보는 개인정보 안내를 참고하세요."] },
    ],
  },
};
