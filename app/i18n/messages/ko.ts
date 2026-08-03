import type { SiteMessages } from "./types";

export const ko = {
  common: {
    siteName: "Property Sale Profit",
    homeAria: "Property Sale Profit 홈",
    scopeAria: "예상 범위 안내",
    scopeTitle: "참고용 예상치",
    scopeDescription:
      "입력한 금액만 사용하며, 세금과 입력하지 않은 정산 조정 항목은 제외됩니다.",
    readImportantInformation: "중요 정보 읽기",
    legalNavigationAria: "개인정보 및 법적 정보",
    privacy: "개인정보",
    importantInformation: "중요 정보",
    disclaimer: "면책 고지",
    languageNavigationAria: "언어 선택",
    languageChangeWarning:
      "언어를 변경하면 현재 입력한 금액이 모두 지워집니다. 계속하시겠습니까?",
    languages: {
      enAU: "English",
      zhHans: "简体中文",
      ko: "한국어",
    },
  },
  metadata: {
    home: {
      title: "호주 부동산 매각 수익 계산기 | Property Sale Profit",
      description:
        "호주 부동산 매각 비용, 거래 손익, 선택적 보유 기간 결과, 간소화된 정산 후 현금 및 목표 매각가를 추정합니다.",
      openGraphTitle: "부동산 매각 결과와 현금 상황을 추정해 보세요.",
      openGraphDescription:
        "브라우저에서 비공개로 매각 비용, 거래 결과, 선택적 보유 현금 흐름과 대출 상환 후 간소화된 현금을 추정합니다.",
    },
    privacy: {
      title: "개인정보 | Property Sale Profit",
      description:
        "Property Sale Profit이 계산기 입력값과 기술 데이터를 처리하는 방식을 안내합니다.",
    },
    disclaimer: {
      title: "중요 정보 | Property Sale Profit",
      description: "Property Sale Profit 계산기의 중요한 한계입니다.",
    },
  },
  home: {
    eyebrow: "호주 부동산 매각 계산기",
    title: "부동산 매각 결과와 현금 상황을 추정해 보세요.",
    intro:
      "네 가지 숫자로 거래 예상치를 확인하세요. 매입 비용, 보유 기간 현금 흐름, 대출 상환액을 선택적으로 추가하되 서로 다른 결과는 구분해서 볼 수 있습니다.",
    privacyBenefitsAria: "개인정보 보호 특징",
    privateByDesign: "개인정보 보호 중심 설계",
    noSignUp: "가입 불필요",
    calculationsStay: "계산은 이 기기에서만 처리",
    explanationLabel: "이 도구로 확인할 수 있는 것",
    explanationTitle: "매각가에서 매입가만 빼는 것보다 명확한 결과.",
    explanationCards: [
      {
        title: "매각 비용 차감 후 금액",
        body:
          "매각가에서 중개 수수료, 기타 매각 비용 및 매각 준비 비용을 뺀 금액입니다. 대출 상환액은 차감하기 전입니다.",
      },
      {
        title: "거래 이익 또는 손실",
        body:
          "매각 비용 차감 후 금액에서 매입가, 매입 비용, 개조 및 개선 비용을 뺍니다. 보유 현금 흐름, 대출 상환액 및 세금은 제외됩니다.",
      },
      {
        title: "손익분기 및 목표 매각가",
        body:
          "입력한 거래 비용을 충당하거나 목표 거래 이익을 달성하는 데 필요한 매각가를 확인합니다. 보유 현금 흐름, 대출 상환액 및 세금은 이 계획 가격에 영향을 주지 않습니다.",
      },
      {
        title: "선택적 종합 및 현금 결과",
        body:
          "보유 기간의 수입·비용과 대출 상환 후 간소화된 현금 예상치를 구분해 확인합니다.",
      },
    ],
    footerPrivacyBody:
      "입력값은 이 브라우저에서 계산되며 이 애플리케이션으로 전송되거나 저장되지 않습니다. 제한적인 익명 사용 이벤트에는 계산기 입력값, 애플리케이션이 생성한 식별자 또는 쿠키가 포함되지 않습니다. 자세한 내용은 개인정보 처리 안내를 확인하세요.",
    limitationsTitle: "중요한 한계",
    limitationsBody:
      "선택적 종합 결과와 정산 후 현금 결과에는 입력한 금액만 사용됩니다. 이 도구는 자본이득세(CGT), 소득세, 감가상각, 시간 조정 수익률 또는 세후 이익을 계산하지 않습니다.",
    contactTitle: "문의 또는 의견이 있으신가요?",
    independence:
      "독립 계산기 · 호주 국세청(ATO) 또는 기타 정부 기관과 제휴하거나 그 승인을 받지 않음",
  },
  form: {
    quickEstimateStep: "01 · 빠른 예상",
    title: "네 가지 숫자로 시작하세요",
    reset: "초기화",
    required: "필수",
    salePrice: "예상 매각가",
    salePriceHelpBefore: "참고 가격이 필요하면",
    salePriceHelpOr: "또는",
    salePriceHelpAfter: "에서 확인하세요.",
    purchasePrice: "최초 매입가",
    commissionRate: "중개 수수료율",
    commissionHelp:
      "중개인 견적서의 GST 포함 수수료율을 사용하세요. 수수료가 없을 때만 0을 입력하세요.",
    otherSellingCosts: "기타 매각 비용",
    otherSellingCostsHelp:
      "광고, 소유권 이전, 법률 및 기타 매각 비용입니다. 해당 비용이 없으면 0을 입력하세요.",
    transactionDetailsTitle: "거래 세부 정보 추가",
    transactionDetailsSummary: "매입, 매각 준비 및 개선 비용",
    addDetails: "세부 정보 추가",
    hideDetails: "세부 정보 접기",
    salePreparationCosts: "매각 준비 비용",
    salePreparationHelp:
      "이번 매각을 위해 지출한 스타일링, 청소, 수리 및 기타 준비 비용입니다.",
    purchaseCosts: "매입 비용(매입가 제외)",
    purchaseCostsHelp:
      "인지세, 소유권 이전 및 포함하려는 기타 매입 비용입니다.",
    renovations: "개조 및 개선 비용",
    renovationsHelp:
      "이번 거래 예상치에 포함하려는 개조 및 개선 지출입니다.",
    holdingDetailsTitle: "보유 및 대출 세부 정보 추가",
    holdingDetailsSummary: "선택적 종합 결과 및 정산 후 현금 예상치",
    holdingDetailsIntro:
      "이 금액들은 거래 이익, 손익분기 매각가 또는 목표 거래 이익에 필요한 매각가를 변경하지 않습니다.",
    holdingCosts: "지급한 총 보유 비용",
    holdingCostsHelp:
      "포함하려는 이자(대출 원금 제외), Council rates(카운슬 요금), 보험, 공동주택 관리비, 임대 관리비, 유지비 및 기타 보유 비용입니다.",
    rentalIncome: "수령한 총 임대 수입",
    rentalIncomeHelp:
      "보유 비용과 동일한 기간에 받은 총 임대료입니다. 임대 수입이 없으면 0을 입력하세요.",
    loanPayout: "잔금 정산 시 예상 대출 상환액",
    loanPayoutHelp:
      "가능하면 대출기관의 상환 예상액을 사용하세요. 현재 대출 잔액과 다를 수 있으며 간소화된 현금 예상치에만 사용됩니다.",
  },
  results: {
    expandedEstimate: "상세 예상",
    quickEstimate: "빠른 예상",
    onDevice: "기기 내 계산",
    incompleteTitle: "빠른 입력 네 항목을 완료하세요",
    incompleteBody: "수수료나 기타 매각 비용이 없으면 0을 입력하세요.",
    invalidTitle: "표시된 항목을 확인하세요",
    invalidBody: "예상치를 사용하기 전에 입력값을 수정하세요.",
    print: "인쇄 또는 PDF로 저장",
    resultNote:
      "참고용 예상치이며 회계상 이익이나 세금 계산이 아닙니다. 정산 후 현금에는 입력하지 않은 조정 항목이 제외됩니다. 결정하기 전에 적절한 자격을 갖춘 전문가에게 중요 금액을 확인하세요.",
    showCalculation: "계산 과정 보기",
    profitStatus: "이익",
    lossStatus: "손실",
    estimateStatus: "예상",
    shortfallStatus: "부족",
    transactionProfitTitle: "부동산 전체 거래 이익",
    transactionLossTitle: "부동산 전체 거래 손실",
    transactionIntro:
      "보유 비용, 임대 수입, 대출 상환액 및 세금 차감 전입니다. 추가 금액을 입력하면 관련 결과가 별도로 표시됩니다.",
    expectedSalePrice: "예상 매각가",
    agentCommission: "중개 수수료",
    otherSellingCosts: "기타 매각 비용",
    salePreparationCosts: "매각 준비 비용",
    amountAfterSellingCosts: "매각 비용 차감 후 금액",
    purchasePrice: "매입가",
    buyingCosts: "매입 비용",
    renovations: "개조 및 개선 비용",
    transactionProfit: "거래 이익",
    transactionLoss: "거래 손실",
    transactionCalculation:
      "예상 매각가에서 수수료, 기타 매각 및 준비 비용, 매입가, 매입 비용과 개선 비용을 뺍니다.",
    displayedAmountsNote:
      "표시 금액은 센트 단위로 반올림되며, 예상치는 표시 전 입력값을 사용합니다.",
    holdingPeriodCashFlows: "보유 기간 현금 흐름",
    overallResultTitle: "부동산 종합 세전 결과",
    rentalIncome: "임대 수입",
    holdingCosts: "보유 비용",
    overallResult: "종합 세전 결과",
    overallResultNote:
      "세전 결과입니다. 매입가가 이미 거래 이익에 포함되므로 대출 원금 상환액은 제외됩니다.",
    transactionPrecisionNote:
      "예상치는 표시 전 반올림되지 않은 거래 결과를 사용합니다.",
    settlementCashLabel: "간소화된 정산 후 현금",
    settlementCashTitle: "대출 상환 후 예상 현금",
    settlementShortfallTitle: "대출 상환 후 예상 현금 부족액",
    estimatedLoanPayout: "예상 대출 상환액",
    estimatedCash: "예상 현금",
    estimatedCashShortfall: "예상 현금 부족액",
    settlementNote:
      "세전이며 입력하지 않은 정산 조정 항목은 제외됩니다. 실제 상환액은 대출기관과 정산 담당 전문가에게 확인하세요.",
    settlementPrecisionNote:
      "표시 금액은 센트 단위로 반올림되며, 예상치는 표시 전 값을 사용합니다.",
    breakEvenLabel: "입력한 거래 비용의 손익분기 매각가",
    breakEvenExplanation:
      "고정 거래 비용을 1에서 수수료율을 뺀 값으로 나눈 뒤 다음 1달러 단위로 올림합니다.",
    roundedUp: "올림",
    targetTitle: "목표 이익을 위한 매각가",
    targetIntro:
      "보유 현금 흐름, 대출 상환액 및 세금을 제외한 부동산 전체 거래 이익을 설정합니다. 필요한 매각가에서 수수료를 다시 계산하고 다음 1달러 단위로 올림합니다.",
    targetProfit: "목표 거래 이익",
    targetProfitHelp: "0을 입력하면 입력 비용 기준 손익분기 가격이 나옵니다.",
    targetResultLabel: "이 목표에 필요한 매각가",
    targetMatches: "입력한 예상 매각가와 같습니다.",
    targetAbove: "입력한 예상 매각가 {salePrice}보다 {difference} 높습니다.",
    targetBelow: "입력한 예상 매각가 {salePrice}보다 {difference} 낮습니다.",
    targetCalculation:
      "입력한 고정 거래 비용에 목표 이익을 더하고 1에서 수수료율을 뺀 값으로 나눈 뒤 다음 1달러 단위로 올림합니다.",
    sensitivityTitle: "매각가 민감도",
    sensitivityIntro:
      "입력한 매각가보다 5% 낮고 높은 예시 시나리오이며 가격 예측이 아닙니다. 수수료는 다시 계산하고 다른 입력 비용은 그대로 유지합니다.",
    scenario: "시나리오",
    salePrice: "매각가",
    result: "결과",
    current: "현재",
    profit: "이익",
    loss: "손실",
    sensitivityCalculation:
      "각 행은 해당 시나리오 매각가로 수수료를 다시 계산한 뒤 같은 고정 거래 비용을 뺍니다.",
    commissionFormulaLabel: "수수료",
    fixedCostsFormulaLabel: "고정 비용",
    sensitivityPrecisionNote:
      "표시 금액은 센트 단위로 반올림되며, 각 시나리오는 표시 전 값을 사용합니다.",
  },
  validation: {
    amountGreaterThanZero: "0보다 큰 금액을 입력하세요.",
    amountZeroOrMore: "0 이상의 금액을 입력하세요.",
    amountMaxTrillion: "1조 호주 달러 이하의 금액을 입력하세요.",
    commissionRange: "0%에서 99.9% 사이의 수수료율을 입력하세요.",
    completeValidEstimate: "먼저 유효한 거래 예상치를 완성하세요.",
    targetZeroOrMore: "0 이상의 목표 이익을 입력하세요.",
    targetMaxTrillion: "1조 호주 달러 이하의 목표 이익을 입력하세요.",
  },
  privacy: {
    eyebrow: "개인정보 처리 안내",
    title: "데이터 처리 방식",
    intro:
      "이 계산기를 사용하는 데 계정이 필요하지 않습니다. 입력한 재무 정보는 브라우저에만 남습니다.",
    entriesTitle: "계산기 입력값",
    entriesBody:
      "매각가, 매입가, 수수료율과 비용 가정은 기기에서 계산됩니다. 현재 애플리케이션 코드는 이 입력값을 서버로 전송하거나 서버에 저장하지 않습니다. 페이지를 새로 고치면 초기화됩니다. 인쇄 또는 PDF 저장은 브라우저와 기기에서 수행하는 작업입니다.",
    technicalTitle: "기술 요청 데이터",
    technicalBody:
      "Cloudflare가 이 사이트를 호스팅, 보호 및 전송합니다. 다른 웹 인프라 제공업체와 마찬가지로 IP 주소, 브라우저 정보, 요청 URL, 요청 시간 및 보안 신호 등의 기술 요청 데이터를 처리할 수 있습니다. 계산기 입력값은 URL에 포함되지 않습니다.",
    cloudflareBefore: "다음 문서를 확인하세요:",
    cloudflareLink: "Cloudflare 개인정보 처리방침",
    cloudflareAfter: ".",
    analyticsTitle: "익명 사용 분석",
    analyticsBody:
      "계산기가 실제로 유용한지 파악하기 위해 계산기를 볼 때와 한 번의 페이지 방문에서 사용자가 처음으로 입력을 시작하거나 유효한 예상치를 완성할 때, 선택 항목을 펼칠 때, 목표 매각가를 계산할 때 또는 인쇄를 선택할 때 짧은 이벤트를 전송합니다. Analytics Engine 데이터 세트에는 이벤트 유형, 페이지 언어, production 또는 Preview 환경 여부, Cloudflare 이벤트 타임스탬프만 기록됩니다. 계산기 입력값, 페이지 내용, 애플리케이션이 생성한 사용자·세션 식별자 또는 쿠키는 포함되지 않습니다. 이벤트는 Cloudflare에 최대 3개월 보관되며 집계 분석에만 사용됩니다.",
    accountsTitle: "계정 및 쿠키",
    accountsBody:
      "현재 버전에는 사용자 계정, 피드백 양식, 광고 분석 또는 애플리케이션 쿠키가 없습니다. 향후 버전에서 이러한 방식이 바뀌는 경우 관련 기능을 도입하기 전에 이 안내를 업데이트합니다.",
    externalTitle: "외부 웹사이트",
    externalBody:
      "realestate.com.au, Domain 및 기타 제3자 웹사이트 링크에는 각 사이트의 개인정보 보호 관행이 적용됩니다. 계산기 입력값은 해당 링크에 첨부되지 않습니다.",
    questionsTitle: "문의 및 의견",
    questionsBefore: "문의 또는 의견은",
    questionsAfter:
      "로 보내 주세요. 이메일은 Cloudflare Email Routing을 통해 전달되어 Gmail에 저장되므로 Cloudflare와 Google이 이메일 내용과 기술 데이터를 처리할 수 있습니다. 계산기 입력값이나 민감한 개인·부동산·재무 정보를 보내지 마세요.",
    updated: "최종 업데이트: 2026년 8월 3일.",
  },
  disclaimer: {
    eyebrow: "중요 정보",
    title: "이 예상치는 출발점으로만 사용하세요",
    intro:
      "Property Sale Profit은 무료 일반 정보 도구이며, 개인 상황을 고려한 조언을 대체하지 않습니다.",
    adviceTitle: "전문가 조언이 아님",
    adviceBody:
      "이 계산기는 세무, 재무, 법률, 부동산 가치평가, 소유권 이전, 신용, 회계 또는 잔금 정산 관련 조언을 제공하지 않습니다. 매각가를 예측하거나 납세 의무를 계산하거나 잔금 정산 시 받을 정확한 금액을 산정하지 않습니다. 이 예상치만으로 매각, 매입, 대출 또는 투자 결정을 내리지 마세요.",
    limitationsTitle: "중요한 한계",
    limitations: [
      "결과는 전적으로 입력한 수치와 가정에 따라 달라집니다.",
      "매각 비용 차감 후 금액은 주택담보대출 상환 전입니다. 선택적 정산 후 현금 예상치는 입력한 대출 상환액만 차감하며 세금, 정산 조정 및 입력하지 않은 금액은 제외합니다.",
      "거래 이익은 보유 기간 수입, 보유 비용 및 금융 비용을 제외합니다. 선택적 종합 세전 결과는 입력한 임대 수입만 더하고 입력한 보유 비용만 뺍니다. 연환산 또는 시간 조정 수익률이 아닙니다.",
      "매입가가 이미 거래 이익에 포함되므로 대출 원금 상환액은 보유 비용으로 처리하지 않습니다. 이 계산기는 이자, 임대료 또는 기타 입력값의 회계상·세무상 처리를 판단하지 않습니다.",
      "손익분기 매각가는 입력한 거래 비용만 충당합니다. 보유 현금 흐름, 대출 상환액, 세금 및 사용자가 입력하지 않은 비용은 제외합니다.",
      "매각가 민감도 표는 입력한 예상 매각가보다 5% 낮고 높은 값을 기계적으로 적용합니다. 이는 시나리오일 뿐 예측, 가치평가 또는 미래 매각가 전망이 아닙니다.",
      "이 계산기는 자본이득세(CGT), 소득세, 과세 대상 자본이득, 회계상 이익 또는 세후 이익을 계산하지 않습니다.",
      "개조, 개선 및 기타 비용 입력값은 사용자가 선택한 거래 가정입니다. 이 계산기는 해당 비용의 회계상 또는 세무상 처리를 판단하지 않습니다.",
    ],
    affiliationTitle: "정부 기관과 무관",
    affiliationBody:
      "이 프로젝트는 독립적으로 운영됩니다. 호주 국세청(ATO), 호주증권투자위원회(ASIC), Tax Practitioners Board 또는 기타 호주 정부 기관과 제휴하지 않았으며 승인, 인증 또는 보증을 받지 않았습니다.",
    checkTitle: "결정 전에 확인하세요",
    checkBody:
      "부동산 상황, 거래 비용, 부채 및 세금은 결과에 중대한 영향을 줄 수 있습니다. 회계사, 등록 세무사, 부동산 소유권 이전 전문가(컨베이언서), 변호사 또는 재무 자문가 등 적절한 자격을 갖춘 호주 전문가에게 중요 수치와 결정을 확인하세요. 본 내용은 법적으로 배제할 수 없는 권리나 구제 수단을 배제하지 않습니다.",
    updated: "모델 범위 및 고지 최종 검토일: 2026년 7월 24일.",
  },
} as const satisfies SiteMessages;
