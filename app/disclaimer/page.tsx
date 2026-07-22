export const metadata = {
  title: "Important Information | Property Sale Profit",
  description: "Important limitations of the Property Sale Profit calculator.",
};

export default function DisclaimerPage() {
  return (
    <main>
      <aside className="beta-banner" aria-label="Public beta notice">
        <strong>Public beta</strong>
        <span>This calculator is under active development.</span>
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
            valuation, conveyancing, credit or settlement advice. It does not
            prepare or lodge a tax return, determine an official tax liability,
            or represent you in dealings with the Australian Taxation Office.
            Do not rely on an estimate alone to sell, buy, borrow, invest or
            make a tax decision.
          </p>
        </section>

        <section className="legal-section">
          <h2>Material limitations</h2>
          <ul>
            <li>Results depend entirely on the figures and assumptions entered.</li>
            <li>
              Profit excludes loan balances and historical holding cash flows
              unless they are expressly represented by an input.
            </li>
            <li>
              The optional tax scenario uses one assumed tax rate; it does not
              model tax brackets, offsets or a complete income tax return.
            </li>
            <li>
              Foreign residency, trusts, companies, SMSFs, capital losses,
              complex exemptions and special cost-base rules are outside its
              supported scope.
            </li>
            <li>
              Tax estimates for contracts on or after 1 July 2027 are paused
              until the required reform inputs are supported.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>No government affiliation</h2>
          <p>
            This is an independent project. It is not affiliated with,
            approved, certified or endorsed by the ATO, ASIC, the Tax
            Practitioners Board or another Australian government agency.
            References to ATO guidance are provided so you can review the
            official source.
          </p>
        </section>

        <section className="legal-section">
          <h2>Check before acting</h2>
          <p>
            Tax rules, property circumstances and transaction costs can change
            the outcome materially. Confirm important decisions with an
            appropriately qualified Australian tax agent, accountant,
            conveyancer, solicitor or financial adviser. Nothing here excludes
            rights or remedies that cannot lawfully be excluded.
          </p>
          <p>
            Review the{" "}
            <a
              href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax"
              target="_blank"
              rel="noreferrer"
            >
              ATO property and capital gains tax guidance
            </a>
            .
          </p>
        </section>

        <p className="legal-updated">
          Model and tax rules last reviewed 21 July 2026. Notice last updated 22
          July 2026.
        </p>
      </article>
    </main>
  );
}
import Link from "next/link";
