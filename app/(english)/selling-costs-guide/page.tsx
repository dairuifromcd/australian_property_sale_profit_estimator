import { headers } from "next/headers";
import { SellingCostsGuide } from "../../selling-costs-guide-page";
import { metadataForPage } from "../../site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();
  return metadataForPage({ host: requestHeaders.get("host"), locale: "en-AU", page: "guide" });
}

export default function GuidePage() {
  return <SellingCostsGuide locale="en-AU" />;
}
