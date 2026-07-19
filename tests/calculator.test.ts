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
    purchaseCosts: 30_000,
    capitalImprovements: 20_000,
    estimateTax: false,
    propertyUse: "investment",
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

  assert.equal(result.derivedCostBase, 670_000);
  assert.equal(result.rawCapitalGain, 330_000);
  assert.equal(result.heldAtLeastTwelveMonths, true);
  assert.equal(result.taxableCapitalGain, 165_000);
  assert.equal(result.estimatedCgt, 61_050);
  assert.equal(result.userAfterTaxProfit, 258_950);
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

  assert.equal(result.taxableCapitalGain, 33_000);
  assert.equal(result.estimatedCgt, 12_210);
  assert.equal(result.userAfterTaxProfit, 147_790);
});

test("keeps capital works adjustments out of economic profit", () => {
  const result = calculateEstimate(
    input({ estimateTax: true, capitalWorksDeductions: 10_000 }),
  );

  assert.equal(result.preTaxPropertyProfit, 320_000);
  assert.equal(result.derivedCostBase, 660_000);
  assert.equal(result.estimatedCgt, 62_900);
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
    input({ estimateTax: true, propertyUse: "main-residence" }),
  );

  assert.equal(result.taxStatus, "assumed-exempt");
  assert.equal(result.estimatedCgt, 0);
  assert.equal(result.userAfterTaxProfit, 320_000);
});
