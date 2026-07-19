import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const baseMetadata: Metadata = {
  title: "SaleProfit AU | Australian Property Sale Profit Estimator",
  description:
    "Estimate your Australian property sale proceeds, selling costs, pre-tax profit and an optional indicative CGT scenario—privately in your browser.",
  applicationName: "SaleProfit AU",
  keywords: [
    "Australian property sale profit calculator",
    "property selling costs Australia",
    "capital gains tax estimate property",
  ],
  openGraph: {
    title: "Know what you could really make when you sell.",
    description:
      "A private, Australia-focused property sale profit estimator.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaleProfit AU",
    description:
      "Estimate sale proceeds and property profit with only the detail you need.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = new URL("/og.png", origin).toString();

  return {
    ...baseMetadata,
    metadataBase: new URL(origin),
    openGraph: {
      ...baseMetadata.openGraph,
      images: [{ url: socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      ...baseMetadata.twitter,
      images: [socialImage],
    },
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
