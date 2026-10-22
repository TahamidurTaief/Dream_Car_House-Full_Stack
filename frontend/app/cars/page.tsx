import type { Metadata } from "next";
import InventoryClient from "../inventory/InventoryClient";

export const metadata: Metadata = {
  title: "Luxury Vehicles Collection | DREAM CAR HOUSE",
  description:
    "Explore our complete collection of brand new and certified pre-owned luxury vehicles in Bangladesh. Mercedes-Benz, BMW, Lexus, Toyota, Land Rover, and Porsche.",
  alternates: {
    canonical: "https://dreamcarhouse.com/cars/",
  },
};

export default function CarsPage() {
  return <InventoryClient />;
}
