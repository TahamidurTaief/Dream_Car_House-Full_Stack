import type { Metadata } from "next";
import Link from "next/link";
import { VEHICLE_DATA } from "@/lib/showroomData";
import VehicleCard from "@/components/VehicleCard";

export const metadata: Metadata = {
  title: "Brand New & Reconditioned Luxury Vehicles | DREAM CAR HOUSE",
  description:
    "Explore factory-fresh, zero-mileage brand new luxury automobiles in Bangladesh at DREAM CAR HOUSE Kakrail and Gulshan showrooms.",
  alternates: {
    canonical: "https://dreamcarhouse.com/cars/brand-new/",
  },
};

export default function BrandNewCarsPage() {
  const brandNewCars = VEHICLE_DATA.filter((c) => c.car_type === "BRAND_NEW");

  return (
    <div className="inventory-page-wrap max-w-7xl" style={{ padding: "8rem 1.5rem 5rem" }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#9ca3af" }}>
        <Link href="/" style={{ color: "#d1d5db" }}>Home</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <Link href="/inventory" style={{ color: "#d1d5db" }}>Inventory</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>Brand New</span>
      </nav>

      <div style={{ marginBottom: "2.5rem" }}>
        <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
          FACTORY ZERO-METER COLLECTION
        </span>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          Brand New & Reconditioned Luxury Vehicles
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Explore our exclusive collection of {brandNewCars.length} untouched zero-meter luxury imports with full official warranty.
        </p>
      </div>

      <div className="cars-grid-layout">
        {brandNewCars.map((car) => (
          <VehicleCard key={car.id} car={car} layout="grid" />
        ))}
      </div>
    </div>
  );
}
