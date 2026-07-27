import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  getMessages,
  isLocalizedLocale,
  localizedLocales,
} from "../../i18n/config";
import { DisclaimerPageContent } from "../../legal-pages";
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
    page: "disclaimer",
  });
}

export default async function LocalizedDisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocalizedLocale(locale)) {
    notFound();
  }

  return (
    <DisclaimerPageContent locale={locale} messages={getMessages(locale)} />
  );
}
