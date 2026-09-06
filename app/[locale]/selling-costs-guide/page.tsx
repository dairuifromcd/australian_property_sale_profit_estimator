import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isLocalizedLocale, localizedLocales } from "../../i18n/routing";
import { SellingCostsGuide } from "../../selling-costs-guide-page";
import { metadataForPage } from "../../site-config";

export function generateStaticParams() {
  return localizedLocales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const [{ locale }, requestHeaders] = await Promise.all([params, headers()]);
  if (!isLocalizedLocale(locale)) return {};
  return metadataForPage({ host: requestHeaders.get("host"), locale, page: "guide" });
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  return <SellingCostsGuide locale={locale} />;
}
