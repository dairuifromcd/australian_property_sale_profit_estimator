import type { Metadata } from "next";
import "../globals.css";
import { isLocalizedLocale } from "../i18n/config";
import { SITE_ICON_LINKS, SITE_ORIGIN } from "../site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: "Property Sale Profit",
};

export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return (
    <html lang={isLocalizedLocale(locale) ? locale : "en-AU"}>
      <head>
        {SITE_ICON_LINKS.map((icon) => (
          <link key={icon.href} rel="icon" {...icon} />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
