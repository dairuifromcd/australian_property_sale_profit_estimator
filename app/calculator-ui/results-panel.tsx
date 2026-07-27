import { PlanningResults } from "./planning-results";
import { TransactionResults } from "./transaction-results";
import type { CalculatorController } from "./use-calculator-form";
import type { CalculatorMessages } from "../i18n/messages/types";

export function ResultsPanel({
  controller,
  messages,
}: {
  controller: CalculatorController;
  messages: CalculatorMessages;
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
          {hasExpandedInputs
            ? messages.results.expandedEstimate
            : messages.results.quickEstimate}
        </span>
        <span className="result-privacy">{messages.results.onDevice}</span>
      </div>

      {!hasAllQuickInputs ? (
        <div className="empty-result" role="status" aria-atomic="true">
          <span className="empty-number">$—</span>
          <h2>{messages.results.incompleteTitle}</h2>
          <p>{messages.results.incompleteBody}</p>
        </div>
      ) : result.hasTransactionErrors ? (
        <div
          className="empty-result invalid-result"
          role="status"
          aria-atomic="true"
        >
          <span className="empty-number">!</span>
          <h2>{messages.results.invalidTitle}</h2>
          <p>{messages.results.invalidBody}</p>
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
            messages={messages.results}
          />
          <PlanningResults
            inputs={inputs}
            result={result}
            targetProfit={targetProfit}
            targetSalePrice={targetSalePrice}
            updateTargetProfit={updateTargetProfit}
            messages={messages.results}
            validationMessages={messages.validation}
          />
        </>
      )}

      <button
        className="print-button no-print"
        type="button"
        onClick={() => window.print()}
        disabled={!canShowEstimate}
      >
        {messages.results.print}
      </button>
      <p className="result-note">{messages.results.resultNote}</p>
    </aside>
  );
}
