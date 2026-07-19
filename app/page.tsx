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
  purchaseCosts: "",
  capitalImprovements: "",
  estimateTax: false,
  propertyUse: "main-residence",
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
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  help?: React.ReactNode;
  required?: boolean;
}) {
  const helpId = help ? `${id}-help` : undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {required ? <span className="required">Required</span> : null}
      </span>
      <span className="money-input">
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
          aria-describedby={helpId}
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  help?: string;
}) {
  const helpId = help ? `${id}-help` : undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <span className="percent-input">
        <input
          id={id}
          type="number"
          min="0"
          max="100"
          step="0.1"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-describedby={helpId}
        />
        <span aria-hidden="true">%</span>
      </span>
      {help ? (
        <span className="field-help" id={helpId}>
          {help}
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
              required
            />
            <PercentageField
              id="commission-rate"
              label="Agent commission"
              value={inputs.commissionRate}
              onChange={(value) => update("commissionRate", value)}
              placeholder="2.2"
              help="Use the GST-inclusive rate from your agent quote."
            />
            <AmountField
              id="other-selling-costs"
              label="Other selling costs"
              value={inputs.otherSellingCosts}
              onChange={(value) => update("otherSellingCosts", value)}
              placeholder="8,500"
              help="Marketing, conveyancing, styling and other sale costs."
            />
          </div>

          <details className="details-block">
            <summary>
              <span>
                <strong>Improve this estimate</strong>
                <small>Add buying costs and capital improvements</small>
              </span>
              <span className="summary-action">Add detail</span>
            </summary>
            <div className="details-content field-grid">
              <AmountField
                id="purchase-costs"
                label="Purchase costs"
                value={inputs.purchaseCosts}
                onChange={(value) => update("purchaseCosts", value)}
                placeholder="32,000"
                help="Stamp duty, conveyancing and eligible acquisition costs."
              />
              <AmountField
                id="capital-improvements"
                label="Capital improvements"
                value={inputs.capitalImprovements}
                onChange={(value) => update("capitalImprovements", value)}
                placeholder="25,000"
                help="Renovations or improvements, excluding routine repairs."
              />
            </div>
          </details>

          <details className="details-block tax-block">
            <summary>
              <span>
                <strong>Estimate CGT</strong>
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
                      onChange={(event) =>
                        update("propertyUse", event.target.value as PropertyUse)
                      }
                    >
                      <option value="main-residence">
                        Main residence — assuming full exemption
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
                        onChange={(event) =>
                          update("purchaseDate", event.target.value)
                        }
                      />
                    </label>
                    <label className="field" htmlFor="sale-date">
                      <span className="field-label">Expected sale contract date</span>
                      <input
                        id="sale-date"
                        type="date"
                        value={inputs.saleDate}
                        min={inputs.purchaseDate || undefined}
                        onChange={(event) =>
                          update("saleDate", event.target.value)
                        }
                      />
                    </label>
                    <PercentageField
                      id="ownership-share"
                      label="Your ownership share"
                      value={inputs.ownershipShare}
                      onChange={(value) => update("ownershipShare", value)}
                      placeholder="100"
                    />
                    {inputs.propertyUse !== "main-residence" ? (
                      <PercentageField
                        id="marginal-tax-rate"
                        label="Estimated marginal tax rate"
                        value={inputs.marginalTaxRate}
                        onChange={(value) => update("marginalTaxRate", value)}
                        placeholder="37"
                        help="Include Medicare levy if it applies to you."
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
                        help="Use a proportion reviewed by your tax adviser."
                      />
                    ) : null}
                  </div>

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

          {!result.hasCoreInputs ? (
            <div className="empty-result">
              <span className="empty-number">$—</span>
              <h2>Your estimate will appear here</h2>
              <p>Add an expected sale price and original purchase price.</p>
            </div>
          ) : (
            <>
              <div className={`primary-result ${profitTone}`}>
                <span>Preliminary pre-tax profit</span>
                <strong>{aud.format(result.preTaxPropertyProfit)}</strong>
                <small>
                  Excludes loan balance and historical holding cash flows.
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
            disabled={!result.hasCoreInputs}
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
            For Australian resident individuals only. Special CGT rules,
            capital losses, foreign residency, trusts, companies, SMSFs and
            post-1 July 2027 tax calculations are outside this first version.
          </p>
        </div>
        <div className="footer-meta">
          <span>Tax rules reviewed 18 July 2026</span>
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
  afterTaxProfit,
  heldAtLeastTwelveMonths,
}: {
  status: ReturnType<typeof calculateEstimate>["taxStatus"];
  taxableCapitalGain: number | null;
  estimatedCgt: number | null;
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
        <p>Add both contract dates and, when relevant, a marginal tax rate.</p>
      </div>
    );
  }

  if (status === "assumed-exempt") {
    return (
      <div className="tax-message success">
        <strong>Estimated CGT: {aud.format(0)}</strong>
        <p>Based on your selection of a fully exempt main residence.</p>
      </div>
    );
  }

  if (status === "capital-loss") {
    return (
      <div className="tax-message">
        <strong>No CGT estimated on this property</strong>
        <p>The entered tax cost base is greater than the expected sale price.</p>
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
      <ResultRow
        label="Estimated taxable capital gain"
        value={taxableCapitalGain ?? 0}
      />
      <ResultRow label="Estimated CGT" value={estimatedCgt ?? 0} subtract />
      <div className="after-tax-result">
        <span>Your estimated profit after tax</span>
        <strong>{aud.format(afterTaxProfit ?? 0)}</strong>
      </div>
    </div>
  );
}
