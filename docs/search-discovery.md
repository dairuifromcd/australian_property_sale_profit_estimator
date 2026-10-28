# Search discovery and SEO/AEO implementation

## Published commission task — 28 October 2026

The three commission-calculator routes are published at the English
`/real-estate-agent-commission-calculator` path and its `/zh-Hans` and `/ko`
equivalents. The canonical sitemap now contains 15 URLs. PR #26 merged as
`f50eb52386f8747f2284ad4c7b1288935e552811`; successful Cloudflare build
`9c0cbc7c-cf52-42cd-b17f-7d9733461ee4` first rolled out Worker
`d3f62894-4470-48db-ae00-c7556f970eb5`, verified in active-version and rollout
views at 100% traffic. Main Linux CI run `40641529648` succeeded.

The final candidate passed clean install, lint, 68 application/SSR tests,
38 focused tests with 100% coverage of calculation/input modules only,
258 killed mutants, 47 local browser tests (37.5 s) and 47 tests against the
fixed `3f80111d` Cloudflare Preview (32.9 s). Production read-only HTTP checks
passed **20 requests / 908 assertions / 0 failures**. New artifact review and
independent production release acceptance gave GO with 3 moderate Satori
development-chain audit entries documented and production-only audit zero.

The initial production robots check failed one overly broad QA assertion:
Cloudflare's specific training-crawler denies were mistaken for wildcard
denial. UA-group-aware parsing and 35 offline positive/negative fixtures fixed
the temporary checker. The final checks confirm wildcard/Googlebot/Bingbot
access to all 15 public paths; no site robots or Cloudflare configuration was
changed. No production calculator interaction, browser JavaScript, new
analytics, index request or synthetic search click was used.

These are publication and HTTP-discovery facts. Search indexing, rankings and
new-tool traffic are still **Unknown**. The three-guide allowlist for the
30-content-click goal is unchanged. Source/Worker IDs here identify the first
runtime release; a subsequent documentation-only commit may automatically
deploy a newer Worker. See [the complete acceptance record](commission-calculator-plan.md)
for commands, evidence and limits.

## Historical commission branch preparation — 27 October 2026

The owner authorised an independent, directly usable commission calculator
topic in three languages at `/real-estate-agent-commission-calculator` and the
Chinese/Korean equivalents. This source branch has 15 sitemap URLs, with
task-specific titles, descriptions, canonicals and language alternates. The
existing production-only robots and English-home-only Bing tag rules apply.
Home and guide pages link to the matching tool; the tool links back to the
full calculator and guide. Branch implementation is not a deployment, indexed
page or measured traffic gain.

The hypothesis is that requiring just price and the user's quoted inclusive
rate better serves a commission-only task. After an approved publication,
record its actual date and inspect relevant queries, impressions and natural
clicks for these three URLs. Search demand remains unverified. The existing
30-guide-click goal allowlist is unchanged.

## Prior release record

Historical implementation snapshot observed 2026-09-06, Australia/Brisbane.
Sources are the authenticated Google Search Console UI for
`sc-domain:propertysaleprofit.au`, repository tests and local changes.
The subsequent 7 September release reached production as `7730c5d`; recorded
read-only production checks passed. Earlier references to pending release below
describe that historical point, not the current deployment state.
No user identifiers or calculator amounts were collected.

## Published sprint — 20 October 2026

PR #24 was merged into `main` as
`ef72ad26b4e87df99c104fc025dd297181e6fc70` after the updated Preview, Linux CI
and independent release review passed. Cloudflare's production build succeeded;
the dashboard then showed version `b7ff061f-3876-4474-bc34-75f6a9ad56b4`
receiving 100% of traffic. Read-only HTTP acceptance passed for all 12 localized
pages, robots, the 12-URL sitemap and three share images. It confirmed production
index/follow, canonical/hreflang, the guide's new content and the Bing tag in the
initial head, including for an unknown verification User-Agent. No production
calculator interaction or artificial search click was used.

The authenticated Bing Verify action then succeeded, displaying
"Congratulations! Site addition successful" for the production domain. Evidence:
`outputs/seo-sprint/bing-verified-2026-10-20.png` (local, ignored). This supersedes
the historical unknown ownership state below. Verification alone does not prove
that Bing has crawled or indexed any page, or that traffic has improved.

Bing's sitemap list initially contained zero rows. A single submission of
`https://propertysaleprofit.au/sitemap.xml` was then accepted with a success
message; the list showed one known sitemap in **Processing** state, no crawl
date and no discovered-URL count yet. Evidence:
`outputs/seo-sprint/bing-sitemap-submitted-2026-10-20.png` (local, ignored).
Submission is complete; successful processing and indexing remain unverified.

The Google baseline and the 18 November 100-click / 30-content-click target are
unchanged. Review crawl/indexing and related queries on 26 October and 2 November;
the 19 October Google indexing request should not be repeated.

## Current review — 19 October 2026

The authenticated Web Search report for 20 September–17 October shows 31
impressions, 1 click, 3.2% CTR and average position 30.6. The English homepage
contributed 26 impressions and the one click; the Chinese homepage contributed
5 impressions and no clicks. No guide rows appeared in that page report.

The indexing report updated 12 October still shows 5 indexed and 7 discovered,
not indexed, including all three guides with no last crawl. The sitemap was
read successfully on 16 October and now reports all 12 URLs discovered. This
confirms discovery, not indexing or a specific cause for the delay.

The separate Google generative-AI Beta report for the same 28 days shows 0
impressions. Keep this UI snapshot separate from Web totals; it does not measure
all AI platforms or establish zero AI referrals. No search-attributed calculator
completion metric is available from the existing anonymous event schema.

The Bing tag was published with the September release, but subsequent Verify
attempts returned a generic error. A fresh sign-in and manual add retry later
returned a too-many-requests message. Current ownership verification remains
Unknown; no successful verification or sitemap submission is claimed.

The owner accepted a fixed 18 November target and authorised a focused local
SEO change. See [the sprint plan, evidence and acceptance](seo-growth-sprint.md).
Publication of this new batch is separate from the September release approval.

At 20:05 Brisbane on 19 October the English guide's Search Console live test
fetched successfully and reported crawling and indexing allowed, with the
expected declared canonical. Its Google-selected canonical is not yet determined.
One subsequent indexing request was accepted into the priority crawl queue.
This is a successful request for the existing production page, not proof of
indexing or publication of the new sprint content.

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
