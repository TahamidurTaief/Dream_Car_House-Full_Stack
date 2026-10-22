import type { Metadata } from "next";
import InventoryClient from "./InventoryClient";

export const metadata: Metadata = {
  title: "Complete Luxury Vehicle Inventory | DREAM CAR HOUSE",
  description:
    "Explore our complete inventory of brand new and certified pre-owned luxury vehicles in Bangladesh. Mercedes-Benz, BMW, Lexus, Toyota, Land Rover, and Porsche.",
  alternates: {
    canonical: "https://dreamcarhouse.com/inventory/",
  },
};

export default function InventoryPage() {
  return <InventoryClient />;
}
