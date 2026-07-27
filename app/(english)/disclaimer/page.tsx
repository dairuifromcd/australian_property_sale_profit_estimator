import { headers } from "next/headers";
import { DisclaimerPageContent } from "../../legal-pages";
import { getMessages } from "../../i18n/config";
import { metadataForPage } from "../../site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();

  return metadataForPage({
    host: requestHeaders.get("host"),
    locale: "en-AU",
    page: "disclaimer",
  });
}

export default function DisclaimerPage() {
  return (
    <DisclaimerPageContent
      locale="en-AU"
      messages={getMessages("en-AU")}
    />
  );
}
