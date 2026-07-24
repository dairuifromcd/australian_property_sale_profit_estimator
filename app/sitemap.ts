import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_ORIGIN}/`,
    },
    {
      url: `${SITE_ORIGIN}/privacy`,
    },
    {
      url: `${SITE_ORIGIN}/disclaimer`,
    },
  ];
}
