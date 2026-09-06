# Growth and calculation clarity plan

Date: 2026-09-05
Objective: help relevant Australian sellers discover and understand the calculator while preserving accurate, explicitly scoped calculations.

## Conversation summary and evidence

The owner requested a concise review of functionality, interface, user experience, SEO, answer-engine discovery and other traffic opportunities. Repository review found an existing three-language calculator with canonical/hreflang metadata, a sitemap, break-even and target-price planning, sensitivity and PDF printing. Search and production-event baselines remain **Unknown**; no real-user interviews were conducted in this conversation.

Candidate growth directions were task-specific search content, clear answerable questions and worked examples, easier first use, agent-fee comparison, reviewed multilingual distribution, professional/content-resource referrals and transparent methodology. Outreach, advertising, additional languages, Search Console/Bing setup and professional endorsements were not performed. No demand, rankings or AI citations were measured or inferred as facts.

At the owner's request, three subagents simulated a Brisbane owner selling to buy another home, a Melbourne seller comparing agent quotes, and a Perth investment-property seller reviewing a completed sale. **These are AI-generated perspectives, not people, interviews, quotes or validated user needs.** Subagents could not access the primary browser session. The primary agent operated the actual production site and supplied observed outputs to the independent simulated reviewers.

The initial production visit was read-only. The owner subsequently explicitly requested fictional input and full calculations on production. Those operations may have contributed `calculator_viewed`, `calculator_started`, `estimate_completed`, optional-section and target-price events. Event delivery was not verified; these operations must not be presented as organic activity or growth. Their events cannot be isolated by user/session IDs because the application does not collect such identifiers.

### Verified during that production walkthrough

- At 1280 × 720, the large hero left only the top of the calculator visible.
- Four valid inputs produced results automatically; monetary fields grouped digits on blur.
- The loan payout field appeared after holding costs and rental income in a combined disclosure.
- Optional cash and holding results were separate from transaction profit; formulas could be expanded.
- Editing quote inputs replaced the previous scenario; no side-by-side comparison was observed.
- Expanded results formed a long right-hand column with empty space on the left at lower scroll positions.
- The arithmetic below matched independent calculations for these examples. This does not establish correctness for every possible input.
- Printing and mobile interaction were not exercised in the production walkthrough.

| Fictional scenario | Entered assumptions (AUD) | Observed results (AUD) |
| --- | --- | --- |
| Sale / next-home cash | Sale 1,000,000; purchase 650,000; commission 2.2%; other selling costs 5,000; payout 400,000 | Commission 22,000; amount after costs 973,000; transaction profit 323,000; cash 573,000; entered-cost break-even 669,735 |
| Alternative quote | Same sale, purchase and payout; commission 1.8%; other selling costs 9,000 | Commission 18,000; amount after costs 973,000; transaction profit 323,000; cash 573,000; break-even 671,080 |
| Detailed property result | Sale 850,000; purchase 600,000; commission 2.5%; other selling 6,000; preparation 8,000; buying 25,000; renovations 40,000; holding 120,000; rent 150,000; payout 350,000 | After selling costs 814,750; transaction profit 149,750; overall pre-tax result 179,750; cash 464,750; break-even 696,411 |
| Target and sensitivity for detailed result | Target transaction profit 100,000; sale-price scenarios −5%, current, +5% | Required price 798,975; scenario transaction results 108,313 / 149,750 / 191,188 (whole-dollar display) |

### Hypotheses, not observed user behaviour

- Sellers may confuse transaction profit, entered holding-period result and cash after payout.
- Owner-occupiers may overlook a loan field grouped after rental information.
- Sellers may enter the same repair or improvement in multiple cost fields.
- People who have already sold may not recognise that their actual sale price can be used.
- A clear task-specific guide may bring relevant search visits and support answer-engine discovery.
- Quote comparison may be valuable, but the desired assumptions and comparison workflow remain unvalidated.

## Decision and implementation scope

**Change:** implement a bounded clarity and explanatory-content batch. The owner authorised implementation; evidence supports removing observed presentation friction and explaining existing calculations. It does not establish an expected traffic uplift.

| Workstream | Owner | User-visible outcome | Acceptance / adversarial questions |
| --- | --- | --- | --- |
| Result and input clarity | `clarity_implementation` — maintainer, overall implementation owner | Shorter hero, visible result purposes before long breakdowns, direct loan entry, cost-once guidance, consistent target transaction wording | Do invalid supplementary values hide only their own result? Does payout leave profit/planning unchanged? Are zero, loss and shortfall unambiguous? Do reset, keyboard, mobile and print work? |
| Search and answer content | `discovery_implementation` — worker | One substantive server-rendered selling-costs guide in all three languages, linked to the calculator | Is every example consistent with the model? Are tax/full-settlement claims excluded? Do canonical, hreflang, sitemap, noindex and 404 behaviour agree? |
| Integration and documentation | Primary agent | A single combined working-tree change with recorded evidence and verification | Are existing untracked owner files preserved? Do examples, docs and translations match the actual combined change? |
| Independent calculation review | `calculation_reviewer` | Review outcome separation, examples, validation and regression coverage | Can any invalid or stale value produce a misleading result? Does the UI imply a broader model than implemented? |
| Independent release/accessibility/privacy/SEO review | `release_reviewer` and read-only review | Explicit readiness decision and remaining blockers | Are local/Preview results mistaken for production? Are figures stored/transmitted? Are claims or translations overstated? |

