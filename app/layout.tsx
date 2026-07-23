import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const baseMetadata: Metadata = {
  title: "Property Sale Profit | Australian Property Sale Profit Estimator",
  description:
    "Estimate Australian property selling costs, proceeds before debt and tax, transaction profit before holding costs, debt and tax, and an entered-cost break-even sale price.",
  applicationName: "Property Sale Profit",
  keywords: [
    "Australian property sale profit calculator",
    "property selling costs Australia",
    "property sale proceeds calculator",
    "property break-even sale price",
  ],
  openGraph: {
    title: "Estimate your sale proceeds and transaction result.",
    description:
      "Estimate selling costs, proceeds and an entered-cost transaction result privately in your browser.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Sale Profit",
    description:
      "Estimate sale proceeds and transaction profit before holding costs, debt and tax.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    ...baseMetadata,
    metadataBase: new URL(origin),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
