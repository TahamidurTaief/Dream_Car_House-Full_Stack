import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Your Car | Beg Autos - Get the Best Price for Your Vehicle",
  description:
    "Want to sell your car? Submit your vehicle details to Beg Autos and get the best price. We buy luxury, reconditioned, and pre-owned cars in Bangladesh.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.begautos.com/sell/",
  },
  openGraph: {
    title: "Sell Your Car | Beg Autos",
    description:
      "Submit your vehicle details to Beg Autos and get the best price for your car.",
    url: "https://www.begautos.com/sell/",
    type: "website",
    siteName: "Beg Autos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your Car | Beg Autos",
    description:
      "Submit your vehicle details to Beg Autos and get the best price for your car.",
  },
};

export default function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
