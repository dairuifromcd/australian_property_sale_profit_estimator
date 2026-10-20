# SEO growth sprint — 19 October 2026

## Owner-approved objective and measurement

The owner accepted this challenge on 19 October 2026 and authorised beginning
the changes. By **18 November 2026**, Google Search Console's latest complete,
processed, consecutive 28 days must show **at least 100 Web Search clicks** for
the production domain, including **at least 30 clicks to guide/content pages**.
The English, Chinese and Korean calculator homepages are all excluded from that
content-page subtotal. The current content-page allowlist is
`/selling-costs-guide`, `/zh-Hans/selling-costs-guide` and
`/ko/selling-costs-guide`; privacy/disclaimer routes are excluded. Any future
educational URLs must be explicitly added to this definition before evaluation.
Record both exact reporting dates and filters; page
aggregation and property aggregation can differ, so evaluate each threshold
using its corresponding report. Development, publication and indexing delays
are included in the deadline.

This is an ambitious operating target chosen by the owner, not a forecast or
guarantee. The observed sample is too small to estimate its probability.
Clicks are not unique people or completed calculations. Existing anonymous
events cannot attribute calculator completion to search; no new tracking is
authorised by this objective. Never create search clicks through team tests or
automated browsing to satisfy the target.

## Verified baseline — observed 19 October

Authenticated Search Console, production domain, Web Search,
**20 September–17 October 2026**:

| Metric | Observed |
| --- | ---: |
| Clicks | 1 |
| Impressions | 31 |
| CTR | 3.2% |
| Average position | 30.6 |
| English homepage impressions / clicks | 26 / 1 |
| Chinese homepage impressions / clicks | 5 / 0 |

The remaining pages have no rows in that window's viewed page report. Visible
queries were `property sale calculator` (4 impressions), `proceed from sale`,
`sell your house calculator` and `house sale calculator` (1 each), all with
zero visible query-level clicks. These rows are not a complete demand inventory.

The 12 October indexing report shows 5 indexed pages and 7 discovered, not
indexed. All three selling-costs guides are in the latter group and have no
last crawl reported. The sitemap was read successfully on 16 October with 12
discovered pages. The separate generative-AI Beta report for the same 28 days
shows 0 impressions; preserve its report identity and do not add it to Web
totals or generalise it to all AI services. Real-user research sample: **0**.

The pre-release Web Search baseline (8 August–4 September) was 34 impressions,
0 clicks and average position 45.3. Different query mixes and the tiny sample
prevent causal conclusions about the 7 September release (`7730c5d`).

## Decision, hypothesis and first batch

**Decision: Change.** Prioritise diagnosis and value on existing URLs before
adding new themes or city/amount template pages.

**User-visible outcome:** a searcher can identify the Australian property-sale
profit calculator, find its guide before completing the form, distinguish the
three result scopes and collect the amounts needed for an estimate.

**Hypothesis:** clearer query-aligned titles, an earlier guide link and a
checkable comparison/example will improve the usefulness and discovery of the
existing guide. Its indexing delay has not been attributed to content quality,
metadata streaming, hosting or any other specific cause.

The first batch uses existing routes and preserves all calculation semantics:

- Clear calculator title, summary and main heading, synchronised in all locales.
- A visible server-rendered guide link that opens separately and preserves inputs.
- A semantic comparison of transaction profit, optional overall pre-tax result
  and simplified cash, plus a complete fictional counterexample and input-material
  checklist in the existing guide.
- Metadata compatibility: use the framework's supported non-streaming option
  for requests with a User-Agent, so metadata is in the initial HTML head.
  vinext's empty-User-Agent path still streams metadata. Bingbot was already
  handled by the framework default; this is not proof of the past Bing failure's
  cause or of Google's indexing delay.

## Acceptance and independent review

- Preserve formulas, validation, rounding, privacy and the 12-URL inventory.
- Match all three locales; record pending fluent-human review truthfully.
- Check head placement and uniqueness for normal, Googlebot, Bingbot and
  unknown-verifier request headers, plus Preview noindex and Bing-tag scope.
- Check table semantics, mobile page overflow and guide-link input preservation.
- Verify new fictional examples against the existing calculation model.
- Run the repository's release-candidate suite and obtain separate calculation,
  localization and release reviews; record actual results when available.
- Publication requires owner approval for this batch. Preparing this change
  does not claim Preview or production deployment.

