import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateEstimate,
  type CalculatorInput,
} from "../app/calculator.ts";

function input(overrides: Partial<CalculatorInput> = {}): CalculatorInput {
  return {
    salePrice: 1_000_000,
    purchasePrice: 600_000,
    commissionRate: 2,
    otherSellingCosts: 10_000,
    salePreparationCosts: 0,
    purchaseCosts: 30_000,
    capitalImprovements: 20_000,
    estimateTax: false,
    propertyUse: "investment",
    mainResidenceExemptionConfirmed: false,
    purchaseDate: "2020-01-01",
    saleDate: "2026-06-01",
    ownershipShare: 100,
    marginalTaxRate: 37,
    mixedTaxablePercentage: 0,
    capitalWorksDeductions: 0,
    atoCostBaseOverride: 0,
    ...overrides,
  };
}

test("calculates quick and adjusted property profit", () => {
  const result = calculateEstimate(input());

  assert.equal(result.agentCommission, 20_000);
  assert.equal(result.totalSellingCosts, 30_000);
  assert.equal(result.netSaleProceeds, 970_000);
  assert.equal(result.preTaxPropertyProfit, 320_000);
  assert.equal(result.breakEvenSalePrice, 660_000 / 0.98);
  assert.equal(result.taxStatus, "not-requested");
});

test("estimates pre-July-2027 investment CGT with the 12-month discount", () => {
  const result = calculateEstimate(input({ estimateTax: true }));

  assert.equal(result.derivedCostBase, 680_000);
  assert.equal(result.rawCapitalGain, 320_000);
  assert.equal(result.heldAtLeastTwelveMonths, true);
  assert.equal(result.taxableCapitalGain, 160_000);
  assert.equal(result.estimatedCgt, 59_200);
  assert.equal(result.userAfterTaxProfit, 260_800);
  assert.equal(result.taxStatus, "estimated");
});

test("applies ownership and mixed-use percentages", () => {
  const result = calculateEstimate(
    input({
      estimateTax: true,
      propertyUse: "mixed",
      ownershipShare: 50,
      mixedTaxablePercentage: 40,
    }),
  );

  assert.equal(result.taxableCapitalGain, 32_000);
  assert.equal(result.estimatedCgt, 11_840);
  assert.equal(result.preTaxPropertyProfit, 320_000);
  assert.equal(result.userPreTaxProfit, 160_000);
  assert.equal(result.userAfterTaxProfit, 148_160);
});

test("keeps capital works adjustments out of economic profit", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, capitalWorksDeductions: 10_000 }),
  );

  assert.equal(result.preTaxPropertyProfit, 320_000);
  assert.equal(result.derivedCostBase, 670_000);
  assert.equal(result.estimatedCgt, 61_050);
});

test("separates CGT-eligible selling costs from cash-only sale preparation", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, salePreparationCosts: 15_000 }),
  );

  assert.equal(result.totalSellingCosts, 45_000);
  assert.equal(result.preTaxPropertyProfit, 305_000);
  assert.equal(result.breakEvenSalePrice, 675_000 / 0.98);
  assert.equal(result.derivedCostBase, 680_000);
  assert.equal(result.estimatedCgt, 59_200);
});

test("does not apply the CGT discount on the calendar anniversary", () => {
  const anniversary = calculateEstimate(
    input({
      estimateTax: true,
      purchaseDate: "2024-02-02",
      saleDate: "2025-02-02",
    }),
  );
  const followingDay = calculateEstimate(
    input({
      estimateTax: true,
      purchaseDate: "2024-02-02",
      saleDate: "2025-02-03",
    }),
  );

  assert.equal(anniversary.heldAtLeastTwelveMonths, false);
  assert.equal(anniversary.taxableCapitalGain, 320_000);
  assert.equal(followingDay.heldAtLeastTwelveMonths, true);
  assert.equal(followingDay.taxableCapitalGain, 160_000);
});

test("does not return a numeric tax estimate for post-reform sale dates", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, saleDate: "2027-07-01" }),
  );

  assert.equal(result.taxStatus, "post-2027-unsupported");
  assert.equal(result.estimatedCgt, null);
  assert.equal(result.userAfterTaxProfit, null);
});

test("assumes a selected fully exempt main residence has no CGT", () => {
  const result = calculateEstimate(
    input({
      estimateTax: true,
      propertyUse: "main-residence",
      mainResidenceExemptionConfirmed: true,
    }),
  );

  assert.equal(result.taxStatus, "assumed-exempt");
  assert.equal(result.estimatedCgt, 0);
  assert.equal(result.userAfterTaxProfit, 320_000);
});

test("does not show zero CGT until the main residence exemption is confirmed", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, propertyUse: "main-residence" }),
  );

  assert.equal(result.taxStatus, "main-residence-unconfirmed");
  assert.equal(result.estimatedCgt, null);
  assert.equal(result.userAfterTaxProfit, null);
});

test("rejects a sale date that is not after the purchase date", () => {
  const result = calculateEstimate(
    input({
      estimateTax: true,
      purchaseDate: "2026-01-02",
      saleDate: "2026-01-01",
    }),
  );

  assert.equal(result.taxStatus, "invalid-input");
  assert.equal(result.hasTaxErrors, true);
  assert.deepEqual(
    result.validationErrors.map((error) => error.field),
    ["saleDate"],
  );
});

test("rejects malformed calendar dates", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, purchaseDate: "2025-02-30" }),
  );

  assert.equal(result.taxStatus, "invalid-input");
  assert.deepEqual(
    result.validationErrors.map((error) => error.field),
    ["purchaseDate"],
  );
});

test("rejects impossible percentages instead of silently clamping them", () => {
  const commission = calculateEstimate(
    input({ estimateTax: true, commissionRate: 100 }),
  );
  const ownership = calculateEstimate(
    input({ estimateTax: true, ownershipShare: 0 }),
  );
  const mixedUse = calculateEstimate(
    input({
      estimateTax: true,
      propertyUse: "mixed",
      mixedTaxablePercentage: 100,
    }),
  );

  assert.equal(commission.hasCalculationErrors, true);
  assert.equal(commission.breakEvenSalePrice, 0);
  assert.equal(commission.taxStatus, "invalid-input");
  assert.equal(ownership.taxStatus, "invalid-input");
  assert.equal(mixedUse.taxStatus, "invalid-input");
});

test("rejects negative cash costs instead of converting them to zero", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, salePreparationCosts: -1 }),
  );

  assert.equal(result.hasCalculationErrors, true);
  assert.equal(result.taxStatus, "invalid-input");
  assert.deepEqual(
    result.validationErrors.map((error) => error.field),
    ["salePreparationCosts"],
  );
});
