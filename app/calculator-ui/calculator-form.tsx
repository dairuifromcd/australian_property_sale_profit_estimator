import type { CalculatorController } from "./use-calculator-form";
import { AmountField, PercentageField } from "./fields";

export function CalculatorForm({
  controller,
}: {
  controller: CalculatorController;
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
            onChange={(value) => update("renovationsAndImprovements", value)}
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
          These figures do not change transaction profit, break-even price or
          the sale price needed for a target transaction profit.
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
  );
}
