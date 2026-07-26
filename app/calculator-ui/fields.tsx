"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  formatAmountInput,
  normaliseAmountInputDraft,
} from "../input-format";

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

type AmountInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
};

function selectionPosition(value: string, position: number | null): number {
  if (position === null) {
    return normaliseAmountInputDraft(value).length;
  }

  return normaliseAmountInputDraft(value.slice(0, position)).length;
}

export function AmountInput({
  id,
  value,
  onChange,
  placeholder,
  describedBy,
  invalid = false,
  required = false,
}: AmountInputProps) {
  const [hasEditedSinceFocus, setHasEditedSinceFocus] = useState(false);
  const [selectionRevision, setSelectionRevision] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingSelectionRef = useRef<{
    start: number;
    end: number;
  } | null>(null);
  const displayedValue = hasEditedSinceFocus
    ? normaliseAmountInputDraft(value)
    : formatAmountInput(value);

  useLayoutEffect(() => {
    const pendingSelection = pendingSelectionRef.current;
    if (!pendingSelection || !inputRef.current) {
      return;
    }

    inputRef.current.setSelectionRange(
      pendingSelection.start,
      pendingSelection.end,
    );
    pendingSelectionRef.current = null;
  }, [displayedValue, hasEditedSinceFocus, selectionRevision]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="decimal"
      value={displayedValue}
      onFocus={() => setHasEditedSinceFocus(false)}
      onChange={(event) => {
        pendingSelectionRef.current = {
          start: selectionPosition(
            event.currentTarget.value,
            event.currentTarget.selectionStart,
          ),
          end: selectionPosition(
            event.currentTarget.value,
            event.currentTarget.selectionEnd,
          ),
        };
        onChange(normaliseAmountInputDraft(event.currentTarget.value));
        setHasEditedSinceFocus(true);
        setSelectionRevision((revision) => revision + 1);
      }}
      onBlur={(event) => {
        pendingSelectionRef.current = null;
        onChange(
          normaliseAmountInputDraft(
            formatAmountInput(event.currentTarget.value),
          ),
        );
        setHasEditedSinceFocus(false);
      }}
      placeholder={placeholder}
      aria-describedby={describedBy}
      aria-invalid={invalid ? true : undefined}
      required={required}
    />
  );
}

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
        <AmountInput
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          describedBy={describedBy}
          invalid={Boolean(error)}
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
