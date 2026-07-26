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
  const dotIndex = numeric.indexOf(".");
  const wholePart = dotIndex === -1 ? numeric : numeric.slice(0, dotIndex);
  const fractionPart =
    dotIndex === -1
      ? ""
      : numeric
          .slice(dotIndex + 1)
          .replace(/\./g, "")
          .slice(0, 2);

  return {
    isNegative,
    wholePart,
    fractionPart,
    hasDecimalPoint: dotIndex !== -1,
  };
}

export function normaliseAmountInputDraft(value: string): string {
  const { isNegative, wholePart, fractionPart, hasDecimalPoint } =
    amountParts(value);

  if (!wholePart && !hasDecimalPoint) {
    return isNegative ? "-" : "";
  }

  return `${isNegative ? "-" : ""}${wholePart}${
    hasDecimalPoint ? `.${fractionPart}` : ""
  }`;
}

export function formatAmountInput(value: string): string {
  const { isNegative, wholePart, fractionPart, hasDecimalPoint } =
    amountParts(value);
  const normalizedWhole =
    wholePart.replace(/^0+(?=\d)/, "") ||
    (hasDecimalPoint ? "0" : "");
  const groupedWhole = normalizedWhole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!groupedWhole && isNegative) return "-";

  return `${isNegative ? "-" : ""}${groupedWhole}${
    hasDecimalPoint ? `.${fractionPart}` : ""
  }`;
}

export function numberFromInput(value: string): number {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
