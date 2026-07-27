import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  getMessages,
  isLocalizedLocale,
  localizedLocales,
} from "../../i18n/config";
import { PrivacyPageContent } from "../../legal-pages";
import { metadataForPage } from "../../site-config";

export function generateStaticParams() {
  return localizedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, requestHeaders] = await Promise.all([params, headers()]);

  if (!isLocalizedLocale(locale)) {
    return {};
  }

  return metadataForPage({
    host: requestHeaders.get("host"),
    locale,
    page: "privacy",
  });
}

export default async function LocalizedPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocalizedLocale(locale)) {
    notFound();
  }

  return <PrivacyPageContent locale={locale} messages={getMessages(locale)} />;
}
