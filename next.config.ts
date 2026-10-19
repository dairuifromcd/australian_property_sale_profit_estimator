import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep generated metadata in the initial head for browsers and verification
  // crawlers, including user agents outside the framework's known-bot list.
  // Metadata uses only local dictionaries and request context; no remote lookup.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
