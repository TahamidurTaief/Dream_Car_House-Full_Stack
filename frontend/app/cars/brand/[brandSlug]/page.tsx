import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicInventory } from "@/lib/server/api";
import VehicleCard from "@/components/VehicleCard";

interface PageProps {
  params: Promise<{
    brandSlug: string;
  }>;
}

const BRAND_SLUG_MAP: Record<string, string> = {
  "mercedes-benz": "Mercedes-Benz",
  "toyota": "Toyota",
  "bmw": "BMW",
  "lexus": "Lexus",
  "nissan": "Nissan",
  "volvo": "Volvo",
  "porsche": "Porsche",
  "audi": "Audi",
  "land-rover": "Land Rover",
  "byd": "BYD",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const brandName = BRAND_SLUG_MAP[brandSlug.toLowerCase()];

  if (!brandName) {
    return {
      title: "Marque Not Found | DREAM CAR HOUSE",
    };
  }

  return {
    title: `${brandName} Luxury Vehicles for Sale in Bangladesh | DREAM CAR HOUSE`,
    description: `Explore certified brand new and pre-owned ${brandName} luxury vehicles at DREAM CAR HOUSE showrooms in Kakrail and Gulshan, Dhaka.`,
    alternates: {
      canonical: `https://dreamcarhouse.com/cars/brand/${brandSlug}/`,
    },
  };
}

export default async function BrandVehiclesPage({ params }: PageProps) {
  const { brandSlug } = await params;
  const brandName = BRAND_SLUG_MAP[brandSlug.toLowerCase()];

  if (!brandName) {
    notFound();
  }

  let matchingCars: import("@/lib/types").PublicVehicle[] = [];
  try {
    const res = await getPublicInventory({ brand: brandName });
    matchingCars = res.items;
  } catch (error) {
    console.error(`[BrandVehiclesPage] Failed to fetch cars for brand ${brandName}:`, error);
  }

  return (
    <div className="inventory-page-wrap max-w-7xl">
      <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#9ca3af" }}>
        <Link href="/" style={{ color: "#d1d5db" }}>Home</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <Link href="/cars/brand" style={{ color: "#d1d5db" }}>Marques</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>{brandName}</span>
      </nav>

      <div style={{ marginBottom: "2.5rem" }}>
        <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
          OFFICIAL MARQUE PORTFOLIO
        </span>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          {brandName} Collection
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Explore our verified showroom allocations of {brandName} luxury automobiles in Dhaka.
        </p>
      </div>

      {matchingCars.length > 0 ? (
        <div className="cars-grid-layout">
          {matchingCars.map((car) => (
            <VehicleCard key={car.id} car={car} layout="grid" />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#0d0f12",
            border: "1px solid #1f2937",
            borderRadius: "8px",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#d1d5db", fontSize: "1rem", marginBottom: "1.5rem" }}>
            New {brandName} allocations are currently being inducted into our Dhaka showroom. Contact our concierge for bespoke importation.
          </p>
          <Link href="/inventory" className="consult-primary-btn" style={{ margin: "0 auto" }}>
            <span>Browse All Available Showroom Inventory</span>
          </Link>
        </div>
      )}
    </div>
  );
}
