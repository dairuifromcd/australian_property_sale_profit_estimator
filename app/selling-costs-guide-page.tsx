import { getMessages } from "./i18n/config";
import { guideSummary } from "./i18n/guide-summary";
import { guideMessages } from "./i18n/guide-messages";
import { pathFor, type Locale } from "./i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import "./styles/guide.css";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "./site-config";

export function SellingCostsGuide({ locale }: { locale: Locale }) {
  const content = guideMessages[locale];
  const { common } = getMessages(locale);
  return (
    <main className="selling-guide">
      <aside className="scope-banner" aria-label={common.scopeAria}>
        <strong>{common.scopeTitle}</strong>
        <span>{common.scopeDescription}</span>
        <LanguageSwitcher currentLocale={locale} page="guide" labels={common.languages}
          ariaLabel={common.languageNavigationAria} warning={common.languageChangeWarning} />
      </aside>
      <header className="site-header">
        <a className="brand" href={pathFor(locale, "home")}>{common.siteName}</a>
      </header>
      <article className="legal-page">
        <h1>{content.title}</h1>
        <p className="legal-intro">{content.intro}</p>
        <p><a className="guide-calculator-link" href={pathFor(locale, "home")}>{content.calculator}</a></p>
        <nav className="guide-contents" aria-label={guideSummary[locale].link}>
          <ul>{content.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul>
        </nav>
        {content.sections.map(section => (
          <section className="legal-section" id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        <div className="guide-method">
          <p>{content.updated}</p>
          <p>{content.maintainer}</p>
          <p>{content.corrections} <a href={SUPPORT_MAILTO}>{SUPPORT_EMAIL}</a></p>
        </div>
        <footer className="guide-footer">
          <a className="guide-calculator-link" href={pathFor(locale, "home")}>{content.calculator}</a>
          <a href={pathFor(locale, "privacy")}>{common.privacy}</a>
          <a href={pathFor(locale, "disclaimer")}>{common.importantInformation}</a>
        </footer>
      </article>
    </main>
  );
}
