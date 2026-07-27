import { headers } from "next/headers";
import { notFound } from "next/navigation";
import CalculatorPage from "../calculator-page";
import {
  getCalculatorMessages,
  isLocalizedLocale,
  localizedLocales,
} from "../i18n/config";
import { metadataForPage } from "../site-config";

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
    page: "home",
  });
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocalizedLocale(locale)) {
    notFound();
  }

  return (
    <CalculatorPage
      locale={locale}
      messages={getCalculatorMessages(locale)}
    />
  );
}
