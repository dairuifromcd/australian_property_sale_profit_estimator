import Link from "next/link";

export const metadata = {
  title: "Privacy | Property Sale Profit",
  description:
    "How Property Sale Profit handles calculator inputs and technical data.",
};

export default function PrivacyPage() {
  return (
    <main>
      <aside className="beta-banner" aria-label="Public beta notice">
        <strong>Public beta</strong>
        <span>This privacy notice applies to the current beta release.</span>
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
          <Link className="header-link" href="/disclaimer">
            Important information
          </Link>
        </nav>
      </header>

      <article className="legal-page">
        <span className="eyebrow">Privacy notice</span>
        <h1>How your data is handled</h1>
        <p className="legal-intro">
          The calculator is designed to work without an account or a database.
          The financial figures you enter remain in your browser.
        </p>

        <section className="legal-section">
          <h2>Calculator entries</h2>
          <p>
            Sale prices, purchase prices, commission rates and cost assumptions
            are calculated on your device. The current application code does
            not transmit or store those entries on a server. Reloading the page
            resets them. Printing or saving a PDF is an action performed by your
            browser and device.
          </p>
        </section>

        <section className="legal-section">
          <h2>Technical request data</h2>
          <p>
            Cloudflare hosts, secures and delivers this site. Like other web
            infrastructure providers, it may process technical request data
            such as an IP address, browser information, requested URL, request
            time and security signals. Calculator entries are not placed in
            the URL.
          </p>
          <p>
            See the{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noreferrer"
            >
              Cloudflare Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className="legal-section">
          <h2>Accounts, analytics and cookies</h2>
          <p>
            This release has no user accounts, feedback form, advertising
            analytics or application cookies. These practices may change in a
            later release; this notice will be updated before such features are
            introduced.
          </p>
        </section>

        <section className="legal-section">
          <h2>External websites</h2>
          <p>
            Links to realestate.com.au, Domain, GitHub and other third-party
            websites are governed by those websites&apos; own privacy practices.
            Calculator entries are not attached to those links.
          </p>
        </section>

        <section className="legal-section">
          <h2>Questions</h2>
          <p>
            Contact the project through its{" "}
            <a
              href="https://github.com/dairuifromcd/australian_property_sale_profit_estimator/issues/new"
              target="_blank"
              rel="noreferrer"
            >
              public issue tracker
            </a>
            . Do not include personal, property or financial information in a
            public issue.
          </p>
        </section>

        <p className="legal-updated">Last updated 23 July 2026.</p>
      </article>
    </main>
  );
}
