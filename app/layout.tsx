import type { Metadata } from "next";
import TemplateInteractions from "@/components/TemplateInteractions";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AutoDeal - Car Dealer, Rental & Listing HTML Template",
    template: "%s | AutoDeal",
  },
  description: "AutoDeal - Car Dealer, Rental & Listing HTML Template converted to Next.js App Router",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" href="/app/css/font-awesome.css" />
        <link rel="stylesheet" href="/forms/end-form/build/sib-styles.css" />
        <link rel="stylesheet" href="/app/css/styles.css" />
        <link rel="shortcut icon" href="/assets/images/logo/Favicon.png" />
        <link rel="apple-touch-icon-precomposed" href="/assets/images/logo/Favicon.png" />
      </head>
      <body className="body header-fixed">
        {children}
        <TemplateInteractions />
      </body>
    </html>
  );
}
