"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  calculateEstimate,
  calculateRequiredSalePrice,
  type CalculatorInput,
} from "./calculator";
import { formatAmountInput, numberFromInput } from "./input-format";

type InputState = {
  salePrice: string;
  purchasePrice: string;
  commissionRate: string;
  otherSellingCosts: string;
  salePreparationCosts: string;
  purchaseCosts: string;
  renovationsAndImprovements: string;
  estimatedLoanPayout: string;
  totalHoldingCosts: string;
  totalRentalIncome: string;
};

const INITIAL_INPUTS: InputState = {
  salePrice: "",
  purchasePrice: "",
  commissionRate: "",
  otherSellingCosts: "",
  salePreparationCosts: "",
  purchaseCosts: "",
  renovationsAndImprovements: "",
  estimatedLoanPayout: "",
  totalHoldingCosts: "",
  totalRentalIncome: "",
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

function CalculationDetails({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <details className="calculation-details">
      <summary>Show calculation</summary>
      <div>{children}</div>
    </details>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<InputState>(INITIAL_INPUTS);
  const [targetProfit, setTargetProfit] = useState("");
  const transactionDetailsRef = useRef<HTMLDetailsElement>(null);
  const holdingDetailsRef = useRef<HTMLDetailsElement>(null);

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
    setTargetProfit("");
    transactionDetailsRef.current?.removeAttribute("open");
    holdingDetailsRef.current?.removeAttribute("open");
  };

  const calculatorInput = useMemo<CalculatorInput>(
    () => ({
      salePrice: numberFrom(inputs.salePrice),
      purchasePrice: numberFrom(inputs.purchasePrice),
      commissionRate: numberFrom(inputs.commissionRate),
      otherSellingCosts: numberFrom(inputs.otherSellingCosts),
      salePreparationCosts: numberFrom(inputs.salePreparationCosts),
      purchaseCosts: numberFrom(inputs.purchaseCosts),
      renovationsAndImprovements: numberFrom(
        inputs.renovationsAndImprovements,
      ),
      estimatedLoanPayout: numberFrom(inputs.estimatedLoanPayout),
      totalHoldingCosts: numberFrom(inputs.totalHoldingCosts),
      totalRentalIncome: numberFrom(inputs.totalRentalIncome),
    }),
    [inputs],
  );
  const result = useMemo(
    () => calculateEstimate(calculatorInput),
    [calculatorInput],
  );
  const targetSalePrice = useMemo(
    () =>
      calculateRequiredSalePrice(
        calculatorInput,
        targetProfit === "-" ? Number.NaN : numberFrom(targetProfit),
      ),
    [calculatorInput, targetProfit],
  );

  const hasHoldingCashFlowInputs =
    inputs.totalHoldingCosts !== "" || inputs.totalRentalIncome !== "";
  const hasLoanPayoutInput = inputs.estimatedLoanPayout !== "";
  const hasExpandedInputs =
    result.hasAdjustedInputs ||
    hasHoldingCashFlowInputs ||
    hasLoanPayoutInput;
  const estimateLevel = hasExpandedInputs
    ? "Expanded estimate"
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
  const hasQuickInputErrors = result.hasTransactionErrors;
  const hasHoldingCashFlowErrors = result.validationErrors.some(
    (error) =>
      error.field === "totalHoldingCosts" ||
      error.field === "totalRentalIncome",
  );
  const hasLoanPayoutError = result.validationErrors.some(
    (error) => error.field === "estimatedLoanPayout",
  );
  const canShowEstimate =
    hasAllQuickInputs && !hasQuickInputErrors;
  const targetProfitError =
    targetProfit === "" ? undefined : targetSalePrice.validationError;
  const hasTargetSalePrice =
    targetProfit !== "" &&
    targetSalePrice.requiredSalePrice !== null &&
    targetSalePrice.differenceFromExpectedSalePrice !== null;
  const roundedTargetDifference = Math.round(
    targetSalePrice.differenceFromExpectedSalePrice ?? 0,
  );
  const targetDifferenceText =
    roundedTargetDifference === 0
      ? "Matches your expected sale price."
      : `${aud.format(Math.abs(roundedTargetDifference))} ${
          roundedTargetDifference > 0 ? "above" : "below"
        } your expected sale price of ${aud.format(
          numberFrom(inputs.salePrice),
        )}.`;
  const overallResultTone =
    result.overallPreTaxPropertyResult < 0 ? "loss" : "gain";
  const settlementCashTone =
    result.estimatedCashAfterLoanPayout < 0 ? "loss" : "gain";

  return (
    <main>
      <aside className="scope-banner" aria-label="Estimate scope notice">
        <strong>Indicative estimate</strong>
        <span>
          Uses only the amounts you enter. Tax and unentered settlement
          adjustments are excluded.
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
        <h1>Estimate your property sale result and cash position.</h1>
        <p className="hero-copy">
          Start with four numbers for a transaction estimate. Optionally add
          buying costs, holding cash flows and a loan payout without mixing
          those different results together.
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

          <details
            className="details-block transaction-details"
            ref={transactionDetailsRef}
          >
            <summary>
              <span>
                <strong>Add transaction details</strong>
                <small>Buying, preparation and improvement costs</small>
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
                label="Buying costs (excluding purchase price)"
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

          <details
            className="details-block holding-details"
            ref={holdingDetailsRef}
          >
            <summary>
              <span>
                <strong>Add holding and loan details</strong>
                <small>Optional overall result and settlement cash estimates</small>
              </span>
              <span className="summary-action">
                <span className="summary-action-closed">Add details</span>
                <span className="summary-action-open">Hide details</span>
              </span>
            </summary>
            <div className="details-intro">
              These figures do not change transaction profit, break-even price
              or the sale price needed for a target transaction profit.
            </div>
            <div className="details-content field-grid">
              <AmountField
                id="total-holding-costs"
                label="Total holding costs paid"
                value={inputs.totalHoldingCosts}
                onChange={(value) => update("totalHoldingCosts", value)}
                placeholder="85,000"
                error={errorFor("totalHoldingCosts")}
                help="Interest (not loan principal), rates, insurance, body corporate, management, maintenance and other holding costs you want included."
              />
              <AmountField
                id="total-rental-income"
                label="Total rental income received"
                value={inputs.totalRentalIncome}
                onChange={(value) => update("totalRentalIncome", value)}
                placeholder="60,000"
                error={errorFor("totalRentalIncome")}
                help="Gross rent received over the same period as the holding costs. Enter 0 if there was none."
              />
              <AmountField
                id="estimated-loan-payout"
                label="Estimated loan payout at settlement"
                value={inputs.estimatedLoanPayout}
                onChange={(value) => update("estimatedLoanPayout", value)}
                placeholder="420,000"
                error={errorFor("estimatedLoanPayout")}
                help="Use a lender payout estimate if available. It can differ from the current loan balance and is used only for the simplified cash estimate."
              />
            </div>
          </details>
        </div>

        <aside className="results-panel">
          <div className="result-topline">
            <span className="estimate-level">{estimateLevel}</span>
            <span className="result-privacy">On-device</span>
          </div>

          {!hasAllQuickInputs ? (
            <div className="empty-result" role="status" aria-atomic="true">
              <span className="empty-number">$—</span>
              <h2>Complete the four quick inputs</h2>
              <p>
                Enter 0 if commission or other selling costs do not apply.
              </p>
            </div>
          ) : hasQuickInputErrors ? (
            <div
              className="empty-result invalid-result"
              role="status"
              aria-atomic="true"
            >
              <span className="empty-number">!</span>
              <h2>Check the highlighted fields</h2>
              <p>Fix the entered values before using this estimate.</p>
            </div>
          ) : (
            <>
              <div
                className={`primary-result ${profitTone}`}
                role="status"
                aria-atomic="true"
              >
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
                  Before holding costs, rental income, loan payout and tax.
                  Additional results appear separately when you enter them.
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
                  label="Amount remaining after selling costs"
                  value={result.amountAfterSellingCosts}
                />
                <ResultRow
                  label="Purchase price"
                  value={numberFrom(inputs.purchasePrice)}
                  subtract
                />
                {numberFrom(inputs.purchaseCosts) > 0 ? (
                  <ResultRow
                    label="Buying costs"
                    value={numberFrom(inputs.purchaseCosts)}
                    subtract
                  />
                ) : null}
                {numberFrom(inputs.renovationsAndImprovements) > 0 ? (
                  <ResultRow
                    label="Renovations and improvements"
                    value={numberFrom(inputs.renovationsAndImprovements)}
                    subtract
                  />
                ) : null}
                <div className="result-divider" />
                <ResultRow
                  label={
                    profitTone === "loss"
                      ? "Transaction loss"
                      : "Transaction profit"
                  }
                  value={result.transactionProfit}
                />
              </div>

              <CalculationDetails>
                <p>
                  Expected sale price minus commission, selling and preparation
                  costs, purchase price, buying costs and improvements.
                </p>
                <code>
                  {aud.format(numberFrom(inputs.salePrice))} −{" "}
                  {aud.format(result.agentCommission)} −{" "}
                  {aud.format(numberFrom(inputs.otherSellingCosts))} −{" "}
                  {aud.format(numberFrom(inputs.salePreparationCosts))} −{" "}
                  {aud.format(numberFrom(inputs.purchasePrice))} −{" "}
                  {aud.format(numberFrom(inputs.purchaseCosts))} −{" "}
                  {aud.format(numberFrom(inputs.renovationsAndImprovements))} ={" "}
                  {aud.format(result.transactionProfit)}
                </code>
              </CalculationDetails>

                  {hasHoldingCashFlowInputs && !hasHoldingCashFlowErrors ? (
                <section
                  className={`supplementary-result ${overallResultTone}`}
                  aria-labelledby="overall-result-title"
                >
                  <div className="supplementary-result-heading">
                    <div>
                      <span>Holding-period cash flows</span>
                      <h3 id="overall-result-title">
                        Overall pre-tax property result
                      </h3>
                    </div>
                    <span className={`outcome-status ${overallResultTone}`}>
                      {overallResultTone === "loss" ? "LOSS" : "PROFIT"}
                    </span>
                  </div>
                  <ResultRow
                    label="Transaction profit"
                    value={result.transactionProfit}
                  />
                  <ResultRow
                    label="Rental income"
                    value={numberFrom(inputs.totalRentalIncome)}
                  />
                  <ResultRow
                    label="Holding costs"
                    value={numberFrom(inputs.totalHoldingCosts)}
                    subtract
                  />
                  <div className="supplementary-total">
                    <span>Overall pre-tax result</span>
                    <strong>
                      {aud.format(result.overallPreTaxPropertyResult)}
                    </strong>
                  </div>
                  <small>
                    Before tax. Loan principal repayments are excluded because
                    the purchase price is already counted in transaction profit.
                  </small>
                  <CalculationDetails>
                    <code>
                      {aud.format(result.transactionProfit)} +{" "}
                      {aud.format(numberFrom(inputs.totalRentalIncome))} −{" "}
                      {aud.format(numberFrom(inputs.totalHoldingCosts))} ={" "}
                      {aud.format(result.overallPreTaxPropertyResult)}
                    </code>
                  </CalculationDetails>
                </section>
              ) : null}

                  {hasLoanPayoutInput && !hasLoanPayoutError ? (
                <section
                  className={`supplementary-result ${settlementCashTone}`}
                  aria-labelledby="settlement-cash-title"
                >
                  <div className="supplementary-result-heading">
                    <div>
                      <span>Simplified settlement cash</span>
                      <h3 id="settlement-cash-title">
                        {settlementCashTone === "loss"
                          ? "Estimated cash shortfall after loan payout"
                          : "Estimated cash after loan payout"}
                      </h3>
                    </div>
                    <span className={`outcome-status ${settlementCashTone}`}>
                      {settlementCashTone === "loss"
                        ? "SHORTFALL"
                        : "ESTIMATE"}
                    </span>
                  </div>
                  <ResultRow
                    label="Amount after selling costs"
                    value={result.amountAfterSellingCosts}
                  />
                  <ResultRow
                    label="Estimated loan payout"
                    value={numberFrom(inputs.estimatedLoanPayout)}
                    subtract
                  />
                  <div className="supplementary-total">
                    <span>
                      {settlementCashTone === "loss"
                        ? "Estimated cash shortfall"
                        : "Estimated cash"}
                    </span>
                    <strong>
                      {aud.format(result.estimatedCashAfterLoanPayout)}
                    </strong>
                  </div>
                  <small>
                    Before tax and unentered settlement adjustments. Confirm the
                    actual payout with your lender and settlement professional.
                  </small>
                  <CalculationDetails>
                    <code>
                      {aud.format(result.amountAfterSellingCosts)} −{" "}
                      {aud.format(numberFrom(inputs.estimatedLoanPayout))} ={" "}
                      {aud.format(result.estimatedCashAfterLoanPayout)}
                    </code>
                  </CalculationDetails>
                </section>
              ) : null}

              <div className="secondary-metric">
                <div>
                  <span>Break-even sale price for entered transaction costs</span>
                  <CalculationDetails>
                    <p>
                      Fixed transaction costs divided by one minus the commission
                      rate. Rounded up to the next dollar.
                    </p>
                    <code>
                      {aud.format(
                        numberFrom(inputs.purchasePrice) +
                          numberFrom(inputs.purchaseCosts) +
                          numberFrom(inputs.renovationsAndImprovements) +
                          numberFrom(inputs.otherSellingCosts) +
                          numberFrom(inputs.salePreparationCosts),
                      )}{" "}
                      ÷ (1 − {numberFrom(inputs.commissionRate)}%) ={" "}
                      {aud.format(result.breakEvenSalePrice)}
                    </code>
                  </CalculationDetails>
                </div>
                <strong>{aud.format(result.breakEvenSalePrice)}</strong>
              </div>

              <section
                className={`target-sale-price ${
                  hasTargetSalePrice ? "has-target" : ""
                }`}
                aria-labelledby="target-sale-price-title"
              >
                <div className="target-sale-price-heading">
                  <h3 id="target-sale-price-title">
                    Sale price for a target profit
                  </h3>
                  <p>
                    Set a whole-property transaction profit before holding
                    cash flows, loan payout and tax. Commission is recalculated
                    at the required sale price, which is rounded up to the next
                    dollar.
                  </p>
                </div>

                <label
                  className="target-profit-control no-print"
                  htmlFor="target-profit"
                >
                  <span>Target transaction profit</span>
                  <span
                    className={`money-input ${
                      targetProfitError ? "field-control-error" : ""
                    }`}
                  >
                    <span aria-hidden="true">$</span>
                    <input
                      id="target-profit"
                      type="text"
                      inputMode="decimal"
                      value={targetProfit}
                      onChange={(event) =>
                        setTargetProfit(formatAmountInput(event.target.value))
                      }
                      placeholder="100,000"
                      aria-describedby={
                        targetProfitError
                          ? "target-profit-help target-profit-error"
                          : "target-profit-help"
                      }
                      aria-invalid={targetProfitError ? true : undefined}
                    />
                    <span className="currency" aria-hidden="true">
                      AUD
                    </span>
                  </span>
                  <small id="target-profit-help">
                    Enter 0 to reproduce the entered-cost break-even price.
                  </small>
                  {targetProfitError ? (
                    <span className="field-error" id="target-profit-error">
                      {targetProfitError}
                    </span>
                  ) : null}
                </label>

                {hasTargetSalePrice ? (
                  <div
                    className="target-sale-price-result"
                    role="status"
                    aria-live="polite"
                  >
                    <span>Sale price needed for this target</span>
                    <strong>
                      {aud.format(targetSalePrice.requiredSalePrice ?? 0)}
                    </strong>
                    <small>{targetDifferenceText}</small>
                    <CalculationDetails>
                      <p>
                        Entered fixed transaction costs plus target profit,
                        divided by one minus the commission rate. Rounded up to
                        the next dollar.
                      </p>
                      <code>
                        (
                        {aud.format(
                          numberFrom(inputs.purchasePrice) +
                            numberFrom(inputs.purchaseCosts) +
                            numberFrom(inputs.renovationsAndImprovements) +
                            numberFrom(inputs.otherSellingCosts) +
                            numberFrom(inputs.salePreparationCosts),
                        )}{" "}
                        + {aud.format(numberFrom(targetProfit))}) ÷ (1 −{" "}
                        {numberFrom(inputs.commissionRate)}%) ={" "}
                        {aud.format(targetSalePrice.requiredSalePrice ?? 0)}
                      </code>
                    </CalculationDetails>
                  </div>
                ) : null}
              </section>

              <section
                className="sale-sensitivity"
                aria-labelledby="sale-sensitivity-title"
              >
                <div className="sale-sensitivity-heading">
                  <h3 id="sale-sensitivity-title">Sale price sensitivity</h3>
                  <p>
                    Illustrative scenarios 5% below and above your entered sale
                    price—not a price prediction. Commission is recalculated;
                    other entered costs stay fixed.
                  </p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Scenario</th>
                      <th scope="col">Sale price</th>
                      <th scope="col">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.salePriceSensitivity.map((scenario) => {
                      const scenarioTone =
                        scenario.transactionProfit < 0 ? "loss" : "gain";
                      const scenarioLabel =
                        scenario.changePercent === 0
                          ? "Current"
                          : scenario.changePercent > 0
                            ? `+${scenario.changePercent}%`
                            : `−${Math.abs(scenario.changePercent)}%`;

                      return (
                        <tr
                          className={
                            scenario.changePercent === 0
                              ? "current-scenario"
                              : undefined
                          }
                          key={scenario.changePercent}
                        >
                          <th scope="row">{scenarioLabel}</th>
                          <td>{aud.format(scenario.salePrice)}</td>
                          <td>
                            <strong className={scenarioTone}>
                              {aud.format(scenario.transactionProfit)}
                            </strong>
                            <small>
                              {scenarioTone === "loss" ? "Loss" : "Profit"}
                            </small>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <CalculationDetails>
                  <p>
                    Each row recalculates commission from its scenario sale
                    price, then subtracts the same fixed transaction costs.
                  </p>
                  {result.salePriceSensitivity.map((scenario) => (
                    <code key={scenario.changePercent}>
                      {aud.format(scenario.salePrice)} −{" "}
                      {aud.format(
                        scenario.salePrice *
                          (numberFrom(inputs.commissionRate) / 100),
                      )}{" "}
                      commission −{" "}
                      {aud.format(
                        numberFrom(inputs.purchasePrice) +
                          numberFrom(inputs.purchaseCosts) +
                          numberFrom(inputs.renovationsAndImprovements) +
                          numberFrom(inputs.otherSellingCosts) +
                          numberFrom(inputs.salePreparationCosts),
                      )}{" "}
                      fixed costs = {aud.format(scenario.transactionProfit)}
                    </code>
                  ))}
                </CalculationDetails>
              </section>
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
            Indicative estimates only—not accounting profit or a tax
            calculation. Settlement cash excludes unentered adjustments.
            Confirm important figures with qualified professionals before
            making a decision.
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
            <h3>Amount after selling costs</h3>
            <p>
              Sale price less commission, selling costs and preparation costs.
              This is before any loan payout.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Transaction profit or loss</h3>
            <p>
              Amount after selling costs less purchase price, buying costs,
              renovations and improvements—before holding cash flows, loan
              payout and tax.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Break-even and target sale price</h3>
            <p>
              See the sale price needed to cover the transaction costs you
              enter or reach a target transaction profit. Holding cash flows,
              loan payout and tax do not change these planning prices.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Optional overall and cash results</h3>
            <p>
              Keep holding-period income and costs separate from a simplified
              estimate of cash after a loan payout.
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
            Optional overall and settlement cash results use only the amounts
            entered. This tool does not calculate capital gains tax, income tax,
            depreciation, time-adjusted returns or after-tax profit.
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
