import type { Metadata } from "next";
import SellClient from "./SellClient";

export const metadata: Metadata = {
  title: "Sell Your Luxury Car & Trade-In Valuation | DREAM CAR HOUSE",
  description:
    "Confidential valuation and trade-in services for your luxury car in Bangladesh. Direct acquisition, rapid appraisal, and certified verification at DREAM CAR HOUSE.",
  alternates: {
    canonical: "https://dreamcarhouse.com/sell/",
  },
};

export default function SellPage() {
  return <SellClient />;
}
