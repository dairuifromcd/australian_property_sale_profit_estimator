export function formatAmountInput(value: string): string {
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
  const normalizedWhole =
    wholePart.replace(/^0+(?=\d)/, "") ||
    (dotIndex === -1 ? "" : "0");
  const groupedWhole = normalizedWhole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!groupedWhole && isNegative) return "-";

  return `${isNegative ? "-" : ""}${groupedWhole}${
    dotIndex === -1 ? "" : `.${fractionPart}`
  }`;
}

export function numberFromInput(value: string): number {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
