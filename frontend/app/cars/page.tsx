// app/cars/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchCategorySEO,
  buildCategoryMetadata,
  isCategoryPageHidden,
} from "@/lib/seo";
import AllCarsClient from "./_components/AllCarsClient";
import { fetchInventoryFilters } from "@/lib/inventoryFilters";
import { fetchInitialCars } from "./_components/fetchCars";

const FALLBACK_METADATA: Metadata = {
  title: "Cars for Sale in Bangladesh | BEG AUTOS",
  description:
    "Browse every car available at BEG AUTOS — Bangladesh's premier luxury car studio.",
  alternates: { canonical: "https://www.begautos.com/cars/" },
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchCategorySEO("cars");
  return buildCategoryMetadata(seo, FALLBACK_METADATA);
}

export default async function AllCarsPage() {
  const [seo, filterData, initialData] = await Promise.all([
    fetchCategorySEO("cars"),
    fetchInventoryFilters(),
    fetchInitialCars({}, "Available"),
  ]);

  if (isCategoryPageHidden(seo)) notFound();

  const { brands = [], models = [], bodyStyles = [], colors = [] } = filterData || {};

  return (
    <>
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      <AllCarsClient
        brands={brands}
        models={models}
        bodyStyles={bodyStyles}
        colors={colors}
        initialCars={initialData.cars}
        initialTotalPages={initialData.totalPages}
        h1Title={seo?.h1_title}
        shortDescription={seo?.short_description}
        longDescription={seo?.long_description}
      />
    </>
  );
}