## One initial experiment and fixed checkpoints

Test the English guide's live URL through Search Console. Record live fetch,
index eligibility, declared canonical and any available last-crawl data.
After a successful live test, submit one indexing request if there is no recent
recorded request. Do not repeatedly submit the same URL. A successful live test
or request is not proof of indexing, ranking or traffic.

**Executed 19 October, 20:05 Brisbane:** the authenticated live test successfully
fetched the English guide using Google's mobile inspection tool, with crawling
allowed, indexing allowed and the expected declared canonical. Google's selected
canonical is not determined by this live test. The subsequent one-off request
was accepted: Search Console displayed "Indexing requested" and that the URL
was added to the priority crawl queue. This request concerns the existing live
September page; the new local content is not published yet. Evidence screenshot:
`outputs/seo-sprint/gsc-index-request.png` (local, ignored). No production
calculator values were entered or test search-result clicks created.

| Date | Checkpoint |
| --- | --- |
| 26 October (D7) | First batch published if approved; technical diagnosis and evidence recorded |
| 2 November (D14) | Review crawl/indexing, relevant query impressions and content-page clicks; act on the demonstrated bottleneck |
| 18 November (D30) | Evaluate the 100 property-click / 30 content-page-click thresholds using the latest complete processed 28 days |

If the guide remains unindexed, investigate that specific state before expanding
content. If indexed without related impressions, reassess its topic and usefulness.
If targets are missed, report the shortfall and observed bottleneck; do not move
the deadline or select a more favourable window. These are review checkpoints,
not a scheduled automation or permission to publish outreach.

## Local verification — 19 October 2026

- `npm ci --cache /private/tmp/property-profit-npm-cache`: sandbox attempt
  exited with an npm exit-handler error; authorised network retry installed
  595 packages successfully. The unchanged lockfile now reports 17 audit
  findings (1 moderate, 15 high, 1 critical). That scan is current; the earlier
  zero-audit result in September is historical. No audit fix or dependency
  update is part of this change. Risk triage is recorded separately below.
- `npm run lint` and `npm test`: final retry passed after the layout correction;
  typecheck, production build and all 62 tests passed, including initial-head
  placement across 48 user-agent/host/locale/path combinations.
- `npm run test:coverage`: 34 tests passed; 100% line, branch and function
  coverage for `calculator.ts` and `input-format.ts` only.
- `npm run test:mutation`: 238/238 mutants killed, no survivors or timeouts.
- `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e`: first run passed 39/40;
  the earlier guide link pushed the first desktop input below the opening
  viewport. Reducing hero padding restored the original layout requirement
  without relaxing the test. The final complete run passed **40/40** (27.3 s)
  and refreshed all eight local mobile review screenshots.
- `node --experimental-strip-types scripts/generate-translation-review.mjs`:
  regenerated the current three-language source packet and fingerprints.
- Independent calculation and AI localization source reviews found no blocking
  inconsistency. The primary agent and release reviewer inspected the updated
  375px Chinese/Korean guide screenshots: no clipped table/page overflow was
  observed; the three-column table is relatively dense. This is not fluent-human
  language approval or a real-device audit.
- `git diff --check`: passed. At this local verification stage, remote Preview
  E2E and post-release production checks had not been executed. The subsequent
  completed Preview verification is recorded below; production remains pending.

## Publication smoke and rollback

Before any approved production release, record the then-current active Worker
version and traffic allocation. The source baseline for this branch is `7730c5d`;
the Worker version observed after that September release was
`a5442ecd-4a7c-42a0-9af7-3e4a52899772`. Do not assume it remains active without
checking at release time.

After approved Preview publication, run the complete remote E2E against that
Preview and verify its noindex metadata. After approved production publication,
use HTTP-only smoke checks for homepage/guide head metadata, host indexing rules,
canonical/hreflang, one visible guide entry, three result scopes, static share
images, robots and the 12-URL sitemap. Do not enter calculator figures or create
search-result clicks in production. Recheck Bing only after verifying the tag
is in the production initial head; do not assert its old failure is resolved.

If production smoke fails, restore the captured previous Worker version rather
than making unreviewed production edits; use a reviewed revert to preserve the
source history if necessary. Verify the restored output and record the cause.

## Current dependency triage and release boundary

