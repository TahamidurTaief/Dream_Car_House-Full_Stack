import type { Metadata } from "next";
import Link from "next/link";
import { VEHICLE_DATA } from "@/lib/showroomData";
import VehicleCard from "@/components/VehicleCard";

export const metadata: Metadata = {
  title: "Certified Pre-Owned Luxury Vehicles | DREAM CAR HOUSE",
  description:
    "Explore 150-point certified pre-owned luxury cars in Dhaka at DREAM CAR HOUSE. Verified service history and showroom-ready condition.",
  alternates: {
    canonical: "https://dreamcarhouse.com/cars/pre-owned/",
  },
};

export default function PreOwnedCarsPage() {
  const preOwnedCars = VEHICLE_DATA.filter((c) => c.car_type === "PRE_OWNED");

  return (
    <div className="inventory-page-wrap max-w-7xl" style={{ padding: "8rem 1.5rem 5rem" }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#9ca3af" }}>
        <Link href="/" style={{ color: "#d1d5db" }}>Home</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <Link href="/inventory" style={{ color: "#d1d5db" }}>Inventory</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>Pre-Owned</span>
      </nav>

      <div style={{ marginBottom: "2.5rem" }}>
        <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
          150-POINT AUDITED COLLECTION
        </span>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          Certified Pre-Owned Luxury Vehicles
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Explore our certified collection of {preOwnedCars.length} pristine pre-owned luxury vehicles with verified documentation and immediate handover.
        </p>
      </div>

      <div className="cars-grid-layout">
        {preOwnedCars.map((car) => (
          <VehicleCard key={car.id} car={car} layout="grid" />
        ))}
      </div>
    </div>
  );
}
