import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateAgentCommission,
  calculateEstimate,
  calculateRequiredSalePrice,
  type CalculatorInput,
} from "../app/calculator.ts";
import {
  formatAmountInput,
  normaliseAmountInputDraft,
  numberFromInput,
  numberFromInputForValidation,
  numberFromMoneyInputForValidation,
} from "../app/input-format.ts";
import { aud, calculationAud, exactAud, exactIsInteger, exactTone } from "../app/calculator-ui/format.ts";

function input(
  overrides: Partial<CalculatorInput> = {},
): CalculatorInput {
  return {
    salePrice: 1_000_000,
    purchasePrice: 600_000,
    commissionRate: 2,
    otherSellingCosts: 10_000,
    salePreparationCosts: 0,
    purchaseCosts: 0,
    renovationsAndImprovements: 0,
    estimatedLoanPayout: 0,
    totalHoldingCosts: 0,
    totalRentalIncome: 0,
    ...overrides,
  };
}

test("calculates standalone commission from two inputs without adding GST", () => {
  for (const [salePrice, commissionRate, expected, display] of [
    [1_000_000, 2.2, 22_000, "$22,000.00"],
    [750_000, 2, 15_000, "$15,000.00"],
    [1_000_000, 0, 0, "$0.00"],
    [1_000_000, -0, 0, "$0.00"],
    [1_000_000_000_000, 99.9, 999_000_000_000, "$999,000,000,000.00"],
  ] as const) {
    const result = calculateAgentCommission({ salePrice, commissionRate });
    assert.deepEqual(result.validationErrors, []);
    assert.ok(Math.abs(result.commission! - expected) <= Math.max(1e-10, expected * 1e-15));
    assert.equal(calculationAud.format(result.commission!), display);
    assert.equal(Object.is(result.commission, -0), false);
    assert.equal(result.commission, calculateEstimate(input({ salePrice, commissionRate })).agentCommission);
  }
});

test("keeps standalone commission precision and rounds only its AUD display", () => {
  const precise = calculateAgentCommission({ salePrice: 1_000_001.49, commissionRate: 2.37 });
  assert.ok(Math.abs(precise.commission! - 23_700.035313) < 0.0000001);
  assert.equal(calculationAud.format(precise.commission!), "$23,700.04");
  const halfCent = calculateAgentCommission({ salePrice: 1, commissionRate: 0.5 });
  assert.equal(halfCent.commission, 0.005);
  assert.equal(calculationAud.format(halfCent.commission!), "$0.01");
  assert.ok(Math.abs(calculateAgentCommission({ salePrice: 0.01, commissionRate: 0.0000001 }).commission! - 0.00000000001) < 1e-24);
});

test("decimal commission keeps literal half-cent values before display rounding", () => {
  for (const [salePrice, commissionRate, exact, display] of [
    [1.15, 10, 0.115, "$0.12"],
    [11, 1.5, 0.165, "$0.17"],
  ] as const) {
    const standalone = calculateAgentCommission({ salePrice, commissionRate });
    assert.equal(standalone.commission, exact);
    assert.equal(calculationAud.format(standalone.commission!), display);
    assert.equal(calculateEstimate(input({ salePrice, commissionRate })).agentCommission, exact);
  }
  const result = calculateEstimate(input({ salePrice: 1.15, purchasePrice: 1, commissionRate: 10, otherSellingCosts: 0 }));
  assert.equal(result.transactionProfit, 0.035);
  assert.equal(calculationAud.format(result.transactionProfit), "$0.04");
});

test("decimal cancellation preserves exact zero across profit holding cash and current sensitivity", () => {
  const scenario = input({ salePrice: 1_000_000.07, purchasePrice: 990_000.06, commissionRate: 0, otherSellingCosts: 10_000.01, estimatedLoanPayout: 990_000.06, totalRentalIncome: 123.45, totalHoldingCosts: 123.45 });
  const result = calculateEstimate(scenario);
  for (const value of [result.transactionProfit, result.overallPreTaxPropertyResult, result.estimatedCashAfterLoanPayout, result.salePriceSensitivity[1].transactionProfit]) {
    assert.equal(value, 0);
    assert.equal(Object.is(value, -0), false);
    assert.equal(calculationAud.format(value), "$0.00");
  }
  assert.equal(calculateRequiredSalePrice(scenario, 0).differenceFromExpectedSalePrice, 0.93);
  assert.equal(calculateEstimate({ ...scenario, otherSellingCosts: 10_000.02 }).transactionProfit, -0.01);
  assert.equal(calculateEstimate({ ...scenario, estimatedLoanPayout: 990_000.07 }).estimatedCashAfterLoanPayout, -0.01);
});

