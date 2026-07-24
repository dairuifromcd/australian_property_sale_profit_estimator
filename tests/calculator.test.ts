import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateEstimate,
  calculateRequiredSalePrice,
  type CalculatorInput,
} from "../app/calculator.ts";
import {
  formatAmountInput,
  numberFromInput,
} from "../app/input-format.ts";

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

test("formats monetary input with grouping separators", () => {
  assert.equal(formatAmountInput("650000"), "650,000");
  assert.equal(formatAmountInput("$ 1,250,000.50"), "1,250,000.50");
  assert.equal(formatAmountInput("-12000"), "-12,000");
  assert.equal(numberFromInput("1,250,000.50"), 1_250_000.5);
});

test("normalises partial and malformed monetary text safely", () => {
  assert.equal(formatAmountInput(""), "");
  assert.equal(formatAmountInput("-"), "-");
  assert.equal(formatAmountInput(".5"), "0.5");
  assert.equal(formatAmountInput("12..34"), "12.34");
  assert.equal(formatAmountInput("abc"), "");
  assert.equal(numberFromInput(""), 0);
  assert.equal(numberFromInput("-"), 0);
});

test("calculates the four-input transaction estimate", () => {
  const result = calculateEstimate(input());

  assert.equal(result.hasCoreInputs, true);
  assert.equal(result.hasAdjustedInputs, false);
  assert.equal(result.agentCommission, 20_000);
  assert.equal(result.totalSellingCosts, 30_000);
  assert.equal(result.amountAfterSellingCosts, 970_000);
  assert.equal(result.transactionProfit, 370_000);
  assert.equal(result.overallPreTaxPropertyResult, 370_000);
  assert.equal(result.estimatedCashAfterLoanPayout, 970_000);
  assert.equal(Math.round(result.breakEvenSalePrice), 622_449);
  assert.deepEqual(result.validationErrors, []);
  assert.equal(result.hasCalculationErrors, false);
});

test("calculates sale-price sensitivity with scenario commission", () => {
  const result = calculateEstimate(input());

  assert.deepEqual(result.salePriceSensitivity, [
    {
      changePercent: -5,
      salePrice: 950_000,
      transactionProfit: 321_000,
    },
    {
      changePercent: 0,
      salePrice: 1_000_000,
      transactionProfit: 370_000,
    },
    {
      changePercent: 5,
      salePrice: 1_050_000,
      transactionProfit: 419_000,
    },
  ]);
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

test("keeps target-profit validation separate from the main estimate", () => {
  for (const targetProfit of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    const result = calculateRequiredSalePrice(input(), targetProfit);

    assert.deepEqual(result, {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "Enter a target profit of zero or more.",
    });
  }

  assert.deepEqual(
    calculateRequiredSalePrice(input({ salePrice: 0 }), 100_000),
    {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "Complete a valid transaction estimate first.",
    },
  );

  assert.deepEqual(
    calculateRequiredSalePrice(input(), Number.MAX_VALUE),
    {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "The entered target is too large to calculate.",
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
        message: "Enter an amount greater than zero.",
      },
    ]);
    assert.equal(result.breakEvenSalePrice, 0);
  }
});

test("rejects invalid commission rates", () => {
  for (const commissionRate of [-1, 100, Number.NaN]) {
    const result = calculateEstimate(input({ commissionRate }));

    assert.equal(result.hasCalculationErrors, true);
    assert.equal(
      result.validationErrors.some(
        (error) => error.field === "commissionRate",
      ),
      true,
    );
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
    assert.equal(
      result.validationErrors.some((error) => error.field === field),
      true,
    );

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

    assert.equal(result.hasCalculationErrors, true);
    assert.equal(
      result.validationErrors.some((error) => error.field === field),
      true,
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
        message: "Enter an amount no greater than $1 trillion.",
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
