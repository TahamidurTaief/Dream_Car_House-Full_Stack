import type { Metadata } from "next";
import Link from "next/link";
import { getPublicInventory } from "@/lib/server/api";

export const metadata: Metadata = {
  title: "Prestigious Automotive Brands • Luxury Marques | DREAM CAR HOUSE",
  description:
    "Explore luxury marques available at DREAM CAR HOUSE: Mercedes-Benz, BMW, Lexus, Toyota, Porsche, Land Rover, Nissan, and Volvo.",
  alternates: {
    canonical: "https://dreamcarhouse.com/cars/brand/",
  },
};

export const dynamic = "force-dynamic";

export default async function BrandsDirectoryPage() {
  const inventoryRes = await getPublicInventory();
  const vehicles = inventoryRes.items;

  // Aggregate all unique brands
  const brandsSet = new Set(vehicles.map((c: { brand: string }) => c.brand).filter(Boolean));
  const brandsList = Array.from(brandsSet).map((brandName) => {
    const cars = vehicles.filter((c: { brand: string }) => c.brand === brandName);
    const slug = String(brandName).toLowerCase().replace(/[\s_]+/g, "-");
    return {
      name: String(brandName),
      slug,
      count: cars.length,
      image: cars[0]?.image || "",
    };
  });

  return (
    <div className="inventory-page-wrap max-w-7xl">
      <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#9ca3af" }}>
        <Link href="/" style={{ color: "#d1d5db" }}>Home</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <Link href="/inventory" style={{ color: "#d1d5db" }}>Inventory</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>Marques</span>
      </nav>

      <div style={{ marginBottom: "2.5rem" }}>
        <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
          OFFICIAL LUXURY MARQUES
        </span>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          Prestigious Brand Portfolios
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Select an automotive marque to explore dedicated flagship inventory allocated at our Dhaka showrooms.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {brandsList.map((brand) => (
          <Link
            key={brand.slug}
            href={`/cars/brand/${brand.slug}`}
            className="brand-card-box group"
            style={{
              background: "#0d0f12",
              border: "1px solid #1f2937",
              borderRadius: "10px",
              padding: "1.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.35rem" }}>
                {brand.name}
              </h3>
              <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                {brand.count} {brand.count === 1 ? "Vehicle" : "Vehicles"} In Stock
              </span>
            </div>
            <span style={{ fontSize: "1.25rem", color: "#d97706" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