test("exact zero metadata is canonical for deduction rows signs and matching target prices", () => {
  // UI deduction rows and the target-match branch compare with the literal "0";
  // numeric equality alone would accept "", "0.00" or "-0.00" incorrectly.
  const scenario = input({ salePrice: 1_000_000.07, purchasePrice: 990_000.06, commissionRate: -0, otherSellingCosts: 10_000.01, estimatedLoanPayout: 990_000.06, totalRentalIncome: 123.45, totalHoldingCosts: 123.45 });
  const result = calculateEstimate(scenario);
  for (const value of [result.exact.agentCommission, result.exact.transactionProfit, result.exact.overallPreTaxPropertyResult, result.exact.estimatedCashAfterLoanPayout, result.salePriceSensitivity[1].exact.transactionProfit, ...result.salePriceSensitivity.map(row => row.exact.agentCommission)]) {
    assert.equal(value, "0");
    assert.equal(exactTone(value), "gain");
    assert.equal(exactAud(value), "$0");
    assert.equal(exactAud(value, 2), "$0.00");
  }
  assert.equal(calculateAgentCommission(scenario).exactCommission, "0");

  const matching = input({ salePrice: 100, purchasePrice: 100, commissionRate: 0, otherSellingCosts: 0 });
  assert.equal(calculateEstimate(matching).exact.totalSellingCosts, "0");
  assert.equal(calculateRequiredSalePrice(matching, 0).exactDifferenceFromExpectedSalePrice, "0");
  const allProceedsSpent = input({ salePrice: 100.01, commissionRate: 0, otherSellingCosts: 100.01 });
  assert.equal(calculateEstimate(allProceedsSpent).exact.amountAfterSellingCosts, "0");
});

test("AUD summary formatting retains the currency sign and whole-dollar rounding", () => {
  for (const [amount, expected] of [
    [0, "$0"],
    [1234.49, "$1,234"],
    [1234.5, "$1,235"],
    [-1234.5, "-$1,235"],
  ] as const) {
    assert.equal(aud.format(amount), expected);
  }
});

test("decimal intermediates preserve genuine sub-cent losses without rounding the fee first", () => {
  const result = calculateEstimate(input({ salePrice: 1.15, purchasePrice: 1.04, commissionRate: 10, otherSellingCosts: 0, estimatedLoanPayout: 1.04, totalHoldingCosts: 0.01, totalRentalIncome: 0.02 }));
  assert.equal(result.agentCommission, 0.115);
  assert.equal(result.transactionProfit, -0.005);
  assert.equal(result.estimatedCashAfterLoanPayout, -0.005);
  assert.equal(result.overallPreTaxPropertyResult, 0.005);
  assert.equal(calculationAud.format(result.transactionProfit), "-$0.01");
});

test("decimal sensitivity and maximum-price proceeds retain exact intermediate precision", () => {
  const maximum = calculateEstimate(input({ salePrice: 1_000_000_000_000, purchasePrice: 1, commissionRate: 99.9, otherSellingCosts: 0 }));
  assert.equal(maximum.amountAfterSellingCosts, 1_000_000_000);
  assert.equal(maximum.transactionProfit, 999_999_999);
  const small = calculateEstimate(input({ salePrice: 0.03, purchasePrice: 0.01, commissionRate: 2.2, otherSellingCosts: 0.01, salePreparationCosts: 0.01, purchaseCosts: 0.01, renovationsAndImprovements: 0.01 }));
  assert.deepEqual(small.salePriceSensitivity.map(row => [row.salePrice, row.agentCommission, row.transactionProfit]), [
    [0.0285, 0.000627, -0.022127],
    [0.03, 0.00066, -0.02066],
    [0.0315, 0.000693, -0.019193],
  ]);
});

test("exact AUD formatting rounds decimal ties and their neighbours without a Number conversion", () => {
  for (const [value, cents, whole] of [
    ["0", "$0.00", "$0"],
    ["0.004999999999999999", "$0.00", "$0"],
    ["0.005", "$0.01", "$0"],
    ["0.005000000000000001", "$0.01", "$0"],
    ["-0.005", "-$0.01", "-$0"],
    ["-0.004999999999999999", "-$0.00", "-$0"],
    ["0.5", "$0.50", "$1"],
    ["-0.5", "-$0.50", "-$1"],
    ["1234", "$1,234.00", "$1,234"],
    ["1000.999", "$1,001.00", "$1,001"],
  ]) {
    assert.equal(exactAud(value, 2), cents);
    assert.equal(exactAud(value), whole);
    assert.equal(exactTone(value), value.startsWith("-") ? "loss" : "gain");
  }
  assert.equal(exactIsInteger("123"), true);
  assert.equal(exactIsInteger("-123.0000"), true);
  assert.equal(exactIsInteger("0.0001"), false);
});

