export interface CalculatorValidationError {
  field: keyof CalculatorInput;
  message: string;
}

export interface CalculatorInput {
  salePrice: number;
  purchasePrice: number;
  commissionRate: number;
  otherSellingCosts: number;
  salePreparationCosts: number;
  purchaseCosts: number;
  renovationsAndImprovements: number;
}

export interface SalePriceSensitivityScenario {
  changePercent: -5 | 0 | 5;
  salePrice: number;
  transactionProfit: number;
}

export interface RequiredSalePriceResult {
  requiredSalePrice: number | null;
  differenceFromExpectedSalePrice: number | null;
  validationError: string | null;
}

export interface CalculatorResult {
  hasCoreInputs: boolean;
  hasAdjustedInputs: boolean;
  agentCommission: number;
  totalSellingCosts: number;
  netSaleProceeds: number;
  transactionProfit: number;
  breakEvenSalePrice: number;
  salePriceSensitivity: SalePriceSensitivityScenario[];
  validationErrors: CalculatorValidationError[];
  hasCalculationErrors: boolean;
}

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

function validateInput(rawInput: CalculatorInput): CalculatorValidationError[] {
  const errors: CalculatorValidationError[] = [];
  const addError = (field: keyof CalculatorInput, message: string) =>
    errors.push({ field, message });

  for (const field of ["salePrice", "purchasePrice"] as const) {
    const value = rawInput[field];
    if (!Number.isFinite(value) || value <= 0) {
      addError(field, "Enter an amount greater than zero.");
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
      addError(field, "Enter an amount of zero or more.");
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
    );
  }

  return errors;
}

export function calculateEstimate(rawInput: CalculatorInput): CalculatorResult {
  const validationErrors = validateInput(rawInput);
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
  const agentCommission = salePrice * commissionRate;
  const totalSellingCosts =
    agentCommission + otherSellingCosts + salePreparationCosts;
  const netSaleProceeds = salePrice - totalSellingCosts;
  const transactionProfit =
    netSaleProceeds -
    purchasePrice -
    purchaseCosts -
    renovationsAndImprovements;
  const enteredFixedTransactionCosts = fixedTransactionCosts(rawInput);
  const breakEvenSalePrice = hasCalculationErrors
    ? 0
    : Math.ceil(enteredFixedTransactionCosts / (1 - commissionRate));
  const salePriceSensitivity: SalePriceSensitivityScenario[] =
    hasCalculationErrors
      ? []
      : ([-5, 0, 5] as const).map((changePercent) => {
          const scenarioSalePrice = salePrice * (1 + changePercent / 100);
          return {
            changePercent,
            salePrice: scenarioSalePrice,
            transactionProfit:
              changePercent === 0
                ? transactionProfit
                : scenarioSalePrice * (1 - commissionRate) -
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
    netSaleProceeds,
    transactionProfit,
    breakEvenSalePrice,
    salePriceSensitivity,
    validationErrors,
    hasCalculationErrors,
  };
}

export function calculateRequiredSalePrice(
  rawInput: CalculatorInput,
  targetProfit: number,
): RequiredSalePriceResult {
  if (validateInput(rawInput).length > 0) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "Complete a valid transaction estimate first.",
    };
  }

  if (!Number.isFinite(targetProfit) || targetProfit < 0) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "Enter a target profit of zero or more.",
    };
  }

  const exactRequiredSalePrice =
    (fixedTransactionCosts(rawInput) + targetProfit) /
    (1 - percentage(rawInput.commissionRate));

  if (!Number.isFinite(exactRequiredSalePrice)) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      validationError: "The entered target is too large to calculate.",
    };
  }

  const requiredSalePrice = Math.ceil(exactRequiredSalePrice);

  return {
    requiredSalePrice,
    differenceFromExpectedSalePrice:
      requiredSalePrice - rawInput.salePrice,
    validationError: null,
  };
}
