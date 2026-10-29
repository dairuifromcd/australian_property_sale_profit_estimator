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

export type CommissionInput = Pick<CalculatorInput, "salePrice" | "commissionRate">;

export interface CommissionResult {
  commission: number | null;
  exactCommission: string | null;
  validationErrors: CalculatorValidationError[];
}

export interface SalePriceSensitivityScenario {
  changePercent: -5 | 0 | 5;
  salePrice: number;
  agentCommission: number;
  transactionProfit: number;
  exact: { salePrice: string; agentCommission: string; transactionProfit: string };
}

export interface RequiredSalePriceResult {
  requiredSalePrice: number | null;
  differenceFromExpectedSalePrice: number | null;
  exactDifferenceFromExpectedSalePrice: string | null;
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
  exact: {
    agentCommission: string;
    totalSellingCosts: string;
    fixedTransactionCosts: string;
    amountAfterSellingCosts: string;
    transactionProfit: string;
    overallPreTaxPropertyResult: string;
    estimatedCashAfterLoanPayout: string;
  };
}

const MAX_MONEY_INPUT = 1_000_000_000_000;
const MAX_COMMISSION_RATE = 99.9;
const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const BIGINT_TEN = BigInt(10);
const BIGINT_ONE_HUNDRED = BigInt(100);

function nonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function percentage(value: number): number {
  return nonNegative(value) / 100;
}

// Finite decimal arithmetic: retain all entered precision until an API number
// or display string is requested. No intermediate amount is rounded to cents.
interface Decimal { coefficient: bigint; scale: number }

function decimal(value: number): Decimal {
  const [coefficient, exponent] = value.toString().toLowerCase().split("e");
  const [whole, fraction = ""] = coefficient.split(".");
  return { coefficient: BigInt(`${whole}${fraction}`), scale: fraction.length - Number(exponent ?? 0) };
}

function addDecimal(left: Decimal, right: Decimal): Decimal {
  const scale = Math.max(left.scale, right.scale);
  return {
    coefficient: left.coefficient * BIGINT_TEN ** BigInt(scale - left.scale) + right.coefficient * BIGINT_TEN ** BigInt(scale - right.scale),
    scale,
  };
}

function subtractDecimal(left: Decimal, right: Decimal): Decimal {
  return addDecimal(left, { coefficient: -right.coefficient, scale: right.scale });
}

function multiplyDecimal(left: Decimal, right: Decimal): Decimal {
  return { coefficient: left.coefficient * right.coefficient, scale: left.scale + right.scale };
}

function percentageDecimal(amount: Decimal, rate: Decimal): Decimal {
  const product = multiplyDecimal(amount, rate);
  return { coefficient: product.coefficient, scale: product.scale + 2 };
}

function decimalText(value: Decimal): string {
  if (value.coefficient === BIGINT_ZERO) return "0";
  if (value.scale <= 0) return `${value.coefficient}${"0".repeat(-value.scale)}`;
  const negative = value.coefficient.toString().startsWith("-");
  const digits = (negative ? -value.coefficient : value.coefficient).toString().padStart(value.scale + 1, "0");
  return `${negative ? "-" : ""}${digits.slice(0, -value.scale)}.${digits.slice(-value.scale)}`;
}

function decimalNumber(value: Decimal): number {
  return Number(decimalText(value));
}

function commissionDecimal(input: CommissionInput): Decimal {
  return percentageDecimal(decimal(nonNegative(input.salePrice)), decimal(nonNegative(input.commissionRate)));
}

function positiveMoneyError(value: number): ValidationErrorCode | null {
  if (!Number.isFinite(value) || value <= 0) return "amountGreaterThanZero";
  if (value > MAX_MONEY_INPUT) return "amountMaxTrillion";
  return null;
}

function commissionRateError(value: number): ValidationErrorCode | null {
  return !Number.isFinite(value) || value < 0 || value > MAX_COMMISSION_RATE
    ? "commissionRange"
    : null;
}

export function calculateAgentCommission(input: CommissionInput): CommissionResult {
  const validationErrors: CalculatorValidationError[] = [];
  const salePriceError = positiveMoneyError(input.salePrice);
  const rateError = commissionRateError(input.commissionRate);
  if (salePriceError) validationErrors.push({ field: "salePrice", code: salePriceError });
  if (rateError) validationErrors.push({ field: "commissionRate", code: rateError });

  const exactCommission = validationErrors.length > 0 ? null : decimalText(commissionDecimal(input));
  return {
    commission: exactCommission === null ? null : Number(exactCommission),
    exactCommission,
    validationErrors,
  };
}

function moneyInCents(value: number): bigint {
  return BigInt(Math.round(nonNegative(value) * 100));
}

function fixedTransactionCostsInCents(input: CalculatorInput): bigint {
  return [
    input.purchasePrice,
    input.purchaseCosts,
    input.renovationsAndImprovements,
    input.otherSellingCosts,
    input.salePreparationCosts,
  ].reduce(
    (total, value) => total + moneyInCents(value),
    BIGINT_ZERO,
  );
}

function decimalRatio(value: number): {
  numerator: bigint;
  denominator: bigint;
} {
  const [coefficient, exponentText] = value
    .toString()
    .toLowerCase()
    .split("e");
  const [wholePart, fractionPart = ""] = coefficient.split(".");
  const digits = `${wholePart}${fractionPart}`;
  const decimalPlaces = fractionPart.length - Number(exponentText ?? 0);

  return {
    numerator: BigInt(digits),
    denominator: BIGINT_TEN ** BigInt(decimalPlaces),
  };
}