The release review commissioned a separate read-only audit-applicability check.
It found no reachable path in the current local Cloudflare/vinext build for the
three Next advisories carrying critical severity: Windows-hosted native server
execution, the native Next AVIF image-optimization path and `next/og`
ImageResponse. The inspected artifact does not bundle Next's native server,
sharp or the dynamic OG implementation; external imports were empty in the
build metadata. The application uses static trusted share images, not image
uploads or dynamic OG routes. These are applicability observations for this
artifact, not proof that every dependency or attack path is safe.

The 17 audit findings remain unresolved. Other findings largely concern local
build/lint/deployment dependencies. The share-image generator parses controlled
local SVG input; keep that input trusted. A separate compatible dependency
remediation is warranted; do not apply `npm audit fix --force` or suggested
framework downgrades as an incidental SEO change. Remote artifact consistency
has not yet been checked.

Official advisory references:

- https://github.com/advisories/GHSA-p293-qw3h-jr36
- https://github.com/advisories/GHSA-2xp9-vwfh-vxw4
- https://github.com/advisories/GHSA-vcvr-r3jv-pc5j

Independent review found no new calculation, privacy or SEO source blocker for
the local candidate. At that review stage, Preview publication still needed
owner approval and remote verification. Production approval, current dependency-risk
disposition and the recorded fluent-human language review gate remain separate;
the September publication approvals do not approve this new batch.

Final independent `release_reviewer` decision: **CONDITIONAL GO for the local
candidate / an owner-approved Preview verification; production NO-GO until the
stated publication and language-review gates are met**. The reviewer separately
ran lint, 44 unit/dictionary/usage tests, 18 built-HTML tests and 34 coverage
tests, all passing, and inspected the updated mobile guides. At that local review
stage no remote Preview verification was claimed. Production smoke, Linux CI,
Safari/Firefox, real-device and fluent-human review remain unperformed.

## Approved Cloudflare Preview — 19 October 2026

The owner explicitly approved this batch's Preview publication. Local Wrangler
OAuth had expired and could not refresh. Instead of adding a new token or
granting new access, the primary agent pushed only the existing feature branch
to use the already configured GitHub–Cloudflare Workers Builds integration.

- Source commit: `4506146f125c2ace27c05b0d7038bf33d0896530`.
- Branch: `codex/seo-growth-sprint`.
- Cloudflare build: `d950db32-159a-4dcd-93a7-fa7d9ae26425`.
- Uploaded Worker version: `8eb25615-d924-49f8-91cb-52b56ded8b5a`.
- Fixed URL: https://8eb25615-property-profit-au.dairuifromcd.workers.dev
- Branch alias: https://codex-seo-growth-sprint-property-profit-au.dairuifromcd.workers.dev

The public GitHub check reported `completed / success` and supplied those exact
version URLs. The complete remote regression command was:

```sh
PLAYWRIGHT_BASE_URL=https://8eb25615-property-profit-au.dairuifromcd.workers.dev npm run test:e2e
```

Result: **40/40 passed**, 30.1 seconds. A browser view of the alias also displayed
the new title, introduction and early guide link. Its local screenshot is
`outputs/seo-sprint/cloudflare-preview.png` (ignored).

`git ls-remote` confirmed remote `main` remains `7730c5d`; a read-only production
homepage fetch still showed the September title and main heading. This is a
Preview release only. No production promotion, DNS change or new credential
was performed. Remaining production approval, language-review and dependency
disposition gates are unchanged.

