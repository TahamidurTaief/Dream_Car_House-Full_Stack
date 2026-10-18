import { notFound } from "next/navigation";
import { Metadata } from "next";
import { sanitizeSEO } from "@/lib/seo";
import CarDetailClient from "./CarDetailClient";

export const dynamicParams = true;
export const revalidate = 0; // Dynamic

const CANONICAL_HOST = "https://www.begautos.com";

function normalizeCanonicalUrl(url?: string): string | undefined {
  if (!url) return undefined;

  return url
    .replace("https://begautos.com", CANONICAL_HOST)
    .replace("http://begautos.com", CANONICAL_HOST);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchCarBySlug(slug: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  try {
    const res = await fetch(`${base}/api/v1/inventory/detail/${slug.toLowerCase()}/`, {
      next: { revalidate: 0 },
    });
    
    if (res.status === 404) {
      return null; // Explicit 404
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch car: ${res.status}`);
    }

    const data = await res.json();
    
    // Some APIs wrap response in 'data' and 'success', DRF might return direct object
    if (data?.success !== undefined) {
      return data.success ? data.data : null;
    }
    return data || null;
  } catch (err) {
    throw err; // Let it throw for network errors instead of returning null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawCar = await fetchCarBySlug(slug);

  if (!rawCar) {
    return {
      title: "Car Not Found | Beg Autos",
      description: "The requested car could not be found in our inventory.",
      robots: "noindex, nofollow",
      alternates: {
        canonical: `https://www.begautos.com/cars/${slug}`,
      },
      openGraph: {
        title: "Car Not Found | Beg Autos",
        description: "The requested car could not be found in our inventory.",
        url: `https://www.begautos.com/cars/${slug}`,
        type: "website" as const,
        images: [{ url: "/images/begautos-og.jpg", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image" as const,
        title: "Car Not Found | Beg Autos",
        description: "The requested car could not be found in our inventory.",
      }
    };
  }

  const car = sanitizeSEO(rawCar);

  // `indexing` now holds the full robots directive ("index, follow" etc.).
  // LEGACY_ROBOTS covers any row still holding the old short values.
  const LEGACY_ROBOTS: Record<string, string> = {
    index: "index, follow",
    noindex: "noindex, nofollow",
  };
  const robotsContent =
    LEGACY_ROBOTS[car.indexing ?? ""] ?? car.indexing ?? "index, follow";

  const pageTitle = car.meta_title || car.name || "Used Car for Sale | Beg Autos";
  const pageDescription = car.meta_description || car.description || `Buy ${car.name || "this car"} at Beg Autos. Check out our luxury collection of cars in Bangladesh.`;
  const pageUrl = normalizeCanonicalUrl(car.canonical_url) || `https://www.begautos.com/cars/${slug}`;

  const ogImages = car.feature_image
    ? [
        {
          url: car.feature_image,
          alt: car.featured_image_alt || car.name || "Car Image",
          width: 1200,
          height: 630,
        },
      ]
    : [{ url: "/images/begautos-og.jpg", width: 1200, height: 630 }];

  const keywords = [
    // Admin-set primary keyword leads, then the auto-derived ones.
    car.target_keyword,
    car.brand,
    car.model,
    car.year ? String(car.year) : "",
    car.color,
    car.fuel_type,
    car.transmission,
    car.body_style,
    "car for sale",
    "Bangladesh",
    "Beg Autos",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title: pageTitle,
    description: pageDescription,
    keywords,
    robots: robotsContent,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: ogImages,
      url: pageUrl,
      type: "website" as const,
      siteName: "Beg Autos",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: pageTitle,
      description: pageDescription,
      images: ogImages.map((img) => img.url),
      site: "@begautos",
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = await fetchCarBySlug(slug);

  if (!car) {
    notFound();
  }

  return (
    <>
      {car?.schema_data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(car.schema_data) }}
        />
      )}
      <CarDetailClient slug={slug} initialCar={car} />
    </>
  );
}
