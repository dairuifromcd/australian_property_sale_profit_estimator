import type { enAU } from "./en-AU";

type DictionaryShape<Value> = Value extends string
  ? string
  : Value extends readonly unknown[]
    ? { readonly [Key in keyof Value]: DictionaryShape<Value[Key]> }
    : Value extends object
      ? { readonly [Key in keyof Value]: DictionaryShape<Value[Key]> }
      : Value;

export type SiteMessages = DictionaryShape<typeof enAU>;
export type CalculatorMessages = Pick<
  SiteMessages,
  "common" | "home" | "form" | "results" | "validation"
>;
