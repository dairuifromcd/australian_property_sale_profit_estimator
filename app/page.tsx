"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { calculateEstimate, type CalculatorInput } from "./calculator";
import { formatAmountInput, numberFromInput } from "./input-format";

type InputState = {
  salePrice: string;
  purchasePrice: string;
  commissionRate: string;
  otherSellingCosts: string;
  salePreparationCosts: string;
  purchaseCosts: string;
  renovationsAndImprovements: string;
};

const INITIAL_INPUTS: InputState = {
  salePrice: "",
  purchasePrice: "",
  commissionRate: "",
  otherSellingCosts: "",
  salePreparationCosts: "",
  purchaseCosts: "",
  renovationsAndImprovements: "",
};

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

function numberFrom(value: string): number {
  return numberFromInput(value);
}

function AmountField({
  id,
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  help?: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {required ? <span className="required">Required</span> : null}
      </span>
      <span className={`money-input ${error ? "field-control-error" : ""}`}>
        <span aria-hidden="true">$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(formatAmountInput(event.target.value))}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
        />
        <span className="currency" aria-hidden="true">
          AUD
        </span>
      </span>
      {help ? (
        <span className="field-help" id={helpId}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function PercentageField({
  id,
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  max = 100,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  help?: string;
  error?: string;
  max?: number;
  required?: boolean;
}) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {required ? <span className="required">Required</span> : null}
      </span>
      <span className={`percent-input ${error ? "field-control-error" : ""}`}>
        <input
          id={id}
          type="number"
          min="0"
          max={max}
          step="0.1"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
        />
        <span aria-hidden="true">%</span>
      </span>
      {help ? (
        <span className="field-help" id={helpId}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ResultRow({
  label,
  value,
  subtract = false,
}: {
  label: string;
  value: number;
  subtract?: boolean;
}) {
  return (
    <div className="result-row">
      <span>{label}</span>
      <strong>
        {subtract && value > 0 ? "−" : ""}
        {aud.format(value)}
      </strong>
    </div>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<InputState>(INITIAL_INPUTS);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    document.documentElement.dataset.clientReady = "true";

    return () => {
      delete document.documentElement.dataset.clientReady;
    };
  }, []);

  const update = <Key extends keyof InputState>(
    key: Key,
    value: InputState[Key],
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  const resetCalculator = () => {
    setInputs(INITIAL_INPUTS);
    detailsRef.current?.removeAttribute("open");
  };

  const result = useMemo(
    () =>
      calculateEstimate({
        ...inputs,
        salePrice: numberFrom(inputs.salePrice),
        purchasePrice: numberFrom(inputs.purchasePrice),
        commissionRate: numberFrom(inputs.commissionRate),
        otherSellingCosts: numberFrom(inputs.otherSellingCosts),
        salePreparationCosts: numberFrom(inputs.salePreparationCosts),
        purchaseCosts: numberFrom(inputs.purchaseCosts),
        renovationsAndImprovements: numberFrom(
          inputs.renovationsAndImprovements,
        ),
      }),
    [inputs],
  );

  const estimateLevel = result.hasAdjustedInputs
    ? "Adjusted estimate"
    : "Quick estimate";
  const profitTone = result.transactionProfit < 0 ? "loss" : "gain";
  const errorFor = (field: keyof CalculatorInput) => {
    const rawValue = inputs[field];
    if (rawValue === "") return undefined;

    const validationError = result.validationErrors.find(
      (error) => error.field === field,
    )?.message;
    return validationError;
  };
  const hasAllQuickInputs =
    inputs.salePrice !== "" &&
    inputs.purchasePrice !== "" &&
    inputs.commissionRate !== "" &&
    inputs.otherSellingCosts !== "";
  const hasQuickInputErrors = result.hasCalculationErrors;
  const canShowEstimate =
    hasAllQuickInputs && !hasQuickInputErrors;

  return (
    <main>
      <aside className="scope-banner" aria-label="Estimate scope notice">
        <strong>Indicative estimate</strong>
        <span>
          Based only on the costs you enter. Excludes holding costs, debt and
          tax.
        </span>
        <Link href="/disclaimer">Read important information</Link>
      </aside>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Property Sale Profit home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Property Sale Profit</span>
        </a>
        <nav className="header-nav" aria-label="Privacy and legal information">
          <Link className="header-link" href="/privacy">
            Privacy
          </Link>
          <Link className="header-link" href="/disclaimer">
            Important information
          </Link>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">Australian property sale calculator</div>
        <h1>Estimate your sale proceeds and transaction result.</h1>
        <p className="hero-copy">
          Start with four numbers. See your estimated sale proceeds and
          transaction profit before holding costs, debt and tax, then add detail
          only when you need it.
        </p>
        <div className="trust-line" aria-label="Privacy benefits">
          <span>Private by design</span>
          <span>No sign-up</span>
          <span>Calculations stay on this device</span>
        </div>
      </section>

      <section className="calculator-shell" aria-labelledby="calculator-title">
        <div className="form-panel">
          <div className="section-heading">
            <div>
              <span className="step-label">01 · Quick estimate</span>
              <h2 id="calculator-title">Start with four numbers</h2>
            </div>
            <button
              className="text-button no-print"
              type="button"
              onClick={resetCalculator}
            >
              Reset
            </button>
          </div>

          <div className="field-grid">
            <AmountField
              id="sale-price"
              label="Expected sale price"
              value={inputs.salePrice}
              onChange={(value) => update("salePrice", value)}
              placeholder="1,050,000"
              error={errorFor("salePrice")}
              required
              help={
                <>
                  Need a reference? Check{" "}
                  <a
                    href="https://www.realestate.com.au/property/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    realestate.com.au
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://www.domain.com.au/property-profile/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Domain
                  </a>
                  .
                </>
              }
            />
            <AmountField
              id="purchase-price"
              label="Original purchase price"
              value={inputs.purchasePrice}
              onChange={(value) => update("purchasePrice", value)}
              placeholder="650,000"
              error={errorFor("purchasePrice")}
              required
            />
            <PercentageField
              id="commission-rate"
              label="Agent commission"
              value={inputs.commissionRate}
              onChange={(value) => update("commissionRate", value)}
              placeholder="2.2"
              max={99.9}
              error={errorFor("commissionRate")}
              help="Use the GST-inclusive rate from your agent quote. Enter 0 only if no commission applies."
              required
            />
            <AmountField
              id="other-selling-costs"
              label="Other selling costs"
              value={inputs.otherSellingCosts}
              onChange={(value) => update("otherSellingCosts", value)}
              placeholder="8,500"
              error={errorFor("otherSellingCosts")}
              help="Advertising, conveyancing, legal and other selling costs. Enter 0 if none apply."
              required
            />
          </div>

          <details className="details-block" ref={detailsRef}>
            <summary>
              <span>
                <strong>Improve this estimate</strong>
                <small>Add sale preparation, buying costs and improvements</small>
              </span>
              <span className="summary-action">
                <span className="summary-action-closed">Add details</span>
                <span className="summary-action-open">Hide details</span>
              </span>
            </summary>
            <div className="details-content field-grid">
              <AmountField
                id="sale-preparation-costs"
                label="Sale preparation costs"
                value={inputs.salePreparationCosts}
                onChange={(value) => update("salePreparationCosts", value)}
                placeholder="4,000"
                error={errorFor("salePreparationCosts")}
                help="Styling, cleaning, repairs and other preparation costs entered for this sale."
              />
              <AmountField
                id="purchase-costs"
                label="Purchase costs"
                value={inputs.purchaseCosts}
                onChange={(value) => update("purchaseCosts", value)}
                placeholder="32,000"
                error={errorFor("purchaseCosts")}
                help="Stamp duty, conveyancing and other purchase costs you want included."
              />
              <AmountField
                id="renovations-and-improvements"
                label="Renovations and improvements"
                value={inputs.renovationsAndImprovements}
                onChange={(value) =>
                  update("renovationsAndImprovements", value)
                }
                placeholder="25,000"
                error={errorFor("renovationsAndImprovements")}
                help="The renovation and improvement spending you want included in this transaction estimate."
              />
            </div>
          </details>
        </div>

        <aside className="results-panel" aria-live="polite" aria-atomic="true">
          <div className="result-topline">
            <span className="estimate-level">{estimateLevel}</span>
            <span className="result-privacy">On-device</span>
          </div>

          {!hasAllQuickInputs ? (
            <div className="empty-result">
              <span className="empty-number">$—</span>
              <h2>Complete the four quick inputs</h2>
              <p>
                Enter 0 if commission or other selling costs do not apply.
              </p>
            </div>
          ) : hasQuickInputErrors ? (
            <div className="empty-result invalid-result">
              <span className="empty-number">!</span>
              <h2>Check the highlighted fields</h2>
              <p>Fix the entered values before using this estimate.</p>
            </div>
          ) : (
            <>
              <div className={`primary-result ${profitTone}`}>
                <div className="primary-result-heading">
                  <span>
                    {profitTone === "loss"
                      ? "Whole-property transaction loss"
                      : "Whole-property transaction profit"}
                  </span>
                  <span className={`outcome-status ${profitTone}`}>
                    {profitTone === "loss" ? "LOSS" : "PROFIT"}
                  </span>
                </div>
                <strong>{aud.format(result.transactionProfit)}</strong>
                <small>
                  Before holding costs, debt and tax. Based only on the amounts
                  entered here.
                </small>
              </div>

              <div className="result-breakdown">
                <ResultRow
                  label="Expected sale price"
                  value={numberFrom(inputs.salePrice)}
                />
                <ResultRow
                  label="Agent commission"
                  value={result.agentCommission}
                  subtract
                />
                <ResultRow
                  label="Other selling costs"
                  value={numberFrom(inputs.otherSellingCosts)}
                  subtract
                />
                {numberFrom(inputs.salePreparationCosts) > 0 ? (
                  <ResultRow
                    label="Sale preparation costs"
                    value={numberFrom(inputs.salePreparationCosts)}
                    subtract
                  />
                ) : null}
                <div className="result-divider" />
                <ResultRow
                  label="Sale proceeds after selling costs"
                  value={result.netSaleProceeds}
                />
                <ResultRow
                  label="Purchase price"
                  value={numberFrom(inputs.purchasePrice)}
                  subtract
                />
                {result.hasAdjustedInputs ? (
                  <ResultRow
                    label="Purchase costs & improvements"
                    value={
                      numberFrom(inputs.purchaseCosts) +
                      numberFrom(inputs.renovationsAndImprovements)
                    }
                    subtract
                  />
                ) : null}
              </div>

              <div className="secondary-metric">
                <span>Break-even sale price for entered transaction costs</span>
                <strong>{aud.format(result.breakEvenSalePrice)}</strong>
              </div>
            </>
          )}

          <button
            className="print-button no-print"
            type="button"
            onClick={() => window.print()}
            disabled={!canShowEstimate}
          >
            Print or save as PDF
          </button>
          <p className="result-note">
            Indicative transaction estimate only. It is not settlement cash,
            accounting profit or a tax calculation. Confirm important figures
            with qualified professionals before making a decision.
          </p>
        </aside>
      </section>

      <section className="explanation" aria-labelledby="what-counts-title">
        <div>
          <span className="step-label">What this helps answer</span>
          <h2 id="what-counts-title">A clearer view than sale price minus purchase price.</h2>
        </div>
        <div className="explanation-grid">
          <article>
            <span>01</span>
            <h3>Sale proceeds</h3>
            <p>What remains after the selling costs you enter, before debt and tax.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Transaction profit or loss</h3>
            <p>
              Sale proceeds less purchase price, buying costs, renovations and
              improvements—before holding costs, debt and tax.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Entered-cost break-even</h3>
            <p>
              The sale price needed to cover the transaction costs you enter,
              before holding costs, debt and tax.
            </p>
          </article>
        </div>
      </section>

      <footer id="privacy">
        <div>
          <strong>Private by design</strong>
          <p>
            Your figures are calculated in this browser and are not sent to or
            saved by this application. Cloudflare may process ordinary request
            metadata needed to deliver and protect the site.
          </p>
        </div>
        <div>
          <strong>Important limitations</strong>
          <p>
            This tool does not calculate settlement cash, holding-period
            returns, capital gains tax, income tax or after-tax profit. Confirm
            actual costs, debt and tax treatment separately.
          </p>
        </div>
        <div className="footer-meta">
          <span>
            Independent calculator · Not affiliated with or endorsed by the ATO
            or another government agency
          </span>
          <span className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </span>
        </div>
      </footer>
    </main>
  );
}
