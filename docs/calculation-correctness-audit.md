# Calculation correctness audit — 29 October 2026

## Publication authorisation after local acceptance

After the local audit below, the owner explicitly authorised publishing and
accepting this batch on 29 October. The earlier statements about checks not yet
run and absent publication permission describe that completed local-audit
stage. The subsequent clean-install release checks, fixed Preview, exact source
revision, production Worker/traffic and rollback evidence are recorded under
`outputs/release-2026-10-29/`, with the final outcome in `final-acceptance.md`.
Do not interpret a historical local-only statement as a permanent deployment
status. No outreach email is part of this release authorisation.

## Outcome and scope

For the existing two-decimal AUD inputs and accepted commission percentages,
calculate intermediate amounts as exact decimal values before converting the
final public numeric results. Exact zero must not become a loss or loan
shortfall, and half-cent amounts must follow the existing nearest-cent display
policy. Keep genuine small positive/negative results and unrounded commission
and sensitivity precision; do not use an epsilon or round each operation.

This is a software correctness repair, not a change to financial scope or
advice. Keep the ordinary decimal money-input contract, validation, invalid-input
numeric fallbacks, public numeric interfaces, three separate result meanings, and BigInt whole-
dollar ceiling for break-even/target prices. No new dependency, product copy,
analytics, storage, network transmission or production action is included.
Preserve the reviewed but uncommitted homepage readability changes.

The audit also reproduces a separate input defect: monetary text `1e6` was
silently sanitized to `16`. The accepted narrow repair preserves exponent-like
money drafts for correction and rejects them, using the existing validation
messages and affected-result hiding rules. It does not expand exponent money
notation into a supported amount. Native percentage exponent notation remains
valid, including `1e-7` and `5e-324`.

## Evidence before repair

The independent calculation reviewer confirmed two defect classes:

- `1.15 × 10% = 0.115` displayed `$0.11` rather than `$0.12`;
  `11 × 1.5% = 0.165` displayed `$0.16` rather than `$0.17`.
- Sale `1000000.07`, purchase `990000.06`, other selling costs `10000.01`,
  zero commission and all other transaction costs zero mathematically produce
  zero profit. Binary arithmetic produced approximately `-1.164e-10`, causing
  a false LOSS/negative-zero display. Loan payout `990000.06` also produced a
  false cash SHORTFALL. Equal rental income/holding costs must preserve zero.

The primary thread's frozen-source baseline mutation check killed 258/258
mutants with no survivors/timeouts. Its independent Python Decimal reference
used 100-digit precision and separately written formulas against 10,006
scenarios / 490,294 checks. It reported 6,326 mismatches, including repeated
fields and display representations of the same defect; this does not establish
6,326 distinct bugs. Evidence is under ignored
`outputs/calculation-audit-2026-10-29/`, including the original input sample and
`oracle-before-summary.json`. Full coverage/mutation success did not establish
correct decimal arithmetic.

## Smallest implementation plan

1. Add literal regression tests and record their failure on the unchanged engine.
2. Represent finite decimal amounts internally as a signed BigInt coefficient
   and decimal scale. Build this from the accepted numeric input's decimal
   string, including exponent notation. Align scales for addition/subtraction;
   multiply integer coefficients and add scales for products. Percentage and
   95%/105% scenario factors are exact powers-of-ten operations.
3. Keep commission, selling/fixed costs, proceeds, transaction result, holding
   result, cash and each sensitivity row in that representation throughout their
   calculation. Convert each final result once using its decimal string, without
   separately converting a large numerator and denominator to binary numbers.
   Calculate the target/expected-price difference exactly too. Keep additional
   exact decimal strings for every computed display and sign, so converting a
   large final value to a Number cannot change the displayed half-cent result.
4. Retain the current break-even/target BigInt ceiling and validation paths.
   Preserve the main model's sanitized numeric fallback for invalid inputs and
   the standalone tool's `null` result. Do not silently clamp valid losses.
5. Update the scenario matrix and local Chromium regressions, then hand the
   frozen source to the primary thread for independent Decimal comparison,
   full checks and calculation/release review.

Before implementation, the primary thread's independent boundary test found
67 cases where even a single Number conversion lost the correct side of a
half-cent. One exact transaction result was `-2384244190366.66493859`, but its
Number string was `-2384244190366.665`, which displayed one cent too negative.
The agreed compatible interface therefore keeps the existing numeric fields
and adds exact decimal metadata. `exactAud(string, 0 | 2)` uses BigInt half-away-
from-zero rounding, then passes the whole-dollar BigInt to Intl for grouping;
it explicitly composes the fixed en-AU AUD sign/cents. `exactTone(string)` and
`exactIsInteger(string)` also avoid Number conversion. There is no dependency
on newer Intl decimal-string-input support and no new product copy.

