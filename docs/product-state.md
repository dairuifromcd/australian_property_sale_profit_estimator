# Product State

Last updated: 2026-10-20
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
- The 20 October search-entry/guide/metadata sprint was merged through PR #24 as
  `ef72ad2` and published. Updated Preview E2E passed 40/40, Linux CI passed and
  independent release review gave GO. Production HTTP checks passed for 12 pages,
  robots, sitemap and share images; the first new Worker version `b7ff061f`
  received 100% of traffic. This is release evidence, not traffic-effect evidence.
- Bing ownership verification succeeded on 20 October. Crawl/indexing and Bing
  performance remain Unknown; earlier verification failures are historical.
  The sitemap submission in this workflow was accepted and is Processing, with no crawl
  date or discovered-URL count observed yet.
- The repository configures anonymous events containing event type, locale,
  environment and Cloudflare timestamp, without calculator figures, cookies or
  application-generated identifiers.
- Google Search Console has a verified search snapshot recorded below;
  production usage-event counts and structured real-user feedback remain unknown.
- No completed Chinese or Korean fluent-human review is recorded. On 20 October
  the owner removed it as a mandatory release gate; independent semantic and
  rendered-layout review remain required, without claiming human approval.
- `docs/mvp-without-cgt-decision.md` is a historical scope decision. Its
  "pending Preview" status and P2 feature list no longer match the current
  implementation. The SEO/AEO batch `7730c5d` was published on 2026-09-07;
  its production read-only checks passed in the recorded conversation.

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

Window: Search Console 2026-08-08 through 2026-09-04; usage events not queried
Environment: production only
Status: Google search verified 2026-09-06; usage-event baseline still Unknown

| Evidence | en-AU | zh-Hans | ko | Interpretation |
| --- | ---: | ---: | ---: | --- |
| `calculator_viewed` | Unknown | Unknown | Unknown | Aggregate page-load proxy |
| `calculator_started` | Unknown | Unknown | Unknown | Aggregate engagement proxy |
| `estimate_completed` | Unknown | Unknown | Unknown | Primary task-completion proxy |
| `transaction_details_opened` | Unknown | Unknown | Unknown | Optional transaction-detail interest |
| `holding_details_opened` | Unknown | Unknown | Unknown | Holding/loan-detail interest |
| `target_profit_completed` | Unknown | Unknown | Unknown | Planning-feature use |
| `print_selected` | Unknown | Unknown | Unknown | Handoff or export intent |
| Homepage search impressions / clicks | 29 / 0 | 4 / 0 | 1 / 0 | Google Web Search, observed 28-day window; not usage events |

Ratios are directional only. Events cannot be linked to unique users or
sessions, and automated visits may contribute.

Search Console reports 34 impressions, zero clicks, 0% CTR and average position
45.3 for the observed window. Its sitemap status is successful (last read
2026-09-03, nine URLs). The indexing report dated 2026-08-28 shows five indexed
pages and four discovered/unindexed legal pages. These snapshots predate the
new release; see [search discovery](search-discovery.md) for precise sources,
query rows, implementation status and remaining access/verification limits.

The separate Google generative-AI Beta report shows two impressions for the
Chinese homepage in that same window; it exposes no click metric in the viewed
report. Do not add these impressions to Web Search totals or infer traffic
uplift. Bing was added to the authenticated account and awaits verification
after the real public meta tag is deployed.

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

**Continue — 20 October 2026.** The bounded batch's compatible dependency
remediation, release checks, merge and production HTTP acceptance are complete.
Observe the English guide's indexing before expanding the page count. Full npm
audit retains 8 high entries from one unpatched development-tool advisory;
production-only audit is 0 and independent review accepted the documented
trusted-build controls for this release. The owner authorised acceptance and
merge and explicitly removed the mandatory human language-review gate.
Independent product and SEO source reviews found no
evidence supporting additional pages or features before observing the guide's
indexing. The deployed Preview passed all 40 remote browser tests. This is
technical evidence, not evidence of a traffic improvement.

The preceding **Change** decision on 19 October was to diagnose the existing
guide's indexing state and improve search entry points before expanding page
count. The latest
observed 28 days (20 September–17 October) show 31 Web Search impressions and 1
click. All three guides remain discovered but unindexed in the 12 October
report, despite successful discovery of all 12 sitemap URLs on 16 October.
This identifies a bottleneck, not its cause. The earlier 7 September release
did not establish a sustained acquisition effect.

The owner approved a stretch objective of 100 Web Search clicks, including 30
guide/content-page clicks, in the latest complete processed 28 days at the
18 November checkpoint. The deadline starts 19 October and includes development
and indexing delays. It is a target, not a forecast. See the
[SEO sprint evidence and acceptance criteria](seo-growth-sprint.md).

## Next learning experiment

The English guide's live Search Console test passed and one indexing request
was accepted on 19 October. After publication, review crawl/indexing, Google's
canonical and related query exposure at the fixed sprint checkpoints. Do not
repeat the same indexing request. New content expansion depends on this evidence.
The previously proposed five-participant comprehension study remains unrun;
its participant count is zero and it is deferred from this search sprint.

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
