import type { ReactNode } from "react";
import { aud } from "./format";

export type ResultTone = "gain" | "loss";

export function toneFor(value: number): ResultTone {
  return value < 0 ? "loss" : "gain";
}

export function ResultRow({
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

export function CalculationDetails({ children }: { children: ReactNode }) {
  return (
    <details className="calculation-details">
      <summary>Show calculation</summary>
      <div>{children}</div>
    </details>
  );
}

export function OutcomeStatus({
  tone,
  gainLabel = "PROFIT",
  lossLabel = "LOSS",
}: {
  tone: ResultTone;
  gainLabel?: string;
  lossLabel?: string;
}) {
  return (
    <span className={`outcome-status ${tone}`}>
      {tone === "loss" ? lossLabel : gainLabel}
    </span>
  );
}
