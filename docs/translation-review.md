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
