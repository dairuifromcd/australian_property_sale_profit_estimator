import type { CalculatorResult } from "../calculator";
import { numberFromInput } from "../input-format";
import { aud } from "./format";
import {
  CalculationDetails,
  OutcomeStatus,
  ResultRow,
  toneFor,
} from "./result-primitives";
import type { InputState } from "./use-calculator-form";

export function TransactionResults({
  inputs,
  result,
  showHoldingResult,
  showSettlementCash,
}: {
  inputs: InputState;
  result: CalculatorResult;
  showHoldingResult: boolean;
  showSettlementCash: boolean;
}) {
  const transactionTone = toneFor(result.transactionProfit);

  return (
    <>
      <div
        className={`primary-result ${transactionTone}`}
        role="status"
        aria-atomic="true"
      >
        <div className="primary-result-heading">
          <span>
            {transactionTone === "loss"
              ? "Whole-property transaction loss"
              : "Whole-property transaction profit"}
          </span>
          <OutcomeStatus tone={transactionTone} />
        </div>
        <strong>{aud.format(result.transactionProfit)}</strong>
        <small>
          Before holding costs, rental income, loan payout and tax. Additional
          results appear separately when you enter them.
        </small>
      </div>

      <div className="result-breakdown">
        <ResultRow
          label="Expected sale price"
          value={numberFromInput(inputs.salePrice)}
        />
        <ResultRow
          label="Agent commission"
          value={result.agentCommission}
          subtract
        />
        <ResultRow
          label="Other selling costs"
          value={numberFromInput(inputs.otherSellingCosts)}
          subtract
        />
        {numberFromInput(inputs.salePreparationCosts) > 0 ? (
          <ResultRow
            label="Sale preparation costs"
            value={numberFromInput(inputs.salePreparationCosts)}
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
          value={numberFromInput(inputs.purchasePrice)}
          subtract
        />
        {numberFromInput(inputs.purchaseCosts) > 0 ? (
          <ResultRow
            label="Buying costs"
            value={numberFromInput(inputs.purchaseCosts)}
            subtract
          />
        ) : null}
        {numberFromInput(inputs.renovationsAndImprovements) > 0 ? (
          <ResultRow
            label="Renovations and improvements"
            value={numberFromInput(inputs.renovationsAndImprovements)}
            subtract
          />
        ) : null}
        <div className="result-divider" />
        <ResultRow
          label={
            transactionTone === "loss"
              ? "Transaction loss"
              : "Transaction profit"
          }
          value={result.transactionProfit}
        />
      </div>

      <CalculationDetails>
        <p>
          Expected sale price minus commission, selling and preparation costs,
          purchase price, buying costs and improvements.
        </p>
        <code>
          {aud.format(numberFromInput(inputs.salePrice))} −{" "}
          {aud.format(result.agentCommission)} −{" "}
          {aud.format(numberFromInput(inputs.otherSellingCosts))} −{" "}
          {aud.format(numberFromInput(inputs.salePreparationCosts))} −{" "}
          {aud.format(numberFromInput(inputs.purchasePrice))} −{" "}
          {aud.format(numberFromInput(inputs.purchaseCosts))} −{" "}
          {aud.format(numberFromInput(inputs.renovationsAndImprovements))} ={" "}
          {aud.format(result.transactionProfit)}
        </code>
      </CalculationDetails>

      {showHoldingResult ? (
        <HoldingResult inputs={inputs} result={result} />
      ) : null}

      {showSettlementCash ? (
        <SettlementCashResult inputs={inputs} result={result} />
      ) : null}
    </>
  );
}

function HoldingResult({
  inputs,
  result,
}: {
  inputs: InputState;
  result: CalculatorResult;
}) {
  const tone = toneFor(result.overallPreTaxPropertyResult);

  return (
    <section
      className={`supplementary-result ${tone}`}
      aria-labelledby="overall-result-title"
    >
      <div className="supplementary-result-heading">
        <div>
          <span>Holding-period cash flows</span>
          <h3 id="overall-result-title">Overall pre-tax property result</h3>
        </div>
        <OutcomeStatus tone={tone} />
      </div>
      <ResultRow label="Transaction profit" value={result.transactionProfit} />
      <ResultRow
        label="Rental income"
        value={numberFromInput(inputs.totalRentalIncome)}
      />
      <ResultRow
        label="Holding costs"
        value={numberFromInput(inputs.totalHoldingCosts)}
        subtract
      />
      <div className="supplementary-total">
        <span>Overall pre-tax result</span>
        <strong>{aud.format(result.overallPreTaxPropertyResult)}</strong>
      </div>
      <small>
        Before tax. Loan principal repayments are excluded because the purchase
        price is already counted in transaction profit.
      </small>
      <CalculationDetails>
        <code>
          {aud.format(result.transactionProfit)} +{" "}
          {aud.format(numberFromInput(inputs.totalRentalIncome))} −{" "}
          {aud.format(numberFromInput(inputs.totalHoldingCosts))} ={" "}
          {aud.format(result.overallPreTaxPropertyResult)}
        </code>
      </CalculationDetails>
    </section>
  );
}

function SettlementCashResult({
  inputs,
  result,
}: {
  inputs: InputState;
  result: CalculatorResult;
}) {
  const tone = toneFor(result.estimatedCashAfterLoanPayout);

  return (
    <section
      className={`supplementary-result ${tone}`}
      aria-labelledby="settlement-cash-title"
    >
      <div className="supplementary-result-heading">
        <div>
          <span>Simplified settlement cash</span>
          <h3 id="settlement-cash-title">
            {tone === "loss"
              ? "Estimated cash shortfall after loan payout"
              : "Estimated cash after loan payout"}
          </h3>
        </div>
        <OutcomeStatus
          tone={tone}
          gainLabel="ESTIMATE"
          lossLabel="SHORTFALL"
        />
      </div>
      <ResultRow
        label="Amount after selling costs"
        value={result.amountAfterSellingCosts}
      />
      <ResultRow
        label="Estimated loan payout"
        value={numberFromInput(inputs.estimatedLoanPayout)}
        subtract
      />
      <div className="supplementary-total">
        <span>
          {tone === "loss" ? "Estimated cash shortfall" : "Estimated cash"}
        </span>
        <strong>{aud.format(result.estimatedCashAfterLoanPayout)}</strong>
      </div>
      <small>
        Before tax and unentered settlement adjustments. Confirm the actual
        payout with your lender and settlement professional.
      </small>
      <CalculationDetails>
        <code>
          {aud.format(result.amountAfterSellingCosts)} −{" "}
          {aud.format(numberFromInput(inputs.estimatedLoanPayout))} ={" "}
          {aud.format(result.estimatedCashAfterLoanPayout)}
        </code>
      </CalculationDetails>
    </section>
  );
}