test("exact result displays preserve half-cent profit and genuine underflow loss signs", () => {
  const positive = calculateEstimate(input({ salePrice: 1.15, purchasePrice: 1.03, commissionRate: 10, otherSellingCosts: 0 }));
  assert.equal(positive.exact.transactionProfit, "0.0050");
  assert.equal(exactAud(positive.exact.transactionProfit, 2), "$0.01");
  const negative = calculateEstimate(input({ salePrice: 1.15, purchasePrice: 1.04, commissionRate: 10, otherSellingCosts: 0 }));
  assert.equal(negative.exact.transactionProfit, "-0.0050");
  assert.equal(exactAud(negative.exact.transactionProfit, 2), "-$0.01");
  assert.equal(exactTone(negative.exact.transactionProfit), "loss");

  const underflow = calculateEstimate(input({ salePrice: 1, purchasePrice: 1, commissionRate: 5e-324, otherSellingCosts: 0, estimatedLoanPayout: 1 }));
  const exactLoss = `-0.${"0".repeat(325)}5`;
  assert.equal(underflow.exact.transactionProfit, exactLoss);
  assert.equal(underflow.exact.estimatedCashAfterLoanPayout, exactLoss);
  assert.equal(exactTone(underflow.exact.transactionProfit), "loss");
  assert.equal(exactTone(underflow.exact.estimatedCashAfterLoanPayout), "loss");
  assert.equal(exactAud(underflow.exact.transactionProfit, 2), "-$0.00");
});

test("exact display keeps high-value half-cent boundaries and target differences beyond Number precision", () => {
  const result = calculateEstimate(input({ salePrice: 509_787_197_923.29, purchasePrice: 344_346_527_243.03, commissionRate: 90.6571, otherSellingCosts: 873_196_952_743.45, salePreparationCosts: 263_872_644_165.53, purchaseCosts: 212_052_843_067.8, renovationsAndImprovements: 738_404_131_261.63, estimatedLoanPayout: 171_345_414_128.16, totalHoldingCosts: 832_099_994_644.52, totalRentalIncome: 878_354_679_560.29 }));
  assert.equal(result.exact.transactionProfit, "-2384244190366.66493859");
  assert.equal(exactAud(result.exact.transactionProfit, 2), "-$2,384,244,190,366.66");
  assert.equal(exactAud(result.exact.estimatedCashAfterLoanPayout, 2), "-$1,260,786,102,922.36");
  const maximum = input({ salePrice: 0.01, purchasePrice: 1e12, commissionRate: 99.9, otherSellingCosts: 1e12, salePreparationCosts: 1e12, purchaseCosts: 1e12, renovationsAndImprovements: 1e12 });
  const target = calculateRequiredSalePrice(maximum, 1e12);
  assert.equal(target.requiredSalePrice, 6_000_000_000_000_000);
  assert.equal(target.exactDifferenceFromExpectedSalePrice, "5999999999999999.99");
  assert.equal(exactIsInteger(target.exactDifferenceFromExpectedSalePrice!), false);
  assert.equal(exactAud(target.exactDifferenceFromExpectedSalePrice!, 2), "$5,999,999,999,999,999.99");
});

test("exact internal arithmetic preserves sanitized invalid exponent-form fallbacks", () => {
  const result = calculateEstimate(input({ salePrice: 1e21 }));
  assert.equal(result.hasTransactionErrors, true);
  assert.equal(result.agentCommission, 20_000_000_000_000_000_000);
  assert.equal(result.exact.agentCommission, "20000000000000000000");
  assert.equal(result.breakEvenSalePrice, 0);
  assert.deepEqual(result.salePriceSensitivity, []);
});

test("rejects invalid standalone prices and rates instead of returning a zero result", () => {
  for (const salePrice of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 1_000_000_000_001]) {
    assert.deepEqual(calculateAgentCommission({ salePrice, commissionRate: 2.2 }), {
      commission: null,
      exactCommission: null,
      validationErrors: [{ field: "salePrice", code: salePrice > 1e12 && Number.isFinite(salePrice) ? "amountMaxTrillion" : "amountGreaterThanZero" }],
    });
  }
  for (const commissionRate of [-1, 99.91, 100, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    assert.deepEqual(calculateAgentCommission({ salePrice: 1_000_000, commissionRate }), {
      commission: null,
      exactCommission: null,
      validationErrors: [{ field: "commissionRate", code: "commissionRange" }],
    });
  }
  assert.deepEqual(calculateAgentCommission({ salePrice: Number.NaN, commissionRate: Number.NaN }), {
    commission: null,
      exactCommission: null,
    validationErrors: [{ field: "salePrice", code: "amountGreaterThanZero" }, { field: "commissionRate", code: "commissionRange" }],
  });
});

