# Calculation scenario coverage

This document records the calculator behaviour that is intentionally supported
by the current release and maps each scenario to its automated tests. It
describes software behaviour, not tax, financial, legal, valuation, or
settlement advice.

## How to read the coverage column

- **Unit + E2E** — the calculation rule and its browser-visible behaviour are
  both tested.
- **Unit only** — the calculation rule is tested directly, but the complete
  browser flow is not.
- **E2E only** — the browser behaviour is tested, but there is no focused unit
  test for the rule.
- **Not directly covered** — the behaviour exists in the application but needs
  a focused automated test.
- **Outside model** — the calculator deliberately does not calculate this
  scenario.

Coverage labels are written as text so that they do not depend on colour.

## Sale proceeds and economic profit

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Four-input quick estimate | `agent commission = sale price × commission rate`<br>`net sale proceeds = sale price − agent commission − eligible selling costs`<br>`pre-tax property profit = net sale proceeds − purchase price` | **Unit + E2E** — [unit: `calculates quick and adjusted property profit`](../tests/calculator.test.ts); [E2E: `requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) |
| Explicit zero commission or selling costs | Zero is treated as a valid entered cost. Sale price and purchase price must still be greater than zero. | **E2E only** — [`requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) and [`rejects zero sale and purchase prices`](../tests/e2e/calculator.spec.ts) |
| Detailed profit estimate | `pre-tax property profit = net sale proceeds − purchase price − purchase costs − capital improvements`<br>Sale preparation costs are also deducted when calculating net sale proceeds. | **Unit only** — [`calculates quick and adjusted property profit`](../tests/calculator.test.ts) and [`separates CGT-eligible selling costs from cash-only sale preparation`](../tests/calculator.test.ts) |
| Profit and loss outcomes | A result below zero is presented as a loss; zero or more is presented as a profit. The outcome is expressed with text as well as colour. | **E2E only** — [`shows an explicit non-colour loss status`](../tests/e2e/calculator.spec.ts) |
| Break-even sale price | `(purchase price + purchase costs + capital improvements + eligible selling costs + sale preparation costs) ÷ (1 − commission rate)` | **Unit only** — [`calculates quick and adjusted property profit`](../tests/calculator.test.ts) and [`separates CGT-eligible selling costs from cash-only sale preparation`](../tests/calculator.test.ts) |
| Eligible selling costs versus sale preparation | Agent commission and eligible selling costs are included in the derived CGT cost base. Sale preparation costs affect economic profit and break-even price but are not automatically added to that cost base. | **Unit only** — [`separates CGT-eligible selling costs from cash-only sale preparation`](../tests/calculator.test.ts) |
| Grouped monetary input | Monetary text is normalised to a number for calculation and displayed with thousands separators. | **Unit + E2E** — [unit: `formats monetary input with grouping separators`](../tests/calculator.test.ts); [E2E: `requires four quick inputs and accepts explicit zero costs`](../tests/e2e/calculator.spec.ts) |

## Indicative capital-gain tax scenarios

