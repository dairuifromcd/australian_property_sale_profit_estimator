export type PropertyUse = "main-residence" | "investment" | "mixed";

export type TaxEstimateStatus =
  | "not-requested"
  | "insufficient-input"
  | "invalid-input"
  | "main-residence-unconfirmed"
  | "assumed-exempt"
  | "estimated"
  | "post-2027-unsupported"
  | "capital-loss";

export type ValidationScope = "calculation" | "tax";

export interface CalculatorValidationError {
  field: keyof CalculatorInput;
  message: string;
  scope: ValidationScope;
}

export interface CalculatorInput {
  salePrice: number;
  purchasePrice: number;
  commissionRate: number;
  otherSellingCosts: number;
  salePreparationCosts: number;
  purchaseCosts: number;
  capitalImprovements: number;
  estimateTax: boolean;
  propertyUse: PropertyUse;
  mainResidenceExemptionConfirmed: boolean;
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
  validationErrors: CalculatorValidationError[];
  hasCalculationErrors: boolean;
  hasTaxErrors: boolean;
  taxableCapitalGain: number | null;
  estimatedCgt: number | null;
  userAfterTaxProfit: number | null;
  taxStatus: TaxEstimateStatus;
}

const TAX_REFORM_START = "2027-07-01";

interface IsoDateParts {
  year: number;
  month: number;
  day: number;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percentage(value: number): number {
  return Math.min(100, nonNegative(value)) / 100;
}

function parseIsoDate(value: string): IsoDateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function compareDates(left: IsoDateParts, right: IsoDateParts): number {
  const leftValue = left.year * 10_000 + left.month * 100 + left.day;
  const rightValue = right.year * 10_000 + right.month * 100 + right.day;
  return leftValue - rightValue;
}

function isAtLeastTwelveMonths(purchaseDate: string, saleDate: string): boolean {
  const purchase = parseIsoDate(purchaseDate);
  const sale = parseIsoDate(saleDate);
  if (!purchase || !sale) return false;

  const yearDifference = sale.year - purchase.year;
  if (yearDifference > 1) return true;
  if (yearDifference < 1) return false;

  // The ATO excludes both the acquisition date and CGT event date. A sale on
  // the calendar anniversary is therefore one day too early for the discount.
  return (
    sale.month > purchase.month ||
    (sale.month === purchase.month && sale.day > purchase.day)
  );
}

function validateInput(rawInput: CalculatorInput): CalculatorValidationError[] {
  const errors: CalculatorValidationError[] = [];
  const addError = (
    field: keyof CalculatorInput,
    message: string,
    scope: ValidationScope,
  ) => errors.push({ field, message, scope });

  const nonNegativeCalculationFields: Array<
    keyof Pick<
      CalculatorInput,
      | "salePrice"
      | "purchasePrice"
      | "otherSellingCosts"
      | "salePreparationCosts"
      | "purchaseCosts"
      | "capitalImprovements"
    >
  > = [
    "salePrice",
    "purchasePrice",
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "capitalImprovements",
  ];

  for (const field of nonNegativeCalculationFields) {
    const value = rawInput[field];
    if (!Number.isFinite(value) || value < 0) {
      addError(field, "Enter an amount of zero or more.", "calculation");
    }
  }

  if (
    !Number.isFinite(rawInput.commissionRate) ||
    rawInput.commissionRate < 0 ||
    rawInput.commissionRate >= 100
  ) {
    addError(
      "commissionRate",
      "Enter a commission rate from 0% to less than 100%.",
      "calculation",
    );
  }

  if (!rawInput.estimateTax) return errors;

  if (
    !Number.isFinite(rawInput.ownershipShare) ||
    rawInput.ownershipShare <= 0 ||
    rawInput.ownershipShare > 100
  ) {
    addError(
      "ownershipShare",
      "Enter an ownership share greater than 0% and no more than 100%.",
      "tax",
    );
  }

  if (rawInput.propertyUse !== "main-residence") {
    if (
      !Number.isFinite(rawInput.marginalTaxRate) ||
      rawInput.marginalTaxRate < 0 ||
      rawInput.marginalTaxRate > 100
    ) {
      addError(
        "marginalTaxRate",
        "Enter a tax rate from 0% to 100%.",
        "tax",
      );
    }
  }

  if (
    rawInput.propertyUse === "mixed" &&
    (!Number.isFinite(rawInput.mixedTaxablePercentage) ||
      rawInput.mixedTaxablePercentage <= 0 ||
      rawInput.mixedTaxablePercentage >= 100)
  ) {
    addError(
      "mixedTaxablePercentage",
      "For mixed use, enter a taxable portion greater than 0% and less than 100%.",
      "tax",
    );
  }

  if (
    !Number.isFinite(rawInput.capitalWorksDeductions) ||
    rawInput.capitalWorksDeductions < 0
  ) {
    addError(
      "capitalWorksDeductions",
      "Enter an amount of zero or more.",
      "tax",
    );
  }

  if (
    !Number.isFinite(rawInput.atoCostBaseOverride) ||
    rawInput.atoCostBaseOverride < 0
  ) {
    addError(
      "atoCostBaseOverride",
      "Enter an amount of zero or more.",
      "tax",
    );
  }

  const purchaseDate = rawInput.purchaseDate
    ? parseIsoDate(rawInput.purchaseDate)
    : null;
  const saleDate = rawInput.saleDate ? parseIsoDate(rawInput.saleDate) : null;

  if (rawInput.purchaseDate && !purchaseDate) {
    addError("purchaseDate", "Enter a valid purchase date.", "tax");
  }

  if (rawInput.saleDate && !saleDate) {
    addError("saleDate", "Enter a valid sale date.", "tax");
  }

  if (purchaseDate && saleDate && compareDates(saleDate, purchaseDate) <= 0) {
    addError(
      "saleDate",
      "The sale contract date must be after the purchase contract date.",
      "tax",
    );
  }

  return errors;
}

export function calculateEstimate(rawInput: CalculatorInput): CalculatorResult {
  const validationErrors = validateInput(rawInput);
  const hasCalculationErrors = validationErrors.some(
    (error) => error.scope === "calculation",
  );
  const hasTaxErrors = validationErrors.some(
    (error) => error.scope === "tax" || error.scope === "calculation",
  );
  const salePrice = nonNegative(rawInput.salePrice);
  const purchasePrice = nonNegative(rawInput.purchasePrice);
  const commissionRate = percentage(rawInput.commissionRate);
  const otherSellingCosts = nonNegative(rawInput.otherSellingCosts);
  const salePreparationCosts = nonNegative(rawInput.salePreparationCosts);
  const purchaseCosts = nonNegative(rawInput.purchaseCosts);
  const capitalImprovements = nonNegative(rawInput.capitalImprovements);
  const ownershipShare = percentage(rawInput.ownershipShare);
  const agentCommission = salePrice * commissionRate;
  const totalSellingCosts =
    agentCommission + otherSellingCosts + salePreparationCosts;
  const netSaleProceeds = salePrice - totalSellingCosts;
  const preTaxPropertyProfit =
    netSaleProceeds - purchasePrice - purchaseCosts - capitalImprovements;
  const userPreTaxProfit = preTaxPropertyProfit * ownershipShare;
  const breakEvenSalePrice = hasCalculationErrors
    ? 0
    : (purchasePrice +
        purchaseCosts +
        capitalImprovements +
        otherSellingCosts +
        salePreparationCosts) /
      (1 - commissionRate);
  const derivedCostBase = Math.max(
    0,
    purchasePrice +
      purchaseCosts +
      capitalImprovements +
      agentCommission +
      otherSellingCosts -
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
  const hasAdjustedInputs =
    salePreparationCosts > 0 || purchaseCosts > 0 || capitalImprovements > 0;

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
    validationErrors,
    hasCalculationErrors,
    hasTaxErrors,
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

  if (hasTaxErrors) {
    return {
      ...baseResult,
      taxableCapitalGain: null,
      estimatedCgt: null,
      userAfterTaxProfit: null,
      taxStatus: "invalid-input",
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
    if (!rawInput.mainResidenceExemptionConfirmed) {
      return {
        ...baseResult,
        taxableCapitalGain: null,
        estimatedCgt: null,
        userAfterTaxProfit: null,
        taxStatus: "main-residence-unconfirmed",
      };
    }

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
