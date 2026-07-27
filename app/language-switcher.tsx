"use client";

import Link from "next/link";
import { Fragment } from "react";
import {
  locales,
  pathFor,
  type Locale,
  type SitePage,
} from "./i18n/routing";
import type { SiteMessages } from "./i18n/messages/types";

export function LanguageSwitcher({
  currentLocale,
  page,
  labels,
  ariaLabel,
  warning,
  hasUnsavedData = false,
}: {
  currentLocale: Locale;
  page: SitePage;
  labels: SiteMessages["common"]["languages"];
  ariaLabel: string;
  warning: string;
  hasUnsavedData?: boolean;
}) {
  const labelFor: Record<Locale, string> = {
    "en-AU": labels.enAU,
    "zh-Hans": labels.zhHans,
    ko: labels.ko,
  };

  return (
    <nav className="language-switcher" aria-label={ariaLabel}>
      {locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 ? (
            <span
              className="language-switcher-separator"
              aria-hidden="true"
            >
              /
            </span>
          ) : null}
          <Link
            href={pathFor(locale, page)}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === currentLocale ? "page" : undefined}
            onClick={(event) => {
              if (locale === currentLocale) {
                event.preventDefault();
                return;
              }

              if (hasUnsavedData && !window.confirm(warning)) {
                event.preventDefault();
              }
            }}
          >
            {labelFor[locale]}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
