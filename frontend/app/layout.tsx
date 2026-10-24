import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./dream-car-house.css";
import { UIProvider } from "@/lib/UIContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalContainer from "@/components/ModalContainer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050608",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamcarhouse.com"),
  title: {
    default: "The Pinnacle of Luxury Automobiles | DREAM CAR HOUSE",
    template: "%s | DREAM CAR HOUSE",
  },
  description:
    "Explore luxury cars in Bangladesh with DREAM CAR HOUSE. Browse our exclusive range of brand new, reconditioned, and pre-owned premium vehicles in Kakrail and Gulshan, Dhaka.",
  keywords: [
    "DREAM CAR HOUSE",
    "Luxury cars Bangladesh",
    "Pre-owned luxury cars Dhaka",
    "Brand new cars Dhaka",
    "Mercedes Bangladesh",
    "BMW Bangladesh",
    "Land Cruiser Dhaka",
    "Rolls-Royce Bangladesh",
  ],
  alternates: {
    canonical: "https://dreamcarhouse.com",
  },
  openGraph: {
    title: "The Pinnacle of Luxury Automobiles | DREAM CAR HOUSE",
    description:
      "Explore luxury cars in Bangladesh with DREAM CAR HOUSE. Browse our exclusive range of brand new and pre-owned premium vehicles.",
    url: "https://dreamcarhouse.com",
    siteName: "DREAM CAR HOUSE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85",
        width: 1200,
        height: 630,
        alt: "DREAM CAR HOUSE Flagship Luxury Automobiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pinnacle of Luxury Automobiles | DREAM CAR HOUSE",
    description: "Explore luxury cars in Bangladesh with DREAM CAR HOUSE.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const autoDealerSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "DREAM CAR HOUSE",
  image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85",
  telephone: "+8801615121312",
  email: "dreamcarhouse101@gmail.com",
  url: "https://dreamcarhouse.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "18, Shaheed Captain Monsur Ali Soroni, Kakrail",
    addressLocality: "Dhaka",
    postalCode: "1000",
    addressCountry: "BD",
  },
  openingHours: "Mo,Tu,We,Th,Sa,Su 10:00-22:00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
        />
      </head>
      <body className="bg-black text-white font-poppins">
        <UIProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <ModalContainer />
        </UIProvider>
      </body>
    </html>
  );
}