test("preserves main-calculator numeric fallbacks while invalid standalone commission stays unavailable", () => {
  // The main model historically returns finite sanitised intermediate numbers
  // alongside validation errors. They are never a valid displayed estimate.
  for (const [commissionRate, expectedCommission] of [
    [-1, 0],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [100, 1_000_000],
  ]) {
    const estimate = calculateEstimate(input({ commissionRate }));
    assert.equal(estimate.agentCommission, expectedCommission);
    assert.equal(Number.isFinite(estimate.agentCommission), true);
    assert.equal(estimate.hasTransactionErrors, true);
    assert.equal(estimate.hasCalculationErrors, true);
    assert.equal(estimate.breakEvenSalePrice, 0);
    assert.deepEqual(estimate.salePriceSensitivity, []);
    assert.deepEqual(calculateAgentCommission({ salePrice: 1_000_000, commissionRate }), {
      commission: null,
      exactCommission: null,
      validationErrors: [{ field: "commissionRate", code: "commissionRange" }],
    });
  }
});

test("formats monetary input with grouping separators", () => {
  assert.equal(formatAmountInput("650000"), "650,000");
  assert.equal(formatAmountInput("$ 1,250,000.50"), "1,250,000.50");
  assert.equal(formatAmountInput("-12000"), "-12,000");
  assert.equal(formatAmountInput("   -12000"), "-12,000");
  assert.equal(numberFromInput("1,250,000.50"), 1_250_000.5);
});

test("preserves a stable monetary draft while the user is editing", () => {
  assert.equal(normaliseAmountInputDraft("1,000"), "1000");
  assert.equal(normaliseAmountInputDraft(",000"), "000");
  assert.equal(normaliseAmountInputDraft("2,000"), "2000");
  assert.equal(
    normaliseAmountInputDraft("$ 1,250,000.50"),
    "1250000.50",
  );
  assert.equal(normaliseAmountInputDraft("000"), "000");
  assert.equal(normaliseAmountInputDraft(".5"), ".5");
  assert.equal(normaliseAmountInputDraft("-1.2"), "-1.2");
  assert.equal(normaliseAmountInputDraft("   -12"), "-12");
  assert.equal(normaliseAmountInputDraft("12..345"), "12.34");
  assert.equal(normaliseAmountInputDraft("abc"), "");
  assert.equal(normaliseAmountInputDraft("-"), "-");
});

test("normalises partial and malformed monetary text safely", () => {
  assert.equal(formatAmountInput(""), "");
  assert.equal(formatAmountInput("-"), "-");
  assert.equal(formatAmountInput(".5"), "0.5");
  assert.equal(formatAmountInput("-0.5"), "-0.5");
  assert.equal(formatAmountInput("12..34"), "12.34");
  assert.equal(formatAmountInput("000"), "0");
  assert.equal(formatAmountInput("abc"), "");
  assert.equal(numberFromInput(""), 0);
  assert.equal(numberFromInput("-"), 0);
});

test("keeps unfinished monetary drafts invalid through formatting and model validation", () => {
  for (const draft of ["-", ".", "-."]) {
    assert.equal(formatAmountInput(draft), draft);
    const parsed = numberFromInputForValidation(formatAmountInput(draft));
    assert.ok(Number.isNaN(parsed));
    assert.equal(calculateEstimate(input({ otherSellingCosts: parsed })).hasTransactionErrors, true);
    assert.equal(calculateEstimate(input({ estimatedLoanPayout: parsed })).hasSupplementaryErrors, true);
    assert.equal(calculateRequiredSalePrice(input(), parsed).requiredSalePrice, null);
  }
  assert.equal(numberFromInputForValidation(""), 0);
  assert.equal(numberFromInputForValidation("0"), 0);
  assert.equal(numberFromInputForValidation("0."), 0);
  assert.equal(numberFromInputForValidation("1,250,000.50"), 1_250_000.5);
  assert.equal(numberFromInputForValidation("-0.5"), -0.5);
  assert.equal(formatAmountInput("12."), "12.");
  assert.equal(formatAmountInput("-.5"), "-0.5");
});

test("preserves exponent money drafts for correction and rejects them without changing percentage parsing", () => {
  for (const draft of ["1e6", "1E6", "1e+6", "1e-6", "1.e6", ".5E-3", "1e", "1e+", "1e-", "0e0", "-1.25e3", "$ 1,234.56e2"]) {
    assert.equal(normaliseAmountInputDraft(draft), draft);
    assert.equal(formatAmountInput(draft), draft);
    const amount = numberFromMoneyInputForValidation(draft);
    assert.ok(Number.isNaN(amount), draft);
    assert.equal(calculateEstimate(input({ salePrice: amount })).hasTransactionErrors, true);
    assert.equal(calculateEstimate(input({ otherSellingCosts: amount })).hasTransactionErrors, true);
    assert.equal(calculateEstimate(input({ estimatedLoanPayout: amount })).hasSupplementaryErrors, true);
    assert.equal(calculateRequiredSalePrice(input(), amount).requiredSalePrice, null);
    assert.equal(calculateAgentCommission({ salePrice: amount, commissionRate: 2 }).commission, null);
  }
  for (const [draft, expected] of [["", 0], ["0", 0], ["1,234.56", 1234.56], ["-0.5", -0.5]] as const) {
    assert.equal(numberFromMoneyInputForValidation(draft), expected);
  }
  for (const draft of ["-", ".", "-."]) {
    assert.ok(Number.isNaN(numberFromMoneyInputForValidation(draft)));
  }
  for (const draft of ["$ 1,234.56", "AUD 1,234.56"]) {
    assert.equal(normaliseAmountInputDraft(draft), "1234.56");
    assert.equal(formatAmountInput(draft), "1,234.56");
    assert.equal(numberFromMoneyInputForValidation(normaliseAmountInputDraft(draft)), 1234.56);
  }
  for (const rate of ["1e-7", "5e-324"]) {
    assert.equal(numberFromInputForValidation(rate), Number(rate));
    assert.deepEqual(calculateAgentCommission({ salePrice: 1, commissionRate: numberFromInputForValidation(rate) }).validationErrors, []);
  }
});

