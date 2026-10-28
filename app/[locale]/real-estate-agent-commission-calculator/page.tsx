import { headers } from "next/headers";
import { notFound } from "next/navigation";
import CommissionCalculatorPage from "../../commission-calculator-page";
import { isLocalizedLocale, localizedLocales } from "../../i18n/routing";
import { metadataForPage } from "../../site-config";

export function generateStaticParams() {
  return localizedLocales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const [{ locale }, requestHeaders] = await Promise.all([params, headers()]);
  if (!isLocalizedLocale(locale)) return {};
  return metadataForPage({ host: requestHeaders.get("host"), locale, page: "commission" });
}

export default async function CommissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  return <CommissionCalculatorPage locale={locale} />;
}
