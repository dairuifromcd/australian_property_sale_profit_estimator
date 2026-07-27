import type { MetadataRoute } from "next";
import { locales, pathFor } from "./i18n/routing";
import { SITE_ORIGIN } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return (["home", "privacy", "disclaimer"] as const).flatMap((page) =>
    locales.map((locale) => ({
      url: new URL(pathFor(locale, page), SITE_ORIGIN).href,
    })),
  );
}
