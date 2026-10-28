import { commissionMessages } from "./i18n/commission-messages";
import { pathFor, type Locale } from "./i18n/routing";

export function CommissionLink({ locale }: { locale: Locale }) {
  const content = commissionMessages[locale];
  return <a href={pathFor(locale, "commission")} target="_blank" rel="noopener noreferrer">{content.link} {content.newTab}</a>;
}
