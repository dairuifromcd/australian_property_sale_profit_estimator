import { PlanningResults } from "./planning-results";
import { TransactionResults } from "./transaction-results";
import type { CalculatorController } from "./use-calculator-form";

export function ResultsPanel({
  controller,
}: {
  controller: CalculatorController;
}) {
  const {
    inputs,
    targetProfit,
    result,
    targetSalePrice,
    hasExpandedInputs,
    hasAllQuickInputs,
    hasHoldingCashFlowInputs,
    hasLoanPayoutInput,
    hasHoldingCashFlowErrors,
    hasLoanPayoutError,
    canShowEstimate,
    updateTargetProfit,
  } = controller;

  return (
    <aside className="results-panel">
      <div className="result-topline">
        <span className="estimate-level">
          {hasExpandedInputs ? "Expanded estimate" : "Quick estimate"}
        </span>
        <span className="result-privacy">On-device</span>
      </div>

      {!hasAllQuickInputs ? (
        <div className="empty-result" role="status" aria-atomic="true">
          <span className="empty-number">$—</span>
          <h2>Complete the four quick inputs</h2>
          <p>Enter 0 if commission or other selling costs do not apply.</p>
        </div>
      ) : result.hasTransactionErrors ? (
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
          <TransactionResults
            inputs={inputs}
            result={result}
            showHoldingResult={
              hasHoldingCashFlowInputs && !hasHoldingCashFlowErrors
            }
            showSettlementCash={hasLoanPayoutInput && !hasLoanPayoutError}
          />
          <PlanningResults
            inputs={inputs}
            result={result}
            targetProfit={targetProfit}
            targetSalePrice={targetSalePrice}
            updateTargetProfit={updateTargetProfit}
          />
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
        Indicative estimates only—not accounting profit or a tax calculation.
        Settlement cash excludes unentered adjustments. Confirm important
        figures with qualified professionals before making a decision.
      </p>
    </aside>
  );
}
