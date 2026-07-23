# Calculation scenario coverage

This document records the calculator behaviour intentionally supported by the
current release and maps each scenario to its automated tests. It describes
software behaviour, not tax, financial, legal, valuation, accounting, or
settlement advice.

## How to read the coverage column

- **Unit + E2E** — the calculation rule and its browser-visible behaviour are
  both tested.
- **Unit only** — the calculation boundary is tested directly because a normal
  browser control cannot produce that input.
- **Disclosure E2E** — the calculator deliberately excludes the scenario and
  the exclusion is tested in the rendered product.

Coverage labels are written as text so that they do not depend on colour.

## Entered-cost transaction scenarios

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Four-input quick estimate | `agent commission = sale price × commission rate`<br>`total selling costs = agent commission + other selling costs`<br>`sale proceeds before debt and tax = sale price − total selling costs`<br>`transaction result = sale proceeds − purchase price` | **Unit + E2E** — [unit: `calculates the four-input transaction estimate`](../tests/calculator.test.ts); [E2E: `requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) |
| Explicit zero commission and other selling costs | Zero is a valid entered cost. Sale price and purchase price must still be greater than zero. | **Unit + E2E** — [unit: `treats explicit zero commission and selling costs as valid`](../tests/calculator.test.ts); [E2E: `requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) |
| Detailed transaction estimate | `transaction result = sale proceeds − purchase price − purchase costs − renovations and improvements`<br>Sale preparation costs are also included in total selling costs. | **Unit + E2E** — [unit: `applies every optional transaction cost to the correct result`](../tests/calculator.test.ts); [E2E: `applies optional costs to transaction profit and entered-cost break-even`](../tests/e2e/calculator.spec.ts) |
| Profit and loss outcomes | A result below zero is labelled **LOSS**; zero or more is labelled **PROFIT**. The outcome is expressed with text and a sign, not colour alone. | **Unit + E2E** — [unit: `preserves an entered-cost transaction loss`](../tests/calculator.test.ts); [E2E: `shows an explicit non-colour transaction loss status`](../tests/e2e/calculator.spec.ts) |
| Entered-cost break-even sale price | `(purchase price + purchase costs + renovations and improvements + other selling costs + sale preparation costs) ÷ (1 − commission rate)` | **Unit + E2E** — [unit: `applies every optional transaction cost to the correct result`](../tests/calculator.test.ts); [E2E: `applies optional costs to transaction profit and entered-cost break-even`](../tests/e2e/calculator.spec.ts) |
| Sale-price sensitivity | Three illustrative scenarios use 95%, 100% and 105% of the entered expected sale price. For each scenario, percentage commission is recalculated from the scenario sale price; purchase price and all other entered costs remain fixed. Each row explicitly labels its result as **PROFIT** or **LOSS**. These scenarios are not price predictions. | **Unit + E2E** — [unit: `calculates sale-price sensitivity with scenario commission`](../tests/calculator.test.ts); [E2E: `shows sale-price sensitivity and recalculates commission`](../tests/e2e/calculator.spec.ts) |
| Cost placement | Agent commission, other selling costs, and sale preparation reduce sale proceeds. Purchase costs and renovations reduce the transaction result but not sale proceeds. All five cost groups affect the entered-cost break-even price. | **Unit + E2E** — [unit: `applies every optional transaction cost to the correct result`](../tests/calculator.test.ts); [E2E: `applies optional costs to transaction profit and entered-cost break-even`](../tests/e2e/calculator.spec.ts) |
| Grouped monetary input | Monetary text is normalised for calculation and displayed with thousands separators. | **Unit + E2E** — [unit: `formats monetary input with grouping separators`](../tests/calculator.test.ts); [E2E: `requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) |
| Estimate level | Supplying any optional cost changes the result label from **Quick estimate** to **Adjusted estimate**. | **Unit + E2E** — [unit: `marks each optional detail as an adjusted estimate`](../tests/calculator.test.ts); [E2E: `applies optional costs to transaction profit and entered-cost break-even`](../tests/e2e/calculator.spec.ts) |

## Validation and interaction guardrails

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Incomplete quick inputs | No numeric result is shown until sale price, purchase price, commission, and other selling costs have all been entered. | **E2E** — [`requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) |
| Sale price or purchase price is zero or negative | Both prices must be greater than zero. An invalid value prevents a numeric result. | **Unit + E2E** — [unit: `requires positive sale and purchase prices`](../tests/calculator.test.ts); [E2E: `rejects zero sale and purchase prices`](../tests/e2e/calculator.spec.ts) |
| Invalid commission | Commission must be at least 0% and below 100%. A rate of 100% would make the break-even denominator zero and is rejected. | **Unit + E2E** — [unit: `rejects invalid commission rates`](../tests/calculator.test.ts); [E2E: `rejects impossible commission rates`](../tests/e2e/calculator.spec.ts) |
| Negative optional costs | Other selling costs, sale preparation, purchase costs, and renovations must be zero or greater. | **Unit + E2E** — [unit: `rejects negative optional transaction costs`](../tests/calculator.test.ts); [E2E: `rejects negative quick and detailed costs`](../tests/e2e/calculator.spec.ts) |
| Non-finite model input | `NaN` and infinite monetary values are rejected by the calculation model. Native browser inputs cannot normally emit these values. | **Unit only** — [`rejects non-finite monetary values`](../tests/calculator.test.ts) |
| Malformed monetary text | Empty or non-numeric monetary text normalises to zero before model validation. | **Unit only** — [`normalises partial and malformed monetary text safely`](../tests/calculator.test.ts) |
| Reset | Reset clears the entered values and returns the result panel to its incomplete state. | **E2E** — [`resets the calculator and avoids mobile horizontal overflow`](../tests/e2e/calculator.spec.ts) |
| Print | Print remains disabled until the four required inputs are valid, then becomes available. The printable result includes the sale-price sensitivity table. | **E2E** — [`requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts); [`includes sale-price sensitivity in the printable result`](../tests/e2e/calculator.spec.ts) |
| Mobile layout | The form and result remain readable without horizontal page overflow at the tested mobile viewport. | **E2E** — [`resets the calculator and avoids horizontal overflow on mobile`](../tests/e2e/calculator.spec.ts) |

## Explicitly outside the current model

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Mortgage and settlement cash | Loan balances, discharge amounts, settlement adjustments, and funds delivered at settlement are excluded. | **Disclosure E2E** — [`publishes material limitations and government non-affiliation`](../tests/e2e/compliance.spec.ts) |
| Historical holding cash flows | Interest, rates, insurance, maintenance, rent, depreciation, and other historical cash flows are excluded. | **Disclosure E2E** — [`publishes material limitations and government non-affiliation`](../tests/e2e/compliance.spec.ts) |
| Tax and accounting outcomes | CGT, income tax, taxable gain, accounting profit, and after-tax profit are not calculated. User-entered labels do not classify costs for tax or accounting purposes. | **Disclosure E2E + absence E2E** — [disclosure: `publishes material limitations and government non-affiliation`](../tests/e2e/compliance.spec.ts); [absence: `does not expose a tax calculation path`](../tests/e2e/calculator.spec.ts) |
| Property valuation or sale-price prediction | The user supplies the expected sale price; the calculator does not predict market value or a future sale price. | **Disclosure E2E** — [`publishes material limitations and government non-affiliation`](../tests/e2e/compliance.spec.ts) |
| Ownership allocation | The result is for the whole property. It is not apportioned among owners. | **Disclosure E2E** — [`publishes material limitations and government non-affiliation`](../tests/e2e/compliance.spec.ts) |
| Complete investment return | Because holding-period income, expenses, financing, and time are excluded, the result is not an economic return, annual return, or complete investment performance measure. | **Disclosure E2E** — [`publishes material limitations and government non-affiliation`](../tests/e2e/compliance.spec.ts) |

## Maintenance rule

When calculation behaviour changes, update the corresponding row in this file
in the same pull request. Add a row for every new user-visible calculation,
guardrail, or material exclusion, and link it to a focused automated test.
