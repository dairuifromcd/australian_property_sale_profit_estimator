import type { ReactNode } from "react";
import { aud, exactAud, exactTone } from "./format";

export type ResultTone = "gain" | "loss";

export function toneFor(value: number): ResultTone {
  return value < 0 ? "loss" : "gain";
}

export function ResultRow({
  label,
  value,
  exact,
  subtract = false,
}: {
  label: string;
  value: number;
  exact?: string;
  subtract?: boolean;
}) {
  const positive = exact === undefined ? value > 0 : exact !== "0" && exactTone(exact) === "gain";
  return (
    <div className="result-row">
      <span>{label}</span>
      <strong>
        {subtract && positive ? "−" : ""}
        {exact === undefined ? aud.format(value) : exactAud(exact)}
      </strong>
    </div>
  );
}

export function CalculationDetails({
  children,
  summary,
}: {
  children: ReactNode;
  summary: string;
}) {
  return (
    <details className="calculation-details">
      <summary>{summary}</summary>
      <div>{children}</div>
    </details>
  );
}

export function OutcomeStatus({
  tone,
  gainLabel,
  lossLabel,
}: {
  tone: ResultTone;
  gainLabel: string;
  lossLabel: string;
}) {
  return (
    <span className={`outcome-status ${tone}`}>
      {tone === "loss" ? lossLabel : gainLabel}
    </span>
  );
}
