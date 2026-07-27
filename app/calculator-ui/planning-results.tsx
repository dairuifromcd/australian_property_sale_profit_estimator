import type {
  CalculatorResult,
  RequiredSalePriceResult,
} from "../calculator";
import { numberFromInput } from "../input-format";
import { AmountInput } from "./fields";
import { aud, calculationAud } from "./format";
import { CalculationDetails, toneFor } from "./result-primitives";
import type { InputState } from "./use-calculator-form";
import type { SiteMessages } from "../i18n/messages/types";
import { interpolate } from "../i18n/interpolate";

export function PlanningResults({
  inputs,
  result,
  targetProfit,
  targetSalePrice,
  updateTargetProfit,
  messages,
  validationMessages,
}: {
  inputs: InputState;
  result: CalculatorResult;
  targetProfit: string;
  targetSalePrice: RequiredSalePriceResult;
  updateTargetProfit: (value: string) => void;
  messages: SiteMessages["results"];
  validationMessages: SiteMessages["validation"];
}) {
  const targetProfitErrorCode =
    targetProfit === "" ? null : targetSalePrice.validationError;
  const targetProfitError = targetProfitErrorCode
    ? validationMessages[targetProfitErrorCode]
    : undefined;
  const hasTargetSalePrice =
    targetProfit !== "" &&
    targetSalePrice.requiredSalePrice !== null &&
    targetSalePrice.differenceFromExpectedSalePrice !== null;
  const roundedTargetDifference = Math.round(
    targetSalePrice.differenceFromExpectedSalePrice ?? 0,
  );
  const targetDifferenceText =
    roundedTargetDifference === 0
      ? messages.targetMatches
      : interpolate(
          roundedTargetDifference > 0
            ? messages.targetAbove
            : messages.targetBelow,
          {
            difference: aud.format(Math.abs(roundedTargetDifference)),
            salePrice: aud.format(numberFromInput(inputs.salePrice)),
          },
        );

  return (
    <>
      <div className="secondary-metric">
        <div>
          <span>{messages.breakEvenLabel}</span>
          <CalculationDetails summary={messages.showCalculation}>
            <p>{messages.breakEvenExplanation}</p>
            <code>
              {calculationAud.format(result.fixedTransactionCosts)} ÷ (1 −{" "}
              {numberFromInput(inputs.commissionRate)}%) →{" "}
              {messages.roundedUp} ={" "}
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
          <h3 id="target-sale-price-title">{messages.targetTitle}</h3>
          <p>{messages.targetIntro}</p>
        </div>

        <label
          className="target-profit-control no-print"
          htmlFor="target-profit"
        >
          <span>{messages.targetProfit}</span>
          <span
            className={`money-input ${
              targetProfitError ? "field-control-error" : ""
            }`}
          >
            <span aria-hidden="true">$</span>
            <AmountInput
              id="target-profit"
              value={targetProfit}
              onChange={updateTargetProfit}
              placeholder="100,000"
              describedBy={
                targetProfitError
                  ? "target-profit-help target-profit-error"
                  : "target-profit-help"
              }
              invalid={Boolean(targetProfitError)}
            />
            <span className="currency" aria-hidden="true">
              AUD
            </span>
          </span>
          <small id="target-profit-help">
            {messages.targetProfitHelp}
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
            <span>{messages.targetResultLabel}</span>
            <strong>
              {aud.format(targetSalePrice.requiredSalePrice ?? 0)}
            </strong>
            <small>{targetDifferenceText}</small>
            <CalculationDetails summary={messages.showCalculation}>
              <p>{messages.targetCalculation}</p>
              <code>
                ({calculationAud.format(result.fixedTransactionCosts)} +{" "}
                {calculationAud.format(numberFromInput(targetProfit))}) ÷ (1 −{" "}
                {numberFromInput(inputs.commissionRate)}%) →{" "}
                {messages.roundedUp} ={" "}
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
          <h3 id="sale-sensitivity-title">{messages.sensitivityTitle}</h3>
          <p>{messages.sensitivityIntro}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col">{messages.scenario}</th>
              <th scope="col">{messages.salePrice}</th>
              <th scope="col">{messages.result}</th>
            </tr>
          </thead>
          <tbody>
            {result.salePriceSensitivity.map((scenario) => {
              const scenarioTone = toneFor(scenario.transactionProfit);
              const scenarioLabel =
                scenario.changePercent === 0
                  ? messages.current
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
                      {scenarioTone === "loss"
                        ? messages.loss
                        : messages.profit}
                    </small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <CalculationDetails summary={messages.showCalculation}>
          <p>{messages.sensitivityCalculation}</p>
          {result.salePriceSensitivity.map((scenario) => (
            <code key={scenario.changePercent}>
              {calculationAud.format(scenario.salePrice)} −{" "}
              {calculationAud.format(scenario.agentCommission)}{" "}
              {messages.commissionFormulaLabel} −{" "}
              {calculationAud.format(result.fixedTransactionCosts)}{" "}
              {messages.fixedCostsFormulaLabel} ≈{" "}
              {calculationAud.format(scenario.transactionProfit)}
            </code>
          ))}
          <small>{messages.sensitivityPrecisionNote}</small>
        </CalculationDetails>
      </section>
    </>
  );
}
