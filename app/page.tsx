"use client";

import { useMemo, useState } from "react";
import {
  calculateEstimate,
  type CalculatorInput,
  type PropertyUse,
} from "./calculator";

type InputState = Omit<
  CalculatorInput,
  | "salePrice"
  | "purchasePrice"
  | "commissionRate"
  | "otherSellingCosts"
  | "salePreparationCosts"
  | "purchaseCosts"
  | "capitalImprovements"
  | "ownershipShare"
  | "marginalTaxRate"
  | "mixedTaxablePercentage"
  | "capitalWorksDeductions"
  | "atoCostBaseOverride"
> & {
  salePrice: string;
  purchasePrice: string;
  commissionRate: string;
  otherSellingCosts: string;
  salePreparationCosts: string;
  purchaseCosts: string;
  capitalImprovements: string;
  ownershipShare: string;
  marginalTaxRate: string;
  mixedTaxablePercentage: string;
  capitalWorksDeductions: string;
  atoCostBaseOverride: string;
};

const INITIAL_INPUTS: InputState = {
  salePrice: "",
  purchasePrice: "",
  commissionRate: "",
  otherSellingCosts: "",
  salePreparationCosts: "",
  purchaseCosts: "",
  capitalImprovements: "",
  estimateTax: false,
  propertyUse: "main-residence",
  mainResidenceExemptionConfirmed: false,
  purchaseDate: "",
  saleDate: "",
  ownershipShare: "100",
  marginalTaxRate: "",
  mixedTaxablePercentage: "",
  capitalWorksDeductions: "",
  atoCostBaseOverride: "",
};

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

