"use client";

import { useMemo, useRef, useState } from "react";
import {
  calculateEstimate,
  calculateRequiredSalePrice,
  type CalculatorInput,
} from "../calculator";
import { numberFromInput } from "../input-format";

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

export function useCalculatorForm() {
  const [inputs, setInputs] = useState<InputState>(INITIAL_INPUTS);
  const [targetProfit, setTargetProfit] = useState("");
  const transactionDetailsRef = useRef<HTMLDetailsElement>(null);
  const holdingDetailsRef = useRef<HTMLDetailsElement>(null);

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
  };

  const calculatorInput = useMemo<CalculatorInput>(
    () => ({
      salePrice: numberFromInput(inputs.salePrice),
      purchasePrice: numberFromInput(inputs.purchasePrice),
      commissionRate: numberFromInput(inputs.commissionRate),
      otherSellingCosts: numberFromInput(inputs.otherSellingCosts),
      salePreparationCosts: numberFromInput(inputs.salePreparationCosts),
      purchaseCosts: numberFromInput(inputs.purchaseCosts),
      renovationsAndImprovements: numberFromInput(
        inputs.renovationsAndImprovements,
      ),
      estimatedLoanPayout: numberFromInput(inputs.estimatedLoanPayout),
      totalHoldingCosts: numberFromInput(inputs.totalHoldingCosts),
      totalRentalIncome: numberFromInput(inputs.totalRentalIncome),
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
        targetProfit === "-" ? Number.NaN : numberFromInput(targetProfit),
      ),
    [calculatorInput, targetProfit],
  );

  const errorFor = (field: keyof CalculatorInput) => {
    if (inputs[field] === "") return undefined;
    return result.validationErrors.find((error) => error.field === field)
      ?.message;
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

  return {
    inputs,
    targetProfit,
    transactionDetailsRef,
    holdingDetailsRef,
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
    canShowEstimate: hasAllQuickInputs && !result.hasTransactionErrors,
  };
}

export type CalculatorController = ReturnType<typeof useCalculatorForm>;
