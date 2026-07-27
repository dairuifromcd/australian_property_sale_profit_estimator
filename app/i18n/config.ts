import { enAU } from "./messages/en-AU";
import { ko } from "./messages/ko";
import type {
  CalculatorMessages,
  SiteMessages,
} from "./messages/types";
import { zhHans } from "./messages/zh-Hans";
import type { Locale } from "./routing";
export {
  isLocale,
  isLocalizedLocale,
  locales,
  localizedLocales,
  pathFor,
  type Locale,
  type LocalizedLocale,
  type SitePage,
} from "./routing";

const dictionaries: Record<Locale, SiteMessages> = {
  "en-AU": enAU,
  "zh-Hans": zhHans,
  ko,
};

export function getMessages(locale: Locale): SiteMessages {
  return dictionaries[locale];
}

export function getCalculatorMessages(locale: Locale): CalculatorMessages {
  const { common, home, form, results, validation } = dictionaries[locale];

  return { common, home, form, results, validation };
}

export const openGraphLocale: Record<Locale, string> = {
  "en-AU": "en_AU",
  "zh-Hans": "zh_CN",
  ko: "ko_KR",
};
