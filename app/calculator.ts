export type PropertyUse = "main-residence" | "investment" | "mixed";

export type TaxEstimateStatus =
  | "not-requested"
  | "insufficient-input"
  | "assumed-exempt"
  | "estimated"
  | "post-2027-unsupported"
  | "capital-loss";

export interface CalculatorInput {
  salePrice: number;
  purchasePrice: number;
  commissionRate: number;
  otherSellingCosts: number;
  purchaseCosts: number;
  capitalImprovements: number;
  estimateTax: boolean;
  propertyUse: PropertyUse;
  purchaseDate: string;
  saleDate: string;
  ownershipShare: number;
  marginalTaxRate: number;
  mixedTaxablePercentage: number;
  capitalWorksDeductions: number;
  atoCostBaseOverride: number;
}

export interface CalculatorResult {
  hasCoreInputs: boolean;
  hasAdjustedInputs: boolean;
  agentCommission: number;
  totalSellingCosts: number;
  netSaleProceeds: number;
  preTaxPropertyProfit: number;
  userPreTaxProfit: number;
  breakEvenSalePrice: number;
  derivedCostBase: number;
  atoCostBase: number;
  rawCapitalGain: number;
  capitalLoss: number;
  heldAtLeastTwelveMonths: boolean;
  taxableCapitalGain: number | null;
  estimatedCgt: number | null;
  userAfterTaxProfit: number | null;
  taxStatus: TaxEstimateStatus;
}

const TAX_REFORM_START = "2027-07-01";

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percentage(value: number): number {
  return Math.min(100, nonNegative(value)) / 100;
}

function isAtLeastTwelveMonths(purchaseDate: string, saleDate: string): boolean {
  if (!purchaseDate || !saleDate) return false;

  const purchase = new Date(`${purchaseDate}T00:00:00Z`);
  const sale = new Date(`${saleDate}T00:00:00Z`);
  if (Number.isNaN(purchase.valueOf()) || Number.isNaN(sale.valueOf())) {
    return false;
  }

  const anniversary = new Date(purchase.valueOf());
  anniversary.setUTCFullYear(anniversary.getUTCFullYear() + 1);
  return sale >= anniversary;
}

export function calculateEstimate(rawInput: CalculatorInput): CalculatorResult {
  const salePrice = nonNegative(rawInput.salePrice);
  const purchasePrice = nonNegative(rawInput.purchasePrice);
  const commissionRate = percentage(rawInput.commissionRate);
  const otherSellingCosts = nonNegative(rawInput.otherSellingCosts);
  const purchaseCosts = nonNegative(rawInput.purchaseCosts);
  const capitalImprovements = nonNegative(rawInput.capitalImprovements);
  const ownershipShare = percentage(rawInput.ownershipShare);
  const agentCommission = salePrice * commissionRate;
  const totalSellingCosts = agentCommission + otherSellingCosts;
  const netSaleProceeds = salePrice - totalSellingCosts;
  const preTaxPropertyProfit =
    netSaleProceeds - purchasePrice - purchaseCosts - capitalImprovements;
  const userPreTaxProfit = preTaxPropertyProfit * ownershipShare;
  const commissionDenominator = Math.max(0.0001, 1 - commissionRate);
  const breakEvenSalePrice =
    (purchasePrice +
      purchaseCosts +
      capitalImprovements +
      otherSellingCosts) /
    commissionDenominator;
  const derivedCostBase = Math.max(
    0,
    purchasePrice +
      purchaseCosts +
      capitalImprovements +
      agentCommission -
      nonNegative(rawInput.capitalWorksDeductions),
  );
  const atoCostBase =
    nonNegative(rawInput.atoCostBaseOverride) > 0
      ? nonNegative(rawInput.atoCostBaseOverride)
      : derivedCostBase;
  const rawGainOrLoss = salePrice - atoCostBase;
  const rawCapitalGain = Math.max(0, rawGainOrLoss);
  const capitalLoss = Math.max(0, -rawGainOrLoss);
  const heldAtLeastTwelveMonths = isAtLeastTwelveMonths(
    rawInput.purchaseDate,
    rawInput.saleDate,
  );
  const hasCoreInputs = salePrice > 0 && purchasePrice > 0;
  const hasAdjustedInputs = purchaseCosts > 0 || capitalImprovements > 0;

  const baseResult = {
    hasCoreInputs,
    hasAdjustedInputs,
    agentCommission,
    totalSellingCosts,
    netSaleProceeds,
    preTaxPropertyProfit,
    userPreTaxProfit,
    breakEvenSalePrice,
    derivedCostBase,
    atoCostBase,
    rawCapitalGain,
    capitalLoss,
    heldAtLeastTwelveMonths,
  };

  if (!rawInput.estimateTax) {
    return {
      ...baseResult,
      taxableCapitalGain: null,
      estimatedCgt: null,
      userAfterTaxProfit: null,
      taxStatus: "not-requested",
    };
  }

  if (!hasCoreInputs || !rawInput.saleDate || !rawInput.purchaseDate) {
    return {
      ...baseResult,
      taxableCapitalGain: null,
      estimatedCgt: null,
      userAfterTaxProfit: null,
      taxStatus: "insufficient-input",
    };
  }

  if (rawInput.saleDate >= TAX_REFORM_START) {
    return {
      ...baseResult,
      taxableCapitalGain: null,
      estimatedCgt: null,
      userAfterTaxProfit: null,
      taxStatus: "post-2027-unsupported",
    };
  }

  if (rawInput.propertyUse === "main-residence") {
    return {
      ...baseResult,
      taxableCapitalGain: 0,
      estimatedCgt: 0,
      userAfterTaxProfit: userPreTaxProfit,
      taxStatus: "assumed-exempt",
    };
  }

  if (capitalLoss > 0) {
    return {
      ...baseResult,
      taxableCapitalGain: 0,
      estimatedCgt: 0,
      userAfterTaxProfit: userPreTaxProfit,
      taxStatus: "capital-loss",
    };
  }

  if (nonNegative(rawInput.marginalTaxRate) <= 0) {
    return {
      ...baseResult,
      taxableCapitalGain: null,
      estimatedCgt: null,
      userAfterTaxProfit: null,
      taxStatus: "insufficient-input",
    };
  }

  const taxableUsePercentage =
    rawInput.propertyUse === "investment"
      ? 1
      : percentage(rawInput.mixedTaxablePercentage);
  const discountMultiplier = heldAtLeastTwelveMonths ? 0.5 : 1;
  const taxableCapitalGain =
    rawCapitalGain *
    taxableUsePercentage *
    ownershipShare *
    discountMultiplier;
  const estimatedCgt =
    taxableCapitalGain * percentage(rawInput.marginalTaxRate);

  return {
    ...baseResult,
    taxableCapitalGain,
    estimatedCgt,
    userAfterTaxProfit: userPreTaxProfit - estimatedCgt,
    taxStatus: "estimated",
  };
}
