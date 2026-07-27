import type { Metadata } from "next";
import "../globals.css";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_ORIGIN,
} from "../site-config";

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  applicationName: "Property Sale Profit",
};

export const metadata = baseMetadata;

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
