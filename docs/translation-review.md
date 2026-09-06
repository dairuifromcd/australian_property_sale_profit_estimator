# Translation review

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

## Human review gate

The current Chinese and Korean text is an implementation draft and has been
checked structurally and adversarially against the English source. Before
merging to production, a fluent reviewer for each language should read the
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

## Owner acceptance of the reviewed Preview — 2026-09-06

After viewing the deployed Preview, the owner said the copy looked good and
explicitly instructed merging that existing Preview into `main`. This records
owner acceptance and publication authorisation for Preview version
`3b710e4f-72e4-4dd8-9082-49730fb40767` despite the previously disclosed pending
language-review records. The pending table above is preserved: no fluent-human
qualification, professional review, signature, or permanent policy waiver is
inferred. Subsequent SEO/AEO copy changes are a separate review scope.
