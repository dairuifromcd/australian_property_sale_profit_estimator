import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateEstimate,
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
  assert.equal(result.netSaleProceeds, 970_000);
  assert.equal(result.transactionProfit, 370_000);
  assert.equal(Math.round(result.breakEvenSalePrice), 622_449);
  assert.deepEqual(result.validationErrors, []);
  assert.equal(result.hasCalculationErrors, false);
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
  assert.equal(result.netSaleProceeds, 965_000);
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

  assert.equal(result.netSaleProceeds, 578_000);
  assert.equal(result.transactionProfit, -72_000);
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
  }
});

test("rejects negative optional transaction costs", () => {
  for (const field of [
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
  ] as const) {
    const result = calculateEstimate(input({ [field]: -1 }));

    assert.equal(result.hasCalculationErrors, true);
    assert.equal(
      result.validationErrors.some((error) => error.field === field),
      true,
    );
    assert.equal(result.breakEvenSalePrice, 0);
  }
});

test("rejects non-finite monetary values", () => {
  for (const field of [
    "salePrice",
    "purchasePrice",
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
  ] as const) {
    const result = calculateEstimate(input({ [field]: Number.NaN }));

    assert.equal(result.hasCalculationErrors, true);
    assert.equal(
      result.validationErrors.some((error) => error.field === field),
      true,
    );
  }
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
