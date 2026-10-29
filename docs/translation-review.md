# Translation review

## Decimal correctness and monetary exponent drafts — 29 October 2026

This local repair changes calculation/display arithmetic and money-input
validation; it adds no source or translated dictionary strings. English,
Chinese and Korean retain the same financial scope, result labels, existing
validation messages and privacy disclosures. Exact zero no longer appears as a
false loss/shortfall, decimal half cents round once for display, and exponent
money drafts stay visible but invalid until corrected. Native percentage
exponents remain supported.

On the combined frozen source,
`CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` passed **53/53** local Chromium
tests in **26.2s**, refreshing **12** mobile review screenshots under ignored
`outputs/translation-review/`. The three-language scenarios exercise main and
standalone calculations, exact-zero status labels, exponent money rejection
through blur, correction recovery and optional/target result isolation.
`npm test` passed typechecking/build and **79/79** application/SSR tests.

The independent calculation reviewer gave **GO** for arithmetic and the input
repair. The independent release reviewer read the final combined logs and
actually viewed four refreshed Chinese/Korean calculator and commission
screenshots, finding no truncation or missing content. It gave **GO for local
acceptance**, with no blocking finding. These are independent AI reviews and
automated software checks, not fluent-human or professional
approval, physical-device testing or a screen-reader assessment. No new
dictionary translation or production publication is claimed. See
[`calculation-correctness-audit.md`](calculation-correctness-audit.md) for exact
commands, numerical evidence, mutation-stage history and remaining limitations.

## Homepage tool discovery and readability — 29 October 2026

The local `codex/home-tool-discovery-readability` branch reuses the existing
English, Chinese and Korean `CommissionLink` label and explicit new-tab warning
in the homepage help area before the full calculator. The guide shortcut and
lower commission shortcut remain available. No dictionary strings, calculation
explanations, formulas, GST treatment, profit/cash labels or privacy claims were
changed. The new links open the same-language task separately and preserve the
original full calculator's inputs and result without putting amounts in URLs.

Readability changes darken muted text to `#52656d`, increase field help from
12px to 13px, loosen Chinese/Korean heading line spacing, wrap Korean page
titles and navigation at word boundaries, and keep reset labels on one line.
Desktop homepage whitespace was reduced to keep the entire first money-control
border in the opening 1280×720 viewport; mobile hero spacing is unchanged. The
existing guide comparison table was retained after independent original-size
inspection found it dense but complete and readable.

On 29 October the independent readability reviewer gave **GO for local
semantic/rendered-layout acceptance**, with no blocking finding. It compared
source semantics and actually viewed six refreshed original-size Chromium
screenshots: Korean home at 320px; English home at 1280px and 375px; Chinese
home at 375px; Korean guide at 375px; and Chinese commission tool at 320px.
It confirmed intact Korean navigation words, a single-line reset label, the
complete English input border, discoverable localized top shortcuts, the Korean
guide title and unchanged Chinese commission scope. An apparent repeated yellow
banner in an earlier capture disappeared on stable recapture; the final pages
each had one static banner. The existing GST, profit and cash meanings remain
equivalent across the three languages.

The independent `release_reviewer` actually inspected the final Korean 320px
and English 1280px images and gave **GO for this local branch**. These are
independent AI source/Chromium screenshot reviews, not fluent-human or
professional approval, physical-device testing or a screen-reader assessment.

Final primary-thread checks passed `npm run lint` (exit 0), `npm test` (exit 0;
typecheck, production build and **68/68** application/SSR tests), and
`CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` (exit 0; **47/47** tests in
**20.4 seconds**). The browser tests protect keyboard activation, full-estimate
retention, same-language destination and safe new-tab attributes. Their desktop
assertion now waits for fonts and measures the full money-control wrapper:
bottom 715.40625px in English and 643.484375px in Chinese/Korean. It no longer
relies on only the inner text input, which had missed the lower border.

Local CLI capture retained 21 after screenshots and nine 640px reflow checks;
all 30 observations had no horizontal overflow. Before/after PNGs and exact
final logs are under ignored `outputs/home-discovery-review/`. The opt-in E2E
capture refreshed 12 local images under `outputs/translation-review/`, including
the Chinese/Korean `home-discovery-mobile.png` views. No source dictionary
fingerprint changed in this batch.

