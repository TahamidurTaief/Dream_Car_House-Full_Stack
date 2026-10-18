import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBDT } from "@/lib/utils";
import {
  fetchCategorySEO,
  buildCategoryMetadata,
  isCategoryPageHidden,
} from "@/lib/seo";
import { CategoryLongDescription } from "../_components/CategoryCopy";

type SegmentTitle = "Luxury & Performance" | "Refined & Versatile" | "Electric";

interface Brand {
  id: number;
  name: string;
  image: string | null;
  car_names: string[];
  starting_price: number | string | null;
  segment: SegmentTitle;
}

// Matches Brand.SegmentChoices in backend/apps/inventory/models/brand_model.py —
// the API now returns the human-readable label directly, so grouping is just
// an exact match against it, no per-brand-name mapping needed on the frontend.
const SEGMENT_ORDER: SegmentTitle[] = [
  "Luxury & Performance",
  "Refined & Versatile",
  "Electric",
];

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function formatStartingPrice(value: Brand["starting_price"]) {
  const num = Number(value);
  if (!value || !Number.isFinite(num) || num <= 0) return "Contact for price";
  return `Starting from ${formatBDT(num)}`;
}

async function fetchBrands(): Promise<Brand[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

  try {
    const res = await fetch(`${base}/api/v1/inventory/brands/`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    return json?.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

const FALLBACK_METADATA: Metadata = {
  title: "Luxury Car Brands | BEG AUTOS",
  description:
    "Browse every marque currently on the floor at Beg Autos — from reconditioned Toyotas to authorised BYD electrics.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.begautos.com/cars/brand/",
  },
  openGraph: {
    title: "Luxury Car Brands | BEG AUTOS",
    description: "Browse every marque currently on the floor at BEG AUTOS.",
    url: "https://www.begautos.com/cars/brand/",
    type: "website",
    siteName: "BEG AUTOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Car Brands | BEG AUTOS",
    description: "Browse every marque currently on the floor at BEG AUTOS.",
  },
};

const FALLBACK_H1 = "Explore by Marque";
const FALLBACK_INTRO =
  "Discover a curated selection of luxury, performance, electric and " +
  "everyday vehicles, brought together by BEG AUTOS with a focus on " +
  "quality, character and confidence.";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchCategorySEO("brand");
  return buildCategoryMetadata(seo, FALLBACK_METADATA);
}

export default async function BrandPage() {
  const [seo, brands] = await Promise.all([
    fetchCategorySEO("brand"),
    fetchBrands(),
  ]);

  if (isCategoryPageHidden(seo)) notFound();

  const segments = SEGMENT_ORDER.map((title) => ({
    title,
    brands: brands.filter((b) => b.segment === title),
  })).filter((segment) => segment.brands.length > 0);

  return (
    <div className="bg-page text-ink min-h-screen container-responsive">
      {seo?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seo.schema_json) }}
        />
      )}
      {/* Hero */}
      <section className="dream-media relative w-full min-h-[280px] sm:min-h-[420px] flex items-end overflow-hidden">
        <Image
          src="/images/best2.png"
          alt="Beg Autos showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:pb-10">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-muted mb-3 sm:mb-4">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-ink">
              Inventory
            </Link>
            <span>/</span>
            <span className="text-ink">Brands</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold leading-tight mb-2 sm:mb-3 max-w-3xl">
            {seo?.h1_title || FALLBACK_H1}
          </h1>
          {seo?.short_description ? (
            <div
              className="text-muted max-w-xl text-sm sm:text-base leading-relaxed [&_a]:underline [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: seo.short_description }}
            />
          ) : (
            <p className="text-muted max-w-xl text-sm sm:text-base leading-relaxed">
              {FALLBACK_INTRO}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {segments.length === 0 ? (
          <p className="text-muted py-16">
            No brands are published yet — check back soon.
          </p>
        ) : (
          segments.map((segment) => (
            <section key={segment.title} className="pt-11 pb-2">
              <div className="flex items-center gap-3 border-b border-line pb-4 mb-7">
                <span className="w-5 h-px bg-soft block" />
                <span className="text-[11px] tracking-[0.22em] uppercase text-muted">
                  {segment.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {segment.brands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            </section>
          ))
        )}

        {seo?.long_description && (
          <CategoryLongDescription html={seo.long_description} />
        )}
      </div>
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  const slug = slugify(brand.name);
  const carNamesPreview = brand.car_names.slice(0, 4).join(", ");

  return (
    <Link
      href={`/cars/brand/${slug}`}
      className="flex flex-col bg-panel border border-line rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:border-line hover:-translate-y-0.5 transition"
    >
      <div className="relative h-[150px] flex items-center justify-center bg-page border-b border-line">
        {brand.image ? (
          <Image
            src={brand.image}
            alt={`${brand.name} logo`}
            width={86}
            height={86}
            className="object-contain max-h-[86px] w-auto"
          />
        ) : (
          <span className="text-2xl font-semibold text-muted">
            {brand.name.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-base font-semibold leading-snug">{brand.name}</h3>
        {carNamesPreview && (
          <p className="text-xs text-muted leading-relaxed min-h-[39px]">
            {carNamesPreview}
          </p>
        )}
        <div className="border-t border-line pt-2 mt-0.5">
          <span className="text-[11px] tracking-wider uppercase text-muted">
            {brand.starting_price ? "Starting from" : ""}
          </span>
        </div>
        <p className="text-sm font-bold">
          {formatStartingPrice(brand.starting_price)}
        </p>
        <div className="mt-2 w-full bg-soft text-ink text-center py-2 rounded-md text-sm font-medium hover:bg-soft transition">
          View {brand.name} Cars
        </div>
      </div>
    </Link>
  );
}
