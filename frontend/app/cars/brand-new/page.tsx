import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CarsClient from "../_components/CarsClient";
import {
  CategoryShortDescription,
  CategoryLongDescription,
} from "../_components/CategoryCopy";
import { CAR_TYPE_CONFIGS } from "../_components/types";
import { fetchInventoryFilters } from "@/lib/inventoryFilters";
import { fetchInitialCars } from "../_components/fetchCars";
import {
  fetchCategorySEO,
  buildCategoryMetadata,
  isCategoryPageHidden,
} from "@/lib/seo";

const FALLBACK_METADATA: Metadata = {
  title: "Brand New Cars for Sale in Bangladesh | BEG AUTOS",
  description:
    "Browse brand new cars available at BEG AUTOS — Bangladesh's premier luxury car studio. Find the latest models with full dealer warranty and competitive pricing.",
  robots: "index, follow",
  alternates: { canonical: "https://www.begautos.com/cars/brand-new/" },
  openGraph: {
    title: "Brand New Cars for Sale | BEG AUTOS",
    description:
      "Browse brand new cars at BEG AUTOS — Bangladesh's finest luxury car studio.",
    url: "https://www.begautos.com/cars/brand-new/",
    type: "website",
    siteName: "BEG AUTOS",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchCategorySEO("brand-new");
  return buildCategoryMetadata(seo, FALLBACK_METADATA);
}

export default async function BrandNewCarsPage() {
  const config = CAR_TYPE_CONFIGS["brand-new"];
  const [seo, filterData, initialData] = await Promise.all([
    fetchCategorySEO("brand-new"),
    fetchInventoryFilters(),
    fetchInitialCars({ car_type: "BRAND_NEW, RECONDITIONED" }, "Available"),
  ]);

  if (isCategoryPageHidden(seo)) notFound();

  const { brands = [], models = [], bodyStyles = [], colors = [] } = filterData || {};

  return (
    <div className="bg-page text-ink min-h-screen container-responsive">
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      <div className="container mx-auto px-4 pt-20">
        <h1 className="text-4xl font-bold pt-20 mb-5">
          {seo?.h1_title || config.title}
        </h1>

        {seo?.short_description ? (
          <CategoryShortDescription html={seo.short_description} />
        ) : (
          <p className="text-muted sm:w-40 md:w-3xl lg:w-4xl mb-10 text-justify">
            {config.description}
          </p>
        )}

        <Suspense fallback={null}>
          <CarsClient
            config={config}
            brands={brands || []}
            models={models || []}
            bodyStyles={bodyStyles || []}
            colors={colors || []}
            initialCars={initialData.cars}
            initialTotalPages={initialData.totalPages}
          />
        </Suspense>

        {seo?.long_description && (
          <CategoryLongDescription html={seo.long_description} />
        )}
      </div>

    </div>
  );
}
