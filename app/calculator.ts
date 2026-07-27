export const validationErrorCodes = [
  "amountGreaterThanZero",
  "amountZeroOrMore",
  "amountMaxTrillion",
  "commissionRange",
  "completeValidEstimate",
  "targetZeroOrMore",
  "targetMaxTrillion",
] as const;

export type ValidationErrorCode = (typeof validationErrorCodes)[number];

export interface CalculatorValidationError {
  field: keyof CalculatorInput;
  code: ValidationErrorCode;
}

export interface CalculatorInput {
  salePrice: number;
  purchasePrice: number;
  commissionRate: number;
  otherSellingCosts: number;
  salePreparationCosts: number;
  purchaseCosts: number;
  renovationsAndImprovements: number;
  estimatedLoanPayout: number;
  totalHoldingCosts: number;
  totalRentalIncome: number;
}

export interface SalePriceSensitivityScenario {
  changePercent: -5 | 0 | 5;
  salePrice: number;
  agentCommission: number;
  transactionProfit: number;
}

export interface RequiredSalePriceResult {
  requiredSalePrice: number | null;
  differenceFromExpectedSalePrice: number | null;
  validationError: ValidationErrorCode | null;
}

export interface CalculatorResult {
  hasCoreInputs: boolean;
  hasAdjustedInputs: boolean;
  agentCommission: number;
  totalSellingCosts: number;
  fixedTransactionCosts: number;
  amountAfterSellingCosts: number;
  transactionProfit: number;
  overallPreTaxPropertyResult: number;
  estimatedCashAfterLoanPayout: number;
  breakEvenSalePrice: number;
  salePriceSensitivity: SalePriceSensitivityScenario[];
  validationErrors: CalculatorValidationError[];
  hasTransactionErrors: boolean;
  hasSupplementaryErrors: boolean;
  hasCalculationErrors: boolean;
}

const MAX_MONEY_INPUT = 1_000_000_000_000;
const MAX_COMMISSION_RATE = 99.9;

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percentage(value: number): number {
  return nonNegative(value) / 100;
}

function fixedTransactionCosts(input: CalculatorInput): number {
  return (
    nonNegative(input.purchasePrice) +
    nonNegative(input.purchaseCosts) +
    nonNegative(input.renovationsAndImprovements) +
    nonNegative(input.otherSellingCosts) +
    nonNegative(input.salePreparationCosts)
  );
}

function validateTransactionInput(
  rawInput: CalculatorInput,
): CalculatorValidationError[] {
  const errors: CalculatorValidationError[] = [];
  const addError = (
    field: keyof CalculatorInput,
    code: ValidationErrorCode,
  ) => errors.push({ field, code });

  for (const field of ["salePrice", "purchasePrice"] as const) {
    const value = rawInput[field];
    if (!Number.isFinite(value) || value <= 0) {
      addError(field, "amountGreaterThanZero");
    } else if (value > MAX_MONEY_INPUT) {
      addError(field, "amountMaxTrillion");
    }
  }

  for (const field of [
    "otherSellingCosts",
    "salePreparationCosts",
    "purchaseCosts",
    "renovationsAndImprovements",
  ] as const) {
    const value = rawInput[field];
    if (!Number.isFinite(value) || value < 0) {
      addError(field, "amountZeroOrMore");
    } else if (value > MAX_MONEY_INPUT) {
      addError(field, "amountMaxTrillion");
    }
  }

  if (
    !Number.isFinite(rawInput.commissionRate) ||
    rawInput.commissionRate < 0 ||
    rawInput.commissionRate > MAX_COMMISSION_RATE
  ) {
    addError("commissionRate", "commissionRange");
  }

  return errors;
}

function validateSupplementaryInput(
  rawInput: CalculatorInput,
): CalculatorValidationError[] {
  const errors: CalculatorValidationError[] = [];

  for (const field of [
    "estimatedLoanPayout",
    "totalHoldingCosts",
    "totalRentalIncome",
  ] as const) {
    const value = rawInput[field];
    if (!Number.isFinite(value) || value < 0) {
      errors.push({ field, code: "amountZeroOrMore" });
    } else if (value > MAX_MONEY_INPUT) {
      errors.push({
        field,
        code: "amountMaxTrillion",
      });
    }
  }

  return errors;
}

