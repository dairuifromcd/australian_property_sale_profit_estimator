import { headers } from "next/headers";
import CommissionCalculatorPage from "../../commission-calculator-page";
import { metadataForPage } from "../../site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();
  return metadataForPage({ host: requestHeaders.get("host"), locale: "en-AU", page: "commission" });
}

export default function CommissionPage() {
  return <CommissionCalculatorPage locale="en-AU" />;
}
