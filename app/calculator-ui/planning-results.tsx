import type {
  CalculatorResult,
  RequiredSalePriceResult,
} from "../calculator";
import { numberFromInput } from "../input-format";
import { AmountInput } from "./fields";
import { aud, calculationAud } from "./format";
import { CalculationDetails, toneFor } from "./result-primitives";
import type { InputState } from "./use-calculator-form";

export function PlanningResults({
  inputs,
  result,
  targetProfit,
  targetSalePrice,
  updateTargetProfit,
}: {
  inputs: InputState;
  result: CalculatorResult;
  targetProfit: string;
  targetSalePrice: RequiredSalePriceResult;
  updateTargetProfit: (value: string) => void;
}) {
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
          numberFromInput(inputs.salePrice),
        )}.`;

  return (
    <>
      <div className="secondary-metric">
        <div>
          <span>Break-even sale price for entered transaction costs</span>
          <CalculationDetails>
            <p>
              Fixed transaction costs divided by one minus the commission rate.
              Rounded up to the next dollar.
            </p>
            <code>
              {calculationAud.format(result.fixedTransactionCosts)} ÷ (1 −{" "}
              {numberFromInput(inputs.commissionRate)}%) → rounded up ={" "}
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
          <h3 id="target-sale-price-title">Sale price for a target profit</h3>
          <p>
            Set a whole-property transaction profit before holding cash flows,
            loan payout and tax. Commission is recalculated at the required
            sale price, which is rounded up to the next dollar.
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
                Entered fixed transaction costs plus target profit, divided by
                one minus the commission rate. Rounded up to the next dollar.
              </p>
              <code>
                ({calculationAud.format(result.fixedTransactionCosts)} +{" "}
                {calculationAud.format(numberFromInput(targetProfit))}) ÷ (1 −{" "}
                {numberFromInput(inputs.commissionRate)}%) → rounded up ={" "}
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
            price—not a price prediction. Commission is recalculated; other
            entered costs stay fixed.
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
              const scenarioTone = toneFor(scenario.transactionProfit);
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
                    <small>{scenarioTone === "loss" ? "Loss" : "Profit"}</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <CalculationDetails>
          <p>
            Each row recalculates commission from its scenario sale price, then
            subtracts the same fixed transaction costs.
          </p>
          {result.salePriceSensitivity.map((scenario) => (
            <code key={scenario.changePercent}>
              {calculationAud.format(scenario.salePrice)} −{" "}
              {calculationAud.format(scenario.agentCommission)} commission −{" "}
              {calculationAud.format(result.fixedTransactionCosts)} fixed costs{" "}
              ≈ {calculationAud.format(scenario.transactionProfit)}
            </code>
          ))}
          <small>
            Displayed amounts are rounded to cents; each scenario uses values
            before display rounding.
          </small>
        </CalculationDetails>
      </section>
    </>
  );
}
