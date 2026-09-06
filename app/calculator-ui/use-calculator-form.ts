"use client";

import { useMemo, useRef, useState } from "react";
import {
  calculateEstimate,
  calculateRequiredSalePrice,
  type CalculatorInput,
} from "../calculator";
import type { SiteMessages } from "../i18n/messages/types";
import { numberFromInputForValidation } from "../input-format";

export type InputState = {
  salePrice: string;
  purchasePrice: string;
  commissionRate: string;
  otherSellingCosts: string;
  salePreparationCosts: string;
  purchaseCosts: string;
  renovationsAndImprovements: string;
  estimatedLoanPayout: string;
  totalHoldingCosts: string;
  totalRentalIncome: string;
};

const INITIAL_INPUTS: InputState = {
  salePrice: "",
  purchasePrice: "",
  commissionRate: "",
  otherSellingCosts: "",
  salePreparationCosts: "",
  purchaseCosts: "",
  renovationsAndImprovements: "",
  estimatedLoanPayout: "",
  totalHoldingCosts: "",
  totalRentalIncome: "",
};

export function useCalculatorForm(
  validationMessages: SiteMessages["validation"],
) {
  const [inputs, setInputs] = useState<InputState>(INITIAL_INPUTS);
  const [targetProfit, setTargetProfit] = useState("");
  const transactionDetailsRef = useRef<HTMLDetailsElement>(null);
  const holdingDetailsRef = useRef<HTMLDetailsElement>(null);
  const loanDetailsRef = useRef<HTMLDetailsElement>(null);

  const update = <Key extends keyof InputState>(
    key: Key,
    value: InputState[Key],
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  const updateTargetProfit = (value: string) => {
    setTargetProfit(value);
  };

  const resetCalculator = () => {
    setInputs(INITIAL_INPUTS);
    setTargetProfit("");
    transactionDetailsRef.current?.removeAttribute("open");
    holdingDetailsRef.current?.removeAttribute("open");
    loanDetailsRef.current?.removeAttribute("open");
  };

  const calculatorInput = useMemo<CalculatorInput>(
    () => ({
      salePrice: numberFromInputForValidation(inputs.salePrice),
      purchasePrice: numberFromInputForValidation(inputs.purchasePrice),
      commissionRate: numberFromInputForValidation(inputs.commissionRate),
      otherSellingCosts: numberFromInputForValidation(inputs.otherSellingCosts),
      salePreparationCosts: numberFromInputForValidation(inputs.salePreparationCosts),
      purchaseCosts: numberFromInputForValidation(inputs.purchaseCosts),
      renovationsAndImprovements: numberFromInputForValidation(
        inputs.renovationsAndImprovements,
      ),
      estimatedLoanPayout: numberFromInputForValidation(inputs.estimatedLoanPayout),
      totalHoldingCosts: numberFromInputForValidation(inputs.totalHoldingCosts),
      totalRentalIncome: numberFromInputForValidation(inputs.totalRentalIncome),
    }),
    [inputs],
  );

  const result = useMemo(
    () => calculateEstimate(calculatorInput),
    [calculatorInput],
  );
  const targetSalePrice = useMemo(
    () =>
      calculateRequiredSalePrice(
        calculatorInput,
        numberFromInputForValidation(targetProfit),
      ),
    [calculatorInput, targetProfit],
  );

  const errorFor = (field: keyof CalculatorInput) => {
    if (inputs[field] === "") return undefined;
    const code = result.validationErrors.find(
      (error) => error.field === field,
    )?.code;

    return code ? validationMessages[code] : undefined;
  };

  const hasHoldingCashFlowInputs =
    inputs.totalHoldingCosts !== "" || inputs.totalRentalIncome !== "";
  const hasLoanPayoutInput = inputs.estimatedLoanPayout !== "";
  const hasExpandedInputs =
    result.hasAdjustedInputs ||
    hasHoldingCashFlowInputs ||
    hasLoanPayoutInput;
  const hasAllQuickInputs =
    inputs.salePrice !== "" &&
    inputs.purchasePrice !== "" &&
    inputs.commissionRate !== "" &&
    inputs.otherSellingCosts !== "";
  const hasHoldingCashFlowErrors = result.validationErrors.some(
    (error) =>
      error.field === "totalHoldingCosts" ||
      error.field === "totalRentalIncome",
  );
  const hasLoanPayoutError = result.validationErrors.some(
    (error) => error.field === "estimatedLoanPayout",
  );
  const hasAnyInput =
    targetProfit !== "" ||
    Object.values(inputs).some((value) => value !== "");

  return {
    inputs,
    targetProfit,
    transactionDetailsRef,
    holdingDetailsRef,
    loanDetailsRef,
    result,
    targetSalePrice,
    errorFor,
    update,
    updateTargetProfit,
    resetCalculator,
    hasHoldingCashFlowInputs,
    hasLoanPayoutInput,
    hasExpandedInputs,
    hasAllQuickInputs,
    hasHoldingCashFlowErrors,
    hasLoanPayoutError,
    hasAnyInput,
    canShowEstimate: hasAllQuickInputs && !result.hasTransactionErrors,
  };
}

export type CalculatorController = ReturnType<typeof useCalculatorForm>;
