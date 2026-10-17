import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBrandSEO, buildCategoryMetadata } from "@/lib/seo";
import { fetchInventoryFilters } from "@/lib/inventoryFilters";
import CarsClient from "../../_components/CarsClient";
import {
  CategoryShortDescription,
  CategoryLongDescription,
} from "../../_components/CategoryCopy";
import { fetchInitialCars } from "../../_components/fetchCars";
import { CAR_TYPE_CONFIGS } from "../../_components/types";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ brandSlug: string }>;
}

// Brand.listing_footer_text predates the long_description SEO field and is
// plain text, not HTML — escape it and turn newlines into <br> so it can run
// through the same CategoryLongDescription treatment as every other listing
// page's bottom text, instead of the plain unstyled block this used to be.
function plainTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<br />");
}

async function fetchBrandBySlug(brandSlug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/v1/inventory/brands/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const brands = json?.success && json.data ? json.data : [];
    return (
      brands.find(
        (b: { id: number; name: string; image: string }) =>
          b.name.toLowerCase().replace(/\s+/g, "-") === brandSlug.toLowerCase(),
      ) ?? null
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await fetchBrandBySlug(brandSlug);

  if (!brand) {
    return {
      title: "Brand Not Found | BEG AUTOS",
      robots: "noindex, nofollow",
    };
  }

  const seo = await fetchBrandSEO(brand.id);

  const fallback: Metadata = {
    title: `${brand.name} Cars for Sale in Bangladesh | BEG AUTOS`,
    description: `Browse all ${brand.name} cars available at BEG AUTOS — Bangladesh's premier luxury car studio. Find the latest ${brand.name} models at competitive prices.`,
    robots: "index, follow",
    alternates: {
      canonical: `https://www.begautos.com/cars/brand/${brandSlug}/`,
    },
    openGraph: {
      title: `${brand.name} Cars for Sale | BEG AUTOS`,
      description: `Browse all ${brand.name} cars at BEG AUTOS.`,
      url: `https://www.begautos.com/cars/brand/${brandSlug}/`,
      type: "website",
      siteName: "BEG AUTOS",
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} Cars for Sale | BEG AUTOS`,
      description: `Browse all ${brand.name} cars at BEG AUTOS.`,
    },
  };

  return buildCategoryMetadata(seo, fallback);
}

export default async function BrandCarsPage({ params }: PageProps) {
  const { brandSlug } = await params;

  const brand = await fetchBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const config = {
    ...CAR_TYPE_CONFIGS["all"],
    title: `${brand.name} Cars`,
    heading: `Looking for <br /> Other Brands?`,
    linkurl: "/cars",
    baseApiParams: { brand_id: String(brand.id) },
    seoTitle: `${brand.name} Cars for Sale | Beg Autos`,
    seoDescription: `Browse all ${brand.name} cars at Beg Autos.`,
    // Only the brand listing page shows every car regardless of availability
    // (sold cars included, sorted to the bottom by the API) — every other
    // listing page defaults to "Available" only.
    defaultAvailability: "",
  };

  const [seo, filterData, initialData] = await Promise.all([
    fetchBrandSEO(brand.id),
    fetchInventoryFilters(),
    fetchInitialCars({ brand_id: String(brand.id) }),
  ]);

  const {
    brands = [],
    models = [],
    bodyStyles = [],
    colors = [],
  } = filterData || {};

  // long_description (admin SEO field) wins when set; listing_footer_text
  // (the older, plain-text field) is the fallback so existing admin content
  // keeps showing, just through the same collapsible treatment.
  const longDescriptionHtml =
    seo?.long_description ||
    (brand.listing_footer_text ? plainTextToHtml(brand.listing_footer_text) : null);

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
          {seo?.h1_title || `${brand.name} Cars for Sale`}
        </h1>

        {seo?.short_description ? (
          <CategoryShortDescription html={seo.short_description} />
        ) : (
          <p className="text-muted sm:w-40 md:w-3xl lg:w-4xl mb-10 text-justify">
            Browse our complete collection of {brand.name} vehicles at BEG AUTOS.
            Find the perfect {brand.name} at the best price in Bangladesh.
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

        {longDescriptionHtml && (
          <CategoryLongDescription html={longDescriptionHtml} />
        )}
      </div>

    </div>
  );
}
