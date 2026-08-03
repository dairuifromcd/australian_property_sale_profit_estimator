import type { SiteMessages } from "./types";

export const zhHans = {
  common: {
    siteName: "Property Sale Profit",
    homeAria: "Property Sale Profit 首页",
    scopeAria: "估算范围提示",
    scopeTitle: "参考估算",
    scopeDescription:
      "仅使用您输入的金额，不包括税务和未输入的交割调整项目。",
    readImportantInformation: "阅读重要信息",
    legalNavigationAria: "隐私与法律信息",
    privacy: "隐私",
    importantInformation: "重要信息",
    disclaimer: "免责声明",
    languageNavigationAria: "选择语言",
    languageChangeWarning: "切换语言会清空当前已输入的数据。是否继续？",
    languages: {
      enAU: "English",
      zhHans: "简体中文",
      ko: "한국어",
    },
  },
  metadata: {
    home: {
      title: "澳洲房产出售收益计算器 | Property Sale Profit",
      description:
        "估算澳洲房产出售成本、交易盈亏、可选持有期结果、简化交割现金和目标售价。",
      openGraphTitle: "估算房产出售结果和现金状况。",
      openGraphDescription:
        "在浏览器中私密估算出售成本、交易结果、可选持有期现金流，以及偿还贷款后的简化现金。",
    },
    privacy: {
      title: "隐私 | Property Sale Profit",
      description:
        "了解 Property Sale Profit 如何处理计算器输入和技术数据。",
    },
    disclaimer: {
      title: "重要信息 | Property Sale Profit",
      description: "Property Sale Profit 计算器的重要限制。",
    },
  },
  home: {
    eyebrow: "澳洲房产出售计算器",
    title: "估算房产出售结果和现金状况。",
    intro:
      "先输入四个数字估算交易结果；还可选择加入购买成本、持有期现金流和贷款偿还额，并将不同结果分开呈现。",
    privacyBenefitsAria: "隐私特点",
    privateByDesign: "隐私优先设计",
    noSignUp: "无需注册",
    calculationsStay: "计算仅在本设备进行",
    explanationLabel: "这个工具能回答什么",
    explanationTitle: "不只看售价减买价，更完整地理解交易结果。",
    explanationCards: [
      {
        title: "扣除出售成本后的金额",
        body:
          "售价减去中介佣金、其他出售成本和售前准备成本。此金额尚未扣除贷款偿还额。",
      },
      {
        title: "交易盈利或亏损",
        body:
          "扣除出售成本后的金额，再减去买价、购买成本、翻新和改良支出；尚未计入持有期现金流、贷款偿还额和税款。",
      },
      {
        title: "保本售价和目标售价",
        body:
          "查看覆盖所输入交易成本或达到目标交易利润所需的售价。持有期现金流、贷款偿还额和税款不会改变这些规划售价。",
      },
      {
        title: "可选的整体结果和现金结果",
        body:
          "将持有期收入和成本，与偿还贷款后的简化现金估算分开查看。",
      },
    ],
    footerPrivacyBody:
      "您的数据只在本浏览器中计算，本应用不会接收或保存这些数据。有限的匿名使用事件不包含计算器数据、应用生成的标识符或 Cookie；详情请参阅隐私声明。",
    limitationsTitle: "重要限制",
    limitationsBody:
      "可选的整体结果和交割现金结果仅使用您输入的金额。本工具不计算资本利得税、所得税、折旧、经时间调整的回报或税后利润。",
    contactTitle: "有问题或建议？",
    independence:
      "独立计算器 · 与澳大利亚税务局（ATO）或其他政府机构无隶属关系，也未获其认可",
  },
  form: {
    quickEstimateStep: "01 · 快速估算",
    title: "先输入四个数字",
    reset: "重置",
    required: "必填",
    salePrice: "预计售价",
    salePriceHelpBefore: "需要参考？可查看",
    salePriceHelpOr: "或",
    salePriceHelpAfter: "。",
    purchasePrice: "原始买价",
    commissionRate: "中介佣金率",
    commissionHelp:
      "请使用中介报价中含 GST 的佣金率。仅在无需支付佣金时输入 0。",
    otherSellingCosts: "其他出售成本",
    otherSellingCostsHelp:
      "广告、过户、法律及其他出售成本；如不适用请输入 0。",
    transactionDetailsTitle: "添加交易明细",
    transactionDetailsSummary: "购买、售前准备和改良成本",
    addDetails: "添加明细",
    hideDetails: "收起明细",
    salePreparationCosts: "售前准备成本",
    salePreparationHelp:
      "为本次出售支出的布置、清洁、维修及其他准备成本。",
    purchaseCosts: "购买成本（不含买价）",
    purchaseCostsHelp: "您希望计入的印花税、过户及其他购买成本。",
    renovations: "翻新和改良支出",
    renovationsHelp: "您希望计入本次交易估算的翻新和改良支出。",
    holdingDetailsTitle: "添加持有期和贷款明细",
    holdingDetailsSummary: "可选的整体结果和交割现金估算",
    holdingDetailsIntro:
      "这些数据不会改变交易利润、保本售价或达到目标交易利润所需的售价。",
    holdingCosts: "已支付的持有成本总额",
    holdingCostsHelp:
      "您希望计入的利息（不含贷款本金）、Council rates、保险、业主委员会费（body corporate）、房屋中介管理费、维护费及其他持有成本。",
    rentalIncome: "已收租金总额",
    rentalIncomeHelp:
      "与持有成本相同期间内收到的租金总额；如没有租金收入请输入 0。",
    loanPayout: "预计交割时贷款偿还额",
    loanPayoutHelp:
      "如有条件，请使用贷款机构提供的 payout estimate。它可能与当前贷款余额不同，仅用于简化现金估算。",
  },
  results: {
    expandedEstimate: "详细估算",
    quickEstimate: "快速估算",
    onDevice: "本设备计算",
    incompleteTitle: "请完成四项快速输入",
    incompleteBody: "如无需支付佣金或其他出售成本，请输入 0。",
    invalidTitle: "请检查标出的字段",
    invalidBody: "请先修正输入值，再使用此估算结果。",
    print: "打印或另存为 PDF",
    resultNote:
      "仅供参考，并非会计利润或税务计算。交割现金不包括未输入的调整项目。作出决定前，请向具备相应资质的专业人士核实重要数据。",
    showCalculation: "显示计算过程",
    profitStatus: "盈利",
    lossStatus: "亏损",
    estimateStatus: "估算",
    shortfallStatus: "缺口",
    transactionProfitTitle: "整套房产交易盈利",
    transactionLossTitle: "整套房产交易亏损",
    transactionIntro:
      "尚未计入持有成本、租金收入、贷款偿还额和税款。输入其他数据后，相关结果会单独显示。",
    expectedSalePrice: "预计售价",
    agentCommission: "中介佣金",
    otherSellingCosts: "其他出售成本",
    salePreparationCosts: "售前准备成本",
    amountAfterSellingCosts: "扣除出售成本后的金额",
    purchasePrice: "买价",
    buyingCosts: "购买成本",
    renovations: "翻新和改良支出",
    transactionProfit: "交易盈利",
    transactionLoss: "交易亏损",
    transactionCalculation:
      "预计售价减去佣金、其他出售和售前准备成本、买价、购买成本及改良支出。",
    displayedAmountsNote:
      "显示金额四舍五入至分；估算使用显示前的输入数值。",
    holdingPeriodCashFlows: "持有期现金流",
    overallResultTitle: "房产整体税前结果",
    rentalIncome: "租金收入",
    holdingCosts: "持有成本",
    overallResult: "整体税前结果",
    overallResultNote:
      "税前结果。由于买价已计入交易利润，因此不再将贷款本金偿还额作为持有成本。",
    transactionPrecisionNote: "估算使用显示前未经四舍五入的交易结果。",
    settlementCashLabel: "简化交割现金",
    settlementCashTitle: "偿还贷款后的预计现金",
    settlementShortfallTitle: "偿还贷款后的预计现金缺口",
    estimatedLoanPayout: "预计贷款偿还额",
    estimatedCash: "预计现金",
    estimatedCashShortfall: "预计现金缺口",
    settlementNote:
      "税前且不含未输入的交割调整项目。请向贷款机构和过户专业人士确认实际偿还额。",
    settlementPrecisionNote:
      "显示金额四舍五入至分；估算使用显示前的数值。",
    breakEvenLabel: "覆盖所输入交易成本的保本售价",
    breakEvenExplanation:
      "固定交易成本除以一减佣金率，再向上取整至下一澳元。",
    roundedUp: "向上取整",
    targetTitle: "达到目标利润所需的售价",
    targetIntro:
      "设定整套房产的目标交易利润，不计持有期现金流、贷款偿还额和税款。系统会按所需售价重新计算佣金，并将售价向上取整至下一澳元。",
    targetProfit: "目标交易利润",
    targetProfitHelp: "输入 0 可得出覆盖所输入成本的保本售价。",
    targetResultLabel: "达到此目标所需的售价",
    targetMatches: "与您的预计售价相同。",
    targetAbove: "比您的预计售价 {salePrice} 高 {difference}。",
    targetBelow: "比您的预计售价 {salePrice} 低 {difference}。",
    targetCalculation:
      "所输入的固定交易成本加目标利润，除以一减佣金率，再向上取整至下一澳元。",
    sensitivityTitle: "售价敏感度",
    sensitivityIntro:
      "仅展示比所输入预计售价低 5% 和高 5% 的示例情景，并非价格预测。佣金会重新计算，其他已输入成本保持不变。",
    scenario: "情景",
    salePrice: "售价",
    result: "结果",
    current: "当前",
    profit: "盈利",
    loss: "亏损",
    sensitivityCalculation:
      "每一行均按该情景售价重新计算佣金，再减去相同的固定交易成本。",
    commissionFormulaLabel: "佣金",
    fixedCostsFormulaLabel: "固定成本",
    sensitivityPrecisionNote:
      "显示金额四舍五入至分；每个情景使用显示前的数值。",
  },
  validation: {
    amountGreaterThanZero: "请输入大于 0 的金额。",
    amountZeroOrMore: "请输入大于或等于 0 的金额。",
    amountMaxTrillion: "请输入不超过 1 万亿澳元的金额。",
    commissionRange: "请输入 0% 至 99.9% 的佣金率。",
    completeValidEstimate: "请先完成有效的交易估算。",
    targetZeroOrMore: "请输入大于或等于 0 的目标利润。",
    targetMaxTrillion: "请输入不超过 1 万亿澳元的目标利润。",
  },
  privacy: {
    eyebrow: "隐私声明",
    title: "您的数据如何处理",
    intro:
      "使用本计算器无需账户。您输入的财务数据会留在浏览器中。",
    entriesTitle: "计算器输入",
    entriesBody:
      "售价、买价、佣金率和成本假设均在您的设备上计算。当前应用代码不会将这些输入传输到服务器或存储在服务器上；重新加载页面会将其重置。打印或保存 PDF 的操作由您的浏览器和设备完成。",
    technicalTitle: "技术请求数据",
    technicalBody:
      "Cloudflare 托管、保护并交付本网站。与其他网站基础设施提供商一样，它可能处理 IP 地址、浏览器信息、请求网址、请求时间和安全信号等技术请求数据。计算器输入不会写入网址。",
    cloudflareBefore: "请参阅",
    cloudflareLink: "Cloudflare 隐私政策",
    cloudflareAfter: "。",
    analyticsTitle: "匿名使用情况分析",
    analyticsBody:
      "为了了解本计算器是否真正有用，当计算器被查看，以及访客在一次页面访问中首次开始或完成估算、展开可选明细、算出目标售价或选择打印时，应用会发送一个简短事件。Analytics Engine 数据集仅记录事件类型、页面语言、请求来自正式环境还是 Preview，以及 Cloudflare 生成的事件时间戳；不会包含计算器输入、页面内容、应用生成的用户或会话标识符，也不使用 Cookie。事件由 Cloudflare 最多保留三个月，仅用于汇总分析。",
    accountsTitle: "账户和 Cookie",
    accountsBody:
      "当前版本没有用户账户、反馈表单、广告分析或应用 Cookie。如未来版本改变这些做法，我们会在引入相关功能前更新本声明。",
    externalTitle: "外部网站",
    externalBody:
      "realestate.com.au、Domain 及其他第三方网站链接受各自隐私规则约束。计算器输入不会附加到这些链接中。",
    questionsTitle: "问题与联系",
    questionsBefore: "如有问题或建议，请发送邮件至",
    questionsAfter:
      "。邮件会通过 Cloudflare Email Routing 转发并存储在 Gmail 中，因此 Cloudflare 和 Google 可能会处理邮件内容和技术数据。请勿发送计算器数据或敏感的个人、房产或财务信息。",
    updated: "最后更新：2026 年 8 月 3 日。",
  },
  disclaimer: {
    eyebrow: "重要信息",
    title: "请仅将本估算作为起点",
    intro:
      "Property Sale Profit 是免费的通用信息工具，不能替代结合您个人情况提供的专业意见。",
    adviceTitle: "不构成专业意见",
    adviceBody:
      "本计算器不提供税务、财务、法律、房产估值、过户、信贷、会计或交割建议；不预测售价、不计算纳税义务，也不确定交割时您将收到的确切金额。请勿仅依据本估算作出出售、购买、借贷或投资决定。",
    limitationsTitle: "重要限制",
    limitations: [
      "结果完全取决于所输入的数据和假设。",
      "扣除出售成本后的金额尚未扣除任何房贷。可选的交割现金估算只减去所输入的贷款偿还额，不包括税款、交割调整项目和未输入金额。",
      "交易利润不包括持有期收入、持有成本和融资。可选的整体税前结果只加上所输入的租金收入，并只减去所输入的持有成本；它不是年化或经时间调整的回报。",
      "由于买价已计入交易利润，因此贷款本金偿还额不视为持有成本。本计算器不判断利息、租金或其他输入在会计或税务上的处理方式。",
      "保本售价仅覆盖所输入的交易成本，不包括持有期现金流、贷款偿还额、税款或用户未提供的成本。",
      "售价敏感度表机械地采用比所输入预计售价低 5% 和高 5% 的情景。这些情景不是预测、估值或未来售价预判。",
      "本计算器不计算资本利得税、所得税、应税资本利得、会计利润或税后利润。",
      "翻新、改良和其他成本均为用户自行选择的交易假设。本计算器不判断这些项目的会计或税务处理方式。",
    ],
    affiliationTitle: "与政府机构无隶属关系",
    affiliationBody:
      "本项目独立运营，与澳大利亚税务局（ATO）、澳大利亚证券和投资委员会（ASIC）、税务从业者委员会（Tax Practitioners Board）或其他澳大利亚政府机构无隶属关系，也未获其批准、认证或认可。",
    checkTitle: "行动前请核实",
    checkBody:
      "房产情况、交易成本、债务和税务可能对结果产生重大影响。请向具备相应资质的澳大利亚专业人士（如会计师、注册税务代理、过户师、律师或财务顾问）核实重要数据和决定。本声明不排除任何依法不能排除的权利或救济。",
    updated: "模型范围与声明最后复核于 2026 年 7 月 24 日。",
  },
} as const satisfies SiteMessages;
