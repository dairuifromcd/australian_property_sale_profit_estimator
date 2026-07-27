import type { CalculatorController } from "./use-calculator-form";
import { AmountField, PercentageField } from "./fields";
import type { SiteMessages } from "../i18n/messages/types";

export function CalculatorForm({
  controller,
  messages,
}: {
  controller: CalculatorController;
  messages: SiteMessages["form"];
}) {
  const {
    inputs,
    transactionDetailsRef,
    holdingDetailsRef,
    errorFor,
    update,
    resetCalculator,
  } = controller;

  return (
    <div className="form-panel">
      <div className="section-heading">
        <div>
          <span className="step-label">{messages.quickEstimateStep}</span>
          <h2 id="calculator-title">{messages.title}</h2>
        </div>
        <button
          className="text-button no-print"
          type="button"
          onClick={resetCalculator}
        >
          {messages.reset}
        </button>
      </div>

      <div className="field-grid">
        <AmountField
          id="sale-price"
          label={messages.salePrice}
          value={inputs.salePrice}
          onChange={(value) => update("salePrice", value)}
          placeholder="1,050,000"
          error={errorFor("salePrice")}
          required
          requiredLabel={messages.required}
          help={
            <>
              {messages.salePriceHelpBefore}{" "}
              <a
                href="https://www.realestate.com.au/property/"
                target="_blank"
                rel="noreferrer"
              >
                realestate.com.au
              </a>{" "}
              {messages.salePriceHelpOr}{" "}
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
          label={messages.purchasePrice}
          value={inputs.purchasePrice}
          onChange={(value) => update("purchasePrice", value)}
          placeholder="650,000"
          error={errorFor("purchasePrice")}
          required
          requiredLabel={messages.required}
        />
        <PercentageField
          id="commission-rate"
          label={messages.commissionRate}
          value={inputs.commissionRate}
          onChange={(value) => update("commissionRate", value)}
          placeholder="2.2"
          max={99.9}
          error={errorFor("commissionRate")}
          help={messages.commissionHelp}
          required
          requiredLabel={messages.required}
        />
        <AmountField
          id="other-selling-costs"
          label={messages.otherSellingCosts}
          value={inputs.otherSellingCosts}
          onChange={(value) => update("otherSellingCosts", value)}
          placeholder="8,500"
          error={errorFor("otherSellingCosts")}
          help={messages.otherSellingCostsHelp}
          required
          requiredLabel={messages.required}
        />
      </div>

      <details
        className="details-block transaction-details"
        ref={transactionDetailsRef}
      >
        <summary>
          <span>
            <strong>{messages.transactionDetailsTitle}</strong>
            <small>{messages.transactionDetailsSummary}</small>
          </span>
          <span className="summary-action">
            <span className="summary-action-closed">{messages.addDetails}</span>
            <span className="summary-action-open">{messages.hideDetails}</span>
          </span>
        </summary>
        <div className="details-content field-grid">
          <AmountField
            id="sale-preparation-costs"
            label={messages.salePreparationCosts}
            value={inputs.salePreparationCosts}
            onChange={(value) => update("salePreparationCosts", value)}
            placeholder="4,000"
            error={errorFor("salePreparationCosts")}
            help={messages.salePreparationHelp}
          />
          <AmountField
            id="purchase-costs"
            label={messages.purchaseCosts}
            value={inputs.purchaseCosts}
            onChange={(value) => update("purchaseCosts", value)}
            placeholder="32,000"
            error={errorFor("purchaseCosts")}
            help={messages.purchaseCostsHelp}
          />
          <AmountField
            id="renovations-and-improvements"
            label={messages.renovations}
            value={inputs.renovationsAndImprovements}
            onChange={(value) => update("renovationsAndImprovements", value)}
            placeholder="25,000"
            error={errorFor("renovationsAndImprovements")}
            help={messages.renovationsHelp}
          />
        </div>
      </details>

      <details
        className="details-block holding-details"
        ref={holdingDetailsRef}
      >
        <summary>
          <span>
            <strong>{messages.holdingDetailsTitle}</strong>
            <small>{messages.holdingDetailsSummary}</small>
          </span>
          <span className="summary-action">
            <span className="summary-action-closed">{messages.addDetails}</span>
            <span className="summary-action-open">{messages.hideDetails}</span>
          </span>
        </summary>
        <div className="details-intro">
          {messages.holdingDetailsIntro}
        </div>
        <div className="details-content field-grid">
          <AmountField
            id="total-holding-costs"
            label={messages.holdingCosts}
            value={inputs.totalHoldingCosts}
            onChange={(value) => update("totalHoldingCosts", value)}
            placeholder="85,000"
            error={errorFor("totalHoldingCosts")}
            help={messages.holdingCostsHelp}
          />
          <AmountField
            id="total-rental-income"
            label={messages.rentalIncome}
            value={inputs.totalRentalIncome}
            onChange={(value) => update("totalRentalIncome", value)}
            placeholder="60,000"
            error={errorFor("totalRentalIncome")}
            help={messages.rentalIncomeHelp}
          />
          <AmountField
            id="estimated-loan-payout"
            label={messages.loanPayout}
            value={inputs.estimatedLoanPayout}
            onChange={(value) => update("estimatedLoanPayout", value)}
            placeholder="420,000"
            error={errorFor("estimatedLoanPayout")}
            help={messages.loanPayoutHelp}
          />
        </div>
      </details>
    </div>
  );
}
