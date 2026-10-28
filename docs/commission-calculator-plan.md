# Independent commission calculator — 27 October 2026

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

After an explicitly authorised publication, record its actual date. Evaluate
the three new task URLs using Search Console indexing, related query
impressions and natural clicks, with complete reporting dates and filters.
These are directional signals, not unique users or completed calculations.

The 18 November objective remains 100 Google Web clicks including 30 clicks to
the existing three selling-costs guides. New commission-tool clicks may count
in the property total but are not added to that content-page allowlist.

This branch work does not authorise pushing, Preview publication, production
deployment, merging, outreach or changing tracking.

## Implementation checks — 27–28 October 2026

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

This batch did not run `npm ci`, remote Preview verification, Linux CI,
Safari/Firefox checks, real-device testing or production HTTP smoke checks.
Repeat the release-candidate checks from a clean install and perform the
applicable remote checks when preparing a separately authorised publication.
The 20 October policy still applies: independent semantic and rendered-layout
reviews are required; fluent-human language sign-off is not a release gate.
