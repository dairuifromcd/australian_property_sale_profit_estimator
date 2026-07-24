import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Property Sale Profit",
  description: "The requested Property Sale Profit page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main>
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
      </header>

      <article className="legal-page">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p className="legal-intro">
          The page you requested does not exist. Return to the calculator to
          estimate a property sale result.
        </p>
        <p>
          <Link href="/">Return to the calculator</Link>
        </p>
      </article>
    </main>
  );
}
