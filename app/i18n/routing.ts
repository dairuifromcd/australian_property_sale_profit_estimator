export const locales = ["en-AU", "zh-Hans", "ko"] as const;
export type Locale = (typeof locales)[number];
export const localizedLocales = ["zh-Hans", "ko"] as const;
export type LocalizedLocale = (typeof localizedLocales)[number];
export type SitePage = "home" | "privacy" | "disclaimer";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function isLocalizedLocale(value: string): value is LocalizedLocale {
  return localizedLocales.some((locale) => locale === value);
}

export function pathFor(locale: Locale, page: SitePage): string {
  const suffix =
    page === "home" ? "" : page === "privacy" ? "/privacy" : "/disclaimer";

  return locale === "en-AU" ? suffix || "/" : `/${locale}${suffix}`;
}
