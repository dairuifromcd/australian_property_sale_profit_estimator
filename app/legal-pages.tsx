import Link from "next/link";
import type { SiteMessages } from "./i18n/messages/types";
import { pathFor, type Locale, type SitePage } from "./i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "./site-config";

function LegalHeader({
  locale,
  messages,
  page,
}: {
  locale: Locale;
  messages: SiteMessages;
  page: SitePage;
}) {
  const otherPage = page === "privacy" ? "disclaimer" : "privacy";
  const otherLabel =
    otherPage === "privacy"
      ? messages.common.privacy
      : messages.common.importantInformation;

  return (
    <>
      <aside className="scope-banner" aria-label={messages.common.scopeAria}>
        <strong>{messages.common.scopeTitle}</strong>
        <span>{messages.common.scopeDescription}</span>
        <LanguageSwitcher
          currentLocale={locale}
          page={page}
          labels={messages.common.languages}
          ariaLabel={messages.common.languageNavigationAria}
          warning={messages.common.languageChangeWarning}
        />
      </aside>
      <header className="site-header">
        <Link
          className="brand"
          href={pathFor(locale, "home")}
          aria-label={messages.common.homeAria}
        >
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>{messages.common.siteName}</span>
        </Link>
        <nav
          className="header-nav"
          aria-label={messages.common.legalNavigationAria}
        >
          <Link className="header-link" href={pathFor(locale, otherPage)}>
            {otherLabel}
          </Link>
        </nav>
      </header>
    </>
  );
}

export function PrivacyPageContent({
  locale,
  messages,
}: {
  locale: Locale;
  messages: SiteMessages;
}) {
  const content = messages.privacy;

  return (
    <main>
      <LegalHeader locale={locale} messages={messages} page="privacy" />
      <article className="legal-page">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="legal-intro">{content.intro}</p>

        <section className="legal-section">
          <h2>{content.entriesTitle}</h2>
          <p>{content.entriesBody}</p>
        </section>

        <section className="legal-section">
          <h2>{content.technicalTitle}</h2>
          <p>{content.technicalBody}</p>
          <p>
            {content.cloudflareBefore}{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noreferrer"
            >
              {content.cloudflareLink}
            </a>
            {content.cloudflareAfter}
          </p>
        </section>

        <section className="legal-section">
          <h2>{content.accountsTitle}</h2>
          <p>{content.accountsBody}</p>
        </section>

        <section className="legal-section">
          <h2>{content.externalTitle}</h2>
          <p>{content.externalBody}</p>
        </section>

        <section className="legal-section">
          <h2>{content.questionsTitle}</h2>
          <p>
            {content.questionsBefore}{" "}
            <a href={SUPPORT_MAILTO}>{SUPPORT_EMAIL}</a>
            {content.questionsAfter}
          </p>
        </section>

        <p className="legal-updated">{content.updated}</p>
      </article>
    </main>
  );
}

export function DisclaimerPageContent({
  locale,
  messages,
}: {
  locale: Locale;
  messages: SiteMessages;
}) {
  const content = messages.disclaimer;

  return (
    <main>
      <LegalHeader locale={locale} messages={messages} page="disclaimer" />
      <article className="legal-page">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p className="legal-intro">{content.intro}</p>

        <section className="legal-section">
          <h2>{content.adviceTitle}</h2>
          <p>{content.adviceBody}</p>
        </section>

        <section className="legal-section">
          <h2>{content.limitationsTitle}</h2>
          <ul>
            {content.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </section>

        <section className="legal-section">
          <h2>{content.affiliationTitle}</h2>
          <p>{content.affiliationBody}</p>
        </section>

        <section className="legal-section">
          <h2>{content.checkTitle}</h2>
          <p>{content.checkBody}</p>
        </section>

        <p className="legal-updated">{content.updated}</p>
      </article>
    </main>
  );
}