test("calculates the four-input transaction estimate", () => {
  const result = calculateEstimate(input());

  assert.equal(result.hasCoreInputs, true);
  assert.equal(result.hasAdjustedInputs, false);
  assert.equal(result.agentCommission, 20_000);
  assert.equal(result.totalSellingCosts, 30_000);
  assert.equal(result.fixedTransactionCosts, 610_000);
  assert.equal(result.amountAfterSellingCosts, 970_000);
  assert.equal(result.transactionProfit, 370_000);
  assert.equal(result.overallPreTaxPropertyResult, 370_000);
  assert.equal(result.estimatedCashAfterLoanPayout, 970_000);
  assert.equal(Math.round(result.breakEvenSalePrice), 622_449);
  assert.deepEqual(result.validationErrors, []);
  assert.equal(result.hasTransactionErrors, false);
  assert.equal(result.hasSupplementaryErrors, false);
  assert.equal(result.hasCalculationErrors, false);
});

test("calculates sale-price sensitivity with scenario commission", () => {
  const result = calculateEstimate(input());

  assert.deepEqual(result.salePriceSensitivity, [
    {
      changePercent: -5,
      salePrice: 950_000,
      agentCommission: 19_000,
      transactionProfit: 321_000,
      exact: { salePrice: "950000.00", agentCommission: "19000.0000", transactionProfit: "321000.0000" },
    },
    {
      changePercent: 0,
      salePrice: 1_000_000,
      agentCommission: 20_000,
      transactionProfit: 370_000,
      exact: { salePrice: "1000000.00", agentCommission: "20000.0000", transactionProfit: "370000.00" },
    },
    {
      changePercent: 5,
      salePrice: 1_050_000,
      agentCommission: 21_000,
      transactionProfit: 419_000,
      exact: { salePrice: "1050000.00", agentCommission: "21000.0000", transactionProfit: "419000.0000" },
    },
  ]);
});

test("applies every fixed optional transaction cost to sensitivity scenarios", () => {
  const baseline = calculateEstimate(input());

  for (const field of [
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
  ] as const) {
    const result = calculateEstimate(input({ [field]: 1_000 }));

    assert.equal(
      result.fixedTransactionCosts,
      baseline.fixedTransactionCosts + 1_000,
    );
    for (const changePercent of [-5, 5] as const) {
      const baselineScenario = baseline.salePriceSensitivity.find(
        (scenario) => scenario.changePercent === changePercent,
      );
      const scenario = result.salePriceSensitivity.find(
        (candidate) => candidate.changePercent === changePercent,
      );

      assert.equal(
        scenario?.transactionProfit,
        (baselineScenario?.transactionProfit ?? 0) - 1_000,
      );
    }
  }
});

test("reproduces the guide's fictional transaction loss with positive cash", () => {
  const scenario = input({
    salePrice: 700_000,
    purchasePrice: 750_000,
    commissionRate: 2,
    otherSellingCosts: 6_000,
    estimatedLoanPayout: 400_000,
  });
  const result = calculateEstimate(scenario);
  assert.deepEqual(result.validationErrors, []);
  assert.equal(result.agentCommission, 14_000);
  assert.equal(result.totalSellingCosts, 20_000);
  assert.equal(result.amountAfterSellingCosts, 680_000);
  assert.equal(result.transactionProfit, -70_000);
  assert.equal(result.overallPreTaxPropertyResult, -70_000);
  assert.equal(result.estimatedCashAfterLoanPayout, 280_000);
  const differentPayout = calculateEstimate({ ...scenario, estimatedLoanPayout: 500_000 });
  assert.equal(differentPayout.transactionProfit, -70_000);
  assert.equal(differentPayout.estimatedCashAfterLoanPayout, 180_000);
});

