import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchSEOConfig, buildMetadata, sanitizeSEO } from "@/lib/seo";
import { fetchInventoryFiltersByBrand } from "@/lib/inventoryFilters";
import CarsClient from "../cars/_components/CarsClient";
import { CAR_TYPE_CONFIGS } from "../cars/_components/types";
import { fetchInitialCars } from "../cars/_components/fetchCars";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const rawSeo = await fetchSEOConfig("byd-cars");
  const seo = sanitizeSEO(rawSeo);

  return buildMetadata("byd-cars", seo);
}

export default async function BydCarsPage() {
  const config = CAR_TYPE_CONFIGS["byd"];
  const [seo, filterData, initialData] = await Promise.all([
    fetchSEOConfig("byd-cars"),
    fetchInventoryFiltersByBrand("BYD"),
    fetchInitialCars({ brand: "BYD" }, "Available"),
  ]);

  const {
    brands = [],
    models = [],
    bodyStyles = [],
    colors = [],
  } = filterData || {};

  return (
    <>
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      <div className="bg-page text-ink min-h-screen container-responsive">
        <div className="container mx-auto px-4 pt-20">
          <h1 className="text-4xl font-bold pt-20 mb-5">{config.title}</h1>
          <p className="text-muted sm:w-40 md:w-3xl lg:w-4xl mb-10 text-justify">
            {config.description}
          </p>

          <Suspense fallback={null}>
            <CarsClient
              config={config}
              brands={brands}
              models={models}
              bodyStyles={bodyStyles}
              model_names={[]}
              colors={colors}
              initialCars={initialData.cars}
              initialTotalPages={initialData.totalPages}
            />
          </Suspense>
        </div>

      </div>
    </>
  );
}

