import { guideSummary } from "./i18n/guide-summary";
import { pathFor, type Locale } from "./i18n/routing";

export function GuideLink({ locale }: { locale: Locale }) {
  const content = guideSummary[locale];
  return (
    <a className="no-print" href={pathFor(locale, "guide")} target="_blank" rel="noopener noreferrer">
      {content.link} {content.newTab}
    </a>
  );
}
