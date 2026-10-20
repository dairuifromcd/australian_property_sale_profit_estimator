import type { Locale } from "./routing";

type GuideMessages = {
  title: string;
  intro: string;
  calculator: string;
  updated: string;
  maintainer: string;
  corrections: string;
  sections: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    table?: {
      caption: string;
      columns: readonly [string, string, string];
      rows: readonly { result: string; includes: string; excludes: string }[];
    };
    checklist?: readonly string[];
  }[];
};

export const guideMessages: Record<Locale, GuideMessages> = {
  "en-AU": {
    title: "Australian property selling costs: profit and cash explained",
    intro: "Selling a property involves more than comparing its sale price with its purchase price. This guide explains the calculator’s entered-cost model. All amounts are AUD; examples are fictional, not typical fees or property valuations.",
    maintainer: "Maintained by the Property Sale Profit project maintainer.",
    corrections: "Found an unclear explanation or an error? Email the page link and a description. Please do not send personal information or actual property, loan or calculator amounts.",
    calculator: "Open the Australian property sale profit calculator",
    updated: "Method explained: 19 October 2026. Based on this calculator’s formulas; not a market-fee survey or professional review.",
    sections: [
      { id: "selling-costs", title: "What selling costs should I enter?", paragraphs: [
        "The calculator adds percentage agent commission, other selling costs and optional sale preparation costs. Enter the commission rate including GST from your own quote; this tool does not estimate a rate for you.",
        "Use other selling costs for your entered selling expenses, such as marketing or conveyancing. Buying costs and renovations have separate fields because they affect transaction profit but are not deducted again from sale proceeds.",
        "Count each expense once. If work belongs in sale preparation, do not also include the same amount under renovations or holding costs. These categories organise this estimate; they do not classify expenses for tax or accounting.",
      ] },
      { id: "profit-and-cash", title: "Why are transaction profit and cash different?", paragraphs: [
        "Transaction profit accounts for the purchase price and entered buying, improvement and selling costs. Simplified cash instead starts with the sale proceeds and subtracts entered selling costs and loan payout; it does not subtract the purchase price, buying costs or improvements again. Neither is an after-tax result.",
        "Transaction profit = sale price − agent commission − other selling costs − sale preparation − purchase price − buying costs − renovations and improvements.",
        "Optional overall pre-tax result = transaction profit + entered rental income − entered holding costs. Do not include loan principal repayments in holding costs: the purchase price is already counted in transaction profit.",
        "Simplified cash after loan payout = sale price − entered selling costs − entered loan payout. Purchase price is not deducted from this cash figure. Loan payout changes this cash figure, not transaction profit. Tax and unentered settlement adjustments are excluded.",
      ], table: {
        caption: "Three separate results from the amounts you enter",
        columns: ["Result", "What it includes", "What it leaves out"],
        rows: [
          { result: "Transaction profit or loss", includes: "Sale price less commission, other selling costs, sale preparation, purchase price, buying costs and improvements.", excludes: "Rental income, holding costs, loan payout and tax." },
          { result: "Overall pre-tax property result (optional)", includes: "Transaction profit plus gross rental income, less holding costs entered for the same period.", excludes: "Loan payout, tax, timing and unentered costs. This is not a complete investment return." },
          { result: "Simplified cash after loan payout (optional)", includes: "Sale price less selling costs and the entered lender payout.", excludes: "Does not deduct purchase price, buying costs or improvements again. Excludes tax and unentered settlement adjustments." },
        ],
      } },
      { id: "worked-example", title: "Worked example: a $1,000,000 sale", paragraphs: [
        "Assume a $1,000,000 sale, $650,000 purchase price, 2.2% commission including GST, $5,000 other selling costs and $400,000 loan payout. All other costs and holding cash flows are zero in this fictional example.",
        "Commission: $1,000,000 × 2.2% = $22,000. Selling costs: $22,000 + $5,000 = $27,000. Amount after selling costs: $1,000,000 − $27,000 = $973,000.",
        "Transaction profit: $973,000 − $650,000 = $323,000. Simplified cash after loan payout: $973,000 − $400,000 = $573,000. Neither result is after-tax profit or a complete settlement statement.",
      ] },
      { id: "cash-with-loss", title: "Can I have cash left after selling at a loss?", paragraphs: [
        "Yes. Cash left after a loan payout does not establish whether the property transaction made a profit. Consider a fictional $700,000 sale, $750,000 purchase price, 2% commission including GST, $6,000 other selling costs and $400,000 loan payout. All other costs and holding cash flows are zero.",
        "Commission is $14,000 and total selling costs are $20,000. Amount after selling costs: $700,000 − $20,000 = $680,000. Transaction result: $680,000 − $750,000 = −$70,000, a transaction loss. Simplified cash after loan payout: $680,000 − $400,000 = $280,000.",
        "The $280,000 cash estimate is not profit: it does not subtract the original purchase price again. Both results exclude tax, unentered costs and settlement adjustments. Changing the payout changes cash, not the $70,000 transaction loss.",
      ] },
      { id: "prepare-figures", title: "What figures should I have ready?", paragraphs: [
        "Use your own records and quotes rather than treating the fictional examples as typical fees. Enter each expense once in its matching field. Missing amounts leave the estimate incomplete.",
      ], checklist: [
        "Expected sale price, or the actual sale price if sold; the GST-inclusive commission rate and itemised selling-cost quotes from your agent and other providers.",
        "Purchase records and invoices for buying costs, renovations, improvements and sale preparation. Check that the same work is not counted in more than one field.",
        "A lender payout estimate if using the cash result; gross rent received and holding costs paid for the same period if using the overall pre-tax result. Keep loan principal out of holding costs.",
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
    maintainer: "由 Property Sale Profit 项目维护者维护。",
    corrections: "发现说明不清楚或有错误？请通过邮件发送页面链接及问题描述。请勿发送个人信息或实际房产、贷款及计算器金额。",
    calculator: "打开澳洲卖房利润计算器",
    updated: "方法说明日期：2026年10月19日。依据本计算器的公式编写，并非市场收费调查或专业审核。",
    sections: [
      { id: "selling-costs", title: "应该输入哪些卖房费用？", paragraphs: ["计算器将按比例计算的中介佣金、其他出售费用和可选的出售准备费用相加。请根据您自己的报价输入含 GST 的佣金比例；本工具不会为您估算费率。", "广告营销或过户等已知出售支出可填入其他出售费用。购入费用与装修改善另有输入项，因为它们影响交易利润，但不会从出售所得中再次扣除。", "每笔费用只填一次。同一笔工程支出如果已计入出售准备费用，就不要再填入装修改善或持有费用。这些分类仅用于整理估算，不用于税务或会计分类。"] },
      { id: "profit-and-cash", title: "为什么交易利润与现金不同？", paragraphs: ["交易利润计入买价及已输入的购入、装修改善和出售费用。简化现金则从出售所得中减去已输入的出售费用与贷款清偿额，不再减去买价、购入费用或装修改善支出。两者均不是税后结果。", "交易利润 = 售价 − 中介佣金 − 其他出售费用 − 出售准备费用 − 买价 − 购入费用 − 装修改善。", "可选的整体税前结果 = 交易利润 + 已输入的租金收入 − 已输入的持有费用。持有费用不应包含偿还贷款本金，因为买价已计入交易利润。", "还贷后简化现金 = 售价 − 已输入的出售费用 − 已输入的贷款清偿额。该现金金额不再减去买价。贷款清偿额只改变现金，不改变交易利润。税款和未输入的结算调整不在其中。"], table: {
        caption: "根据输入金额分别呈现的三种结果",
        columns: ["结果", "计入哪些金额", "未包含哪些内容"],
        rows: [
          { result: "交易利润或亏损", includes: "售价减去佣金、其他出售费用、出售准备费用、买价、购入费用和装修改善。", excludes: "租金收入、持有费用、贷款清偿额和税款。" },
          { result: "整体税前房产结果（可选）", includes: "交易利润加上同一期间的租金总收入，再减去已输入的持有费用。", excludes: "贷款清偿额、税款、时间因素及未输入费用。这不是完整投资回报。" },
          { result: "还贷后简化现金（可选）", includes: "售价减去出售费用和已输入的贷款清偿额。", excludes: "不再减去买价、购入费用或装修改善。税款和未输入的结算调整不在其中。" },
        ],
      } },
      { id: "worked-example", title: "计算案例：以 $1,000,000 出售", paragraphs: ["假设售价 $1,000,000、买价 $650,000、含 GST 佣金 2.2%、其他出售费用 $5,000、贷款清偿额 $400,000。本虚构案例中的所有其他费用及持有期间现金流均为零。", "佣金：$1,000,000 × 2.2% = $22,000。出售费用：$22,000 + $5,000 = $27,000。扣除出售费用后金额：$1,000,000 − $27,000 = $973,000。", "交易利润：$973,000 − $650,000 = $323,000。还贷后简化现金：$973,000 − $400,000 = $573,000。两者均不是税后利润，也不是完整结算单。"] },
      { id: "cash-with-loss", title: "卖房亏损后，还可能有现金剩余吗？", paragraphs: [
        "可能。偿还贷款后有现金剩余，并不能证明房产交易盈利。假设虚构案例的售价为 $700,000、买价 $750,000、含 GST 佣金 2%、其他出售费用 $6,000、贷款清偿额 $400,000。所有其他费用及持有期间现金流均为零。",
        "佣金为 $14,000，出售费用合计 $20,000。扣除出售费用后金额：$700,000 − $20,000 = $680,000。交易结果：$680,000 − $750,000 = −$70,000，即交易亏损。还贷后简化现金：$680,000 − $400,000 = $280,000。",
        "$280,000 的现金估算不是利润，因为它不会再减去原始买价。两种结果均未计入税款、未输入费用及结算调整。改变贷款清偿额只改变现金，不改变 $70,000 的交易亏损。",
      ] },
      { id: "prepare-figures", title: "需要准备哪些金额资料？", paragraphs: [
        "请使用自己的记录和报价，不要将虚构案例视作常见收费。每笔费用只在相应输入项填写一次。遗漏金额会使估算不完整。",
      ], checklist: [
        "预计售价；已经售出时使用实际成交价。准备中介含 GST 的佣金比例，以及中介和其他服务提供方的逐项出售费用报价。",
        "购入记录，以及购入费用、装修、改善和出售准备费用的发票。确认同一工程支出没有重复计入多个输入项。",
        "查看现金结果时，准备贷款机构的清偿额估算；查看整体税前结果时，准备同一期间收到的租金总额和已支付的持有费用。持有费用不包括偿还贷款本金。",
      ] },
      { id: "compare-quotes", title: "佣金更低是否一定代表卖房费用更低？", paragraphs: ["在同一售价下比较已输入的总费用。售价为 $1,000,000 时，虚构报价 A 为 2.2% 佣金加 $5,000 其他费用，总计 $27,000；报价 B 为 1.8% 佣金加 $9,000 其他费用，也为 $27,000。", "仅在这些输入条件下，两者总额相等。售价不同，按比例计算的佣金也会改变。计算器不比较服务质量、合同条款，也不预测中介能实现的售价。"] },
      { id: "planning", title: "保本售价和目标售价如何计算？", paragraphs: ["将买价、购入费用、装修改善、其他出售费用和出售准备费用相加，再除以（1 − 以小数表示的佣金比例），得到基于已输入费用的交易保本售价。计算目标交易利润所需售价时，先将目标利润加入分子，再进行除法。", "所需售价向上取整至整数澳元；结果已为整数澳元时保持不变。佣金按该所需售价重新计算。租金、持有费用和贷款清偿额不改变这些交易利润目标。这些是基于输入费用的计算，不是估值或预测。"] },
      { id: "already-sold", title: "已经卖房后还能使用吗？", paragraphs: ["可以。在售价栏输入实际成交价，并在相应费用栏输入已知的实际费用，即可回顾交易。遗漏任何费用仍会使结果不完整；这不会将估算变为会计报表或结算单。"] },
      { id: "scope", title: "哪些内容不在估算范围内？", paragraphs: ["本模型不计算资本利得税（CGT）、所得税、应税收益、会计利润、税后利润、完整结算调整、年化回报或市场价值。结果针对整套房产，不按各业主份额分摊。", "请使用您自己的书面资料中的金额。本工具仅供参考和学习，不构成金融、法律、税务、估值、会计或结算建议。计算器金额保留在浏览器中；匿名使用事件和托管信息请参阅隐私说明。"] },
    ],
  },
  ko: {
    title: "호주 부동산 매각 비용: 거래 이익과 현금 이해하기",
    intro: "매각 결과는 매각가에서 매입가를 빼는 것만으로 알 수 없습니다. 이 안내는 입력한 비용을 사용하는 계산 방식을 설명합니다. 모든 금액은 AUD이며 사례는 가상입니다. 일반적인 수수료나 부동산 감정가를 나타내지 않습니다.",
    maintainer: "Property Sale Profit 프로젝트 관리자가 관리합니다.",
    corrections: "설명이 불명확하거나 오류가 있나요? 페이지 링크와 문제 설명을 이메일로 보내 주세요. 개인정보나 실제 부동산, 대출 또는 계산기 금액은 보내지 마세요.",
    calculator: "호주 부동산 매각 이익 계산기 열기",
    updated: "계산 방식 설명일: 2026년 10월 19일. 이 계산기의 공식을 기준으로 작성했으며 시장 수수료 조사나 전문가 검토가 아닙니다.",
    sections: [
      { id: "selling-costs", title: "어떤 매각 비용을 입력하나요?", paragraphs: ["계산기는 비율로 계산한 중개 수수료, 기타 매각 비용과 선택 입력한 매각 준비 비용을 합산합니다. 본인의 견적에 나온 GST 포함 수수료율을 입력하세요. 이 도구는 수수료율을 추정하지 않습니다.", "광고나 소유권 이전 업무 등 본인이 파악한 매각 지출은 기타 매각 비용에 입력할 수 있습니다. 매입 비용과 개조 및 개선 비용은 거래 이익에 영향을 주지만 매각 대금에서 다시 차감하지 않으므로 별도 항목입니다.", "각 비용은 한 번만 입력하세요. 매각 준비 비용에 넣은 공사비를 개조 및 개선 비용이나 보유 비용에도 중복 입력하지 마세요. 이 분류는 추정치를 정리하기 위한 것으로 세무 또는 회계 분류가 아닙니다."] },
      { id: "profit-and-cash", title: "거래 이익과 현금은 왜 다른가요?", paragraphs: ["거래 이익에는 매입가와 입력한 매입 비용, 개조 및 개선 비용, 매각 비용이 반영됩니다. 간소화된 현금은 매각 대금에서 입력한 매각 비용과 대출 상환액을 빼며 매입가, 매입 비용, 개조 및 개선 비용을 다시 차감하지 않습니다. 두 결과 모두 세후 결과가 아닙니다.", "거래 이익 = 매각가 − 중개 수수료 − 기타 매각 비용 − 매각 준비 비용 − 매입가 − 매입 비용 − 개조 및 개선 비용.", "선택 항목인 종합 세전 결과 = 거래 이익 + 입력한 임대 수입 − 입력한 보유 비용. 매입가가 거래 이익에 이미 반영되므로 대출 원금 상환액은 보유 비용에 포함하지 마세요.", "대출 상환 후 간소화된 현금 예상치 = 매각가 − 입력한 매각 비용 − 입력한 대출 상환액. 이 현금에서 매입가를 차감하지 않습니다. 대출 상환액은 현금만 바꾸며 거래 이익은 바꾸지 않습니다. 세금과 입력하지 않은 정산 조정액은 제외됩니다."], table: {
        caption: "입력한 금액으로 구분해서 보는 세 가지 결과",
        columns: ["결과", "포함하는 금액", "포함하지 않는 항목"],
        rows: [
          { result: "거래 이익 또는 손실", includes: "매각가에서 수수료, 기타 매각 비용, 매각 준비 비용, 매입가, 매입 비용, 개조 및 개선 비용을 차감합니다.", excludes: "임대 수입, 보유 비용, 대출 상환액과 세금." },
          { result: "종합 세전 부동산 결과(선택)", includes: "거래 이익에 같은 기간의 총 임대 수입을 더하고 입력한 보유 비용을 차감합니다.", excludes: "대출 상환액, 세금, 시간 요소와 입력하지 않은 비용. 완전한 투자 수익률이 아닙니다." },
          { result: "대출 상환 후 간소화된 현금(선택)", includes: "매각가에서 매각 비용과 입력한 대출기관 상환액을 차감합니다.", excludes: "매입가, 매입 비용, 개조 및 개선 비용을 다시 차감하지 않습니다. 세금과 입력하지 않은 정산 조정액은 제외됩니다." },
        ],
      } },
      { id: "worked-example", title: "계산 예시: $1,000,000에 매각", paragraphs: ["매각가 $1,000,000, 매입가 $650,000, GST 포함 수수료율 2.2%, 기타 매각 비용 $5,000, 대출 상환액 $400,000을 가정합니다. 이 가상 사례에서 나머지 비용과 보유 기간 현금 흐름은 모두 0입니다.", "수수료: $1,000,000 × 2.2% = $22,000. 매각 비용: $22,000 + $5,000 = $27,000. 매각 비용 차감 후 금액: $1,000,000 − $27,000 = $973,000.", "거래 이익: $973,000 − $650,000 = $323,000. 대출 상환 후 간소화된 현금: $973,000 − $400,000 = $573,000. 두 결과 모두 세후 이익이나 완전한 정산 명세서가 아닙니다."] },
      { id: "cash-with-loss", title: "손실을 보고 매각해도 현금이 남을 수 있나요?", paragraphs: [
        "네. 대출 상환 후 현금이 남는다고 부동산 거래에서 이익이 났다는 뜻은 아닙니다. 가상 사례로 매각가 $700,000, 매입가 $750,000, GST 포함 수수료율 2%, 기타 매각 비용 $6,000, 대출 상환액 $400,000을 가정합니다. 나머지 비용과 보유 기간 현금 흐름은 모두 0입니다.",
        "수수료는 $14,000, 총 매각 비용은 $20,000입니다. 매각 비용 차감 후 금액: $700,000 − $20,000 = $680,000. 거래 결과: $680,000 − $750,000 = −$70,000으로 거래 손실입니다. 대출 상환 후 간소화된 현금: $680,000 − $400,000 = $280,000.",
        "$280,000의 현금 예상치는 이익이 아닙니다. 최초 매입가를 다시 차감하지 않기 때문입니다. 두 결과 모두 세금, 입력하지 않은 비용과 정산 조정액을 제외합니다. 대출 상환액이 바뀌면 현금만 바뀌며 $70,000의 거래 손실은 바뀌지 않습니다.",
      ] },
      { id: "prepare-figures", title: "어떤 금액 자료를 준비해야 하나요?", paragraphs: [
        "가상 사례를 일반적인 수수료로 보지 말고 본인의 기록과 견적을 사용하세요. 각 비용을 해당 항목에 한 번만 입력하세요. 금액이 빠지면 추정치는 불완전합니다.",
      ], checklist: [
        "예상 매각가 또는 이미 매각했다면 실제 매각가, 중개인의 GST 포함 수수료율, 중개인과 다른 제공자의 항목별 매각 비용 견적.",
        "매입 기록과 매입 비용, 개조 및 개선 비용, 매각 준비 비용의 청구서. 같은 공사비가 여러 항목에 중복 입력되지 않았는지 확인하세요.",
        "현금 결과를 이용할 때는 대출기관의 상환 예상액, 종합 세전 결과를 이용할 때는 같은 기간의 비용 차감 전 총 임대 수입과 지급한 보유 비용. 대출 원금 상환액은 보유 비용에서 제외하세요.",
      ] },
      { id: "compare-quotes", title: "수수료율이 낮으면 매각 비용도 항상 낮나요?", paragraphs: ["같은 매각가에서 입력한 총비용을 비교하세요. $1,000,000 매각 시 가상 견적 A의 수수료율 2.2%와 기타 비용 $5,000은 총 $27,000입니다. 견적 B의 1.8%와 $9,000도 총 $27,000입니다.", "이 입력값에서만 두 총액이 같습니다. 매각가가 달라지면 비율 수수료도 달라집니다. 계산기는 서비스 품질이나 계약 조건을 비교하지 않으며 중개인이 달성할 매각가를 예측하지 않습니다."] },
      { id: "planning", title: "손익분기 매각가와 목표 매각가는 어떻게 계산하나요?", paragraphs: ["매입가, 매입 비용, 개조 및 개선 비용, 기타 매각 비용과 매각 준비 비용을 더하고 (1 − 소수로 표시한 수수료율)로 나누면 입력 비용 기준 거래 손익분기 매각가가 됩니다. 목표 거래 이익이 있다면 나누기 전에 분자에 목표 금액을 더합니다.", "필요한 매각가는 정수 달러 단위로 올림하며 이미 정수 달러인 결과는 그대로 유지합니다. 수수료는 그 매각가로 다시 계산합니다. 임대 수입, 보유 비용과 대출 상환액은 이 거래 이익 목표를 바꾸지 않습니다. 이는 입력 비용에 따른 계산이며 감정가나 예측이 아닙니다."] },
      { id: "already-sold", title: "이미 매각한 후에도 사용할 수 있나요?", paragraphs: ["네. 매각가 항목에는 실제 매각가를, 각 비용 항목에는 확인된 실제 비용을 입력하여 거래를 돌아볼 수 있습니다. 비용을 빠뜨리면 결과는 여전히 불완전합니다. 이 추정치가 회계 또는 정산 명세서로 바뀌는 것은 아닙니다."] },
      { id: "scope", title: "추정 범위에 포함되지 않는 것은 무엇인가요?", paragraphs: ["이 모델은 CGT, 소득세, 과세 대상 자본이득, 회계상 이익, 세후 이익, 완전한 정산 조정, 연환산 수익률이나 시장 가치를 계산하지 않습니다. 결과는 부동산 전체에 대한 것이며 소유자별 지분을 배분하지 않습니다.", "본인의 증빙에 있는 금액을 사용하세요. 참고 및 교육용 도구이며 금융, 법률, 세무, 감정평가, 회계 또는 정산 자문이 아닙니다. 계산기 금액은 브라우저에 남습니다. 익명 사용 이벤트와 호스팅 정보는 개인정보 안내를 참고하세요."] },
    ],
  },
};