Core arithmetic helpers remain private in `calculator.ts`. The coverage and
mutation configurations now include `calculator-ui/format.ts` alongside
`calculator.ts` and `input-format.ts`, retaining the 100% thresholds for all
three modules. Exact metadata is local calculation output only, with no new
analytics, persistence or external transmission.

## Acceptance and test plan

- Literal unit expectations for both half-cent commissions, main/standalone
  equality and unchanged full precision before display rounding.
- Exact zero and positive-zero identity for transaction, overall, cash and the
  unchanged sensitivity row; explicit `$0`/`$0.00` formatting checks.
- Genuine sub-cent loss/shortfall and one-cent neighbours remain negative;
  a half-cent transaction result is not calculated from a pre-rounded fee.
- Large supported amounts, 99.9% and tiny decimal rates retain precision;
  sensitivity uses exactly 95%, 100% and 105% of entered price.
- Target/expected-price difference has exact cents, while existing whole-dollar
  target/break-even minimality and transaction/supplementary separation remain.
- Local browser checks exercise the displayed half-cent commission and the
  zero-profit/zero-cash statuses; existing three-language flows remain covered.
- Exponent-like money drafts remain unchanged while editing and after blur,
  fail money validation, and hide only their affected results. Main/standalone
  calculators and all three languages use the same rule. Ordinary `$`/`AUD`
  grouped pastes, signed decimals, blank/unfinished drafts and native percentage
  exponents retain their existing interpretation.
- Primary thread runs lint, application/SSR, coverage, mutation, Chromium E2E
  and the independently written Decimal reference; independent calculation and
  release reviewers decide acceptance. Record commands and actual results.

## Execution record

On the unchanged engine,
`node --experimental-strip-types --test --test-name-pattern='^decimal ' tests/calculator.test.ts`
failed all four new regressions, showing the literal half-cent, exact-zero,
genuine sub-cent and maximum-price precision defects before repair.

After implementing the decimal engine, exact metadata and UI consumption,
`node --experimental-strip-types --test tests/calculator.test.ts` passed
**46/46** focused tests in **111ms**. Tests include literal Decimal-reference
values, positive/negative half-cent neighbours, a real `−5e-326` result from a
valid `5e-324` rate, large half-cent display and a target difference whose cents
do not fit the compatible Number field. Local Chromium regressions include
the three-language exact-zero statuses and displayed high-value/cents formulas.
Browser verification was pending at this intermediate stage.

Before the final mutation-test completion, the primary thread's saved logs
recorded lint success, **76/76** application tests, and **100%** line, branch
and function coverage for all three calculation/input/display modules. Its
independent 100-digit Python Decimal reference recorded **10,006 scenarios /
730,438 checks / 0 failures** in `oracle-after-summary.json`. The independent
calculation reviewer reported **75 boundary scenarios / 7,434 assertions** and
a software-correctness GO; this is AI review, not professional financial or
tax approval.

The initial post-repair mutation run failed its unchanged 100% gate: **334
killed / 5 survived / 0 timeouts**, or **98.53%**. Three survivors exposed
missing assertions: the legacy `aud` formatter's currency/whole-dollar
contract, and canonical exact-zero metadata (numeric zero assertions alone
accepted an empty or noncanonical string). Added focused tests now assert
literal AUD output and `"0"` metadata used by deduction rows and target matches.
The two remaining survivors were redundant implementation choices: the
internal grouping formatter only receives whole-dollar BigInts, so its
`maximumFractionDigits: 0` option was removed; the `coefficient < 0` comparison
after a zero early return had an equivalent `<= 0` mutant, so decimal-text sign
detection now reads the BigInt's decimal-string sign. No mutant is excluded and
the 100% threshold is unchanged.

After those changes,
`node --experimental-strip-types --test tests/calculator.test.ts` passed
**48/48** tests, **0 failed** (233ms reported total duration). On that frozen
numeric implementation, the primary thread subsequently recorded successful
`npm run lint`, **78/78** `npm test` checks, **48/48** focused tests and all three
modules at **100%** line/branch/function coverage under `npm run test:coverage`,
and **336/336 killed / 0 survivors / 0 timeouts** under `npm run test:mutation`.
Its independent Decimal reference again recorded **10,006 / 730,438 / 0
failures**. The independent release reviewer inspected these numerical gates;
browser verification was still pending, so these results did not constitute a
complete release decision.

## Monetary exponent-draft repair

