import type { Metadata } from "next";
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
  const pageMetadata = messages.metadata[page];
  const title = pageMetadata.title;
  const description = pageMetadata.description;
  const openGraphTitle =
    "openGraphTitle" in pageMetadata
      ? pageMetadata.openGraphTitle
      : title;
  const openGraphDescription =
    "openGraphDescription" in pageMetadata
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
    },
    twitter: {
      card: "summary",
      title: openGraphTitle,
      description: openGraphDescription,
    },
  };
}