These scenarios apply only to the calculator's simplified model for an
Australian resident individual. The indicated tax is not a complete income-tax
calculation.

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Derived CGT cost base | `purchase price + purchase costs + capital improvements + agent commission + eligible selling costs − capital works deductions` | **Unit only** — [`estimates pre-July-2027 investment CGT with the 12-month discount`](../tests/calculator.test.ts) and [`keeps capital works adjustments out of economic profit`](../tests/calculator.test.ts) |
| Investment property held beyond the 12-month threshold | `taxable capital gain = positive capital gain × ownership share × 50%`<br>`indicative tax = taxable capital gain × assumed tax rate` | **Unit + E2E** — [unit: `estimates pre-July-2027 investment CGT with the 12-month discount`](../tests/calculator.test.ts); [E2E: `changes the CGT discount immediately after the 12-month threshold`](../tests/e2e/calculator.spec.ts) |
| Investment property not beyond the 12-month threshold | No 50% discount is applied. A sale on the calendar anniversary is treated as one day too early; the discount starts the following day. | **Unit + E2E** — [unit: `does not apply the CGT discount on the calendar anniversary`](../tests/calculator.test.ts); [E2E: `changes the CGT discount immediately after the 12-month threshold`](../tests/e2e/calculator.spec.ts) |
| Ownership share | Economic profit and taxable capital gain are multiplied by the entered ownership percentage. | **Unit only** — [`applies ownership and mixed-use percentages`](../tests/calculator.test.ts) |
| Mixed use or partial exemption | `taxable capital gain = positive capital gain × entered taxable-use percentage × ownership share × discount multiplier` | **Unit only** — [`applies ownership and mixed-use percentages`](../tests/calculator.test.ts) |
| Fully exempt main residence, unconfirmed | No numeric tax estimate is returned until the user confirms that they believe the full exemption applies. | **Unit + E2E** — [unit: `does not show zero CGT until the main residence exemption is confirmed`](../tests/calculator.test.ts); [E2E: `does not assume a main-residence exemption before confirmation`](../tests/e2e/calculator.spec.ts) |
| Fully exempt main residence, confirmed | Taxable capital gain and indicative tax are set to zero; the ownership-adjusted pre-tax result becomes the after-tax result. | **Unit + E2E** — [unit: `assumes a selected fully exempt main residence has no CGT`](../tests/calculator.test.ts); [E2E: `does not assume a main-residence exemption before confirmation`](../tests/e2e/calculator.spec.ts) |
| Capital works deductions | The entered amount reduces the derived CGT cost base but does not change economic profit. | **Unit only** — [`keeps capital works adjustments out of economic profit`](../tests/calculator.test.ts) |
| Reviewed ATO cost-base override | A positive override replaces the derived CGT cost base before calculating the capital gain or loss. | **Not directly covered** |
| Cost base greater than sale price | The model reports no positive capital gain and zero indicative tax. It does not apply that capital loss against other gains or carry it forward. | **Not directly covered** |
| Contract on or after 1 July 2027 | The pre-tax estimate remains available, but taxable gain, indicative tax, and after-tax profit are not returned. | **Unit only** — [`does not return a numeric tax estimate for post-reform sale dates`](../tests/calculator.test.ts) |

## Validation and guardrails

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Sale date is not after purchase date | The tax scenario is rejected and no numeric tax result is returned. | **Unit + E2E** — [unit: `rejects a sale date that is not after the purchase date`](../tests/calculator.test.ts); [E2E: `rejects a sale contract date that is not after purchase`](../tests/e2e/calculator.spec.ts) |
| Invalid calendar date | A malformed or impossible date is rejected. | **Unit only** — [`rejects malformed calendar dates`](../tests/calculator.test.ts) |
| Incomplete tax inputs | The tax scenario returns no numeric result until both contract dates and all relevant percentages are supplied. The pre-tax result remains available. | **Not directly covered** |
| Invalid percentages | Commission must be at least 0% and below 100%; ownership must be above 0% and no more than 100%; mixed taxable use must be above 0% and below 100%. Invalid values do not produce a tax estimate. | **Unit only** — [`rejects impossible percentages instead of silently clamping them`](../tests/calculator.test.ts) |
| Missing or invalid assumed tax rate | For investment and mixed-use scenarios, a zero rate is treated as incomplete and a rate outside 0%–100% is rejected. No numeric tax estimate is returned. | **Not directly covered** |
| Negative costs | Negative sale, purchase, preparation, acquisition, or improvement costs are rejected instead of silently treated as zero. | **Unit only** — [`rejects negative cash costs instead of converting them to zero`](../tests/calculator.test.ts) |
| Negative advanced tax amounts | Negative capital works deductions or a negative cost-base override are rejected. | **Not directly covered** |

## Explicitly outside the current model

| Scenario | Calculation | Automated test coverage |
| --- | --- | --- |
| Mortgage and settlement cash | Loan balances and discharge amounts are excluded. Net sale proceeds are not the amount delivered at settlement. | **Outside model** — disclosed in the results and important-information page; no focused assertion |
| Historical holding cash flows | Interest, rates, insurance, maintenance, rent, depreciation, and other historical cash flows are excluded. | **Outside model** — disclosed in the important-information page; no focused assertion |
| Complete personal income tax | Tax brackets, offsets, Medicare levy, other income, other capital gains, and prior capital losses are not calculated. The user supplies one assumed rate. | **Outside model** — disclosed in the interface and important-information page; no focused assertion |
| Other taxpayer types and residency rules | Foreign residents, companies, trusts, and SMSFs are excluded. | **Outside model** — disclosed in the interface and important-information page; no focused assertion |
| Automatic partial main-residence calculation | Residence periods, income-producing use, absence choices, valuations, and special apportionment rules are not derived automatically. Mixed use relies on a user-supplied reviewed percentage or cost-base override. | **Outside model** — the full-exemption confirmation flow is tested, but partial-exemption eligibility is not calculated |

## Maintenance rule

When calculation behaviour changes, update the corresponding row in this file
in the same pull request. Add a new row when a new user-visible calculation or
guardrail is introduced, and replace **Not directly covered** with the relevant
test link when coverage is added.