The main controller previously reused the same generic number parser for money
and native percentage inputs, after the money control had stripped letters.
The money control now preserves a digit or decimal point immediately followed
by `e`/`E`, including unfinished exponent drafts such as `1e` or `1e+`. A new
money-only validation parser returns `NaN` for those drafts. All main amounts,
target profit and standalone sale price use it; percentage inputs retain the
general parser. The existing error messages and result-separation rules apply.
The detection leaves `$ 1,234.56` and `AUD 1,234.56` pastes unaffected.

`node --experimental-strip-types --test tests/calculator.test.ts` passed
**49/49**, **0 failed** (201ms total), after this input patch. The new unit
scenario checks draft/blur preservation, explicit rejection, ordinary currency
pastes and valid tiny exponent rates. Added browser scenarios cover every main
money field, holding/loan/target isolation, correction recovery, and standalone
money/rate distinction in English, Chinese and Korean. The final combined run
below passed these browser scenarios. The reproduced `1e6` to `16` defect is
closed by visible rejection and correction recovery, not by accepting exponent
money amounts.

## Final combined-source verification

The primary thread ran these checks against the frozen decimal and input
repairs together. All commands exited **0**. Saved logs are in ignored
`outputs/calculation-audit-2026-10-29/`; the final mutation JSON is retained as
`mutation-final.json`. The earlier **336**-mutant success covered only the
numeric stage; the final **345**-mutant result also covers the money-only
exponent guard. Neither result excludes mutants or reduces the 100% gate.

| Command | Actual result |
| --- | --- |
| `npm run lint` | Passed; no lint errors. |
| `npm test` | Typecheck and production build passed; **79/79** application/SSR tests passed, **0 failed**; test-runner duration **4.688s**. |
| `npm run test:coverage` | **49/49** focused tests passed; `calculator.ts`, `input-format.ts` and `calculator-ui/format.ts` each reached **100%** line, branch and function coverage. |
| `npm run test:mutation` | **345/345 killed**, **0 survivors**, **0 timeouts**, **0 no-coverage mutants**, **0 errors**; **100%**, **31s**. |
| `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` | **53/53** local Chromium tests passed in **26.2s**; refreshed **12** local mobile review screenshots. Includes main/standalone three-language exponent rejection, correction and result isolation, half-cent display, exact-zero statuses, privacy and input-storage checks. |
| `git diff --check` | Passed; no whitespace errors. |

The primary thread also replayed the frozen fictional sample using the retained
collector and independent Python reference:

```sh
node --experimental-strip-types --input-type=module - outputs/calculation-audit-2026-10-29/oracle-before-inputs.json outputs/calculation-audit-2026-10-29/oracle-after-inputs.json < outputs/calculation-audit-2026-10-29/oracle-collector.mjs.txt
python3 outputs/calculation-audit-2026-10-29/oracle-reference.py outputs/calculation-audit-2026-10-29/oracle-after-inputs.json outputs/calculation-audit-2026-10-29/oracle-after-summary.json
```

Both commands exited **0**. The 100-digit Decimal reference reported **10,006
scenarios / 730,438 checks / 0 failures**. The collector invokes the repository's
current calculation and display code locally; the separately written reference imports no application arithmetic or
formatting helper. Exact metadata/display checks are exact; compatible Number
exports use an explicit numerical tolerance. The sample's smallest nonzero
rate is `1e-7`; literal unit tests and the independent reviewer's rational
checks separately cover `5e-324`. The evidence README records replay commands
using retained files, with no dependency on expired temporary scripts.

The independent calculation reviewer gave final **GO** for software arithmetic
and the money-input repair, reporting its own **75 boundary scenarios / 7,434
assertions** and **221 parser assertions** passed. Those additional assertions
were run by that reviewer, not by the primary thread. The independent release
reviewer read the final combined logs, confirmed the reported results, ran
`git diff --check` successfully, and actually viewed four refreshed Chinese/
Korean calculator and commission screenshots without finding truncation or
missing content. Its final decision was **GO for local acceptance**, with no
blocking finding. These AI reviews are not human or professional financial,
tax, legal or settlement approval, or production publication permission.

No fresh `npm ci`, remote Preview, Linux CI, Safari/Firefox, physical-device or
screen-reader checks were run for this local batch. These remain limitations
of local acceptance. No push, deployment or production browser test occurred.
The existing homepage changes were preserved; no publication is authorised by
this audit.

This audit's numeric claims concern the supported ordinary AUD decimal input
with at most two fractional digits, not arbitrary pasted currency/notation
strings. Exponent drafts are now visibly rejected rather than reinterpreted;
the change does not establish correctness for every malformed monetary string.