function ceilDivision(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - BIGINT_ONE) / denominator;
}

function requiredWholeDollarSalePrice(
  input: CalculatorInput,
  targetProfit = 0,
): number {
  const commission = decimalRatio(nonNegative(input.commissionRate));
  const percentageDenominator =
    BIGINT_ONE_HUNDRED * commission.denominator;
  const retainedPercentage =
    percentageDenominator - commission.numerator;
  const requiredDollars = ceilDivision(
    (fixedTransactionCostsInCents(input) + moneyInCents(targetProfit)) *
      commission.denominator,
    retainedPercentage,
  );

  return Number(requiredDollars);
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
    const code = positiveMoneyError(rawInput[field]);
    if (code) addError(field, code);
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

  const rateError = commissionRateError(rawInput.commissionRate);
  if (rateError) addError("commissionRate", rateError);

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
  // Retain the legacy finite fallback for invalid main-form inputs; neither
  // interface displays a result until its required inputs pass validation.
  const agentCommission = calculateAgentCommission(rawInput).commission ?? salePrice * commissionRate;
  const exactSalePrice = decimal(salePrice);
  const exactAgentCommission = commissionDecimal(rawInput);
  const exactOtherSellingCosts = decimal(otherSellingCosts);
  const exactSalePreparationCosts = decimal(salePreparationCosts);
  const exactPurchasePrice = decimal(purchasePrice);
  const exactPurchaseCosts = decimal(purchaseCosts);
  const exactRenovations = decimal(renovationsAndImprovements);
  const exactSellingCosts = addDecimal(addDecimal(exactAgentCommission, exactOtherSellingCosts), exactSalePreparationCosts);
  const exactAmountAfterSellingCosts = subtractDecimal(exactSalePrice, exactSellingCosts);
  const exactTransactionProfit = subtractDecimal(subtractDecimal(subtractDecimal(exactAmountAfterSellingCosts, exactPurchasePrice), exactPurchaseCosts), exactRenovations);
  const exactOverallResult = subtractDecimal(addDecimal(exactTransactionProfit, decimal(totalRentalIncome)), decimal(totalHoldingCosts));
  const exactCash = subtractDecimal(exactAmountAfterSellingCosts, decimal(estimatedLoanPayout));
  const exactFixedCosts = addDecimal(addDecimal(addDecimal(addDecimal(exactPurchasePrice, exactPurchaseCosts), exactRenovations), exactOtherSellingCosts), exactSalePreparationCosts);
  const exact = {
    agentCommission: decimalText(exactAgentCommission),
    totalSellingCosts: decimalText(exactSellingCosts),
    fixedTransactionCosts: decimalText(exactFixedCosts),
    amountAfterSellingCosts: decimalText(exactAmountAfterSellingCosts),
    transactionProfit: decimalText(exactTransactionProfit),
    overallPreTaxPropertyResult: decimalText(exactOverallResult),
    estimatedCashAfterLoanPayout: decimalText(exactCash),
  };
  const totalSellingCosts = Number(exact.totalSellingCosts);
  const amountAfterSellingCosts = Number(exact.amountAfterSellingCosts);
  const transactionProfit = Number(exact.transactionProfit);
  const overallPreTaxPropertyResult = Number(exact.overallPreTaxPropertyResult);
  const estimatedCashAfterLoanPayout = Number(exact.estimatedCashAfterLoanPayout);
  const enteredFixedTransactionCosts = Number(exact.fixedTransactionCosts);
  const breakEvenSalePrice = hasTransactionErrors
    ? 0
    : requiredWholeDollarSalePrice(rawInput);
  const salePriceSensitivity: SalePriceSensitivityScenario[] =
    hasTransactionErrors
      ? []
      : ([-5, 0, 5] as const).map((changePercent) => {
          const scenarioSalePrice = percentageDecimal(exactSalePrice, decimal(100 + changePercent));
          const scenarioAgentCommission = percentageDecimal(scenarioSalePrice, decimal(nonNegative(rawInput.commissionRate)));
          const scenarioProfit = changePercent === 0
            ? exactTransactionProfit
            : subtractDecimal(subtractDecimal(scenarioSalePrice, scenarioAgentCommission), exactFixedCosts);

          return {
            changePercent,
            salePrice: decimalNumber(scenarioSalePrice),
            agentCommission: decimalNumber(scenarioAgentCommission),
            transactionProfit: decimalNumber(scenarioProfit),
            exact: { salePrice: decimalText(scenarioSalePrice), agentCommission: decimalText(scenarioAgentCommission), transactionProfit: decimalText(scenarioProfit) },
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
    exact,
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
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "completeValidEstimate",
    };
  }

  if (!Number.isFinite(targetProfit) || targetProfit < 0) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "targetZeroOrMore",
    };
  }

  if (targetProfit > MAX_MONEY_INPUT) {
    return {
      requiredSalePrice: null,
      differenceFromExpectedSalePrice: null,
      exactDifferenceFromExpectedSalePrice: null,
      validationError: "targetMaxTrillion",
    };
  }

  const requiredSalePrice = requiredWholeDollarSalePrice(
    rawInput,
    targetProfit,
  );

  const exactDifference = decimalText(subtractDecimal(decimal(requiredSalePrice), decimal(rawInput.salePrice)));
  return {
    requiredSalePrice,
    differenceFromExpectedSalePrice:
      Number(exactDifference),
    exactDifferenceFromExpectedSalePrice: exactDifference,
    validationError: null,
  };
}
