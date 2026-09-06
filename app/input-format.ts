type AmountParts = {
  isNegative: boolean;
  wholePart: string;
  fractionPart: string;
  hasDecimalPoint: boolean;
};

function amountParts(value: string): AmountParts {
  const trimmed = value.trimStart();
  const isNegative = trimmed.startsWith("-");
  const numeric = value.replace(/[^\d.]/g, "");
  const [wholePart, ...fractionParts] = numeric.split(".");
  const fractionPart = fractionParts.join("").slice(0, 2);

  return {
    isNegative,
    wholePart,
    fractionPart,
    hasDecimalPoint: fractionParts.length > 0,
  };
}

export function normaliseAmountInputDraft(value: string): string {
  const { isNegative, wholePart, fractionPart, hasDecimalPoint } =
    amountParts(value);

  return `${isNegative ? "-" : ""}${wholePart}${
    hasDecimalPoint ? `.${fractionPart}` : ""
  }`;
}

export function formatAmountInput(value: string): string {
  const { isNegative, wholePart, fractionPart, hasDecimalPoint } =
    amountParts(value);
  const normalizedWhole =
    wholePart.replace(/^0+(?=\d)/, "") ||
    (fractionPart ? "0" : "");
  const groupedWhole = normalizedWhole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${isNegative ? "-" : ""}${groupedWhole}${
    hasDecimalPoint ? `.${fractionPart}` : ""
  }`;
}

export function numberFromInput(value: string): number {
  const parsed = numberFromInputForValidation(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Empty optional fields mean omitted/zero. Nonblank unfinished drafts must
// reach model validation as NaN, rather than silently becoming explicit zero.
export function numberFromInputForValidation(value: string): number {
  return Number(value.replace(/,/g, ""));
}
