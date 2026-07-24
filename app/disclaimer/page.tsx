import Link from "next/link";
import { headers } from "next/headers";
import { metadataForPage } from "../site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();

  return metadataForPage({
    host: requestHeaders.get("host"),
    path: "/disclaimer",
    title: "Important Information | Property Sale Profit",
    description:
      "Important limitations of the Property Sale Profit calculator.",
  });
}

export default function DisclaimerPage() {
  return (
    <main>
      <aside className="scope-banner" aria-label="Estimate scope notice">
        <strong>Indicative estimate</strong>
        <span>
          Uses only the amounts you enter. Tax and unentered settlement
          adjustments are excluded.
        </span>
      </aside>
      <header className="site-header">
        <Link
          className="brand"
          href="/"
          aria-label="Property Sale Profit home"
        >
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Property Sale Profit</span>
        </Link>
        <nav className="header-nav" aria-label="Privacy and legal information">
          <Link className="header-link" href="/privacy">
            Privacy
          </Link>
        </nav>
      </header>

      <article className="legal-page">
        <span className="eyebrow">Important information</span>
        <h1>Use this estimate as a starting point only</h1>
        <p className="legal-intro">
          Property Sale Profit is a free, general information tool. It is not a
          substitute for advice that considers your circumstances.
        </p>

        <section className="legal-section">
          <h2>Not professional advice</h2>
          <p>
            The calculator does not provide tax, financial, legal, property
            valuation, conveyancing, credit, accounting or settlement advice.
            It does not predict a sale price, calculate a tax liability or
            determine the exact amount you will receive at settlement. Do not
            rely on an estimate alone to sell, buy, borrow or invest.
          </p>
        </section>

        <section className="legal-section">
          <h2>Material limitations</h2>
          <ul>
            <li>Results depend entirely on the figures and assumptions entered.</li>
            <li>
              The amount remaining after selling costs is before any mortgage
              payout. The optional settlement cash estimate subtracts only the
              loan payout entered and excludes tax, settlement adjustments and
              unentered amounts.
            </li>
            <li>
              Transaction profit excludes holding-period income, holding costs
              and financing. The optional overall pre-tax result adds only the
              rental income entered and subtracts only the holding costs
              entered. It is not an annualised or time-adjusted return.
            </li>
            <li>
              Loan principal repayments are not treated as holding costs
              because the purchase price is already included in transaction
              profit. The calculator does not determine accounting or tax
              treatment for interest, rent or other entries.
            </li>
            <li>
              The break-even sale price covers only the transaction costs
              entered. It excludes holding cash flows, loan payout, tax and
              costs not supplied by the user.
            </li>
            <li>
              Sale-price sensitivity rows mechanically apply 5% below and
              above the expected sale price entered. They are scenarios, not
              forecasts, valuations or predictions of a future sale price.
            </li>
            <li>
              The calculator does not calculate capital gains tax, income tax,
              taxable capital gain, accounting profit or after-tax profit.
            </li>
            <li>
              Renovation, improvement and other cost entries are user-selected
              transaction assumptions. The calculator does not decide their
              accounting or tax treatment.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>No government affiliation</h2>
          <p>
            This is an independent project. It is not affiliated with,
            approved, certified or endorsed by the ATO, ASIC, the Tax
            Practitioners Board or another Australian government agency.
          </p>
        </section>

        <section className="legal-section">
          <h2>Check before acting</h2>
          <p>
            Property circumstances, transaction costs, debt and tax can change
            the outcome materially. Confirm important figures and decisions
            with appropriately qualified Australian professionals such as an
            accountant, registered tax agent, conveyancer, solicitor or
            financial adviser. Nothing here excludes rights or remedies that
            cannot lawfully be excluded.
          </p>
        </section>

        <p className="legal-updated">
          Model scope and notice last reviewed 24 July 2026.
        </p>
      </article>
    </main>
  );
}
