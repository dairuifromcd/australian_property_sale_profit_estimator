import type { CalculatorResult } from "../calculator";
import { numberFromInput } from "../input-format";
import { calculationAud, exactAud, exactTone } from "./format";
import {
  CalculationDetails,
  OutcomeStatus,
  ResultRow,
} from "./result-primitives";
import type { InputState } from "./use-calculator-form";
import type { SiteMessages } from "../i18n/messages/types";

export function TransactionResults({
  inputs,
  result,
  showHoldingResult,
  showSettlementCash,
  messages,
}: {
  inputs: InputState;
  result: CalculatorResult;
  showHoldingResult: boolean;
  showSettlementCash: boolean;
  messages: SiteMessages["results"];
}) {
  const transactionTone = exactTone(result.exact.transactionProfit);

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
              ? messages.transactionLossTitle
              : messages.transactionProfitTitle}
          </span>
          <OutcomeStatus
            tone={transactionTone}
            gainLabel={messages.profitStatus}
            lossLabel={messages.lossStatus}
          />
        </div>
        <strong>{exactAud(result.exact.transactionProfit)}</strong>
        <small>
          {messages.transactionIntro}
        </small>
      </div>

      {showHoldingResult ? (
        <HoldingResult inputs={inputs} result={result} messages={messages} />
      ) : null}

      {showSettlementCash ? (
        <SettlementCashResult
          inputs={inputs}
          result={result}
          messages={messages}
        />
      ) : null}

      <div className="result-breakdown">
        <ResultRow
          label={messages.expectedSalePrice}
          value={numberFromInput(inputs.salePrice)}
        />
        <ResultRow
          label={messages.agentCommission}
          value={result.agentCommission}
          exact={result.exact.agentCommission}
          subtract
        />
        <ResultRow
          label={messages.otherSellingCosts}
          value={numberFromInput(inputs.otherSellingCosts)}
          subtract
        />
        {numberFromInput(inputs.salePreparationCosts) > 0 ? (
          <ResultRow
            label={messages.salePreparationCosts}
            value={numberFromInput(inputs.salePreparationCosts)}
            subtract
          />
        ) : null}
        <div className="result-divider" />
        <ResultRow
          label={messages.amountAfterSellingCosts}
          value={result.amountAfterSellingCosts}
          exact={result.exact.amountAfterSellingCosts}
        />
        <ResultRow
          label={messages.purchasePrice}
          value={numberFromInput(inputs.purchasePrice)}
          subtract
        />
        {numberFromInput(inputs.purchaseCosts) > 0 ? (
          <ResultRow
            label={messages.buyingCosts}
            value={numberFromInput(inputs.purchaseCosts)}
            subtract
          />
        ) : null}
        {numberFromInput(inputs.renovationsAndImprovements) > 0 ? (
          <ResultRow
            label={messages.renovations}
            value={numberFromInput(inputs.renovationsAndImprovements)}
            subtract
          />
        ) : null}
        <div className="result-divider" />
        <ResultRow
          label={
            transactionTone === "loss"
              ? messages.transactionLoss
              : messages.transactionProfit
          }
          value={result.transactionProfit}
          exact={result.exact.transactionProfit}
        />
      </div>

      <CalculationDetails summary={messages.showCalculation}>
        <p>{messages.transactionCalculation}</p>
        <code>
          {calculationAud.format(numberFromInput(inputs.salePrice))} −{" "}
          {exactAud(result.exact.agentCommission, 2)} −{" "}
          {calculationAud.format(numberFromInput(inputs.otherSellingCosts))} −{" "}
          {calculationAud.format(numberFromInput(inputs.salePreparationCosts))}{" "}
          − {calculationAud.format(numberFromInput(inputs.purchasePrice))} −{" "}
          {calculationAud.format(numberFromInput(inputs.purchaseCosts))} −{" "}
          {calculationAud.format(
            numberFromInput(inputs.renovationsAndImprovements),
          )}{" "}
          ≈ {exactAud(result.exact.transactionProfit, 2)}
        </code>
        <small>{messages.displayedAmountsNote}</small>
      </CalculationDetails>
    </>
  );
}

