import { headers } from "next/headers";
import { getMessages } from "../../i18n/config";
import { PrivacyPageContent } from "../../legal-pages";
import { metadataForPage } from "../../site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();

  return metadataForPage({
    host: requestHeaders.get("host"),
    locale: "en-AU",
    page: "privacy",
  });
}

export default function PrivacyPage() {
  return (
    <PrivacyPageContent locale="en-AU" messages={getMessages("en-AU")} />
  );
}