test("reuses the exact transaction result in the unchanged sensitivity scenario", () => {
  const result = calculateEstimate(
    input({
      salePrice: 0.03,
      purchasePrice: 0.01,
      commissionRate: 2.2,
      otherSellingCosts: 0.01,
      salePreparationCosts: 0.01,
      purchaseCosts: 0.01,
      renovationsAndImprovements: 0.01,
    }),
  );
  const unchangedScenario = result.salePriceSensitivity.find(
    (scenario) => scenario.changePercent === 0,
  );

  assert.equal(
    unchangedScenario?.transactionProfit,
    result.transactionProfit,
  );
});

test("calculates the sale price required for a target transaction profit", () => {
  const result = calculateRequiredSalePrice(input(), 100_000);

  assert.equal(Math.round(result.requiredSalePrice ?? 0), 724_490);
  assert.equal(
    Math.round(result.differenceFromExpectedSalePrice ?? 0),
    -275_510,
  );
  assert.equal(result.validationError, null);
});

test("applies every entered cost and commission to the target sale price", () => {
  const result = calculateRequiredSalePrice(
    input({
      salePrice: 800_000,
      salePreparationCosts: 5_000,
      purchaseCosts: 30_000,
      renovationsAndImprovements: 50_000,
    }),
    100_000,
  );

  assert.equal(result.requiredSalePrice, 811_225);
  assert.equal(result.differenceFromExpectedSalePrice, 11_225);
});

test("treats a zero target profit as entered-cost break-even", () => {
  const estimate = calculateEstimate(input());
  const target = calculateRequiredSalePrice(input(), 0);

  assert.equal(target.requiredSalePrice, estimate.breakEvenSalePrice);
  assert.equal(
    target.differenceFromExpectedSalePrice,
    estimate.breakEvenSalePrice - input().salePrice,
  );
  assert.equal(target.validationError, null);
});

test("rounds required prices up so the displayed whole-dollar price meets the target", () => {
  const estimateInput = input({
    salePrice: 100,
    purchasePrice: 100,
    commissionRate: 3,
    otherSellingCosts: 0,
  });
  const estimate = calculateEstimate(estimateInput);
  const target = calculateRequiredSalePrice(estimateInput, 1);

  assert.equal(estimate.breakEvenSalePrice, 104);
  assert.equal(target.requiredSalePrice, 105);
  assert.ok(
    (target.requiredSalePrice ?? 0) * 0.97 - 100 >= 1,
  );
});

test("does not round an exact high-commission result up by an extra dollar", () => {
  const highCommissionInput = input({
    purchasePrice: 600_000,
    commissionRate: 99.9,
    otherSellingCosts: 0,
  });
  const estimate = calculateEstimate(highCommissionInput);
  const target = calculateRequiredSalePrice(highCommissionInput, 0);

  assert.equal(estimate.breakEvenSalePrice, 600_000_000);
  assert.equal(target.requiredSalePrice, 600_000_000);
});

test("preserves very small decimal commission rates", () => {
  const smallCommissionInput = input({
    salePrice: 100,
    purchasePrice: 100,
    commissionRate: 0.000_000_1,
    otherSellingCosts: 0,
  });

  assert.equal(
    calculateEstimate(smallCommissionInput).breakEvenSalePrice,
    101,
  );
  assert.equal(
    calculateRequiredSalePrice(smallCommissionInput, 1)
      .requiredSalePrice,
    102,
  );
});

test("keeps break-even and target prices exact at supported money limits", () => {
  const maximumInput = input({
    salePrice: 1_000_000_000_000,
    purchasePrice: 1_000_000_000_000,
    commissionRate: 99.9,
    otherSellingCosts: 1_000_000_000_000,
    salePreparationCosts: 1_000_000_000_000,
    purchaseCosts: 1_000_000_000_000,
    renovationsAndImprovements: 1_000_000_000_000,
  });
  const estimate = calculateEstimate(maximumInput);
  const target = calculateRequiredSalePrice(
    maximumInput,
    1_000_000_000_000,
  );

  assert.equal(estimate.breakEvenSalePrice, 5_000_000_000_000_000);
  assert.equal(target.requiredSalePrice, 6_000_000_000_000_000);
});

test("keeps target-profit validation separate from the main estimate", () => {
  for (const targetProfit of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    const result = calculateRequiredSalePrice(input(), targetProfit);

    assert.deepEqual(result, {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "targetZeroOrMore",
    });
  }

  assert.deepEqual(
    calculateRequiredSalePrice(input({ salePrice: 0 }), 100_000),
    {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "completeValidEstimate",
    },
  );

  assert.deepEqual(
    calculateRequiredSalePrice(input(), Number.MAX_VALUE),
    {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "targetMaxTrillion",
    },
  );
});

test("rejects target profit above the supported safe range", () => {
  assert.deepEqual(
    calculateRequiredSalePrice(input(), 1_000_000_000_001),
    {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "targetMaxTrillion",
    },
  );
});

