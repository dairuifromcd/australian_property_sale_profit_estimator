export const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export const calculationAud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Only whole-dollar BigInts reach this grouping formatter.
const wholeNumber = new Intl.NumberFormat("en-AU");

// This accepts the engine's exact decimal string explicitly. It does not cast
// that string to a Number or depend on newer Intl string-input behaviour.
export function exactAud(value: string, fractionDigits: 0 | 2 = 0): string {
  const negative = value.startsWith("-");
  const [whole, fraction = ""] = (negative ? value.slice(1) : value).split(".");
  const coefficient = BigInt(`${whole}${fraction}`);
  const denominator = BigInt(10) ** BigInt(fraction.length);
  const displayScale = BigInt(10) ** BigInt(fractionDigits);
  const rounded = (coefficient * displayScale + denominator / BigInt(2)) / denominator;
  const dollars = rounded / displayScale;
  const cents = (rounded % displayScale).toString().padStart(fractionDigits, "0");
  return `${negative ? "-" : ""}$${wholeNumber.format(dollars)}${fractionDigits === 2 ? `.${cents}` : ""}`;
}

export function exactTone(value: string): "gain" | "loss" {
  return value.startsWith("-") ? "loss" : "gain";
}

export function exactIsInteger(value: string): boolean {
  return !/\.\d*[1-9]/.test(value);
}
