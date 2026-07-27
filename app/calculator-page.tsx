"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CalculatorForm } from "./calculator-ui/calculator-form";
import { ResultsPanel } from "./calculator-ui/results-panel";
import { useCalculatorForm } from "./calculator-ui/use-calculator-form";
import { LanguageSwitcher } from "./language-switcher";
import { pathFor, type Locale } from "./i18n/routing";
import type { CalculatorMessages } from "./i18n/messages/types";

export default function CalculatorPage({
  locale,
  messages,
}: {
  locale: Locale;
  messages: CalculatorMessages;
}) {
  const controller = useCalculatorForm(messages.validation);

  useEffect(() => {
    document.documentElement.dataset.clientReady = "true";

    return () => {
      delete document.documentElement.dataset.clientReady;
    };
  }, []);

  return (
    <main>
      <aside className="scope-banner" aria-label={messages.common.scopeAria}>
        <strong>{messages.common.scopeTitle}</strong>
        <span>{messages.common.scopeDescription}</span>
        <Link href={pathFor(locale, "disclaimer")}>
          {messages.common.readImportantInformation}
        </Link>
        <LanguageSwitcher
          currentLocale={locale}
          page="home"
          labels={messages.common.languages}
          ariaLabel={messages.common.languageNavigationAria}
          warning={messages.common.languageChangeWarning}
          hasUnsavedData={controller.hasAnyInput}
        />
      </aside>

      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label={messages.common.homeAria}
        >
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>{messages.common.siteName}</span>
        </a>
        <nav
          className="header-nav"
          aria-label={messages.common.legalNavigationAria}
        >
          <Link
            className="header-link"
            href={pathFor(locale, "privacy")}
          >
            {messages.common.privacy}
          </Link>
          <Link
            className="header-link"
            href={pathFor(locale, "disclaimer")}
          >
            {messages.common.importantInformation}
          </Link>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">{messages.home.eyebrow}</div>
        <h1>{messages.home.title}</h1>
        <p className="hero-copy">{messages.home.intro}</p>
        <div
          className="trust-line"
          aria-label={messages.home.privacyBenefitsAria}
        >
          <span>{messages.home.privateByDesign}</span>
          <span>{messages.home.noSignUp}</span>
          <span>{messages.home.calculationsStay}</span>
        </div>
      </section>

      <section className="calculator-shell" aria-labelledby="calculator-title">
        <CalculatorForm controller={controller} messages={messages.form} />
        <ResultsPanel controller={controller} messages={messages} />
      </section>

      <section className="explanation" aria-labelledby="what-counts-title">
        <div>
          <span className="step-label">{messages.home.explanationLabel}</span>
          <h2 id="what-counts-title">{messages.home.explanationTitle}</h2>
        </div>
        <div className="explanation-grid">
          {messages.home.explanationCards.map((card, index) => (
            <article key={card.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer id="privacy">
        <div>
          <strong>{messages.home.privateByDesign}</strong>
          <p>{messages.home.footerPrivacyBody}</p>
        </div>
        <div>
          <strong>{messages.home.limitationsTitle}</strong>
          <p>{messages.home.limitationsBody}</p>
        </div>
        <div className="footer-meta">
          <span>
            {messages.home.independence}
          </span>
          <span className="footer-links">
            <Link href={pathFor(locale, "privacy")}>
              {messages.common.privacy}
            </Link>
            <Link href={pathFor(locale, "disclaimer")}>
              {messages.common.disclaimer}
            </Link>
          </span>
        </div>
      </footer>
    </main>
  );
}