function numberFrom(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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
          type="number"
          min="0"
          step="100"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
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

  const update = <Key extends keyof InputState>(
    key: Key,
    value: InputState[Key],
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
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
        capitalImprovements: numberFrom(inputs.capitalImprovements),
        ownershipShare: numberFrom(inputs.ownershipShare),
        marginalTaxRate: numberFrom(inputs.marginalTaxRate),
        mixedTaxablePercentage: numberFrom(inputs.mixedTaxablePercentage),
        capitalWorksDeductions: numberFrom(inputs.capitalWorksDeductions),
        atoCostBaseOverride: numberFrom(inputs.atoCostBaseOverride),
      }),
    [inputs],
  );

  const estimateLevel = inputs.estimateTax
    ? "Tax scenario"
    : result.hasAdjustedInputs
      ? "Adjusted estimate"
      : "Quick estimate";
  const profitTone = result.preTaxPropertyProfit < 0 ? "loss" : "gain";
  const errorFor = (field: keyof CalculatorInput) => {
    const validationError = result.validationErrors.find(
      (error) => error.field === field,
    )?.message;
    if (validationError) return validationError;

    if (
      (field === "salePrice" &&
        inputs.salePrice !== "" &&
        numberFrom(inputs.salePrice) <= 0) ||
      (field === "purchasePrice" &&
        inputs.purchasePrice !== "" &&
        numberFrom(inputs.purchasePrice) <= 0)
    ) {
      return "Enter an amount greater than zero.";
    }

    return undefined;
  };
  const hasAllQuickInputs =
    inputs.salePrice !== "" &&
    inputs.purchasePrice !== "" &&
    inputs.commissionRate !== "" &&
    inputs.otherSellingCosts !== "";
  const hasQuickInputErrors =
    result.hasCalculationErrors ||
    (hasAllQuickInputs && !result.hasCoreInputs);
  const canShowEstimate =
    hasAllQuickInputs && !hasQuickInputErrors;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SaleProfit AU home">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>SaleProfit AU</span>
        </a>
        <a className="header-link" href="#privacy">
          How your data is handled
        </a>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">Australian property sale calculator</div>
        <h1>Know what you could really make when you sell.</h1>
        <p className="hero-copy">
          Start with four numbers. See your estimated sale proceeds and
          pre-tax profit, then add detail only when you need it.
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
              onClick={() => setInputs(INITIAL_INPUTS)}
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
              label="Eligible selling costs"
              value={inputs.otherSellingCosts}
              onChange={(value) => update("otherSellingCosts", value)}
              placeholder="8,500"
              error={errorFor("otherSellingCosts")}
              help="Advertising, conveyancing, legal and other sale costs you expect to include in the CGT cost base. Enter 0 if none apply."
              required
            />
          </div>

          <details className="details-block">
            <summary>
              <span>
                <strong>Improve this estimate</strong>
                <small>Add sale preparation, buying costs and improvements</small>
              </span>
              <span className="summary-action">Add detail</span>
            </summary>
            <div className="details-content field-grid">
              <AmountField
                id="sale-preparation-costs"
                label="Sale preparation costs"
                value={inputs.salePreparationCosts}
                onChange={(value) => update("salePreparationCosts", value)}
                placeholder="4,000"
                error={errorFor("salePreparationCosts")}
                help="Styling, cleaning and non-capital repairs. Included in cash profit, not the derived CGT cost base."
              />
              <AmountField
                id="purchase-costs"
                label="Purchase costs"
                value={inputs.purchaseCosts}
                onChange={(value) => update("purchaseCosts", value)}
                placeholder="32,000"
                error={errorFor("purchaseCosts")}
                help="Stamp duty, conveyancing and eligible acquisition costs."
              />
              <AmountField
                id="capital-improvements"
                label="Capital improvements"
                value={inputs.capitalImprovements}
                onChange={(value) => update("capitalImprovements", value)}
                placeholder="25,000"
                error={errorFor("capitalImprovements")}
                help="Renovations or improvements, excluding routine repairs."
              />
            </div>
          </details>

          <details className="details-block tax-block">
            <summary>
              <span>
                <strong>Estimate tax on the capital gain</strong>
                <small>Optional scenario for Australian resident individuals</small>
              </span>
              <span className="summary-action">Tax scenario</span>
            </summary>
            <div className="details-content">
              <label className="check-row" htmlFor="estimate-tax">
                <input
                  id="estimate-tax"
                  type="checkbox"
                  checked={inputs.estimateTax}
                  onChange={(event) =>
                    update("estimateTax", event.target.checked)
                  }
                />
                <span>
                  <strong>Include an indicative CGT estimate</strong>
                  <small>
                    This is a simplified scenario, not personal tax advice.
                  </small>
                </span>
              </label>

              {inputs.estimateTax ? (
                <div className="tax-fields">
                  <label className="field field-wide" htmlFor="property-use">
                    <span className="field-label">Property use</span>
                    <select
                      id="property-use"
                      value={inputs.propertyUse}
                      onChange={(event) => {
                        const propertyUse = event.target.value as PropertyUse;
                        setInputs((current) => ({
                          ...current,
                          propertyUse,
                          mainResidenceExemptionConfirmed: false,
                        }));
                      }}
                    >
                      <option value="main-residence">
                        Main residence — check full exemption
                      </option>
                      <option value="investment">Investment property</option>
                      <option value="mixed">Mixed use / partial exemption</option>
                    </select>
                  </label>

                  <div className="field-grid">
                    <label className="field" htmlFor="purchase-date">
                      <span className="field-label">Purchase contract date</span>
                      <input
                        id="purchase-date"
                        type="date"
                        value={inputs.purchaseDate}
                        aria-describedby={
                          errorFor("purchaseDate")
                            ? "purchase-date-error"
                            : undefined
                        }
                        aria-invalid={
                          errorFor("purchaseDate") ? true : undefined
                        }
                        onChange={(event) =>
                          update("purchaseDate", event.target.value)
                        }
                      />
                      {errorFor("purchaseDate") ? (
                        <span className="field-error" id="purchase-date-error">
                          {errorFor("purchaseDate")}
                        </span>
                      ) : null}
                    </label>
                    <label className="field" htmlFor="sale-date">
                      <span className="field-label">Expected sale contract date</span>
                      <input
                        id="sale-date"
                        type="date"
                        value={inputs.saleDate}
                        min={inputs.purchaseDate || undefined}
                        aria-describedby={
                          errorFor("saleDate") ? "sale-date-error" : undefined
                        }
                        aria-invalid={errorFor("saleDate") ? true : undefined}
                        onChange={(event) =>
                          update("saleDate", event.target.value)
                        }
                      />
                      {errorFor("saleDate") ? (
                        <span className="field-error" id="sale-date-error">
                          {errorFor("saleDate")}
                        </span>
                      ) : null}
                    </label>
                    <PercentageField
                      id="ownership-share"
                      label="Your ownership share"
                      value={inputs.ownershipShare}
                      onChange={(value) => update("ownershipShare", value)}
                      placeholder="100"
                      error={errorFor("ownershipShare")}
                    />
                    {inputs.propertyUse !== "main-residence" ? (
                      <PercentageField
                        id="marginal-tax-rate"
                        label="Assumed tax rate on the taxable gain"
                        value={inputs.marginalTaxRate}
                        onChange={(value) => update("marginalTaxRate", value)}
                        placeholder="37"
                        error={errorFor("marginalTaxRate")}
                        help="Capital gains form part of your income tax. Use an approximate rate including Medicare levy if applicable; this does not model tax brackets or offsets."
                      />
                    ) : null}
                    {inputs.propertyUse === "mixed" ? (
                      <PercentageField
                        id="mixed-taxable-percentage"
                        label="Taxable portion of the gain"
                        value={inputs.mixedTaxablePercentage}
                        onChange={(value) =>
                          update("mixedTaxablePercentage", value)
                        }
                        placeholder="40"
                        max={99.9}
                        error={errorFor("mixedTaxablePercentage")}
                        help="Use a proportion reviewed by your tax adviser."
                      />
                    ) : null}
                  </div>

                  {inputs.propertyUse === "main-residence" ? (
                    <div className="eligibility-confirmation">
                      <label
                        className="check-row"
                        htmlFor="main-residence-confirmed"
                      >
                        <input
                          id="main-residence-confirmed"
                          type="checkbox"
                          checked={inputs.mainResidenceExemptionConfirmed}
                          onChange={(event) =>
                            update(
                              "mainResidenceExemptionConfirmed",
                              event.target.checked,
                            )
                          }
                        />
                        <span>
                          <strong>
                            I believe the full main residence exemption applies
                          </strong>
                          <small>
                            Confirm only after checking residence periods,
                            income-producing use, absence choices and your tax
                            residency at sale.
                          </small>
                        </span>
                      </label>
                      <p>
                        Unsure? Leave this unchecked and review the{" "}
                        <a
                          href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax/your-main-residence---home"
                          target="_blank"
                          rel="noreferrer"
                        >
                          ATO main residence guidance
                        </a>
                        .
                      </p>
                    </div>
                  ) : null}

                  <details className="advanced-tax">
                    <summary>Advanced tax details</summary>
                    <div className="field-grid">
                      <AmountField
                        id="capital-works"
                        label="Capital works deductions"
                        value={inputs.capitalWorksDeductions}
                        onChange={(value) =>
                          update("capitalWorksDeductions", value)
                        }
                        placeholder="0"
                        error={errorFor("capitalWorksDeductions")}
                        help="Deductions claimed or claimable that reduce cost base."
                      />
                      <AmountField
                        id="ato-cost-base"
                        label="ATO cost base override"
                        value={inputs.atoCostBaseOverride}
                        onChange={(value) =>
                          update("atoCostBaseOverride", value)
                        }
                        placeholder={Math.round(result.derivedCostBase).toString()}
                        error={errorFor("atoCostBaseOverride")}
                        help="Use a reviewed figure for mixed-use or special cases."
                      />
                    </div>
                  </details>
                </div>
              ) : null}
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
                Enter 0 if commission or eligible selling costs do not apply.
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
                <span>Whole-property pre-tax profit</span>
                <strong>{aud.format(result.preTaxPropertyProfit)}</strong>
                <small>
                  Before ownership split. Excludes loan balance and historical
                  holding cash flows.
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
                  label="Eligible selling costs"
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
                      numberFrom(inputs.capitalImprovements)
                    }
                    subtract
                  />
                ) : null}
              </div>

              <div className="secondary-metric">
                <span>Estimated break-even sale price</span>
                <strong>{aud.format(result.breakEvenSalePrice)}</strong>
              </div>

              {inputs.estimateTax ? (
                <TaxResult
                  status={result.taxStatus}
                  taxableCapitalGain={result.taxableCapitalGain}
                  estimatedCgt={result.estimatedCgt}
                  preTaxProfit={result.userPreTaxProfit}
                  afterTaxProfit={result.userAfterTaxProfit}
                  heldAtLeastTwelveMonths={result.heldAtLeastTwelveMonths}
                />
              ) : null}
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
            Indicative estimate only. Confirm selling costs and tax treatment
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
            <h3>Property profit</h3>
            <p>Sale proceeds less purchase price, buying costs and improvements.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Tax scenario</h3>
            <p>An optional, deliberately limited estimate—not a tax return calculation.</p>
          </article>
        </div>
      </section>

      <footer id="privacy">
        <div>
          <strong>Private by design</strong>
          <p>
            Your figures are calculated in this browser. They are not saved,
            attached to the external valuation links or included in analytics.
          </p>
        </div>
        <div>
          <strong>Important limitations</strong>
          <p>
            For Australian resident individuals only. The tax figure applies
            one assumed rate and does not calculate tax brackets or total
            income tax. Special CGT rules, capital losses, foreign residency,
            trusts, companies, SMSFs and post-1 July 2027 tax calculations are
            outside this first version.
          </p>
        </div>
        <div className="footer-meta">
          <span>Tax rules reviewed 21 July 2026</span>
          <a
            href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax"
            target="_blank"
            rel="noreferrer"
          >
            Review ATO guidance
          </a>
        </div>
      </footer>
    </main>
  );
}

