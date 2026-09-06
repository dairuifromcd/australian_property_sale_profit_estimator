# Product State

Last updated: 2026-09-06
Stage: Public MVP
Canonical product: https://propertysaleprofit.au

## Evidence rules

- **Fact:** directly verified in the repository, production output or an
  authoritative record.
- **Behaviour data:** aggregate observed actions; it shows what happened, not
  why.
- **Real feedback:** comments or observed behaviour from an actual person,
  collected with consent.
- **Hypothesis:** an unverified belief to test.

Never label AI-generated personas, inferred motives, competitor copy or
simulated interviews as real feedback. Use **Unknown** when evidence is absent.

## Current facts

- The product is an Australia-focused property-sale calculator deployed as a
  public MVP.
- It separates transaction profit, an optional overall pre-tax result and
  simplified cash after an entered loan payout.
- It also includes target-profit sale-price planning and sale-price
  sensitivity. Implemented capability is not evidence that users value it.
- It does not calculate tax, valuation, complete settlement proceeds or
  after-tax return.
- Calculator figures remain in the browser.
- Production supports English, Simplified Chinese and Korean.
- The repository configures anonymous events containing event type, locale,
  environment and Cloudflare timestamp, without calculator figures, cookies or
  application-generated identifiers.
- No verified production event baseline or structured real-user feedback is
  recorded in this repository.
- No completed Chinese or Korean fluent-human review is recorded, although the
  declared translation process requires it.
- `docs/mvp-without-cgt-decision.md` is a historical scope decision. Its
  "pending Preview" status and P2 feature list no longer match the current
  implementation; the exact production release SHA and date are not recorded.

## Current hypotheses

1. The primary user is an Australian property owner preparing to sell or
   evaluating an agent quote.
2. The most valuable job is understanding likely transaction profit and cash
   position before taking the next professional step.
3. Privacy and no sign-up materially increase willingness to use the tool.
4. Comparing agent quotes may be more valuable than adding more calculation
   fields.
5. Chinese and Korean versions may create useful additional demand after
   fluent-human review.

These are not validated user facts.

## Behaviour baseline

Window: last 28 complete days
Environment: production only
Status: not yet verified

| Evidence | en-AU | zh-Hans | ko | Interpretation |
| --- | ---: | ---: | ---: | --- |
| `calculator_viewed` | Unknown | Unknown | Unknown | Aggregate page-load proxy |
| `calculator_started` | Unknown | Unknown | Unknown | Aggregate engagement proxy |
| `estimate_completed` | Unknown | Unknown | Unknown | Primary task-completion proxy |
| `transaction_details_opened` | Unknown | Unknown | Unknown | Optional transaction-detail interest |
| `holding_details_opened` | Unknown | Unknown | Unknown | Holding/loan-detail interest |
| `target_profit_completed` | Unknown | Unknown | Unknown | Planning-feature use |
| `print_selected` | Unknown | Unknown | Unknown | Handoff or export intent |
| Search impressions and clicks | Unknown | Unknown | Unknown | Search discovery |

Ratios are directional only. Events cannot be linked to unique users or
sessions, and automated visits may contribute.

## Real-user feedback

No interview, usability-session or structured feedback evidence is currently
recorded in the repository.

| Date | Participant code | Relevant situation | Observation or faithful paraphrase | Theme | Product implication |
| --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — |

Do not record names, addresses, actual property values, loan balances, tax
circumstances or other sensitive financial information.

## Highest uncertainty

Who obtains enough value from this calculator to use it during a real
property-sale decision, and which result do they actually need?

## Current decision

Implement the owner-authorised local clarity and explanatory-guide batch while
deferring non-essential feature expansion (including quote A/B comparison).
Production behaviour/search baselines remain Unknown and real-user comprehension
research is still outstanding. Local implementation does not establish traffic
benefit or production release readiness.

## Next learning experiment

Run a five-participant, 20-minute moderated comprehension and jobs-to-be-done
test using fictional property figures. Decide **Continue**, **Change**, **Stop**
or **Insufficient evidence** after synthesizing the observations.

## Decision log

| Date | Decision | Evidence used | Owner | Revisit condition |
| --- | --- | --- | --- | --- |
| 2026-08-06 | Establish the learning baseline before adding features | Repository audit; behaviour and feedback baselines are missing | Human product owner | After the first user test and behaviour snapshot |
| 2026-09-05 | Change: prepare a bounded clarity and localized explanatory-guide batch; defer quote-comparison feature | Owner-authorised production walkthrough with fictional inputs, independent code review and AI simulation hypotheses (not real feedback) | Human product owner / primary integration agent | After local checks, independent review and then consented comprehension research |

## 2026-09-05 local implementation evidence

- **Fact:** the conversation's production walkthrough returned 323,000 transaction
  profit and 573,000 simplified cash for the documented 1,000,000 sale example.
  A detailed example returned 149,750 transaction profit, 179,750 overall pre-tax
  result and 464,750 simplified cash. These sample results matched independent
  arithmetic; they do not prove all possible inputs correct.
- **Fact:** local changes add separate loan entry, clearer result-purpose
  summaries, cost-once guidance, explicit target-transaction wording and a
  three-language selling-costs guide. Code review also identified and fixed
  incomplete monetary drafts being treated as zero and sub-dollar target-price
  differences incorrectly labelled as matching. No production deployment was
  performed by this task.
- **Behaviour data:** production-only aggregate events and search impressions /
  clicks remain Unknown. Owner-requested synthetic production operations may
  have contributed usage events; they must not be counted as evidence of demand.
- **Real feedback:** no real users were interviewed or observed in this
  conversation. Three subagent seller scenarios are AI-generated hypotheses.
- **Hypothesis:** easier result interpretation and one substantive task-specific
  guide can help relevant sellers find and use the existing calculator. Traffic
  uplift, quote-comparison demand and language demand remain unvalidated.
- **Release limits at that point:** Chinese/Korean fluent human review and owner
  approval were pending; dependency audit findings required follow-up. See the
  dated remediation update below for the subsequent dependency status.

See [growth and accuracy plan](growth-accuracy-plan.md) for the full conversation
summary, task ownership, example assumptions, adversarial fixes, deferred work,
verification results and the single next comprehension experiment.

## 2026-09-06 local remediation evidence

- **Fact:** authorised dependency upgrades and a clean install reduced the
  refreshed full npm audit from 17 affected packages to zero; production-only
  audit also returned zero. Exact versions and limitations are recorded in
  [dependency remediation](dependency-remediation.md).
- **Fact:** independent Chinese/Korean AI reviews and calculation explanation
  review accepted the corrected copy. A complete three-language source packet
  and eight local mobile screenshots are available for human review.
- **Fact:** on the upgraded dependencies, lint, build/typecheck and 56 tests,
  33 focused coverage tests, 238 killed mutants and 39 Chromium E2E tests passed.
  Coverage is 100% only for the two named calculation/input modules.
- **Release limits:** actual fluent-human language signoff and explicit owner
  publication approval remain pending. Linux CI was not run. No production
  deployment, traffic measurement or real-user research occurred in this step.
