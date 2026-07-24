"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CalculatorForm } from "./calculator-ui/calculator-form";
import { ResultsPanel } from "./calculator-ui/results-panel";
import { useCalculatorForm } from "./calculator-ui/use-calculator-form";

export default function CalculatorPage() {
  const controller = useCalculatorForm();

  useEffect(() => {
    document.documentElement.dataset.clientReady = "true";

    return () => {
      delete document.documentElement.dataset.clientReady;
    };
  }, []);

  return (
    <main>
      <aside className="scope-banner" aria-label="Estimate scope notice">
        <strong>Indicative estimate</strong>
        <span>
          Uses only the amounts you enter. Tax and unentered settlement
          adjustments are excluded.
        </span>
        <Link href="/disclaimer">Read important information</Link>
      </aside>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Property Sale Profit home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Property Sale Profit</span>
        </a>
        <nav className="header-nav" aria-label="Privacy and legal information">
          <Link className="header-link" href="/privacy">
            Privacy
          </Link>
          <Link className="header-link" href="/disclaimer">
            Important information
          </Link>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">Australian property sale calculator</div>
        <h1>Estimate your property sale result and cash position.</h1>
        <p className="hero-copy">
          Start with four numbers for a transaction estimate. Optionally add
          buying costs, holding cash flows and a loan payout without mixing
          those different results together.
        </p>
        <div className="trust-line" aria-label="Privacy benefits">
          <span>Private by design</span>
          <span>No sign-up</span>
          <span>Calculations stay on this device</span>
        </div>
      </section>

      <section className="calculator-shell" aria-labelledby="calculator-title">
        <CalculatorForm controller={controller} />
        <ResultsPanel controller={controller} />
      </section>

      <section className="explanation" aria-labelledby="what-counts-title">
        <div>
          <span className="step-label">What this helps answer</span>
          <h2 id="what-counts-title">
            A clearer view than sale price minus purchase price.
          </h2>
        </div>
        <div className="explanation-grid">
          <article>
            <span>01</span>
            <h3>Amount after selling costs</h3>
            <p>
              Sale price less commission, selling costs and preparation costs.
              This is before any loan payout.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Transaction profit or loss</h3>
            <p>
              Amount after selling costs less purchase price, buying costs,
              renovations and improvements—before holding cash flows, loan
              payout and tax.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Break-even and target sale price</h3>
            <p>
              See the sale price needed to cover the transaction costs you
              enter or reach a target transaction profit. Holding cash flows,
              loan payout and tax do not change these planning prices.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Optional overall and cash results</h3>
            <p>
              Keep holding-period income and costs separate from a simplified
              estimate of cash after a loan payout.
            </p>
          </article>
        </div>
      </section>

      <footer id="privacy">
        <div>
          <strong>Private by design</strong>
          <p>
            Your figures are calculated in this browser and are not sent to or
            saved by this application. Cloudflare may process ordinary request
            metadata needed to deliver and protect the site.
          </p>
        </div>
        <div>
          <strong>Important limitations</strong>
          <p>
            Optional overall and settlement cash results use only the amounts
            entered. This tool does not calculate capital gains tax, income tax,
            depreciation, time-adjusted returns or after-tax profit.
          </p>
        </div>
        <div className="footer-meta">
          <span>
            Independent calculator · Not affiliated with or endorsed by the ATO
            or another government agency
          </span>
          <span className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </span>
        </div>
      </footer>
    </main>
  );
}