test("applies every optional transaction cost to the correct result", () => {
  const result = calculateEstimate(
    input({
      salePreparationCosts: 5_000,
      purchaseCosts: 30_000,
      renovationsAndImprovements: 50_000,
    }),
  );

  assert.equal(result.hasAdjustedInputs, true);
  assert.equal(result.totalSellingCosts, 35_000);
  assert.equal(result.amountAfterSellingCosts, 965_000);
  assert.equal(result.transactionProfit, 285_000);
  assert.equal(Math.round(result.breakEvenSalePrice), 709_184);
});

test("treats explicit zero commission and selling costs as valid", () => {
  const result = calculateEstimate(
    input({
      purchasePrice: 1_000_000,
      commissionRate: 0,
      otherSellingCosts: 0,
    }),
  );

  assert.equal(result.agentCommission, 0);
  assert.equal(result.totalSellingCosts, 0);
  assert.equal(result.transactionProfit, 0);
  assert.equal(result.breakEvenSalePrice, 1_000_000);
  assert.equal(result.hasCalculationErrors, false);
});

test("preserves an entered-cost transaction loss", () => {
  const result = calculateEstimate(
    input({
      salePrice: 600_000,
      purchasePrice: 650_000,
      otherSellingCosts: 10_000,
    }),
  );

  assert.equal(result.amountAfterSellingCosts, 578_000);
  assert.equal(result.transactionProfit, -72_000);
});

test("keeps mortgage payout separate from every transaction-profit calculation", () => {
  const withoutLoan = calculateEstimate(input());
  const withLoan = calculateEstimate(input({ estimatedLoanPayout: 450_000 }));
  const targetWithoutLoan = calculateRequiredSalePrice(input(), 100_000);
  const targetWithLoan = calculateRequiredSalePrice(
    input({ estimatedLoanPayout: 450_000 }),
    100_000,
  );

  assert.equal(withLoan.estimatedCashAfterLoanPayout, 520_000);
  assert.equal(withLoan.transactionProfit, withoutLoan.transactionProfit);
  assert.equal(
    withLoan.overallPreTaxPropertyResult,
    withoutLoan.overallPreTaxPropertyResult,
  );
  assert.equal(withLoan.breakEvenSalePrice, withoutLoan.breakEvenSalePrice);
  assert.deepEqual(
    withLoan.salePriceSensitivity,
    withoutLoan.salePriceSensitivity,
  );
  assert.deepEqual(targetWithLoan, targetWithoutLoan);
});

test("reports a cash shortfall when the loan payout exceeds the amount after selling costs", () => {
  const result = calculateEstimate(
    input({ estimatedLoanPayout: 1_100_000 }),
  );

  assert.equal(result.amountAfterSellingCosts, 970_000);
  assert.equal(result.estimatedCashAfterLoanPayout, -130_000);
  assert.equal(result.transactionProfit, 370_000);
});

test("combines rental income and holding costs only in the overall pre-tax result", () => {
  const baseline = calculateEstimate(input());
  const result = calculateEstimate(
    input({
      totalRentalIncome: 90_000,
      totalHoldingCosts: 55_000,
    }),
  );

  assert.equal(result.overallPreTaxPropertyResult, 405_000);
  assert.equal(result.transactionProfit, baseline.transactionProfit);
  assert.equal(
    result.estimatedCashAfterLoanPayout,
    baseline.estimatedCashAfterLoanPayout,
  );
  assert.equal(result.breakEvenSalePrice, baseline.breakEvenSalePrice);
  assert.deepEqual(result.salePriceSensitivity, baseline.salePriceSensitivity);
});

test("preserves calculation invariants across supplementary input changes", () => {
  for (const delta of [1, 10_000, 987_654.32]) {
    const baseline = calculateEstimate(input());
    const withLoan = calculateEstimate(
      input({ estimatedLoanPayout: delta }),
    );
    const withHoldingCosts = calculateEstimate(
      input({ totalHoldingCosts: delta }),
    );
    const withRentalIncome = calculateEstimate(
      input({ totalRentalIncome: delta }),
    );

    assert.ok(
      Math.abs(
        baseline.estimatedCashAfterLoanPayout -
          withLoan.estimatedCashAfterLoanPayout -
          delta,
      ) < 0.000_001,
    );
    assert.ok(
      Math.abs(
        baseline.overallPreTaxPropertyResult -
          withHoldingCosts.overallPreTaxPropertyResult -
          delta,
      ) < 0.000_001,
    );
    assert.ok(
      Math.abs(
        withRentalIncome.overallPreTaxPropertyResult -
          baseline.overallPreTaxPropertyResult -
          delta,
      ) < 0.000_001,
    );
    assert.equal(withLoan.transactionProfit, baseline.transactionProfit);
    assert.equal(
      withHoldingCosts.transactionProfit,
      baseline.transactionProfit,
    );
    assert.equal(
      withRentalIncome.transactionProfit,
      baseline.transactionProfit,
    );
  }
});

