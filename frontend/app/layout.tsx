// app/layout.tsx
import { GoogleTagManager } from "@/components/gtm";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ui/ThemeToggle";

// Add these imports at the top of the file

import { Poppins } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import TransitionWrapper from "./TransitionWrapper";

// Initialize the font object
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.begautos.com"),
  icons: {
    icon: "/favicon.ico",
  },
};

async function fetchSalesRep() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/v1/home/sales-representative/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const reps = json?.data ?? [];
    return reps.length > 0 ? reps[0] : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const salesRep = await fetchSalesRep();

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("begautos-theme");document.documentElement.dataset.theme=t==="dark"||t==="light"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){document.documentElement.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}})();` }} />
      </head>
      <body suppressHydrationWarning={true} className="font-poppins ">
        {/* GTM Script */}
        <GoogleTagManager />
        {/* GTM <noscript> fallback for non-JS users */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <noscript>
                <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVH39MQ8"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              </noscript>
            `,
          }}
        />
        <Header />
        <TransitionWrapper>
          <main id="main-content" className="dream-theme">{children}</main>
        </TransitionWrapper>
        <div className="dream-theme dream-footer"><Footer salesRepPhone="8801966900600" /></div>
        <ThemeToggle />
      </body>
    </html>
  );
}
