import type { Metadata } from "next";

export const SITE_ORIGIN = "https://propertysaleprofit.au";
export const SITE_HOSTNAME = "propertysaleprofit.au";
export const HOME_TITLE =
  "Property Sale Profit | Australian Property Sale Profit Estimator";
export const HOME_DESCRIPTION =
  "Estimate Australian property selling costs, proceeds, transaction profit or loss, break-even price and the sale price needed for a target profit.";
export const HOME_OPEN_GRAPH_TITLE =
  "Estimate your sale proceeds and transaction result.";
export const HOME_OPEN_GRAPH_DESCRIPTION =
  "Estimate selling costs, proceeds, transaction result and the sale price needed for a target profit privately in your browser.";

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
  path,
  title,
  description,
  openGraphTitle = title,
  openGraphDescription = description,
}: {
  host: string | null;
  path: `/${string}` | "/";
  title: string;
  description: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
}): Metadata {
  return {
    title,
    description,
    robots: robotsForHost(host),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      type: "website",
      locale: "en_AU",
      siteName: "Property Sale Profit",
      url: path,
    },
    twitter: {
      card: "summary",
      title: openGraphTitle,
      description: openGraphDescription,
    },
  };
}
