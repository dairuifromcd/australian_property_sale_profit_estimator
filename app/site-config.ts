import type { Metadata } from "next";
import { shareCards, shareCardPath } from "./i18n/share-cards";
import { guideSummary } from "./i18n/guide-summary";
import {
  getMessages,
  openGraphLocale,
  pathFor,
} from "./i18n/config";
import {
  locales,
  type Locale,
  type SitePage,
} from "./i18n/routing";

export const SITE_ORIGIN = "https://propertysaleprofit.au";
export const SITE_HOSTNAME = "propertysaleprofit.au";
export const SUPPORT_EMAIL = "support@propertysaleprofit.au";
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;
export const SITE_ICON_LINKS = [
  {
    href: "/favicon.ico",
    type: "image/x-icon",
    sizes: "16x16 32x32 48x48",
  },
  {
    href: "/favicon.svg",
    type: "image/svg+xml",
    sizes: "any",
  },
] as const;
const englishMessages = getMessages("en-AU");
export const HOME_TITLE = englishMessages.metadata.home.title;
export const HOME_DESCRIPTION = englishMessages.metadata.home.description;
export const HOME_OPEN_GRAPH_TITLE =
  englishMessages.metadata.home.openGraphTitle;
export const HOME_OPEN_GRAPH_DESCRIPTION =
  englishMessages.metadata.home.openGraphDescription;

function hostnameFromHeader(host: string | null): string {
  if (!host) {
    return "";
  }

  try {
    return new URL(`https://${host}`).hostname
      .toLowerCase()
      .replace(/\.$/, "");
  } catch {
    return "";
  }
}

export function isProductionHost(host: string | null): boolean {
  return hostnameFromHeader(host) === SITE_HOSTNAME;
}

export function robotsForHost(host: string | null): Metadata["robots"] {
  return isProductionHost(host)
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
      };
}

export function metadataForPage({
  host,
  locale,
  page,
}: {
  host: string | null;
  locale: Locale;
  page: SitePage;
}): Metadata {
  const messages = getMessages(locale);
  const pageMetadata = page === "guide" ? guideSummary[locale].metadata : messages.metadata[page];
  const title = pageMetadata.title;
  const description = pageMetadata.description;
  const openGraphTitle =
    "openGraphTitle" in pageMetadata && typeof pageMetadata.openGraphTitle === "string"
      ? pageMetadata.openGraphTitle
      : title;
  const openGraphDescription =
    "openGraphDescription" in pageMetadata && typeof pageMetadata.openGraphDescription === "string"
      ? pageMetadata.openGraphDescription
      : description;
  const path = pathFor(locale, page);
  const languages = Object.fromEntries([
    ...locales.map((alternateLocale) => [
      alternateLocale,
      pathFor(alternateLocale, page),
    ]),
    ["x-default", pathFor("en-AU", page)],
  ]);

  return {
    title,
    description,
    robots: robotsForHost(host),
    // Public verification tag supplied by the owner's Bing Webmaster Tools account.
    ...(isProductionHost(host) && locale === "en-AU" && page === "home"
      ? { verification: { other: { "msvalidate.01": "E319A70AFC92A835B6CBAF8FAA0717B8" } } }
      : {}),
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      type: "website",
      locale: openGraphLocale[locale],
      alternateLocale: locales
        .filter((alternateLocale) => alternateLocale !== locale)
        .map((alternateLocale) => openGraphLocale[alternateLocale]),
      siteName: messages.common.siteName,
      url: path,
      images: [{ url: `${SITE_ORIGIN}${shareCardPath(locale)}`, width: 1200, height: 630, type: "image/png", alt: shareCards[locale].alt }],
    },
    twitter: {
      card: "summary_large_image",
      images: [{ url: `${SITE_ORIGIN}${shareCardPath(locale)}`, alt: shareCards[locale].alt }],
      title: openGraphTitle,
      description: openGraphDescription,
    },
  };
}