Implementers work in disjoint files against an agreed guide-link/routing interface. The primary integrates their shared-workspace edits and resolves any test or interface mismatch. Final reviews follow implementation. No production deployment or push to main is included.

### Adversarial findings incorporated

The independent calculation reviewer found two pre-existing P2 issues while
examining the changed workflow. Nonblank monetary drafts (`-`, `.`, `-.`) could
be treated as zero, including after blur. The controller now uses a validation
parser that preserves invalid drafts, and formatting no longer invents a zero
digit for an unfinished decimal. The target-price comparison rounded away
differences below one dollar; equality/direction now use the original difference,
with cents displayed when needed. Focused unit and browser transitions cover
both issues. The calculation reviewer re-inspected and accepted both code fixes;
the calculation scenario matrix records their semantics.

Release review identified loss of entered figures when following help in the
same tab. The guide now opens in a labelled new tab with no opener/referrer;
browser tests check that original inputs remain. Full multilingual guide prose
has been separated from the homepage client dependency graph, and supplementary
operands remain available in print. The homepage help link sits with the result
explanations and is hidden when printing the calculator.

### Deferred items

- Quote A/B comparison: a future focused change needs explicit immutable assumptions, valid-input gating, reset/clear semantics and tests against stale/mismatched snapshots. No persistence is introduced in this batch.
- Example auto-fill, additional scenario landing pages, referrals/outreach and multilingual distribution: validate comprehension/search evidence first; avoid mass-producing near-duplicate pages.
- New tax, valuation, full settlement, annualised-return or account features remain outside scope.
- Search Console and Bing verification/submission, traffic baselines and human research need actual authorised account access or participants; they are not substituted with simulation.

## Verification and release boundary

Run `npm ci`, `npm run lint`, `npm test`, `npm run test:coverage`, `npm run test:mutation`, and `npm run test:e2e` against the combined change. Browser regression runs target the local built server, not production. Preserve existing coverage gates for calculation and monetary-input modules; add focused adversarial browser assertions for changed semantics and SSR/route tests for the guide. Test counts and results are recorded only after execution.

Chinese and Korean text remains pending fluent human review as recorded in `docs/translation-review.md`. AI comparison and automated dictionary checks are preparatory, not human approval. Production publication also requires the owner's separate approval. No additional external data, analytics fields, tracking IDs, cookies, storage or production dependencies are planned.

### Original dependency audit limitation (superseded by remediation below)

`npm ci` could not complete with the default cache because of filesystem
permissions. `npm ci --cache /private/tmp/property-profit-npm-cache` succeeded
using the unchanged lockfile. Its install-time audit reported 15 affected
packages; the subsequent successful standalone `npm audit --json --cache
/private/tmp/property-profit-npm-cache` reported 17 (10 moderate, 7 high, no
critical). These are dependency-audit findings, not demonstrated website
exploits. The raw report was inspected locally; no credentials or calculator
figures were involved.

Most reported packages are marked development-only in the lockfile. `next`,
`postcss` and `nanoid` also have non-development paths. Build tools can affect
deployed bundles, so development classification does not establish absence of
production risk. This change does not accept or repair those existing dependency
risks; dependency remediation/applicability review remains a production-release
blocker. No automatic major upgrades or lockfile changes were made.

### Future production smoke and rollback

After owner approval, recorded translation review, dependency-risk disposition
and a release-review decision, record the deployed commit and previous Cloudflare
version. Perform a minimal read-only check of the homepage and three guide URLs:
HTTP success, correct locale/title/canonical, accessible guide/calculator links
and production indexing. Confirm a Preview URL remains `noindex`. Do not enter
amounts, open optional calculator sections, request target estimates or print on
production for this smoke. Even a homepage load may contribute a view event and
must be acknowledged in the measurement notes.

If a regression requires rollback, the authorised release owner restores the
previous recorded deployment version, then repeats the same minimal read-only
checks. No rollback or promotion is performed by this local implementation task.

## One next learning experiment

After this batch is reviewable, the product owner can arrange five consented 20-minute sessions with people who recently sold or plan to sell Australian property. Use the fictional amounts above, first ask what they need to know, then observe which result they choose and how they explain it. Contact requires separate approval; no participants have been recruited.

Continue if at least four independently identify and explain the relevant result and exclusions; change the explanations if confusion recurs; stop expanding a positioning that consistently requires unsupported tax or complete settlement answers. Five qualitative sessions cannot establish search demand or a growth rate. Separately record available production-only aggregate events and search impressions/clicks as a baseline, accounting for this conversation's synthetic production operations and without calling events unique users or conversions.

## Original growth-batch integration and verification record

