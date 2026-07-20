# SaleProfit AU

[![CI](https://github.com/dairuifromcd/australian_property_sale_profit_estimator/actions/workflows/ci.yml/badge.svg)](https://github.com/dairuifromcd/australian_property_sale_profit_estimator/actions/workflows/ci.yml)

An Australia-focused, browser-only calculator for estimating property sale
proceeds, pre-tax profit, break-even price, and a deliberately simplified CGT
scenario.

![SaleProfit AU calculator preview](public/readme-screenshot.jpg)

## Why this exists

Sale price minus purchase price is not the same as profit. Agent commission,
other selling costs, buying costs, capital improvements, property use, and tax
treatment can materially change the result. SaleProfit AU makes those moving
parts visible while keeping the first estimate to four inputs.

## Current features

- Live estimate from expected sale price, purchase price, agent commission, and
  other selling costs
- Optional purchase costs and capital improvements
- Net sale proceeds, pre-tax economic profit, return on cost, and break-even
  sale price
- Optional simplified CGT scenario for Australian resident individuals
- Main-residence, investment, and mixed-use scenarios
- Print or save the result as a PDF
- Responsive, accessible single-page interface
- No account, database, analytics, or server-side storage of calculator inputs

## Calculation model

At a high level:

```text
net sale proceeds = sale price - agent commission - other selling costs

pre-tax profit = net sale proceeds
               - purchase price
               - purchase costs
               - capital improvements
```

The calculator intentionally separates economic profit from settlement cash.
Mortgage balances, loan interest, rates, insurance, maintenance, rental income,
depreciation, and other holding cash flows are not included in this version.

The optional tax result is indicative only. It is not a tax return calculation
and does not cover companies, trusts, SMSFs, foreign-residency rules, capital
losses, complex cost-base adjustments, or tax calculations from 1 July 2027.

## Privacy

Calculator inputs stay in the browser. The application does not currently send
them to a database or external valuation service. Links to third-party property
sites remain ordinary outbound links.

## Technology

- React 19
- TypeScript 5
- Vite 8 with vinext
- Cloudflare Workers-compatible build output
- Node.js 22.13 or newer
- Node's built-in test runner

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
```

`npm test` creates a production build and then runs the calculation and rendered
HTML tests. GitHub Actions runs the same checks for pushes and pull requests to
`main`.

## Project structure

```text
app/page.tsx               calculator interface
app/calculator.ts          pure calculation logic
app/globals.css            responsive visual design
tests/calculator.test.ts   calculation scenarios
tests/rendered-html.test.mjs
public/                    social and README images
worker/                    Cloudflare-compatible entry point
```

## Contributing

Small, focused pull requests are welcome. Use `main` as the stable branch and a
short-lived branch such as `feat/settlement-cash` for each change. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and quality requirements.

## Disclaimer

SaleProfit AU provides indicative estimates for exploration and education. It
does not provide financial, legal, property valuation, settlement, or tax
advice. Confirm material decisions with appropriately qualified Australian
professionals.

## License

No open-source licence has been selected yet. Until a licence is added, the
copyright owner retains all rights; public access to the repository does not by
itself grant permission to copy, modify, or redistribute the code.
