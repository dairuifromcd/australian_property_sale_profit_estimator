export const enAU = {
  common: {
    siteName: "Property Sale Profit",
    homeAria: "Property Sale Profit home",
    scopeAria: "Estimate scope notice",
    scopeTitle: "Indicative estimate",
    scopeDescription:
      "Uses only the amounts you enter. Tax and unentered settlement adjustments are excluded.",
    readImportantInformation: "Read important information",
    legalNavigationAria: "Privacy and legal information",
    privacy: "Privacy",
    importantInformation: "Important information",
    disclaimer: "Disclaimer",
    languageNavigationAria: "Choose language",
    languageChangeWarning:
      "Changing language will clear the figures currently entered. Continue?",
    languages: {
      enAU: "English",
      zhHans: "简体中文",
      ko: "한국어",
    },
  },
  metadata: {
    home: {
      title:
        "Property Sale Profit | Australian Property Sale Profit Estimator",
      description:
        "Estimate Australian property selling costs, transaction profit or loss, optional holding-period result, simplified settlement cash and target sale prices.",
      openGraphTitle:
        "Estimate your property sale result and cash position.",
      openGraphDescription:
        "Estimate selling costs, transaction result, optional holding cash flows and simplified cash after a loan payout privately in your browser.",
    },
    privacy: {
      title: "Privacy | Property Sale Profit",
      description:
        "How Property Sale Profit handles calculator inputs and technical data.",
    },
    disclaimer: {
      title: "Important Information | Property Sale Profit",
      description:
        "Important limitations of the Property Sale Profit calculator.",
    },
  },
  home: {
    eyebrow: "Australian property sale calculator",
    title: "Estimate your property sale result and cash position.",
    intro:
      "Start with four numbers for a transaction estimate. Optionally add buying costs, holding cash flows and a loan payout without mixing those different results together.",
    privacyBenefitsAria: "Privacy benefits",
    privateByDesign: "Private by design",
    noSignUp: "No sign-up",
    calculationsStay: "Calculations stay on this device",
    explanationLabel: "What this helps answer",
    explanationTitle:
      "A clearer view than sale price minus purchase price.",
    explanationCards: [
      {
        title: "Amount after selling costs",
        body:
          "Sale price less commission, selling costs and preparation costs. This is before any loan payout.",
      },
      {
        title: "Transaction profit or loss",
        body:
          "Amount after selling costs less purchase price, buying costs, renovations and improvements—before holding cash flows, loan payout and tax.",
      },
      {
        title: "Break-even and target sale price",
        body:
          "See the sale price needed to cover the transaction costs you enter or reach a target transaction profit. Holding cash flows, loan payout and tax do not change these planning prices.",
      },
      {
        title: "Optional overall and cash results",
        body:
          "Keep holding-period income and costs separate from a simplified estimate of cash after a loan payout.",
      },
    ],
    footerPrivacyBody:
      "Your figures are calculated in this browser and are not sent to or saved by this application. Cloudflare may process ordinary request metadata needed to deliver and protect the site.",
    limitationsTitle: "Important limitations",
    limitationsBody:
      "Optional overall and settlement cash results use only the amounts entered. This tool does not calculate capital gains tax, income tax, depreciation, time-adjusted returns or after-tax profit.",
    independence:
      "Independent calculator · Not affiliated with or endorsed by the ATO or another government agency",
  },
  form: {
    quickEstimateStep: "01 · Quick estimate",
    title: "Start with four numbers",
    reset: "Reset",
    required: "Required",
    salePrice: "Expected sale price",
    salePriceHelpBefore: "Need a reference? Check",
    salePriceHelpOr: "or",
    purchasePrice: "Original purchase price",
    commissionRate: "Agent commission",
    commissionHelp:
      "Use the GST-inclusive rate from your agent quote. Enter 0 only if no commission applies.",
    otherSellingCosts: "Other selling costs",
    otherSellingCostsHelp:
      "Advertising, conveyancing, legal and other selling costs. Enter 0 if none apply.",
    transactionDetailsTitle: "Add transaction details",
    transactionDetailsSummary: "Buying, preparation and improvement costs",
    addDetails: "Add details",
    hideDetails: "Hide details",
    salePreparationCosts: "Sale preparation costs",
    salePreparationHelp:
      "Styling, cleaning, repairs and other preparation costs entered for this sale.",
    purchaseCosts: "Buying costs (excluding purchase price)",
    purchaseCostsHelp:
      "Stamp duty, conveyancing and other purchase costs you want included.",
    renovations: "Renovations and improvements",
    renovationsHelp:
      "The renovation and improvement spending you want included in this transaction estimate.",
    holdingDetailsTitle: "Add holding and loan details",
    holdingDetailsSummary:
      "Optional overall result and settlement cash estimates",
    holdingDetailsIntro:
      "These figures do not change transaction profit, break-even price or the sale price needed for a target transaction profit.",
    holdingCosts: "Total holding costs paid",
    holdingCostsHelp:
      "Interest (not loan principal), rates, insurance, body corporate, management, maintenance and other holding costs you want included.",
    rentalIncome: "Total rental income received",
    rentalIncomeHelp:
      "Gross rent received over the same period as the holding costs. Enter 0 if there was none.",
    loanPayout: "Estimated loan payout at settlement",
    loanPayoutHelp:
      "Use a lender payout estimate if available. It can differ from the current loan balance and is used only for the simplified cash estimate.",
  },
  results: {
    expandedEstimate: "Expanded estimate",
    quickEstimate: "Quick estimate",
    onDevice: "On-device",
    incompleteTitle: "Complete the four quick inputs",
    incompleteBody:
      "Enter 0 if commission or other selling costs do not apply.",
    invalidTitle: "Check the highlighted fields",
    invalidBody: "Fix the entered values before using this estimate.",
    print: "Print or save as PDF",
    resultNote:
      "Indicative estimates only—not accounting profit or a tax calculation. Settlement cash excludes unentered adjustments. Confirm important figures with qualified professionals before making a decision.",
    showCalculation: "Show calculation",
    profitStatus: "PROFIT",
    lossStatus: "LOSS",
    estimateStatus: "ESTIMATE",
    shortfallStatus: "SHORTFALL",
    transactionProfitTitle: "Whole-property transaction profit",
    transactionLossTitle: "Whole-property transaction loss",
    transactionIntro:
      "Before holding costs, rental income, loan payout and tax. Additional results appear separately when you enter them.",
    expectedSalePrice: "Expected sale price",
    agentCommission: "Agent commission",
    otherSellingCosts: "Other selling costs",
    salePreparationCosts: "Sale preparation costs",
    amountAfterSellingCosts: "Amount remaining after selling costs",
    purchasePrice: "Purchase price",
    buyingCosts: "Buying costs",
    renovations: "Renovations and improvements",
    transactionProfit: "Transaction profit",
    transactionLoss: "Transaction loss",
    transactionCalculation:
      "Expected sale price minus commission, selling and preparation costs, purchase price, buying costs and improvements.",
    displayedAmountsNote:
      "Displayed amounts are rounded to cents; the estimate uses the entered values before display rounding.",
    holdingPeriodCashFlows: "Holding-period cash flows",
    overallResultTitle: "Overall pre-tax property result",
    rentalIncome: "Rental income",
    holdingCosts: "Holding costs",
    overallResult: "Overall pre-tax result",
    overallResultNote:
      "Before tax. Loan principal repayments are excluded because the purchase price is already counted in transaction profit.",
    transactionPrecisionNote:
      "The estimate uses the transaction result before display rounding.",
    settlementCashLabel: "Simplified settlement cash",
    settlementCashTitle: "Estimated cash after loan payout",
    settlementShortfallTitle:
      "Estimated cash shortfall after loan payout",
    estimatedLoanPayout: "Estimated loan payout",
    estimatedCash: "Estimated cash",
    estimatedCashShortfall: "Estimated cash shortfall",
    settlementNote:
      "Before tax and unentered settlement adjustments. Confirm the actual payout with your lender and settlement professional.",
    settlementPrecisionNote:
      "Displayed amounts are rounded to cents; the estimate uses values before display rounding.",
    breakEvenLabel:
      "Break-even sale price for entered transaction costs",
    breakEvenExplanation:
      "Fixed transaction costs divided by one minus the commission rate. Rounded up to the next dollar.",
    roundedUp: "rounded up",
    targetTitle: "Sale price for a target profit",
    targetIntro:
      "Set a whole-property transaction profit before holding cash flows, loan payout and tax. Commission is recalculated at the required sale price, which is rounded up to the next dollar.",
    targetProfit: "Target transaction profit",
    targetProfitHelp:
      "Enter 0 to reproduce the entered-cost break-even price.",
    targetResultLabel: "Sale price needed for this target",
    targetMatches: "Matches your expected sale price.",
    targetAbove:
      "{difference} above your expected sale price of {salePrice}.",
    targetBelow:
      "{difference} below your expected sale price of {salePrice}.",
    targetCalculation:
      "Entered fixed transaction costs plus target profit, divided by one minus the commission rate. Rounded up to the next dollar.",
    sensitivityTitle: "Sale price sensitivity",
    sensitivityIntro:
      "Illustrative scenarios 5% below and above your entered sale price—not a price prediction. Commission is recalculated; other entered costs stay fixed.",
    scenario: "Scenario",
    salePrice: "Sale price",
    result: "Result",
    current: "Current",
    profit: "Profit",
    loss: "Loss",
    sensitivityCalculation:
      "Each row recalculates commission from its scenario sale price, then subtracts the same fixed transaction costs.",
    commissionFormulaLabel: "commission",
    fixedCostsFormulaLabel: "fixed costs",
    sensitivityPrecisionNote:
      "Displayed amounts are rounded to cents; each scenario uses values before display rounding.",
  },
  validation: {
    amountGreaterThanZero: "Enter an amount greater than zero.",
    amountZeroOrMore: "Enter an amount of zero or more.",
    amountMaxTrillion:
      "Enter an amount no greater than $1 trillion.",
    commissionRange:
      "Enter a commission rate from 0% to 99.9%.",
    completeValidEstimate:
      "Complete a valid transaction estimate first.",
    targetZeroOrMore: "Enter a target profit of zero or more.",
    targetMaxTrillion:
      "Enter a target profit no greater than $1 trillion.",
  },
  privacy: {
    eyebrow: "Privacy notice",
    title: "How your data is handled",
    intro:
      "The calculator is designed to work without an account or a database. The financial figures you enter remain in your browser.",
    entriesTitle: "Calculator entries",
    entriesBody:
      "Sale prices, purchase prices, commission rates and cost assumptions are calculated on your device. The current application code does not transmit or store those entries on a server. Reloading the page resets them. Printing or saving a PDF is an action performed by your browser and device.",
    technicalTitle: "Technical request data",
    technicalBody:
      "Cloudflare hosts, secures and delivers this site. Like other web infrastructure providers, it may process technical request data such as an IP address, browser information, requested URL, request time and security signals. Calculator entries are not placed in the URL.",
    cloudflareBefore: "See the",
    cloudflareLink: "Cloudflare Privacy Policy",
    accountsTitle: "Accounts, analytics and cookies",
    accountsBody:
      "This release has no user accounts, feedback form, advertising analytics or application cookies. These practices may change in a later release; this notice will be updated before such features are introduced.",
    externalTitle: "External websites",
    externalBody:
      "Links to realestate.com.au, Domain, GitHub and other third-party websites are governed by those websites' own privacy practices. Calculator entries are not attached to those links.",
    questionsTitle: "Questions",
    questionsBefore: "Contact the project through its",
    issueTracker: "public issue tracker",
    questionsAfter:
      "Do not include personal, property or financial information in a public issue.",
    updated: "Last updated 24 July 2026.",
  },
  disclaimer: {
    eyebrow: "Important information",
    title: "Use this estimate as a starting point only",
    intro:
      "Property Sale Profit is a free, general information tool. It is not a substitute for advice that considers your circumstances.",
    adviceTitle: "Not professional advice",
    adviceBody:
      "The calculator does not provide tax, financial, legal, property valuation, conveyancing, credit, accounting or settlement advice. It does not predict a sale price, calculate a tax liability or determine the exact amount you will receive at settlement. Do not rely on an estimate alone to sell, buy, borrow or invest.",
    limitationsTitle: "Material limitations",
    limitations: [
      "Results depend entirely on the figures and assumptions entered.",
      "The amount remaining after selling costs is before any mortgage payout. The optional settlement cash estimate subtracts only the loan payout entered and excludes tax, settlement adjustments and unentered amounts.",
      "Transaction profit excludes holding-period income, holding costs and financing. The optional overall pre-tax result adds only the rental income entered and subtracts only the holding costs entered. It is not an annualised or time-adjusted return.",
      "Loan principal repayments are not treated as holding costs because the purchase price is already included in transaction profit. The calculator does not determine accounting or tax treatment for interest, rent or other entries.",
      "The break-even sale price covers only the transaction costs entered. It excludes holding cash flows, loan payout, tax and costs not supplied by the user.",
      "Sale-price sensitivity rows mechanically apply 5% below and above the expected sale price entered. They are scenarios, not forecasts, valuations or predictions of a future sale price.",
      "The calculator does not calculate capital gains tax, income tax, taxable capital gain, accounting profit or after-tax profit.",
      "Renovation, improvement and other cost entries are user-selected transaction assumptions. The calculator does not decide their accounting or tax treatment.",
    ],
    affiliationTitle: "No government affiliation",
    affiliationBody:
      "This is an independent project. It is not affiliated with, approved, certified or endorsed by the ATO, ASIC, the Tax Practitioners Board or another Australian government agency.",
    checkTitle: "Check before acting",
    checkBody:
      "Property circumstances, transaction costs, debt and tax can change the outcome materially. Confirm important figures and decisions with appropriately qualified Australian professionals such as an accountant, registered tax agent, conveyancer, solicitor or financial adviser. Nothing here excludes rights or remedies that cannot lawfully be excluded.",
    updated: "Model scope and notice last reviewed 24 July 2026.",
  },
} as const;