Safari/Firefox, real devices, screen readers, fresh clean-install release checks,
remote Preview and Linux CI acceptance were not run for this local batch. No
push, deployment or outreach email is claimed. The local review decisions do
not claim publication or measured traffic improvement. See
`docs/home-discovery-readability-plan.md` for the initial assertion failures,
their corrections and the final acceptance record.

## Independent commission tool — 27 October 2026

The feature branch adds a dedicated English source and typed Chinese/Korean
translations in `app/i18n/commission-messages.ts`. Copy preserves GST-inclusive
input without adding GST again, percentage-only commission, explicit zero
versus blank, nearest-cent display, a fictional 2.2% example, excluded
fixed/tiered arrangements and local-only inputs without usage events. The
translation packet now includes this source and links for two local mobile
tool screenshots, generated by the opt-in E2E evidence capture.

`commission_localization_review` independently reviewed both source languages
on 27 October and found no blocking semantic difference. Its Korean form-title
wording suggestion was applied. By 28 October it had also inspected the two
original 375px-wide screenshots, `zh-Hans-commission-mobile.png` and
`ko-commission-mobile.png`, under `outputs/translation-review/`. The maximum
amount, substituted formula, commission-only scope and privacy text remained
readable and equivalent to the English source, with no blocking rendered-layout
finding. This is independent AI semantic and screenshot review, not human or
professional approval or a real-device test. On 28 October the final
`CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` completed its build and passed
**47/47** browser tests in **24.1 seconds**, refreshing all ten local mobile
review screenshots, including the Chinese and Korean commission pages. The
earlier 46/47 run failed an existing guide-footer positional link assertion;
targeting the exact privacy/disclaimer hrefs and checking the new commission
link resolved it. No new publication is claimed.

On 28 October `release_reviewer` gave **GO for this local feature branch** with
no blocking finding. This is not publication permission. This batch did not
run `npm ci`, remote Preview verification, Linux CI, Safari/Firefox checks,
real-device testing or production HTTP smoke checks; applicable clean-install
and remote acceptance remain for a separately authorised release candidate.
The owner policy below continues to make fluent-human sign-off optional, while
retaining independent semantic and rendered-layout review.

English (`en-AU`) is the source of truth. Simplified Chinese (`zh-Hans`) and
Korean (`ko`) must preserve the same calculation scope, uncertainty, privacy
claims and legal limitations; translation must not make an estimate sound like
advice, a valuation, a guaranteed result or a tax calculation.

## Automated controls

- Every dictionary has the exact English key and tuple structure at build time.
- Tests reject missing or empty text and mismatched dynamic placeholders.
- Calculator validation uses language-neutral error codes that must map to every
  dictionary.
- All locales use the same calculation model, AUD parser and AUD formatter.
- Browser tests compare the same complete scenario in all three languages and
  open all six substituted calculations.
- Canonical URLs, `hreflang`, page language, legal routes, invalid locales,
  sitemap entries, switching behaviour, browser storage and mobile overflow are
  tested.

## Terminology decisions

- “Estimate” stays explicitly indicative or reference-only.
- “Transaction profit” is not translated as accounting, taxable or after-tax
  profit.
- “Amount after selling costs” remains before any loan payout.
- “Settlement cash” remains a simplified estimate that excludes tax and
  unentered adjustments.
- “Holding costs” excludes loan principal because purchase price is already
  counted in transaction profit.
- CGT, income tax, accounting profit and after-tax profit remain explicitly
  outside the model.
- Australian names and context such as ATO, ASIC, Tax Practitioners Board,
  GST, Council rates and conveyancing are retained or explained rather than
  replaced with another jurisdiction's concepts.

## Current review policy — 20 October 2026

The owner explicitly instructed removing the mandatory human-review requirement
for Chinese and Korean copy. Fluent-human approval is therefore no longer a
production release gate. This revises the earlier policy below; it does not
retroactively turn an AI review into a human review or fill in reviewer records.