function HoldingResult({
  inputs,
  result,
  messages,
}: {
  inputs: InputState;
  result: CalculatorResult;
  messages: SiteMessages["results"];
}) {
  const tone = exactTone(result.exact.overallPreTaxPropertyResult);

  const operands = (
    <>
      <ResultRow
        label={messages.transactionProfit}
        value={result.transactionProfit}
        exact={result.exact.transactionProfit}
      />
      <ResultRow
        label={messages.rentalIncome}
        value={numberFromInput(inputs.totalRentalIncome)}
      />
      <ResultRow
        label={messages.holdingCosts}
        value={numberFromInput(inputs.totalHoldingCosts)}
        subtract
      />
    </>
  );

  return (
    <section
      className={`supplementary-result ${tone}`}
      aria-labelledby="overall-result-title"
    >
      <div className="supplementary-result-heading">
        <div>
          <span>{messages.holdingPeriodCashFlows}</span>
          <h3 id="overall-result-title">{messages.overallResultTitle}</h3>
        </div>
        <OutcomeStatus
          tone={tone}
          gainLabel={messages.profitStatus}
          lossLabel={messages.lossStatus}
        />
      </div>
      <div className="supplementary-total">
        <span>{messages.overallResult}</span>
        <strong>{exactAud(result.exact.overallPreTaxPropertyResult)}</strong>
      </div>
      <small>{messages.overallResultNote}</small>
      <div className="print-only-operands">{operands}</div>
      <CalculationDetails summary={messages.showCalculation}>
        {operands}

        <code>
          {exactAud(result.exact.transactionProfit, 2)} +{" "}
          {calculationAud.format(numberFromInput(inputs.totalRentalIncome))} −{" "}
          {calculationAud.format(numberFromInput(inputs.totalHoldingCosts))} ≈{" "}
          {exactAud(result.exact.overallPreTaxPropertyResult, 2)}
        </code>
        <small>{messages.transactionPrecisionNote}</small>
      </CalculationDetails>
    </section>
  );
}

function SettlementCashResult({
  inputs,
  result,
  messages,
}: {
  inputs: InputState;
  result: CalculatorResult;
  messages: SiteMessages["results"];
}) {
  const tone = exactTone(result.exact.estimatedCashAfterLoanPayout);

  const operands = (
    <>
      <ResultRow
        label={messages.amountAfterSellingCosts}
        value={result.amountAfterSellingCosts}
        exact={result.exact.amountAfterSellingCosts}
      />
      <ResultRow
        label={messages.estimatedLoanPayout}
        value={numberFromInput(inputs.estimatedLoanPayout)}
        subtract
      />
    </>
  );

  return (
    <section
      className={`supplementary-result ${tone}`}
      aria-labelledby="settlement-cash-title"
    >
      <div className="supplementary-result-heading">
        <div>
          <span>{messages.settlementCashLabel}</span>
          <h3 id="settlement-cash-title">
            {tone === "loss"
              ? messages.settlementShortfallTitle
              : messages.settlementCashTitle}
          </h3>
        </div>
        <OutcomeStatus
          tone={tone}
          gainLabel={messages.estimateStatus}
          lossLabel={messages.shortfallStatus}
        />
      </div>
      <div className="supplementary-total">
        <span>
          {tone === "loss"
            ? messages.estimatedCashShortfall
            : messages.estimatedCash}
        </span>
        <strong>{exactAud(result.exact.estimatedCashAfterLoanPayout)}</strong>
      </div>
      <small>{messages.settlementNote}</small>
      <div className="print-only-operands">{operands}</div>
      <CalculationDetails summary={messages.showCalculation}>
        {operands}

        <code>
          {exactAud(result.exact.amountAfterSellingCosts, 2)} −{" "}
          {calculationAud.format(
            numberFromInput(inputs.estimatedLoanPayout),
          )}{" "}
          ≈ {exactAud(result.exact.estimatedCashAfterLoanPayout, 2)}
        </code>
        <small>{messages.settlementPrecisionNote}</small>
      </CalculationDetails>
    </section>
  );
}
