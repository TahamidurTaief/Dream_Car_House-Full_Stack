// app/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSEOConfig, buildMetadata, sanitizeSEO, isPageHidden } from "@/lib/seo";
import HomeClient from "./_components/HomeClient";

async function fetchSliderData() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/v1/home/slider/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? json.data : null;
  } catch {
    return null;
  }
}

async function fetchFeaturedCars() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/v1/inventory/featured/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

async function fetchBrands() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/v1/inventory/brands/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.success && json.data ? json.data : [];
  } catch {
    return [];
  }
}

async function fetchSocialData() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/v1/home/people-talk/?limit=100`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const results = json?.data?.results ?? [];
    return results
      .filter((item: { is_featured: boolean }) => item.is_featured)
      .slice(-9);
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const rawSeo = await fetchSEOConfig("home");
  const seo = sanitizeSEO(rawSeo);

  return buildMetadata("home", seo);
}

export default async function Home() {
  const [seo, sliderData, featuredCars, brands, socialData] = await Promise.all([
    fetchSEOConfig("home"),
    fetchSliderData(),
    fetchFeaturedCars(),
    fetchBrands(),
    fetchSocialData(),
  ]);
  if (isPageHidden(seo)) notFound();

  return (
    <>
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      <HomeClient
        sliderData={sliderData}
        featuredCars={featuredCars}
        brands={brands}
        socialData={socialData}
      />
    </>
  );
}