export function calculateEstimate(rawInput: CalculatorInput): CalculatorResult {
  const transactionValidationErrors = validateTransactionInput(rawInput);
  const supplementaryValidationErrors =
    validateSupplementaryInput(rawInput);
  const validationErrors = [
    ...transactionValidationErrors,
    ...supplementaryValidationErrors,
  ];
  const hasTransactionErrors = transactionValidationErrors.length > 0;
  const hasSupplementaryErrors = supplementaryValidationErrors.length > 0;
  const hasCalculationErrors = validationErrors.length > 0;
  const salePrice = nonNegative(rawInput.salePrice);
  const purchasePrice = nonNegative(rawInput.purchasePrice);
  const commissionRate = percentage(rawInput.commissionRate);
  const otherSellingCosts = nonNegative(rawInput.otherSellingCosts);
  const salePreparationCosts = nonNegative(rawInput.salePreparationCosts);
  const purchaseCosts = nonNegative(rawInput.purchaseCosts);
  const renovationsAndImprovements = nonNegative(
    rawInput.renovationsAndImprovements,
  );
  const estimatedLoanPayout = nonNegative(rawInput.estimatedLoanPayout);
  const totalHoldingCosts = nonNegative(rawInput.totalHoldingCosts);
  const totalRentalIncome = nonNegative(rawInput.totalRentalIncome);
  const agentCommission = salePrice * commissionRate;
  const totalSellingCosts =
    agentCommission + otherSellingCosts + salePreparationCosts;
  const amountAfterSellingCosts = salePrice - totalSellingCosts;
  const transactionProfit =
    amountAfterSellingCosts -
    purchasePrice -
    purchaseCosts -
    renovationsAndImprovements;
  const overallPreTaxPropertyResult =
    transactionProfit + totalRentalIncome - totalHoldingCosts;
  const estimatedCashAfterLoanPayout =
    amountAfterSellingCosts - estimatedLoanPayout;
  const enteredFixedTransactionCosts = fixedTransactionCosts(rawInput);
  const breakEvenSalePrice = hasTransactionErrors
    ? 0
    : Math.ceil(enteredFixedTransactionCosts / (1 - commissionRate));
  const salePriceSensitivity: SalePriceSensitivityScenario[] =
    hasTransactionErrors
      ? []
      : ([-5, 0, 5] as const).map((changePercent) => {
          const scenarioSalePrice = salePrice * (1 + changePercent / 100);
          const scenarioAgentCommission = scenarioSalePrice * commissionRate;

          return {
            changePercent,
            salePrice: scenarioSalePrice,
            agentCommission: scenarioAgentCommission,
            transactionProfit:
              changePercent === 0
                ? transactionProfit
                : scenarioSalePrice -
                  scenarioAgentCommission -
                  enteredFixedTransactionCosts,
          };
        });

  return {
    hasCoreInputs: salePrice > 0 && purchasePrice > 0,
    hasAdjustedInputs:
      salePreparationCosts > 0 ||
      purchaseCosts > 0 ||
      renovationsAndImprovements > 0,
    agentCommission,
    totalSellingCosts,
    fixedTransactionCosts: enteredFixedTransactionCosts,
    amountAfterSellingCosts,
    transactionProfit,
    overallPreTaxPropertyResult,
    estimatedCashAfterLoanPayout,
    breakEvenSalePrice,
    salePriceSensitivity,
    validationErrors,
    hasTransactionErrors,
    hasSupplementaryErrors,
    hasCalculationErrors,
  };
}

export function calculateRequiredSalePrice(
  rawInput: CalculatorInput,
  targetProfit: number,
): RequiredSalePriceResult {
  if (validateTransactionInput(rawInput).length > 0) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "completeValidEstimate",
    };
  }

  if (!Number.isFinite(targetProfit) || targetProfit < 0) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "targetZeroOrMore",
    };
  }

  if (targetProfit > MAX_MONEY_INPUT) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "targetMaxTrillion",
    };
  }

  const exactRequiredSalePrice =
    (fixedTransactionCosts(rawInput) + targetProfit) /
    (1 - percentage(rawInput.commissionRate));

  const requiredSalePrice = Math.ceil(exactRequiredSalePrice);

  return {
    requiredSalePrice,
    differenceFromExpectedSalePrice:
      requiredSalePrice - rawInput.salePrice,
    validationError: null,
  };
}
