import { MetadataRoute } from "next";
import {
  fetchSEOConfig,
  isPageHidden,
  fetchCategorySEO,
  isCategoryPageHidden,
} from "@/lib/seo";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://www.begautos.com";

// At build time the backend is not on localhost — use the public API URL when set
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://127.0.0.1:8000";

const FETCH_TIMEOUT_MS = 25_000; // 25 s — well inside Next.js 60 s worker limit
const PAGE_SIZE = 200;

interface InventoryCar {
  slug: string;
  indexing: string;
  updated_at?: string;
}

interface ApiPaginatedResponse {
  success: boolean;
  data?: {
    count: number;
    next: string | null;
    previous: string | null;
    results: InventoryCar[];
  };
}

interface BrandSummary {
  name: string;
  /** Only ever contains cars that are published AND registered Available. */
  car_names: string[];
}

/**
 * Must match the slug derivation in app/cars/brand/page.tsx and
 * app/cars/brand/[brandSlug]/page.tsx, or the sitemap would advertise URLs
 * that 404.
 */
function brandSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Brands with at least one available car. A brand whose stock is entirely
 * sold/booked has an empty listing page, so it is left out of the sitemap
 * rather than pointing crawlers at a dead end.
 */
async function fetchBrandsWithStock(): Promise<BrandSummary[]> {
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/v1/inventory/brands/`);
    if (!res.ok) return [];

    const json = await res.json();
    const brands: BrandSummary[] =
      json?.success && Array.isArray(json.data) ? json.data : [];

    return brands.filter(
      (b) => b?.name && Array.isArray(b.car_names) && b.car_names.length > 0
    );
  } catch {
    return [];
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 0 },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAllCars(): Promise<InventoryCar[]> {
  const cars: InventoryCar[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `${API_URL}/api/v1/inventory/?limit=${PAGE_SIZE}&offset=${offset}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) break;

      const data: ApiPaginatedResponse = await res.json();
      if (!data?.success || !data.data?.results?.length) break;

      for (const car of data.data.results) {
        // `indexing` holds a full robots directive ("noindex, nofollow"), and
        // older rows may still hold the short "noindex" — startsWith covers both.
        if (!car.indexing?.startsWith("noindex") && car.slug) {
          cars.push(car);
        }
      }

      hasMore = !!data.data.next && data.data.results.length === PAGE_SIZE;
      offset += PAGE_SIZE;
    } catch {
      // Timeout or network error — stop pagination gracefully
      break;
    }
  }

  return cars;
}

/**
 * Pages whose Visibility can be toggled from Django admin. A page set to
 * "Hidden" 404s, so it must not appear in the sitemap either.
 * Keys are SEOConfig page slugs; values are the public paths they map to.
 */
const TOGGLEABLE_PAGES: Record<string, string> = {
  home: "/",
  gallery: "/gallery/",
  about: "/about/",
  sell: "/sell/",
  contact: "/contact/",
};

/** Listing pages whose Visibility lives in CategoryPageSEO. */
const TOGGLEABLE_CATEGORY_PAGES: Record<string, string> = {
  cars: "/cars/",
  "brand-new": "/cars/brand-new/",
  "pre-owned": "/cars/pre-owned/",
  brand: "/cars/brand/",
};

async function fetchHiddenPaths(): Promise<Set<string>> {
  const hidden = new Set<string>();

  await Promise.all([
    ...Object.entries(TOGGLEABLE_PAGES).map(async ([page, path]) => {
      try {
        if (isPageHidden(await fetchSEOConfig(page))) hidden.add(path);
      } catch {
        // Treat a failed lookup as visible — never silently drop a live page.
      }
    }),
    ...Object.entries(TOGGLEABLE_CATEGORY_PAGES).map(async ([page, path]) => {
      try {
        if (isCategoryPageHidden(await fetchCategorySEO(page))) hidden.add(path);
      } catch {
        // Same here — a failed lookup must not remove a live page.
      }
    }),
  ]);

  return hidden;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, hiddenPaths, brandsWithStock] = await Promise.all([
    fetchAllCars(),
    fetchHiddenPaths(),
    fetchBrandsWithStock(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/cars/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/cars/brand-new/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cars/pre-owned/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cars/brand/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/gallery/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/sell/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const carPages: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${SITE_URL}/cars/${car.slug}/`,
    lastModified: car.updated_at ? new Date(car.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const brandPages: MetadataRoute.Sitemap = brandsWithStock.map((brand) => ({
    url: `${SITE_URL}/cars/brand/${brandSlug(brand.name)}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const visibleStaticPages = staticPages.filter(
    (entry) => !hiddenPaths.has(entry.url.replace(SITE_URL, ""))
  );

  return [...visibleStaticPages, ...brandPages, ...carPages];
}
