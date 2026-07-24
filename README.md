# Property Sale Profit

[![CI](https://github.com/dairuifromcd/australian_property_sale_profit_estimator/actions/workflows/ci.yml/badge.svg)](https://github.com/dairuifromcd/australian_property_sale_profit_estimator/actions/workflows/ci.yml)

An Australia-focused, browser-only calculator for estimating property selling
costs, proceeds before debt and tax, transaction profit before holding costs,
debt and tax, and a break-even sale price for the transaction costs entered.

The hosted site is the first public MVP. Only the canonical production domain
is eligible for search indexing; local, Workers and Preview hosts remain
`noindex`.

## Why this exists

Sale price minus purchase price does not show the effect of agent commission,
selling costs, sale preparation, purchase costs, renovations and improvements.
Property Sale Profit makes those entered transaction costs visible while keeping
the first estimate to four inputs.

## Current features

- Live estimate from expected sale price, purchase price, agent commission and
  other selling costs
- Optional sale preparation costs, purchase costs, renovations and improvements
- Sale proceeds after entered selling costs
- Whole-property transaction profit or loss before holding costs, debt and tax
- Break-even sale price for the transaction costs entered
- Sale price required to reach an entered target transaction profit
- Sale-price sensitivity at −5%, the entered price and +5%, with commission
  recalculated for each scenario
- Text as well as colour for profit and loss outcomes
- Print or save the result as a PDF
- Responsive, accessible single-page calculator interface
- No account, database, advertising analytics or server-side storage of inputs
- Persistent estimate-scope notice, privacy notice, material limitations and government
  non-affiliation disclosure

The public calculator does not calculate capital gains tax, income tax, taxable
capital gain, accounting profit, settlement cash or after-tax profit.

## Calculation model

```text
agent commission = sale price × commission rate

total selling costs = agent commission
                    + other selling costs
                    + sale preparation costs

sale proceeds after selling costs = sale price − total selling costs

transaction profit = sale proceeds after selling costs
                   − purchase price
                   − purchase costs
                   − renovations and improvements

entered-cost break-even sale price =
  (purchase price
   + purchase costs
   + renovations and improvements
   + other selling costs
   + sale preparation costs)
  ÷ (1 − commission rate)

sale price required for target transaction profit =
  (purchase price
   + purchase costs
   + renovations and improvements
   + other selling costs
   + sale preparation costs
   + target transaction profit)
  ÷ (1 − commission rate)

Required break-even and target sale prices are rounded up to the next whole
Australian dollar so the displayed price does not fall short.

sale-price sensitivity transaction profit =
  scenario sale price × (1 − commission rate)
  − purchase price
  − purchase costs
  − renovations and improvements
  − other selling costs
  − sale preparation costs
```

“Transaction profit” is deliberately narrower than complete economic,
accounting or tax profit. It excludes historical holding cash flows such as
interest, rates, insurance, maintenance, rent and depreciation. Sale proceeds
are not settlement cash: mortgage balances, loan discharge amounts and other
settlement adjustments are also excluded.

See the [calculation scenario coverage matrix](docs/calculation-scenarios.md) for
supported scenarios, formulas, automated test mappings and explicit boundaries.
The final public beta that included a simplified CGT scenario is archived under
the Git tag `v0.1.0-cgt-beta`; that code is not present in the current public
runtime.

## Privacy

Calculator inputs stay in the browser. The application does not send them to a
database or external valuation service. Links to third-party property sites
remain ordinary outbound links. Cloudflare may process ordinary technical
request metadata such as IP addresses, browser information, requested URLs and
security signals to host and protect the site; calculator entries are not
placed in those URLs. See the in-app privacy notice for the full disclosure.

## Technology

- React 19
- TypeScript 5
- Vite 8 with vinext
- Cloudflare Workers-compatible build output
- Node.js 22.13 or newer
- Node's built-in test runner
- Playwright browser tests

## Run locally

```bash
git clone https://github.com/dairuifromcd/australian_property_sale_profit_estimator.git
cd australian_property_sale_profit_estimator
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm test
npm run test:coverage
npm run test:e2e
```

`npm test` creates a production build and runs calculation and rendered-HTML
tests. `npm run test:coverage` enforces 100% line, branch and function coverage
for the calculation and monetary-input modules. `npm run test:e2e` exercises
the critical form, validation, profit/loss, reset, compliance, input-privacy and
mobile-overflow scenarios in Chromium. GitHub Actions runs all checks for pushes
and pull requests to `main`.

## Deploy to Cloudflare Workers

The repository is configured for a Worker named `property-profit-au`. Connect
this GitHub repository with Cloudflare Workers Builds and use:

| Setting | Value |
| --- | --- |
| Worker name | `property-profit-au` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Root directory | Repository root (leave blank) |

Enable builds for non-production branches under **Settings > Build > Branch
control**. A push to `main` updates the production Worker and
`https://propertysaleprofit.au`; other branches receive Preview URLs without
being promoted.

No Cloudflare password, API token, account ID or GitHub token belongs in the
repository. Workers Builds creates and manages its deployment token when the
repository is connected.

## Search discovery

The canonical site origin is `https://propertysaleprofit.au`. The production
host publishes `index, follow`; Workers, Preview and local hosts publish
`noindex, nofollow` while still pointing canonical metadata at the production
URL. This prevents publicly accessible deployment URLs from competing with the
custom domain.

The application also publishes:

- `https://propertysaleprofit.au/robots.txt`
- `https://propertysaleprofit.au/sitemap.xml`

After a production deployment, the domain owner must verify the domain with
Google Search Console and Bing Webmaster Tools, then submit the sitemap.

## Project structure

```text
app/page.tsx               indexable home route and page metadata
app/calculator-page.tsx    interactive calculator interface
app/calculator.ts          pure calculation logic
app/globals.css            responsive visual design
app/site-config.ts         canonical origin and host-aware metadata rules
app/not-found.tsx          non-indexable unknown-page response
app/robots.ts              crawler discovery rules
app/sitemap.ts             canonical public URL inventory
app/privacy/               privacy notice
app/disclaimer/            scope, limitations and non-affiliation notice
tests/calculator.test.ts   calculation scenarios
tests/rendered-html.test.mjs
tests/e2e/                 Playwright browser scenarios
playwright.config.ts       browser test configuration
public/                    static icons
wrangler.jsonc             Cloudflare Worker and Preview configuration
```

## Contributing

Small, focused pull requests are welcome. Use `main` as the stable branch and a
short-lived branch for each change. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

Property Sale Profit provides indicative transaction estimates for exploration
and education. It does not provide financial, legal, property valuation,
settlement, accounting or tax advice. Confirm material decisions with
appropriately qualified Australian professionals.

## License

No open-source licence has been selected yet. Until a licence is added, the
copyright owner retains all rights; public access to the repository does not by
itself grant permission to copy, modify or redistribute the code.
