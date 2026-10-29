"use client";

import { useEffect, useState } from "react";
import { calculateAgentCommission, type CommissionInput } from "./calculator";
import { AmountField, PercentageField } from "./calculator-ui/fields";
import { calculationAud, exactAud } from "./calculator-ui/format";
import { getMessages } from "./i18n/config";
import { commissionMessages } from "./i18n/commission-messages";
import { interpolate } from "./i18n/interpolate";
import { pathFor, type Locale } from "./i18n/routing";
import { numberFromInputForValidation, numberFromMoneyInputForValidation } from "./input-format";
import { LanguageSwitcher } from "./language-switcher";
import "./styles/commission.css";

export default function CommissionCalculatorPage({ locale }: { locale: Locale }) {
  const content = commissionMessages[locale];
  const { common, form, validation } = getMessages(locale);
  const [salePrice, setSalePrice] = useState("");
  const [rate, setRate] = useState("");
  const input: CommissionInput = {
    salePrice: numberFromMoneyInputForValidation(salePrice),
    commissionRate: rate.trim() === "" ? Number.NaN : numberFromInputForValidation(rate),
  };
  const result = calculateAgentCommission(input);
  const hasBothInputs = salePrice.trim() !== "" && rate.trim() !== "";
  const canShowCommission = hasBothInputs && result.commission !== null;
  const hasAnyInput = salePrice !== "" || rate !== "";
  const errorFor = (field: keyof CommissionInput, value: string) => {
    if (!value) return undefined;
    const code = result.validationErrors.find(error => error.field === field)?.code;
    return code ? validation[code] : undefined;
  };

  useEffect(() => {
    document.documentElement.dataset.clientReady = "true";
    return () => { delete document.documentElement.dataset.clientReady; };
  }, []);

  return (
    <main className="commission-page">
      <aside className="scope-banner" aria-label={common.scopeAria}>
        <strong>{common.scopeTitle}</strong>
        <span>{common.scopeDescription}</span>
        <LanguageSwitcher currentLocale={locale} page="commission" labels={common.languages}
          ariaLabel={common.languageNavigationAria} warning={common.languageChangeWarning}
          hasUnsavedData={hasAnyInput} />
      </aside>
      <header className="site-header">
        <a className="brand" href={pathFor(locale, "home")}>{common.siteName}</a>
        <nav className="header-nav" aria-label={common.legalNavigationAria}>
          <a className="header-link" href={pathFor(locale, "privacy")}>{common.privacy}</a>
          <a className="header-link" href={pathFor(locale, "disclaimer")}>{common.importantInformation}</a>
        </nav>
      </header>
      <section className="hero" id="top">
        <h1>{content.title}</h1>
        <p className="hero-copy">{content.intro}</p>
      </section>
      <section className="calculator-shell commission-shell" aria-labelledby="commission-form-title">
        <div className="form-panel calculator-inputs">
          <h2 id="commission-form-title">{content.formTitle}</h2>
          <p className="section-intro">{content.formIntro}</p>
          <div className="field-grid">
            <AmountField id="commission-sale-price" label={content.salePrice} help={content.salePriceHelp}
              value={salePrice} onChange={setSalePrice} placeholder={content.salePricePlaceholder}
              required requiredLabel={form.required} error={errorFor("salePrice", salePrice)} />
            <PercentageField id="standalone-commission-rate" label={content.rate} help={content.rateHelp}
              value={rate} onChange={setRate} placeholder={content.ratePlaceholder}
              required requiredLabel={form.required} max={99.9} step="any" error={errorFor("commissionRate", rate)} />
          </div>
          <button className="text-button commission-reset" type="button" onClick={() => { setSalePrice(""); setRate(""); }}>{form.reset}</button>
        </div>
        <section className="form-panel commission-result" aria-labelledby="commission-result-title">
          <h2 id="commission-result-title">{content.resultTitle}</h2>
          <div aria-live="polite" aria-atomic="true">
            {canShowCommission ? (
              <>
                <p className="commission-amount" data-testid="commission-amount">{exactAud(result.exactCommission!, 2)}</p>
                <h3>{content.formulaTitle}</h3>
                <p className="commission-equation" data-testid="commission-equation">{interpolate(content.formula, {
                  salePrice: calculationAud.format(input.salePrice),
                  rate: String(input.commissionRate),
                  commission: exactAud(result.exactCommission!, 2),
                })}</p>
                <p>{content.rounding}</p>
              </>
            ) : <p className="commission-empty">{hasBothInputs ? content.invalid : content.empty}</p>}
          </div>
          <p>{content.resultScope}</p>
        </section>
      </section>
      <article className="commission-explanation">
        <section><h2>{content.methodTitle}</h2><p>{content.method}</p></section>
        <section><h2>{content.exampleTitle}</h2><p>{content.example}</p></section>
        <section><h2>{content.exclusionsTitle}</h2><p>{content.exclusions}</p></section>
        <section>
          <h2>{content.nextTitle}</h2><p>{content.nextBody}</p>
          <p className="commission-links">
            <a href={pathFor(locale, "home")} target="_blank" rel="noopener noreferrer">{content.calculator} {content.newTab}</a>
            <a href={pathFor(locale, "guide")} target="_blank" rel="noopener noreferrer">{content.guide} {content.newTab}</a>
          </p>
        </section>
        <p>{content.privacy}</p>
        <p className="commission-updated">{content.updated}</p>
      </article>
    </main>
  );
}