test("requires positive sale and purchase prices", () => {
  for (const field of ["salePrice", "purchasePrice"] as const) {
    const result = calculateEstimate(input({ [field]: 0 }));

    assert.equal(result.hasCoreInputs, false);
    assert.equal(result.hasCalculationErrors, true);
    assert.deepEqual(result.validationErrors, [
      {
        field,
        code: "amountGreaterThanZero",
      },
    ]);
    assert.equal(result.breakEvenSalePrice, 0);
  }
});

test("rejects invalid commission rates", () => {
  for (const commissionRate of [-1, 99.91, 100, Number.NaN]) {
    const result = calculateEstimate(input({ commissionRate }));

    assert.equal(result.hasCalculationErrors, true);
    assert.deepEqual(result.validationErrors, [
      { field: "commissionRate", code: "commissionRange" },
    ]);
    assert.equal(result.breakEvenSalePrice, 0);
    assert.deepEqual(result.salePriceSensitivity, []);
  }
});

test("rejects negative optional amounts", () => {
  for (const field of [
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
    "estimatedLoanPayout",
    "totalHoldingCosts",
    "totalRentalIncome",
  ] as const) {
    const result = calculateEstimate(input({ [field]: -1 }));

    assert.equal(result.hasCalculationErrors, true);
    assert.deepEqual(result.validationErrors, [
      { field, code: "amountZeroOrMore" },
    ]);

    const isSupplementaryField =
      field === "estimatedLoanPayout" ||
      field === "totalHoldingCosts" ||
      field === "totalRentalIncome";

    assert.equal(
      result.breakEvenSalePrice,
      isSupplementaryField ? 622_449 : 0,
    );
    assert.equal(
      result.salePriceSensitivity.length,
      isSupplementaryField ? 3 : 0,
    );
  }
});

test("keeps transaction calculations available when supplementary inputs are invalid", () => {
  const result = calculateEstimate(
    input({
      estimatedLoanPayout: -1,
      totalHoldingCosts: -2,
      totalRentalIncome: -3,
    }),
  );

  assert.equal(result.hasCalculationErrors, true);
  assert.equal(result.hasTransactionErrors, false);
  assert.equal(result.hasSupplementaryErrors, true);
  assert.equal(result.transactionProfit, 370_000);
  assert.equal(result.breakEvenSalePrice, 622_449);
  assert.equal(result.salePriceSensitivity.length, 3);
});

test("rejects non-finite monetary values", () => {
  for (const field of [
    "salePrice",
    "purchasePrice",
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
    "estimatedLoanPayout",
    "totalHoldingCosts",
    "totalRentalIncome",
  ] as const) {
    const result = calculateEstimate(input({ [field]: Number.NaN }));
    const code =
      field === "salePrice" || field === "purchasePrice"
        ? "amountGreaterThanZero"
        : "amountZeroOrMore";

    assert.equal(result.hasCalculationErrors, true);
    assert.deepEqual(result.validationErrors, [{ field, code }]);
  }
});

test("accepts the exact supported maximum for every monetary input", () => {
  for (const field of [
    "salePrice",
    "purchasePrice",
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
    "estimatedLoanPayout",
    "totalHoldingCosts",
    "totalRentalIncome",
  ] as const) {
    const result = calculateEstimate(
      input({ [field]: 1_000_000_000_000 }),
    );

    assert.equal(
      result.validationErrors.some((error) => error.field === field),
      false,
    );
  }
});

test("rejects monetary inputs above the supported safe range", () => {
  for (const field of [
    "salePrice",
    "purchasePrice",
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
    "estimatedLoanPayout",
    "totalHoldingCosts",
    "totalRentalIncome",
  ] as const) {
    const result = calculateEstimate(
      input({ [field]: 1_000_000_000_001 }),
    );

    assert.equal(result.hasCalculationErrors, true);
    assert.deepEqual(
      result.validationErrors.find((error) => error.field === field),
      {
        field,
        code: "amountMaxTrillion",
      },
    );
  }
});

test("supplementary validation does not change target-sale-price arithmetic", () => {
  const result = calculateRequiredSalePrice(
    input({
      estimatedLoanPayout: -1,
      totalHoldingCosts: Number.NaN,
      totalRentalIncome: Number.POSITIVE_INFINITY,
    }),
    100_000,
  );

  assert.equal(result.requiredSalePrice, 724_490);
  assert.equal(result.differenceFromExpectedSalePrice, -275_510);
  assert.equal(result.validationError, null);
});

test("marks each optional detail as an adjusted estimate", () => {
  for (const field of [
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
  ] as const) {
    const result = calculateEstimate(input({ [field]: 1 }));
    assert.equal(result.hasAdjustedInputs, true);
  }
});
