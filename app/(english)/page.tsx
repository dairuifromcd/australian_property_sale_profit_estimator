import { headers } from "next/headers";
import CalculatorPage from "../calculator-page";
import { getCalculatorMessages } from "../i18n/config";
import { metadataForPage } from "../site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();

  return metadataForPage({
    host: requestHeaders.get("host"),
    locale: "en-AU",
    page: "home",
  });
}

export default function HomePage() {
  return (
    <CalculatorPage
      locale="en-AU"
      messages={getCalculatorMessages("en-AU")}
    />
  );
}