English remains the source of truth. All locales must change together and
preserve calculation scope, privacy and exclusions. Independent semantic review,
dictionary/SSR/browser checks and rendered mobile inspection remain the quality
controls for this batch. Record actual findings and limitations truthfully.
Qualified professional review is still required for any future tax, legal,
accounting, valuation or settlement-scope expansion; this language-policy change
does not authorise such an expansion.

## Historical human review gate — superseded 20 October 2026

Under the previous policy, the Chinese and Korean text was an implementation draft and had been
checked structurally and adversarially against the English source. Before
merging to production, a fluent reviewer for each language was to read the
calculator, privacy notice and important-information page in context.

For each language, record:

- reviewer and date;
- calculator terminology reviewed;
- privacy claims reviewed;
- legal and tax exclusions reviewed;
- mobile screenshots reviewed;
- requested changes completed.

Do not mark a translation production-ready solely because automated tests pass.

## 2026-09-05 clarity and guide change — review pending

The local growth/accuracy batch changes cost-entry guidance, loan and holding
section labels, transaction-result explanations and target transaction wording.
It adds a selling-costs guide with matching English, Simplified Chinese and
Korean content, fictional examples, calculator links and localized metadata.

English is the source. Automated dictionary, rendered-page and browser checks,
and any AI review, do not constitute fluent human approval. The Chinese and
Korean calculator and guide text require the reviewer/date/terminology/privacy/
scope/mobile records above before production publication. No completed human
review is recorded by this change.

## 2026-09-05 independent AI language review and corrections

Two separate read-only agents compared all calculator, validation, metadata,
privacy, disclaimer and guide strings against English, then re-reviewed the
primary agent's corrections. These are AI reviewers, not fluent human signers.

| Area | Correction | AI re-review |
| --- | --- | --- |
| Gross rent in Chinese and Korean | Explicitly state rent is before deductions; preserve the same holding period to avoid net-rent/expense double counting | Accepted by `zh_language_audit` and `ko_language_audit` |
| Chinese expense and loan terminology | Explain Council rates, body corporate and lender payout estimate; cost-once guidance uses actual field names | Accepted by `zh_language_audit` |
| Korean guide consistency | Align transaction profit, accounting/after-tax exclusions, improvements and cash terminology with calculator labels | Accepted by `ko_language_audit` |
| Already-sold guidance, all locales | Put actual price in the sale-price field and costs in their corresponding fields | Accepted by both language reviewers |
| Whole-dollar rounding, all locales | Explain ceiling explicitly: exact whole-dollar results remain unchanged | Accepted by both language reviewers; arithmetic unchanged |
| Korean precision notes | Explain that calculations use values before rounding for display | Accepted by `ko_language_audit` |

No tax, accounting, valuation or settlement scope expansion is authorised by
these corrections. Both language reviewers found no remaining blocking source
language issue in their re-review. They did not claim to have inspected rendered
screenshots or to hold human/professional qualifications.

### Reproducible human review packet

Run `node --experimental-strip-types scripts/generate-translation-review.mjs`
to generate `outputs/translation-review/review.html`. It includes every English,
Chinese and Korean source string side by side, review instructions and SHA-256
fingerprints of the exact source files. The output is local and ignored by Git.

Run `CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` on the local built server to
generate eight mobile screenshots beside the packet: filled calculator, guide,
privacy and disclaimer for each of Chinese and Korean. Screenshots use fictional
figures and are evidence for human contextual review; neither rendering nor
automated assertions approve language quality. The screenshot helper rejects
non-local hosts. Regenerate the packet and images after any relevant copy change.

### Actual human approval record — still pending

On 2026-09-06 the packet generator completed successfully and
`CAPTURE_TRANSLATION_REVIEW=1 npm run test:e2e` passed all 39 local Chromium
tests, producing all eight requested mobile PNGs. The first sandbox attempt
could not bind the local server (`EPERM`); the authorised retry passed. The
primary AI inspected both filled-calculator full-page images for overall layout;
this is not a detailed fluent-human or real-device review. Source dictionary
and SSR checks passed as part of the 56-test `npm test` run. The separate
calculation reviewer accepted the explanation changes without findings.