function TaxResult({
  status,
  taxableCapitalGain,
  estimatedCgt,
  preTaxProfit,
  afterTaxProfit,
  heldAtLeastTwelveMonths,
}: {
  status: ReturnType<typeof calculateEstimate>["taxStatus"];
  taxableCapitalGain: number | null;
  estimatedCgt: number | null;
  preTaxProfit: number;
  afterTaxProfit: number | null;
  heldAtLeastTwelveMonths: boolean;
}) {
  if (status === "post-2027-unsupported") {
    return (
      <div className="tax-message warning">
        <strong>Tax estimate paused for this sale date</strong>
        <p>
          New CGT rules apply from 1 July 2027 and require additional valuation
          and indexation inputs. The pre-tax estimate above remains available.
        </p>
      </div>
    );
  }

  if (status === "insufficient-input") {
    return (
      <div className="tax-message">
        <strong>Complete the tax scenario</strong>
        <p>Add both contract dates and, when relevant, an assumed tax rate.</p>
      </div>
    );
  }

  if (status === "invalid-input") {
    return (
      <div className="tax-message warning">
        <strong>Tax estimate needs correction</strong>
        <p>Fix the highlighted tax fields before using this scenario.</p>
      </div>
    );
  }

  if (status === "main-residence-unconfirmed") {
    return (
      <div className="tax-message warning">
        <strong>Full exemption not confirmed</strong>
        <p>
          No $0 CGT estimate is shown until you confirm that the full main
          residence exemption applies.
        </p>
      </div>
    );
  }

  if (status === "assumed-exempt") {
    return (
      <div className="tax-message success">
        <strong>Indicative tax on the gain: {aud.format(0)}</strong>
        <p>Based on your confirmation of a fully exempt main residence.</p>
        {afterTaxProfit !== null ? (
          <AfterTaxResult value={afterTaxProfit} />
        ) : null}
      </div>
    );
  }

  if (status === "capital-loss") {
    return (
      <div className="tax-message">
        <strong>No positive capital gain estimated</strong>
        <p>The entered tax cost base is greater than the expected sale price.</p>
        {afterTaxProfit !== null ? (
          <AfterTaxResult value={afterTaxProfit} />
        ) : null}
      </div>
    );
  }

  if (status !== "estimated") return null;

  return (
    <div className="tax-result">
      <div className="tax-discount">
        {heldAtLeastTwelveMonths
          ? "50% CGT discount applied"
          : "No 12-month CGT discount applied"}
      </div>
      <ResultRow label="Your share of pre-tax profit" value={preTaxProfit} />
      <ResultRow
        label="Estimated taxable capital gain"
        value={taxableCapitalGain ?? 0}
      />
      <ResultRow
        label="Indicative tax on the capital gain"
        value={estimatedCgt ?? 0}
        subtract
      />
      <AfterTaxResult value={afterTaxProfit ?? 0} />
    </div>
  );
}

function AfterTaxResult({ value }: { value: number }) {
  return (
    <div className={`after-tax-result ${value < 0 ? "loss" : ""}`}>
      <span>Your share after indicative tax</span>
      <strong>{aud.format(value)}</strong>
    </div>
  );
}