All implementation-agent edits and primary integration/correctness fixes are
combined in the same local working tree. No Git branch merge, commit, push or
production deployment is claimed. Existing owner-provided untracked `.agents/`,
`.codex/`, `AGENTS.md` and the original product-state file were preserved; only the
authorised dated evidence update was applied to product-state.

| Check (actual command) | Actual result |
| --- | --- |
| `npm ci` | Failed with default-cache permission errors; no successful install claimed for this exact attempt |
| `npm ci --cache /private/tmp/property-profit-npm-cache` | Exit 0; 598 packages installed from the unchanged lockfile; audit limitations above |
| `npm run lint` | Exit 0 on final code |
| `npm test` | Exit 0; typecheck, production build, 54 unit/dictionary/SSR/API tests passed |
| `npm run test:coverage` | Exit 0; 33 tests passed; `calculator.ts` and `input-format.ts` each 100% line, branch and function coverage |
| `npm run test:mutation` | Initial sandbox attempt failed with local-listener EPERM; authorised retry exit 0, 238/238 killed, 0 survived/timeouts/errors, 100% score (191 calculator, 47 input formatter mutants) |
| `npm run test:e2e` | Exit 0 on final integrated code; 39 Chromium tests passed against the local built server, including mobile widths, print media, locales, privacy, guide popup retention, invalid drafts and fractional target comparisons |
| `git diff --check` | Exit 0; no whitespace errors |
| Built client prose search | No matches for three distinctive full-guide prose phrases in `dist/client` JavaScript after splitting the server content |
| Local visual inspection | CUA screenshot of English calculator at 1280 × 720 showed the first two required inputs within the initial viewport; English guide hierarchy/navigation were visually inspected on the same local build |

The input/target corrections were independently re-reviewed by
`calculation_audit`: both identified P2 findings resolved, no further code defect
identified. `release_audit` re-reviewed help navigation, client-content separation,
privacy, routing, documentation and tests: no remaining blocking code finding.
After the final mutation result, its decision was **GO for local integration,
NO-GO for production publication**. Reviewers inspected code independently;
the primary executed the combined test suite.

These checks do not prove traffic uplift or universal correctness. Coverage is
scoped to the two named pure modules; it is not 100% coverage of the entire
application. Actual PDF pagination, Safari, screen-reader use, real mobile
devices, fluent human translations and real-user comprehension remain outside
the verified results. Production remains blocked on documented human review,
dependency-risk disposition and owner approval.

## 2026-09-06 dependency and language follow-up

The owner authorised dependency remediation and independent Chinese/Korean
review. A maintainer upgraded existing dependencies and compatible transitive
packages, reducing the refreshed npm audit from 17 affected packages to zero
in both full and production-only modes after a clean install. This supersedes
the original dependency limitation above; see
[the dependency report](dependency-remediation.md) for versions, advisory chains,
beta-framework risk and six reproducible optional WASM install artifacts.

Independent Chinese and Korean AI reviewers identified and re-accepted clearer
gross-rent, expense, rounding and result terminology. A calculation reviewer
accepted the explanation changes without findings. A generated side-by-side
source packet and eight local mobile screenshots prepare the remaining actual
human review. No human signature or production approval has been invented.

| Final command | Actual result on upgraded dependencies |
| --- | --- |
| `npm ci --cache /private/tmp/property-profit-npm-cache` | Exit 0; 595 packages installed |
| `npm audit --json --cache /private/tmp/property-profit-npm-cache` | Exit 0; zero findings |
| `npm audit --omit=dev --json --cache /private/tmp/property-profit-npm-cache` | Exit 0; zero findings |
| `npm run lint` | Exit 0 |
| `npm test` | Exit 0; typecheck/build and 56 tests passed |
| `npm run test:coverage` | Exit 0; 33 tests, 100% lines/branches/functions for calculator and input-format only |
| `npm run test:mutation` | Sandbox listener failed with EPERM; authorised retry exit 0, 238/238 killed, zero survivors/timeouts/errors |
| `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` | Sandbox listener failed with EPERM; authorised retry exit 0, 39 local Chromium tests passed and eight review screenshots produced |
| `node --experimental-strip-types scripts/generate-translation-review.mjs` | Exit 0; local review HTML with source fingerprints generated |

The first upgraded `npm test` run exposed four HTML serialization differences:
root-URL trailing slash, attribute-name case and duplicate restrictive 404
robots tags. Tests now compare equivalent HTML semantics and reject wrong
hosts, protocols, paths, queries and conflicting indexing directives. An
independent release reviewer accepted this adjustment; no production metadata
change was needed. Full regression then passed. Linux CI was not run here.

The work remains integrated locally, without a commit, push or deployment.
Chinese/Korean fluent-human approval and explicit publication approval remain
pending; zero known dependency advisories are not a security certification.

Final independent `release_audit` decision: **GO for local integration; NO-GO
for production publication until human language review and owner approval**.
No remaining blocking implementation or dependency-advisory finding was
identified. The reviewer independently inspected the source and test changes;
the primary and maintainer supplied the executed suite/install/audit evidence.
Safari, real devices, screen readers and actual PDF pagination remain unverified.