| Language | Human reviewer | Date | Source fingerprints confirmed | Calculator / guide terminology | Privacy and exclusions | Mobile screenshots | Corrections accepted | Human decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Simplified Chinese | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Not approved |
| Korean | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Not approved |

Only an actual fluent reviewer can supply their name, date and decision. The
owner may provide those records after review, or explicitly revise the project's
release policy; an AI agent must not invent or silently waive human approval.
The owner subsequently revised that policy on 20 October 2026 as recorded above;
the historical table is preserved without fabricated signatures.

## Owner acceptance of the reviewed Preview — 2026-09-06

After viewing the deployed Preview, the owner said the copy looked good and
explicitly instructed merging that existing Preview into `main`. This records
owner acceptance and publication authorisation for Preview version
`3b710e4f-72e4-4dd8-9082-49730fb40767` despite the previously disclosed pending
language-review records. The pending table above is preserved: no fluent-human
qualification, professional review, signature, or permanent policy waiver is
inferred. Subsequent SEO/AEO copy changes are a separate review scope.

## SEO/AEO copy and share-card batch — 2026-09-06

New three-language text adds a direct profit/cash distinction, generic project
maintainer attribution, a correction contact instruction that excludes personal
and actual financial details, and static share-card wording/alt text. No personal
identity or professional endorsement is claimed. `calculation_audit` accepted
the direct-answer semantics without findings; `release_audit` found no blocking
source defect and visually inspected all three share cards.

The final release-candidate run on 2026-09-07 passed `npm test` with 59 tests,
lint, and all 40 local Chromium E2E tests. The authorised E2E run refreshed all
eight calculator/guide/legal mobile screenshots after the new copy. The review
HTML and source fingerprints were then regenerated. The three share PNGs were
also generated and visually inspected. Prior owner acceptance covers the
earlier Preview, not a fluent-human signoff of these new strings.

On 2026-09-07 the owner explicitly instructed merging this SEO/AEO batch into
`main` after Cloudflare Preview verification. Remote Preview browser tests and
metadata/image assertions passed before that merge step. This records owner
publication authorisation; the pending fluent-human qualification records are
still not inferred or marked complete.

## SEO discovery sprint copy — 2026-10-19, human review pending

The homepage title, description, heading and introduction now identify the
Australia-focused property sale profit calculator directly. The existing
guide link moves into the hero and keeps its new-tab warning and input-preserving
behaviour. All three languages receive the same guide additions: a semantic
three-result comparison table, a fictional transaction-loss/positive-cash
example, a records-and-quotes checklist and a more explicit calculator link.
The method explanation date is updated to 19 October 2026. These are software
model explanations; no market fee, professional review or new financial scope
is claimed.

English is the source. The Chinese and Korean wording in this batch remains
pending fluent-human review in context, including the narrow mobile table and
loss-versus-cash example. Automated parity, arithmetic, SSR and browser checks
are evidence only; they do not supply reviewer identity, professional review or
approval. Earlier owner publication authorisations cover earlier batches and
are not a sign-off of these new strings. Regenerate the review packet and mobile
images after final corrections.

For this draft, `npm run lint` passed and `npm test` passed typechecking,
production build and all 62 tests on 19 October 2026. The review HTML and source
fingerprints were regenerated with
`node --experimental-strip-types scripts/generate-translation-review.mjs`.
Independent AI calculation and localization source reviews found no blocking
semantic issue. The localization reviewer requested a check of the new
three-column comparison at 375px; no updated screenshot review or fluent-human
approval is claimed by this entry.

Subsequent final verification on 19 October passed all 40 local Chromium E2E
tests and regenerated eight mobile screenshots, after correcting hero spacing
to preserve the existing desktop first-input requirement. The primary agent
and independent release reviewer inspected the updated Chinese/Korean guide
screenshots at their original 375px width: the table is dense but not clipped
and the page does not overflow. The source packet was regenerated after this
run. Coverage passed 34 tests and mutation killed 238/238 core mutants. These
are software/visual checks only; the fluent-human records remain pending.
