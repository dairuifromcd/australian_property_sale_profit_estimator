import type { ReactNode } from "react";
import { formatAmountInput } from "../input-format";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
};

type AmountFieldProps = FieldProps & {
  help?: ReactNode;
};

export function AmountField({
  id,
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  required = false,
}: AmountFieldProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {required ? <span className="required">Required</span> : null}
      </span>
      <span className={`money-input ${error ? "field-control-error" : ""}`}>
        <span aria-hidden="true">$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(formatAmountInput(event.target.value))}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
        />
        <span className="currency" aria-hidden="true">
          AUD
        </span>
      </span>
      {help ? (
        <span className="field-help" id={helpId}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

type PercentageFieldProps = FieldProps & {
  help?: string;
  max?: number;
};

export function PercentageField({
  id,
  label,
  value,
  onChange,
  placeholder,
  help,
  error,
  max = 100,
  required = false,
}: PercentageFieldProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {required ? <span className="required">Required</span> : null}
      </span>
      <span className={`percent-input ${error ? "field-control-error" : ""}`}>
        <input
          id={id}
          type="number"
          min="0"
          max={max}
          step="0.1"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          required={required}
        />
        <span aria-hidden="true">%</span>
      </span>
      {help ? (
        <span className="field-help" id={helpId}>
          {help}
        </span>
      ) : null}
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
