# Search discovery and SEO/AEO implementation

Observed 2026-09-06, Australia/Brisbane. Sources are the authenticated Google
Search Console UI for `sc-domain:propertysaleprofit.au`, repository tests and
the current local changes. No user identifiers or calculator amounts collected.

## Existing Preview integration

Reviewed Preview `3b710e4f-72e4-4dd8-9082-49730fb40767` was committed as
`cb3a849` and fast-forward merged into local `main` after explicit owner
acceptance. A later credential retry succeeded, and local `main` and
`origin/main` were both observed at `cb3a849` before this SEO/AEO release
candidate. Cloudflare production publication is recorded only after its active
Worker version and live output are observed.

Subsequent SEO/AEO changes are isolated on `codex/seo-aeo-discovery`. The
owner's local `.agents/`, `.codex/` and `AGENTS.md` remain untracked and intact.

## Google baseline — observed, not estimated

The domain property is accessible in Search Console. Existing sitemap
`https://propertysaleprofit.au/sitemap.xml` was submitted on 2026-07-27;
the UI reports success, last read 2026-09-03 and nine discovered pages.
It has not yet observed the three new guide pages from the unpromoted Preview.
No duplicate sitemap submission or indexing request was made in this step.

Web Search, selected 28-day window **2026-08-08 through 2026-09-04**:

| Metric | Observed value |
| --- | ---: |
| Clicks | 0 |
| Impressions | 34 |
| CTR | 0% |
| Average position | 45.3 |

| Page | Impressions | Clicks |
| --- | ---: | ---: |
| `/` | 29 | 0 |
| `/zh-Hans` | 4 | 0 |
| `/ko` | 1 | 0 |

Visible query rows: `property sale calculator` (7 impressions), `net proceeds
calculator` (4), `proceeds sale` (1), `sell your house calculator` (1); all show
zero clicks. Visible query rows do not sum to the property total and are not a
complete demand inventory. These small counts do not establish language demand
or an effect from changes that are not yet in production.

Indexing report last updated **2026-08-28**: five indexed pages and four
"Discovered — currently not indexed": `/ko/privacy`, `/privacy`,
`/zh-Hans/disclaimer`, `/zh-Hans/privacy`, all with no last crawl shown.
These are legal-information routes, not evidence that calculator homepages are
blocked. No error was marked fixed merely to trigger validation. Core Web Vitals
has no data; production usage events were not queried.

The separate Google generative-AI performance report (labelled Beta) was also
read for the same 2026-08-08 through 2026-09-04 window. It reports **two
impressions**, both for `/zh-Hans`. This UI showed no click or conversion metric;
none is inferred. Keep this separate from the Web Search total rather than
adding the two reports together. Two impressions are insufficient to establish
a repeatable AEO acquisition channel or a change effect.

## Bing setup

The authenticated Bing Webmaster Tools account initially displayed the add-site
onboarding screen, with no sites listed. The intended production origin was
added manually and is pending verification. Bing supplied the public
`msvalidate.01` verification value `E319A70AFC92A835B6CBAF8FAA0717B8`.
It is integrated locally only into the English homepage on the production host;
it is a public ownership-verification tag, not an API token or password.

No DNS records or Google Search Console access grants were changed. The first
Google-login attempt expired with HTTP 400; a fresh official login succeeded.
After the tag is published, complete Bing's Verify action and submit the
production sitemap. Until that succeeds, Bing indexing/performance is Unknown.

## Implemented locally

- Three 1200 × 630 localized PNG share cards, matching OG/Twitter image metadata,
  alt text and production-origin absolute URLs; existing result scope retained.
- A direct answer before the guide formulas distinguishes transaction profit
  from simplified cash without implying `cash = profit - loan`.
- Generic project-maintainer attribution and a correction link to the existing
  support address; no personal name, qualification or endorsement invented.
- No new calculation, analytics, storage, dependency, account or tracking code.
- Bing's actual public verification tag is restricted to the production English
  homepage, with SSR assertions for absence on other pages and Preview hosts.

Acceptance: unchanged calculation scope, crawlable visible answer, matching
three-language metadata/assets, truthful identity, existing privacy boundary,
and passing SSR and browser regression. `calculation_audit` accepted the new
answer; `release_audit` found no blocking source defect and inspected all three
images. The SEO/AEO Cloudflare Preview serves the localized share cards from
its own host while metadata deliberately points to their future production
URLs.

## Verification and remaining work

- `npm run lint`: passed.
- `npm test`: final typecheck/build and 59 tests passed, including the Bing
  verification matrix; the earlier share/guide-only run passed 58 tests.
- `node --experimental-strip-types --test tests/rendered-html.test.mjs`:
  strengthened final SSR checks, 15 passed (including metadata across 12 pages).
- `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e`: authorised final retry passed
  all 40 local Chromium tests and refreshed all eight mobile review images.
- Share-card and translation-packet generators completed; the source packet and
  all eight mobile screenshots include the new strings.
- Final independent release review before the successful browser rerun found no
  additional source issue.
- Cloudflare Preview Worker version
  `1ae971d4-2059-45a4-af34-27af04c1fd73` was published at the stable alias
  `https://seo-aeo-preview-property-profit-au.dairuifromcd.workers.dev`.
- The complete browser suite against that remote Preview passed all 40 tests.
  A separate read-only HTTP assertion checked six localized homepage/guide
  routes and three share images: Preview noindex, production canonicals,
  hreflang, OG/Twitter metadata, direct answers, absent Preview Bing tag,
  PNG content type and 1200 × 630 dimensions all passed.

After merging this release candidate, verify the active production Worker
version and perform minimal read-only HTTP checks for index/follow, the Bing
tag, production canonicals, same-page language alternates, robots, share images
and the 12-URL sitemap. Do not claim these post-release checks completed before
publication.

## Decision and next observation

Continue the owner-authorised small discovery/clarity batch. After actual
publication, observe 28 complete days of page/query impressions and clicks,
keeping the release date and reporting window explicit. Relevant impressions
support continued refinement; repeated unsupported tax-intent queries warrant
positioning review. Zero impressions with unknown indexing is insufficient
evidence to justify additional content. This is an observation plan, not a
scheduled automation or prediction of growth.
