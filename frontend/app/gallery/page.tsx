// app/gallery/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchSEOConfig, buildMetadata, isPageHidden } from "@/lib/seo";
import GalleryClient from "./_components/GalleryClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSEOConfig("gallery");
  return buildMetadata("gallery", seo);
}

async function fetchGalleryData() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const res = await fetch(
      `${base}/api/v1/home/people-talk/?limit=14&offset=0`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return { results: [], total_page: 0 };
    const json = await res.json();
    return {
      results: json?.data?.results ?? [],
      total_page: json?.data?.total_page ?? 0,
    };
  } catch {
    return { results: [], total_page: 0 };
  }
}

export default async function GalleryPage() {
  const [seo, initialData] = await Promise.all([
    fetchSEOConfig("gallery"),
    fetchGalleryData(),
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
      <GalleryClient
        initialResults={initialData.results}
        initialTotalPages={initialData.total_page}
      />
    </>
  );
}