A primary-agent HTTP check using an unknown verification User-Agent also
confirmed the fixed Preview's initial head contains the new title, `noindex,
nofollow` and production canonical, with no Bing ownership tag. Preview tags
are valid self-closing HTML; assertions must accept both serializations.
The primary agent's final parallel HTTP checks passed for all six localized
home/guide pages and all three share PNGs: initial-head title/description,
Preview noindex, one robots tag, production canonical, same-page hreflang,
OG/Twitter metadata, absence of the Bing tag, early guide entry, semantic
three-row result comparison, the 70,000 loss / 280,000 cash example and valid
1200 x 630 PNG headers. The temporary command was
`node /private/tmp/seo-preview-remote.mjs` (exit 0). This is remote response
verification, not evidence of improved search indexing or traffic. Independent
local release review remains applicable; an additional independent remote pass
is not claimed until its actual results are available.

## Completion decision and authorisation — 20 October 2026

The owner instructed the team to finish the justified changes, perform
acceptance checks and merge. This authorises the eventual merge to `main` and
its configured production deployment; another merge-permission request is not
needed. The owner subsequently explicitly instructed removing the mandatory
human-review requirement for Chinese and Korean copy. This revises the release
policy, rather than supplying reviewer identities or human approval. Independent
semantic and rendered-layout review and automated checks remain applicable; no
professional review or financial-scope expansion is inferred. The current policy
and preserved historical records are in `docs/translation-review.md`.

Independent product-evidence review recommends **Continue** with the existing
bounded batch. A separate read-only SEO source audit found no concrete remaining
canonical, hreflang, robots, sitemap, initial-head or link-discovery defect. No
additional routes, speculative schema, tracking or outreach are justified by
the current 31-impression / 1-click baseline. The guide's unindexed state and
its cause remain distinct: the state is observed; the cause is Unknown.

The remaining implementation work is compatible remediation of the dependency
findings, followed by a clean release-candidate suite and independent review.
Record its actual results before deciding release readiness. The one search
experiment and the 18 November traffic thresholds above remain unchanged. Code
acceptance and publication cannot establish that the traffic objective has
already been achieved.

### Dependency disposition and rollback baseline

Compatible updates reduce the current full audit from 17 entries to **8 high
entries**, all from the same unpatched `braces` development-tool advisory.
Production-only audit is **0**. The exact versions, advisory and trusted-build
controls are recorded in `docs/dependency-remediation.md`; this is not a claim
that the full audit is clean.

A separate read-only dependency reviewer inspected the new 237-file artifact,
92 source maps and the server import graph. No affected braces/glob/lint/build
plugin source was found in the deployment, and no request-to-glob path was found
in the application. External imports were Node built-ins and
`cloudflare:workers`, with no global `require()` calls. The reviewer gave
**CONDITIONAL GO** for this bounded dependency-risk disposition, subject to the
full release checks and trusted-source/build controls. The primary agent accepts
that documented residual development-tool risk for this batch; no public glob
API, dependency suppression or claim of a patched upstream release is introduced.

After the owner explicitly authorised the terms acknowledgement, Cloudflare's
dashboard sign-in was restored without creating a token. Immediately before
release preparation the active deployment still showed **`a5442ecd` at 100%**,
associated with source `7730c5de61eab2cd4998a11e94b5993ba0eb7e19` and the
previously recorded full version ID
`a5442ecd-4a7c-42a0-9af7-3e4a52899772`. The dashboard showed the new Preview as
ready with no production allocation. Evidence:
`outputs/seo-sprint/cloudflare-before-release-2026-10-20.png` (local, ignored).

Bing's existing Google sign-in was restored and the account again supplied the
same public verification tag. A production HTTP fetch with an ordinary curl
User-Agent found that tag after the initial head in the old streamed response.
Wait for this batch's metadata change to reach production before its next Verify
action. This observation does not establish the cause of Bing's prior failure.

### Final local release-candidate checks — 20 October

All of these checks ran on the compatible dependency candidate, with the same
application source and locale strings reviewed above:

| Command | Actual result |
| --- | --- |
| `npm ci --cache /private/tmp/property-profit-npm-cache` | Exit 0; 591 packages installed from the lockfile. |
| `npm run lint` | Exit 0. |
| `npm test` | Exit 0; typecheck, production build and 62/62 tests passed. |
| `npm run test:coverage` | Exit 0; 34/34 tests, 100% lines/branches/functions for `calculator.ts` and `input-format.ts` only. |
| `npm run test:mutation` | First sandbox attempt could not bind its logging port (`EPERM`); authorised retry exit 0, 238/238 mutants killed, no survivors/timeouts/errors. |
| `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` | First sandbox attempt could not bind localhost:4173 (`EPERM`); authorised retry exit 0, 40/40 Chromium tests passed in 32.4 s and eight mobile review screenshots refreshed. |
| `node --experimental-strip-types scripts/generate-translation-review.mjs` | Exit 0; current source packet and fingerprints regenerated. |
| `git diff --check` | Exit 0. |

The browser run started a fresh local server; no existing process was listening
on port 4173. Vinext/RSC emits existing source-map warnings; these checks did not
establish source-map perfection or real-device/Safari/Firefox coverage. The
remaining 8 audit entries are disclosed above. Updated remote Preview and Linux
CI acceptance are subsequent steps and are not claimed by this local table.
