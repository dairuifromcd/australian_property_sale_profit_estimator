# Independent commission calculator — 27 October 2026

## Published acceptance — 28 October 2026

The owner-authorised batch is published in English, Simplified Chinese and
Korean. The commission routes are `/real-estate-agent-commission-calculator`,
`/zh-Hans/real-estate-agent-commission-calculator` and
`/ko/real-estate-agent-commission-calculator`; the production sitemap contains
15 canonical URLs.

- [PR #26](https://github.com/dairuifromcd/australian_property_sale_profit_estimator/pull/26)
  merged into `main` as `f50eb52386f8747f2284ad4c7b1288935e552811`.
- The first production runtime Worker was
  `d3f62894-4470-48db-ae00-c7556f970eb5`. Cloudflare build
  `9c0cbc7c-cf52-42cd-b17f-7d9733461ee4` succeeded; the dashboard's active version
  and rollout history both showed that Worker receiving **100%** of traffic.
- [Main Linux CI run 40641529648](https://github.com/dairuifromcd/australian_property_sale_profit_estimator/actions/runs/40641529648)
  succeeded. The reviewed fixed Preview was
  `https://3f80111d-property-profit-au.dairuifromcd.workers.dev`.

The following results concern the final security-patched candidate and approved
publication, not only the earlier local feature branch:

| Check | Actual result |
| --- | --- |
| Clean `npm ci --offline --no-audit --cache /private/tmp/property-profit-npm-cache` | Exit 0; locked dependency install succeeded. |
| `npm run lint` | Exit 0. |
| `npm test` | Exit 0; typecheck, build and **68/68 tests** passed. |
| `npm run test:coverage` | **38 tests** passed; 100% lines, branches and functions for `calculator.ts` and `input-format.ts` only. |
| `npm run test:mutation` | **258/258 killed**, no survivors or timeouts. |
| `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` | **47/47 local Chromium tests**, **37.5 seconds**; ten mobile review images refreshed. |
| `PLAYWRIGHT_BASE_URL=https://3f80111d-property-profit-au.dairuifromcd.workers.dev npm run test:e2e` | **47/47 remote Preview tests**, **32.9 seconds**. |
| Preview HTTP-only smoke | **20 requests / 864 assertions / 0 failures**, exit 0. |
| `node --experimental-strip-types /private/tmp/commission-release-smoke.mjs https://propertysaleprofit.au production` | **20 requests / 908 assertions / 0 failures**, exit 0. |
| Full / production-only npm audit | **3 moderate / 0 findings**; zero high or critical entries. |

Independent calculation and AI source/rendered localization reviews accepted
the scope and implementation. The renewed dependency-artifact assessment found
no deployed Satori path in the new build; independent release review gave
**GO**, including the documented residual vinext → @vercel/og → Satori
development chain. The complete audit is not zero. This is software/risk
review, not human-language or professional financial approval.

After the actual production checks, `release_reviewer` independently gave
**production acceptance GO**, verifying 20 requests / 908 assertions / zero
failures and rerunning all 35 offline robots fixtures.

The first production HTTP run had **one failed assertion**: the temporary QA
script looked for any `Disallow: /` across the whole robots.txt. Cloudflare's
managed text restricts specific training crawlers while permitting ordinary
search. The corrected script selects the most specific UA group, merges equal
groups and applies longest-path rules with Allow winning a tie. **35 offline
positive/negative fixture checks passed**, including explicit Googlebot and
wildcard denies, repeated groups and training-only denies. The successful
production rerun verifies wildcard, Googlebot and Bingbot access to all 15
public paths. No application robots rule or Cloudflare configuration was
changed to resolve the test failure.

Local ignored evidence is under `outputs/commission-release/`, including
`preview-smoke.json`, `production-smoke.json`, the audit reports,
`risk-artifact.json` and `production-cloudflare.png`. Production acceptance
used HTTP only: no calculator amounts were entered, no production browser
JavaScript/E2E ran, no new tracking or index requests were added, and no
artificial search clicks were created. Safari/Firefox and real-device tests
remain unperformed.

Publication and crawlable responses do not establish search indexing, ranking
or acquisition. New-tool indexing and traffic remain **Unknown**. The original
100 Google Web / 30 guide-click objective and its three-guide allowlist remain
unchanged; commission-tool clicks are not automatically content-page clicks.

These source/build/Worker IDs record the **first runtime publication**. A
subsequent documentation-only commit may trigger another automatic deployment;
this record does not claim that the first Worker remains permanently active.
Check the current rollout before any later active-version or rollback claim.

## Outcome and hypothesis

An Australian seller can enter only a sale price and the GST-inclusive
percentage from their own agent quote, then see the agent commission in AUD.
They do not need to enter purchase price, a loan or other selling costs.

The owner authorised this focused implementation on a feature branch. The
growth hypothesis is that a directly usable, two-input task page can earn
relevant commission-search impressions and natural clicks. Search demand and
traffic uplift remain unverified; no simulated users are evidence of demand.

## Scope and acceptance

- One task, with English, Simplified Chinese and Korean routes at
  `/real-estate-agent-commission-calculator` and the existing locale prefixes.
- Reuse the main model's sale-price and percentage validation. Price must be
  finite, greater than zero and at most AUD 1 trillion. Rate must be finite and
  between 0 and 99.9 inclusive. Both fields are explicitly required; blank is
  not zero. Incomplete drafts hide any previously valid result.
- Commission is `sale price × rate / 100`, with no extra GST multiplication.
  Keep internal precision; display AUD to cents and explain display rounding.
  The shared function must match the main calculator's valid commission.
- No suggested market fee, tax calculation, valuation, profit, settlement
  cash or claim that commission is all selling costs. Explain exclusions and
  link to the existing full calculator and guide.
- Match source meaning in all locales. Canonical, language alternates, page
  metadata, sitemap and locale switching identify the same task. Existing
  production-only indexing and Bing-tag scope remain unchanged.
- Inputs remain in component memory. No new events, cookies, storage,
  identifiers, input-bearing URLs, dependencies or external transmission.
  The new page must not emit the main four-input calculator's usage events.
- Labels, errors, live results, keyboard controls and layout work at mobile
  widths, including valid maximum amounts. Navigation from the filled main
  calculator opens separately so its values remain available.
- Unit, SSR and browser checks cover normal, zero, decimal, draft, boundary,
  rounding, locale, metadata and privacy behaviour. Existing main-calculator
  semantics remain covered by its regression suite. Independent calculation,
  localization and release review remain separate from implementation.

## Evaluation and release boundary

Following the 28 October publication recorded above, evaluate
the three new task URLs using Search Console indexing, related query
impressions and natural clicks, with complete reporting dates and filters.
These are directional signals, not unique users or completed calculations.

The 18 November objective remains 100 Google Web clicks including 30 clicks to
the existing three selling-costs guides. New commission-tool clicks may count
in the property total but are not added to that content-page allowlist.

The original implementation approval was branch-only. On 28 October the owner
explicitly authorised pushing, merging and publishing this commission batch.
That authorisation did not make pending checks successful: the fresh
dependency findings below required a newly verified candidate and independent
review, completed in the published acceptance above. No outreach or tracking
change is authorised.

## Historical local implementation checks — 27–28 October 2026

This section preserves the earlier local-only stage, before the security patch
and published acceptance above; its pending/untested statements are historical.

- `npm run lint`: passed.
- Latest `npm test`: typecheck and production build passed; **68/68 tests
  passed**, including the three-language task, 15-URL sitemap, complete share
  metadata, initial-head user-agent matrix and production English-home-only
  Bing tag. An earlier run passed 66/67 because the new SSR assertion did not
  account for HTML-escaped apostrophes; correcting the assertion resolved it.
- `node --experimental-strip-types --test tests/rendered-html.test.mjs`:
  **19/19 passed** after that assertion correction.
- `node --experimental-strip-types scripts/generate-translation-review.mjs`:
  passed and generated the local ignored source packet and fingerprints.
- `git diff --check`: passed.
- `npm run test:coverage`: **38 tests passed**, with 100% line, branch and
  function coverage for `app/calculator.ts` and `app/input-format.ts` only.
- `npm run test:mutation`: **258/258 mutants killed**, zero survivors or
  timeouts. The first integration run left two fallback mutants alive; exact
  legacy main-calculator intermediate-value assertions closed that gap without
  changing the model, excluding mutations or lowering thresholds.
- First `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` integration run:
  **46/47 passed**. The existing guide test selected the privacy link by its
  old position, which changed when the commission link was added. It now
  targets privacy and disclaimer by their exact href and also checks the new
  tool's safe new-tab attributes. On 28 October the final complete
  `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` rerun passed **47/47** in
  **24.1 seconds**, including a successful build, and refreshed all ten local
  mobile review screenshots.

The separate calculation reviewer identified negative-zero display while
reviewing the shared function. Reusing the existing percentage normalisation
restored the main calculator's positive-zero semantics. Unit and three-language
browser cases explicitly check a `-0` rate. Floating-point precision is retained;
tests compare independent cents displays and a small numeric tolerance instead
of changing multiplication order or rounding the calculation model.
`calculation_audit` independently accepted the calculation and input source
after the negative-zero correction. This is software calculation review, not
professional financial approval.

The independent AI localization reviewer accepted source semantics and both
original 375px commission screenshots without blocking findings; see the
language review record. On 28 October `release_reviewer` gave **GO for the local
feature branch**, with no blocking finding. This is an independent local
acceptance decision, not permission to publish, push, merge or deploy.
Build warnings about framework sourcemaps and dynamic route classification
remain non-fatal; no new dependency was installed. No
publication or traffic effect is claimed.

At that initial local acceptance, `npm ci`, remote Preview verification,
Linux CI, Safari/Firefox checks, real-device testing and production HTTP smoke
checks had not yet run. Release-candidate checks from a clean install and the
applicable remote checks were still required for publication; subsequent
dependency and release evidence is recorded separately below.
The 20 October policy still applies: independent semantic and rendered-layout
reviews are required; fluent-human language sign-off is not a release gate.

## Historical pre-publication dependency safety update — 28 October 2026

A fresh audit after publication authorisation found 12 affected package
entries (1 critical, 3 high, 8 moderate), including 1 production-only critical
entry. Before merging or promoting, the candidate updates Next and its lint
config to 16.4.3, Vite to 8.1.6, the existing qs override to 6.16.1, transitive
Zod to 4.6.6 and the exact Undici 7.29.1 dependency to 7.30.1. React, vinext
and Cloudflare package versions remain unchanged. No commission calculation,
privacy behaviour or production dependency is added by this safety update.

The compatible candidate's audit is 3 moderate entries from the existing
vinext → @vercel/og → Satori development chain; production-only audit is zero.
The old braces advisory was withdrawn upstream on 23 October, not repaired by
this branch. The original local GO and the 68/38/258/47 test record above
describe the preceding dependency state. Repeat regression, artifact/remote
checks and independent release review for the final safety candidate; do not
carry the previous GO forward automatically.

Two clean installations succeeded. The final exact-version Undici override
also passes the targeted and complete `npm ls` checks, after replacing a
parent-scoped override that npm marked invalid when hoisted. Detailed
versions, commands, residual-risk evidence and actual audit results are in
[dependency remediation](dependency-remediation.md). No production publication
is claimed by these local dependency checks.
