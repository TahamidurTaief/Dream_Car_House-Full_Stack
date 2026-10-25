import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import type {
  PublicSiteSettings,
  PublicShowroomBranch,
  PublicHeroSlider,
  PublicHeroCta,
  PublicVehicle,
  PublicVehicleImage,
  PublicInventoryFilterOptions,
  PublicPreferenceSection,
  PublicBrand,
  PublicConsultationSection,
  PublicExperienceSection,
  PublicVisualChroniclesSection,
  PublicVipSanctuarySection,
  PublicPageSEO,
  PublicCategorySEO,
} from "@/lib/types";

export function getBackendOrigin(): string {
  const origin =
    process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BACKEND_API_ORIGIN;

  if (!origin || !origin.trim()) {
    throw new Error(
      "Missing required backend origin configuration (set INTERNAL_BACKEND_URL or NEXT_PUBLIC_BASE_URL)"
    );
  }

  return origin.trim().replace(/\/$/, "");
}

function validateSiteSettingsPayload(data: unknown): data is PublicSiteSettings {
  if (!data || typeof data !== "object") return false;
  const s = data as Record<string, unknown>;
  return (
    typeof s.name === "string" &&
    s.name.trim().length > 0 &&
    typeof s.hotline === "string" &&
    typeof s.phone === "string" &&
    typeof s.email === "string" &&
    typeof s.whatsapp === "string" &&
    typeof s.primary_address === "string"
  );
}

function validateShowroomBranchesPayload(data: unknown): data is PublicShowroomBranch[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (b) =>
      b &&
      typeof b === "object" &&
      typeof b.branch_id === "string" &&
      typeof b.name === "string" &&
      typeof b.address === "string"
  );
}

function sanitizeCtaButtons(buttons: unknown): PublicHeroCta[] {
  if (!Array.isArray(buttons)) return [];
  const cleaned: PublicHeroCta[] = [];
  for (const btn of buttons) {
    if (!btn || typeof btn !== "object") continue;
    const item = btn as Record<string, unknown>;
    const label = typeof item.label === "string" ? item.label.trim() : "";
    const action = item.action === "appointment_modal" ? "appointment_modal" : "link";
    let destination = typeof item.destination === "string" ? item.destination.trim() : "";
    if (destination.toLowerCase().startsWith("javascript:") || destination.includes("<script")) {
      destination = "/";
    }
    if (label) {
      cleaned.push({ label, action, destination });
    }
  }
  return cleaned;
}

function normalizeHeroPayload(data: unknown): PublicHeroSlider {
  const fallback: PublicHeroSlider = {
    id: null,
    heading: "The Pinnacle of Luxury Automobiles",
    poster: "/assets/maybach_hero_poster.jpg",
    video_provider: "youtube",
    video_source: "7cxfVWs4YGw",
    video_start_time: 45,
    video_title: "DREAM CAR HOUSE Flagship Cinema",
    cta_buttons: [
      { label: "Brand New", action: "link", destination: "/inventory?type=BRAND_NEW" },
      { label: "Pre-Owned", action: "link", destination: "/inventory?type=PRE_OWNED" },
      { label: "Connect to Consult", action: "appointment_modal", destination: "" },
    ],
    scroll_link_label: "Scroll to Current Inventory",
    scroll_link_target: "#carousel-section",
    is_published: true,
  };

  if (!data || typeof data !== "object") return fallback;
  const s = data as Record<string, unknown>;

  const heading = typeof s.heading === "string" && s.heading.trim().length > 0 ? s.heading.trim() : fallback.heading;
  const poster = typeof s.poster === "string" && s.poster.trim().length > 0 ? s.poster.trim() : fallback.poster;
  const provider = s.video_provider === "vimeo" || s.video_provider === "direct" ? s.video_provider : "youtube";
  const source = typeof s.video_source === "string" && s.video_source.trim().length > 0 ? s.video_source.trim() : fallback.video_source;
  const startTime = typeof s.video_start_time === "number" ? Math.max(0, s.video_start_time) : fallback.video_start_time;
  const videoTitle = typeof s.video_title === "string" && s.video_title.trim().length > 0 ? s.video_title.trim() : fallback.video_title;
  const ctas = sanitizeCtaButtons(s.cta_buttons);
  const scrollLabel = typeof s.scroll_link_label === "string" && s.scroll_link_label.trim().length > 0 ? s.scroll_link_label.trim() : fallback.scroll_link_label;
  const scrollTarget = typeof s.scroll_link_target === "string" && s.scroll_link_target.trim().length > 0 ? s.scroll_link_target.trim() : fallback.scroll_link_target;

  return {
    id: typeof s.id === "number" ? s.id : null,
    heading,
    poster,
    video_provider: provider,
    video_source: source,
    video_start_time: startTime,
    video_title: videoTitle,
    cta_buttons: ctas.length > 0 ? ctas : fallback.cta_buttons,
    scroll_link_label: scrollLabel,
    scroll_link_target: scrollTarget,
    image: typeof s.image === "string" ? s.image : null,
    is_published: s.is_published !== false,
  };
}


/**
 * Deduplicated, server-only public SiteSettings fetcher.
 * - Enforces explicit backend origin (fails loudly if unset)
 * - 5-second timeout via AbortSignal.timeout(5000)
 * - Fresh reads initially (cache: 'no-store')
 * - Deduplicated within a single request via React cache()
 * - Never forwards staff credentials or cookies
 */
export const getSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/home/site-settings/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Backend unavailable at ${origin}: ${message}`);
  }

  if (res.status === 404) {
    throw new Error("Public site settings have not been configured (404 NOT FOUND).");
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch public site settings: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json || json.success !== true || !validateSiteSettingsPayload(json.data)) {
    throw new Error("Invalid settings payload or missing required settings record.");
  }

  return json.data;
});

/**
 * Deduplicated, server-only public ShowroomBranches fetcher.
 * - Published-only branches returned by backend
 * - Deduplicated within a single request via React cache()
 */
export const getShowroomBranches = cache(async (): Promise<PublicShowroomBranch[]> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/home/branches/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Backend unavailable at ${origin}: ${message}`);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch showroom branches: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json || json.success !== true || !validateShowroomBranchesPayload(json.data)) {
    throw new Error("Invalid showroom branches payload.");
  }

  // Double assert published only
  return json.data.filter((branch) => !branch.status || branch.status === "PUBLISHED");
});

export const fetchLayoutData = cache(
  async (): Promise<{
    settings: PublicSiteSettings;
    branches: PublicShowroomBranch[];
  }> => {
    const [settings, branches] = await Promise.all([
      getSiteSettings(),
      getShowroomBranches(),
    ]);
    return { settings, branches };
  }
);

/**
 * Deduplicated, server-only public HeroSlider fetcher.
 * - Enforces explicit backend origin
 * - 5-second timeout via AbortSignal.timeout(5000)
 * - Fresh reads initially (cache: 'no-store')
 * - Deduplicated within a single request via React cache()
 * - Never forwards staff credentials or cookies
 */
export const getHeroSlider = cache(async (): Promise<PublicHeroSlider> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/home/slider/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Backend unavailable at ${origin}: ${message}`);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch hero slider configuration: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json || json.success !== true) {
    throw new Error("Invalid hero slider response payload.");
  }

  return normalizeHeroPayload(json.data);
});

/**
 * Normalizes backend Inventory serializer payload into frontend PublicVehicle interface.
 */
export function mapBackendCarToVehicle(car: Record<string, unknown>): PublicVehicle {
  const branchRaw = car.branch && typeof car.branch === "object" ? (car.branch as Record<string, unknown>) : null;
  const branchId = typeof branchRaw?.branch_id === "string" && branchRaw.branch_id ? branchRaw.branch_id : "kakrail";
  const branchName = typeof branchRaw?.name === "string" && branchRaw.name ? branchRaw.name : "Kakrail Branch & Showroom";
  const branchAddress =
    typeof branchRaw?.address === "string" && branchRaw.address
      ? branchRaw.address
      : "18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000";

  const carType = car.car_type === "PRE_OWNED" ? "PRE_OWNED" : "BRAND_NEW";

  let engineCapacity = "";
  if (car.engine_capacity) {
    const rawCap = String(car.engine_capacity).trim();
    if (/^\d+$/.test(rawCap)) {
      engineCapacity = `${rawCap} cc`;
    } else {
      engineCapacity = rawCap;
    }
  }

  let mileage = "";
  if (car.mileage) {
    const rawMil = String(car.mileage).trim();
    if (/^\d+$/.test(rawMil)) {
      mileage = `${parseInt(rawMil, 10).toLocaleString()} km`;
    } else {
      mileage = rawMil;
    }
  } else {
    mileage = carType === "BRAND_NEW" ? "Brand New (00 km)" : "Verified";
  }

  const rawImages = Array.isArray(car.inventory_images) ? car.inventory_images : [];
  const images: PublicVehicleImage[] = rawImages.map((img: Record<string, unknown>) => ({
    id: typeof img.id === "number" ? img.id : undefined,
    url: typeof img.image === "string" ? img.image : "",
    caption: typeof img.caption === "string" && img.caption ? img.caption : typeof img.alt_text === "string" ? img.alt_text : String(car.name || "Showroom Vehicle"),
    tag: typeof img.tag === "string" && img.tag ? img.tag : "EXTERIOR",
    order: typeof img.order === "number" ? img.order : 1,
  }));

  const featureImg =
    typeof car.feature_image === "string" && car.feature_image
      ? car.feature_image
      : images[0]?.url || "/assets/maybach_hero_poster.jpg";

  if (images.length === 0) {
    images.push({
      url: featureImg,
      caption: String(car.name || "Showroom Vehicle"),
      tag: "EXTERIOR",
      order: 1,
    });
  }

  let priceDisplay = "Call for Price";
  if (car.is_call_for_price) {
    priceDisplay = "Call for Price";
  } else if (car.price) {
    priceDisplay = String(car.price);
  }

  return {
    id: typeof car.id === "number" ? car.id : 0,
    name: String(car.name || "Luxury Automobile"),
    brand: String(car.brand || ""),
    model: String(car.model_name || car.model || ""),
    year: typeof car.year === "number" ? car.year : parseInt(String(car.year || "0"), 10) || 0,
    car_type: carType,
    fuel_type: String(car.fuel_type || "Petrol"),
    engine_capacity: engineCapacity,
    mileage,
    price: priceDisplay,
    raw_price: typeof car.raw_price === "string" ? car.raw_price : null,
    is_call_for_price: Boolean(car.is_call_for_price),
    registered: String(car.registered || "Available"),
    branch_id: branchId,
    branch_name: branchName,
    branch_address: branchAddress,
    branch: branchRaw as PublicShowroomBranch | null,
    image: featureImg,
    images,
    description: String(car.description || ""),
    slug: String(car.slug || car.id || ""),
    drivetrain: typeof car.drive_type === "string" ? car.drive_type : undefined,
    registration_number: typeof car.registration_number === "string" ? car.registration_number : undefined,
    is_featured: Boolean(car.is_featured),
    transmission: typeof car.transmission === "string" ? car.transmission : undefined,
    color: typeof car.color === "string" ? car.color : undefined,
    wheel_base: typeof car.wheel_base === "string" ? car.wheel_base : undefined,
    condition: typeof car.condition === "string" ? car.condition : undefined,
    body_style: typeof car.body_style === "string" ? car.body_style : undefined,
    youtube: typeof car.youtube === "string" ? car.youtube : undefined,
    slightly_negotiable: typeof car.slightly_negotiable === "string" ? car.slightly_negotiable : undefined,
    h1_title: typeof car.h1_title === "string" ? car.h1_title : undefined,
    target_keyword: typeof car.target_keyword === "string" ? car.target_keyword : undefined,
    meta_title: typeof car.meta_title === "string" ? car.meta_title : undefined,
    meta_description: typeof car.meta_description === "string" ? car.meta_description : undefined,
    canonical_url: typeof car.canonical_url === "string" ? car.canonical_url : undefined,
    featured_image_alt: typeof car.featured_image_alt === "string" ? car.featured_image_alt : undefined,
    indexing: typeof car.indexing === "string" ? car.indexing : undefined,
    schema_data: car.schema_data && typeof car.schema_data === "object" ? (car.schema_data as Record<string, unknown>) : undefined,
    previous_slug: typeof car.previous_slug === "string" ? car.previous_slug : undefined,
  };
}

/**
 * Deduplicated, server-only public featured vehicles fetcher.
 * Returns up to 10 published vehicles where is_featured=true.
 */
export const getFeaturedInventory = cache(async (): Promise<PublicVehicle[]> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/inventory/featured/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Backend unavailable at ${origin}: ${message}`);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch featured inventory: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json || json.success !== true) {
    throw new Error("Invalid featured inventory response payload.");
  }

  const list = Array.isArray(json.data) ? json.data : [];
  return list.map((item) => mapBackendCarToVehicle(item as Record<string, unknown>));
});

export interface PublicInventoryParams {
  brand?: string;
  type?: string;
  branch?: string;
  q?: string;
  page?: number;
}

/**
 * Deduplicated, server-only public inventory listing fetcher.
 * Matches backend InventoryFilter (supports brand, car_type, branch, search).
 */
export const getPublicInventory = cache(
  async (
    params: PublicInventoryParams = {}
  ): Promise<{ items: PublicVehicle[]; totalRows: number; totalPages: number }> => {
    const origin = getBackendOrigin();
    const query = new URLSearchParams();

    if (params.brand && params.brand !== "all") {
      query.set("brand", params.brand);
    }
    if (params.type && params.type !== "all") {
      query.set("car_type", params.type);
    }
    if (params.branch && params.branch !== "all") {
      query.set("branch", params.branch);
    }
    if (params.q && params.q.trim()) {
      query.set("search", params.q.trim());
    }
    if (params.page && params.page > 1) {
      query.set("page", String(params.page));
    }

    const queryString = query.toString();
    const url = `${origin}/api/v1/inventory/${queryString ? `?${queryString}` : ""}`;

    let res: Response;
    try {
      res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Backend unavailable at ${origin}: ${message}`);
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch inventory listing: HTTP ${res.status}`);
    }

    const json = (await res.json()) as { success?: boolean; data?: unknown };
    if (!json || json.success !== true || !json.data || typeof json.data !== "object") {
      throw new Error("Invalid inventory listing response payload.");
    }

    const dataObj = json.data as Record<string, unknown>;
    const rawList = Array.isArray(dataObj.results) ? dataObj.results : Array.isArray(dataObj.items) ? dataObj.items : Array.isArray(json.data) ? (json.data as unknown[]) : [];
    const totalRows = typeof dataObj.total_rows === "number" ? dataObj.total_rows : rawList.length;
    const totalPages = typeof dataObj.total_page === "number" ? dataObj.total_page : 1;

    const items = rawList.map((item) => mapBackendCarToVehicle(item as Record<string, unknown>));
    return { items, totalRows, totalPages };
  }
);

/**
 * Deduplicated, server-only vehicle detail fetcher by slug.
 * Returns null if vehicle is not found (404) or unpublished.
 */
export const getPublicInventoryDetail = cache(async (slug: string): Promise<PublicVehicle | null> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/inventory/detail/${encodeURIComponent(slug)}/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Backend unavailable at ${origin}: ${message}`);
  }

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle detail: HTTP ${res.status}`);
  }

  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json || json.success !== true || !json.data || typeof json.data !== "object") {
    return null;
  }

  return mapBackendCarToVehicle(json.data as Record<string, unknown>);
});

/**
 * Deduplicated, server-only related vehicles fetcher by slug.
 */
export const getPublicRelatedVehicles = cache(async (slug: string): Promise<PublicVehicle[]> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/inventory/detail/${encodeURIComponent(slug)}/related/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return [];
  }

  if (!res.ok) {
    return [];
  }

  const json = (await res.json()) as { success?: boolean; data?: unknown };
  if (!json || json.success !== true || !json.data) {
    return [];
  }

  const list = Array.isArray(json.data)
    ? json.data
    : typeof json.data === "object" && Array.isArray((json.data as Record<string, unknown>).results)
    ? ((json.data as Record<string, unknown>).results as unknown[])
    : [];

  return list.map((item) => mapBackendCarToVehicle(item as Record<string, unknown>));
});

/**
 * Deduplicated, server-only inventory filter choices fetcher.
 */
export const getInventoryFilters = cache(async (): Promise<PublicInventoryFilterOptions> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/inventory/filters/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return { brands: [], models: [], bodyStyles: [], colors: [] };
  }

  if (!res.ok) {
    return { brands: [], models: [], bodyStyles: [], colors: [] };
  }

  const json = (await res.json()) as Record<string, unknown>;
  const data = (json.data && typeof json.data === "object" ? json.data : json) as Record<string, unknown>;

  return {
    brands: Array.isArray(data.brands) ? (data.brands as { id: number; name: string }[]) : [],
    models: Array.isArray(data.models) ? (data.models as { id: number; model: string; brand: number }[]) : [],
    bodyStyles: Array.isArray(data.bodyStyles) ? (data.bodyStyles as { id: number; body: string }[]) : [],
    colors: Array.isArray(data.colors) ? (data.colors as string[]) : [],
  };
});

/**
 * Deduplicated, server-only public PreferenceSection fetcher.
 * - Deduplicated within a single request via React cache()
 * - Fresh reads initially (cache: 'no-store')
 */
export const getPreferenceSection = cache(async (): Promise<PublicPreferenceSection> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/home/preference-section/`;

  const fallback: PublicPreferenceSection = {
    heading: "Choose per your preference",
    badge: "CURATED INVENTORY",
    subtext: "Toggle between factory-fresh zero mileage units and certified showroom pre-owned vehicles.",
    categories: [
      {
        id: 1,
        category_key: "BRAND_NEW",
        label: "Brand New & Reconditioned",
        badge: "ZERO METER",
        subtext: "Factory-fresh imported luxury vehicles with complete documentation.",
        cta_text: "Explore All Brand New & Reconditioned Collection",
        cta_url: "/inventory?type=BRAND_NEW",
        order: 1,
        highlights: [
          {
            title: "Zero / Minimal Mileage",
            description: "Factory-fresh original condition, untouched luxury and precision.",
          },
          {
            title: "Direct Global Import",
            description: "Handpicked auction grades with verified import manifests.",
          },
          {
            title: "Full Showroom Warranty",
            description: "Complete documentation & personalized post-delivery support.",
          },
        ],
      },
      {
        id: 2,
        category_key: "PRE_OWNED",
        label: "Certified Pre-Owned",
        badge: "SHOWROOM CERTIFIED",
        subtext: "Multi-point inspected certified luxury vehicles ready for ownership.",
        cta_text: "Explore All Certified Pre-Owned Collection",
        cta_url: "/inventory?type=PRE_OWNED",
        order: 2,
        highlights: [
          {
            title: "150+ Point Multi-Inspection",
            description: "Comprehensive engine, transmission, suspension & ECU check.",
          },
          {
            title: "Dhaka Metro Registered",
            description: "100% verified legal papers with authentic ownership history.",
          },
          {
            title: "Showroom Ready",
            description: "Immediate physical test drive & instant ownership handover.",
          },
        ],
      },
    ],
  };

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return fallback;
  }

  if (!res.ok) {
    return fallback;
  }

  const json = (await res.json()) as { success?: boolean; data?: PublicPreferenceSection };
  if (!json || json.success !== true || !json.data) {
    return fallback;
  }

  return json.data;
});

/**
 * Deduplicated, server-only public Brand Runway fetcher.
 * Retrieves published brands configured to show on the homepage Brand Runway.
 * Orders by brand.order, name.
 */
export const getRunwayBrands = cache(async (): Promise<PublicBrand[]> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/inventory/brands/?runway=true`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return [];
  }

  if (!res.ok) {
    return [];
  }

  const json = (await res.json()) as { success?: boolean; data?: PublicBrand[] };
  if (!json || json.success !== true || !Array.isArray(json.data)) {
    return [];
  }

  return json.data;
});

const defaultConsultationFallback: PublicConsultationSection = {
  tag: "PRIVATE AUTOMOTIVE CONCIERGE",
  heading: "Connect to Consult",
  description:
    "Our dedicated automotive advisors offer bespoke consultations—whether you seek an exclusive allocation, custom reconditioned import, or confidential valuation for your vehicle trade-in.",
  trust_pills: [
    { title: "1-on-1 Dedicated Specialist", icon: "specialist" },
    { title: "VIP Handover Lounge Access", icon: "vip" },
    { title: "Confidential Valuation & Quota", icon: "shield" },
  ],
  primary_cta_label: "Book Private Appointment",
  primary_cta_action: "appointment_modal",
  primary_cta_url: "",
  whatsapp_cta_label: "Chat on WhatsApp",
  whatsapp_url:
    "https://wa.me/8801615121312?text=Hello%20Dream%20Car%20House%2C%20I%20would%20like%20to%20consult%20regarding%20a%20luxury%20vehicle.",
  status_beacon_text: "Showroom Open Today • Kakrail & Gulshan, Dhaka",
};

/**
 * Deduplicated, server-only public Consultation Section fetcher.
 */
export const getConsultationSection = cache(async (): Promise<PublicConsultationSection> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/home/consultation/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return defaultConsultationFallback;
  }

  if (!res.ok) {
    return defaultConsultationFallback;
  }

  const json = (await res.json()) as { success?: boolean; data?: PublicConsultationSection };
  if (!json || json.success !== true || !json.data) {
    return defaultConsultationFallback;
  }

  const d = json.data;
  return {
    tag: typeof d.tag === "string" ? d.tag : defaultConsultationFallback.tag,
    heading: typeof d.heading === "string" && d.heading.trim().length > 0 ? d.heading : defaultConsultationFallback.heading,
    description: typeof d.description === "string" && d.description.trim().length > 0 ? d.description : defaultConsultationFallback.description,
    trust_pills: Array.isArray(d.trust_pills) && d.trust_pills.length > 0 ? d.trust_pills : defaultConsultationFallback.trust_pills,
    primary_cta_label: typeof d.primary_cta_label === "string" && d.primary_cta_label.trim().length > 0 ? d.primary_cta_label : defaultConsultationFallback.primary_cta_label,
    primary_cta_action: d.primary_cta_action || defaultConsultationFallback.primary_cta_action,
    primary_cta_url: d.primary_cta_url || "",
    whatsapp_cta_label: typeof d.whatsapp_cta_label === "string" && d.whatsapp_cta_label.trim().length > 0 ? d.whatsapp_cta_label : defaultConsultationFallback.whatsapp_cta_label,
    whatsapp_url: typeof d.whatsapp_url === "string" && d.whatsapp_url.trim().length > 0 ? d.whatsapp_url : defaultConsultationFallback.whatsapp_url,
    status_beacon_text: typeof d.status_beacon_text === "string" ? d.status_beacon_text : defaultConsultationFallback.status_beacon_text,
  };
});

const defaultExperienceFallback: PublicExperienceSection = {
  title: "Experience Beyond Ordinary",
  subtitle:
    "Dhaka's benchmark in high-luxury automotive delivery, certified diagnostic inspection, and bespoke global procurement.",
  video_cta_label: "Watch Showroom Reel",
  video_target: "reel",
  pillars: [
    {
      id: 1,
      pillar_number: "01",
      badge: "PRIVATE SANCTUARY",
      title: "The VIP Delivery Vault",
      description:
        "An exclusive private handover suite featuring theatrical automotive unveiling, champagne reception, and confidential documentation transfer.",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
      tags: ["Soundproof Suite", "Ceremonial Reveal"],
      order: 1,
    },
    {
      id: 2,
      pillar_number: "02",
      badge: "PRECISION AUDIT",
      title: "150-Point Certified Audit",
      description:
        "Exhaustive computerized diagnostics, chassis integrity checks, battery health analysis, and robotic paint-depth verification before showroom induction.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
      tags: ["Computer Diagnostics", "Zero Imperfection"],
      order: 2,
    },
    {
      id: 3,
      pillar_number: "03",
      badge: "BESPOKE IMPORT",
      title: "Global Bespoke Concierge",
      description:
        "Direct sourcing of rare luxury allocations from London, Stuttgart, and Tokyo. Secured container logistics, customs facilitation, and doorstep delivery.",
      image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=80",
      tags: ["UK & Japan Sourcing", "Turnkey Import"],
      order: 3,
    },
  ],
};

/**
 * Deduplicated, server-only public Experience Section fetcher.
 * Guarantees that at least 3 pillars are provided (filling missing ones from baseline fallback)
 * so the 3-pillar layout and visual balance never breaks.
 */
export const getExperienceSection = cache(async (): Promise<PublicExperienceSection> => {
  const origin = getBackendOrigin();
  const url = `${origin}/api/v1/home/experience/`;

  let res: Response;
  try {
    res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    return defaultExperienceFallback;
  }

  if (!res.ok) {
    return defaultExperienceFallback;
  }

  const json = (await res.json()) as { success?: boolean; data?: PublicExperienceSection };
  if (!json || json.success !== true || !json.data) {
    return defaultExperienceFallback;
  }

  const d = json.data;
  let pillars = Array.isArray(d.pillars) ? [...d.pillars] : [];

  // Edge case: if fewer than 3 pillars in database, backfill from fallback to preserve 3-pillar layout
  if (pillars.length < 3) {
    const fallbackPillars = defaultExperienceFallback.pillars;
    for (let i = pillars.length; i < 3; i++) {
      if (fallbackPillars[i]) {
        pillars.push(fallbackPillars[i]);
      }
    }
  }

  return {
    title: typeof d.title === "string" && d.title.trim().length > 0 ? d.title : defaultExperienceFallback.title,
    subtitle: typeof d.subtitle === "string" ? d.subtitle : defaultExperienceFallback.subtitle,
    video_cta_label: typeof d.video_cta_label === "string" && d.video_cta_label.trim().length > 0 ? d.video_cta_label : defaultExperienceFallback.video_cta_label,
    video_target: d.video_target || defaultExperienceFallback.video_target,
    pillars,
  };
});

const defaultChroniclesFallback: PublicVisualChroniclesSection = {
  heading: "DREAM CAR HOUSE Visual Chronicles",
  subtitle:
    "Curated high-resolution photography, delivery spotlights, and automotive cinema from our Kakrail & Gulshan showrooms.",
  stats_number: "19+",
  stats_label: "Curated Masterpieces",
  archive_tag: "19+ SHOWROOM ARCHIVE EDITIONS",
  archive_description:
    "Explore high-definition exterior profiles, handcrafted cockpits, and delivery chronicles.",
  archive_cta_label: "See All Gallery & Media (19+ Photos)",
  archive_cta_url: "/gallery",
  items: [
    {
      id: 1,
      card_type: "hero",
      order: 1,
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85",
      front_alt: "Mercedes-Maybach S 680",
      front_badge: "SHOWROOM FLAGSHIP SPOTLIGHT",
      back_pill: "FIRST-CLASS COMMISSION",
      back_number: "01",
      title: "Mercedes-Maybach S 680 Bi-Turbo V12",
      description:
        "Obsidian Black over Silk Nappa leather. Exclusive rear executive lounge featuring heated massage ottomans, active road noise cancellation, and handcrafted champagne flutes.",
      specs: [
        { label: "Engine", value: "6.0L V12 Bi-Turbo" },
        { label: "Drivetrain", value: "4MATIC All-Wheel" },
        { label: "Interior", value: "First-Class Lounge" },
        { label: "Induction", value: "Showroom Vault" },
      ],
      cta_label: "Explore Available Inventory",
      cta_url: "/inventory",
    },
    {
      id: 2,
      card_type: "portrait",
      order: 2,
      image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=95",
      front_alt: "Rolls-Royce Ghost Extended",
      front_badge: "BESPOKE SANCTUARY",
      back_pill: "GRAND TOURER",
      back_number: "02",
      title: "Rolls-Royce Ghost Extended",
      description:
        "Silver Dawn coachwork with handcrafted fiber-optic Starlight headliner and self-closing coach doors. The ultimate pinnacle of Goodwood coachbuilding.",
      specs: [
        { label: "Engine", value: "6.75L Twin-Turbo V12" },
        { label: "Suspension", value: "Planar Magic Carpet" },
        { label: "Doors", value: "Power Coach Doors" },
        { label: "Acoustics", value: "Whisper Studio 100kg+" },
      ],
      cta_label: "View Media Spotlight",
      cta_url: "/gallery",
    },
    {
      id: 3,
      card_type: "tri",
      order: 3,
      image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=95",
      front_alt: "Porsche 911 Carrera GTS",
      front_badge: "STUTTGART PERFORMANCE",
      back_pill: "TRACK BENCHMARK",
      back_number: "03",
      title: "Porsche 911 Carrera GTS",
      description:
        "Carrara White track stance. 4.0L naturally aspirated flat-6 with razor-sharp response, center-lock wheels, and track precision.",
      specs: [
        { label: "Spec 1", value: "3.0L Flat-6" },
        { label: "Spec 2", value: "Center-Lock" },
        { label: "Spec 3", value: "Sport Chrono" },
      ],
      cta_label: "View Spotlight",
      cta_url: "/inventory",
    },
    {
      id: 4,
      card_type: "tri",
      order: 4,
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=95",
      front_alt: "Executive Cockpit Craftsmanship",
      front_badge: "CABIN ARTISANSHIP",
      back_pill: "VIP FIRST-CLASS SUITE",
      back_number: "04",
      title: "Bespoke Lounge Cockpit",
      description:
        "Handcrafted semi-aniline hides, open-pore walnut trim, and multi-contour active hot-stone massage chairs.",
      specs: [
        { label: "Spec 1", value: "Burmester 4D" },
        { label: "Spec 2", value: "Heated Ottomans" },
        { label: "Spec 3", value: "Ambient 64" },
      ],
      cta_label: "View Spotlight",
      cta_url: "/gallery",
    },
    {
      id: 5,
      card_type: "tri",
      order: 5,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=95",
      front_alt: "Range Rover SV Autobiography",
      front_badge: "FLAGSHIP OFF-ROAD",
      back_pill: "BRITISH LUXURY",
      back_number: "05",
      title: "Range Rover SV Autobiography",
      description:
        "Long wheelbase executive edition in Santorini Black. All-wheel steering, electronic air suspension, and deployable executive tables.",
      specs: [
        { label: "Spec 1", value: "4.4L Twin-Turbo" },
        { label: "Spec 2", value: "Air Suspension" },
        { label: "Spec 3", value: "All-Wheel Steer" },
      ],
      cta_label: "View Spotlight",
      cta_url: "/inventory",
    },
  ],
};

/**
 * Deduplicated, server-only public Visual Chronicles Section fetcher.
 */
export const getVisualChroniclesSection = cache(
  async (): Promise<PublicVisualChroniclesSection> => {
    const origin = getBackendOrigin();
    const url = `${origin}/api/v1/home/visual-chronicles/`;

    let res: Response;
    try {
      res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      return defaultChroniclesFallback;
    }

    if (!res.ok) {
      return defaultChroniclesFallback;
    }

    const json = (await res.json()) as {
      success?: boolean;
      data?: PublicVisualChroniclesSection;
    };
    if (!json || json.success !== true || !json.data) {
      return defaultChroniclesFallback;
    }

    const d = json.data;
    const items =
      Array.isArray(d.items) && d.items.length > 0
        ? d.items
        : defaultChroniclesFallback.items;

    return {
      heading:
        typeof d.heading === "string" && d.heading.trim().length > 0
          ? d.heading
          : defaultChroniclesFallback.heading,
      subtitle:
        typeof d.subtitle === "string"
          ? d.subtitle
          : defaultChroniclesFallback.subtitle,
      stats_number:
        typeof d.stats_number === "string" && d.stats_number.trim().length > 0
          ? d.stats_number
          : defaultChroniclesFallback.stats_number,
      stats_label:
        typeof d.stats_label === "string"
          ? d.stats_label
          : defaultChroniclesFallback.stats_label,
      archive_tag:
        typeof d.archive_tag === "string"
          ? d.archive_tag
          : defaultChroniclesFallback.archive_tag,
      archive_description:
        typeof d.archive_description === "string"
          ? d.archive_description
          : defaultChroniclesFallback.archive_description,
      archive_cta_label:
        typeof d.archive_cta_label === "string"
          ? d.archive_cta_label
          : defaultChroniclesFallback.archive_cta_label,
      archive_cta_url:
        typeof d.archive_cta_url === "string"
          ? d.archive_cta_url
          : defaultChroniclesFallback.archive_cta_url,
      items,
    };
  }
);

const defaultSanctuaryFallback: PublicVipSanctuarySection = {
  background_image:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2560&q=95",
  eyebrow: "KAKRAIL & GULSHAN • DHAKA",
  title: "Step Into The Realm of Automotive Excellence",
  description:
    "DREAM CAR HOUSE specializes in bringing you the finest selection of luxury cars from around the world. With a handpicked collection of the most prestigious brands, DREAM CAR HOUSE takes pride in offering only the highest quality vehicles that combine sophistication, performance, and innovation. Whether you're searching for a sleek sports coupe, a refined executive sedan, or an iconic luxury SUV, DREAM CAR HOUSE is your ultimate destination in Dhaka.",
  value_pillars: [
    {
      title: "100% Certified Provenance",
      subtitle: "Verified mechanical inspection & auction grades",
      icon: "shield",
    },
    {
      title: "Global Bespoke Sourcing",
      subtitle: "Direct official imports from UK, DE & Japan",
      icon: "globe",
    },
    {
      title: "White-Glove VIP Advisory",
      subtitle: "Personalized acquisition & dedicated concierge",
      icon: "star",
    },
  ],
  primary_cta_label: "Schedule Private Viewing",
  primary_cta_action: "appointment_modal",
  primary_cta_url: "",
  secondary_cta_label: "Browse Available Vault →",
  secondary_cta_url: "/inventory",
  card_badge: "FLAGSHIP SHOWROOM",
  card_title: "DREAM CAR HOUSE Flagship",
  card_live_pill: "OPEN TODAY",
  location_text:
    "18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000",
  hours_text:
    "Daily 10:00 AM – 10:00 PM (Private Viewings by Reservation)",
  phone_text: "01615-121312",
  whatsapp_cta_label: "WhatsApp Concierge",
  whatsapp_url:
    "https://wa.me/8801615121312?text=Hello%20DREAM%20CAR%20HOUSE,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20vehicle",
  tour_cta_label: "Showroom Tour",
  tour_video_target: "tour",
};

/**
 * Deduplicated, server-only public VIP Sanctuary Section fetcher.
 */
export const getVipSanctuarySection = cache(
  async (): Promise<PublicVipSanctuarySection> => {
    const origin = getBackendOrigin();
    const url = `${origin}/api/v1/home/vip-sanctuary/`;

    let res: Response;
    try {
      res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      return defaultSanctuaryFallback;
    }

    if (!res.ok) {
      return defaultSanctuaryFallback;
    }

    const json = (await res.json()) as {
      success?: boolean;
      data?: PublicVipSanctuarySection;
    };
    if (!json || json.success !== true || !json.data) {
      return defaultSanctuaryFallback;
    }

    const d = json.data;
    return {
      background_image:
        d.background_image || defaultSanctuaryFallback.background_image,
      eyebrow:
        typeof d.eyebrow === "string" && d.eyebrow.trim().length > 0
          ? d.eyebrow
          : defaultSanctuaryFallback.eyebrow,
      title:
        typeof d.title === "string" && d.title.trim().length > 0
          ? d.title
          : defaultSanctuaryFallback.title,
      description:
        typeof d.description === "string" && d.description.trim().length > 0
          ? d.description
          : defaultSanctuaryFallback.description,
      value_pillars:
        Array.isArray(d.value_pillars) && d.value_pillars.length > 0
          ? d.value_pillars
          : defaultSanctuaryFallback.value_pillars,
      primary_cta_label:
        typeof d.primary_cta_label === "string" &&
        d.primary_cta_label.trim().length > 0
          ? d.primary_cta_label
          : defaultSanctuaryFallback.primary_cta_label,
      primary_cta_action:
        d.primary_cta_action || defaultSanctuaryFallback.primary_cta_action,
      primary_cta_url: d.primary_cta_url || "",
      secondary_cta_label:
        typeof d.secondary_cta_label === "string" &&
        d.secondary_cta_label.trim().length > 0
          ? d.secondary_cta_label
          : defaultSanctuaryFallback.secondary_cta_label,
      secondary_cta_url:
        d.secondary_cta_url || defaultSanctuaryFallback.secondary_cta_url,
      card_badge:
        typeof d.card_badge === "string"
          ? d.card_badge
          : defaultSanctuaryFallback.card_badge,
      card_title:
        typeof d.card_title === "string"
          ? d.card_title
          : defaultSanctuaryFallback.card_title,
      card_live_pill:
        typeof d.card_live_pill === "string"
          ? d.card_live_pill
          : defaultSanctuaryFallback.card_live_pill,
      location_text:
        typeof d.location_text === "string" && d.location_text.trim().length > 0
          ? d.location_text
          : defaultSanctuaryFallback.location_text,
      hours_text:
        typeof d.hours_text === "string" && d.hours_text.trim().length > 0
          ? d.hours_text
          : defaultSanctuaryFallback.hours_text,
      phone_text:
        typeof d.phone_text === "string" && d.phone_text.trim().length > 0
          ? d.phone_text
          : defaultSanctuaryFallback.phone_text,
      whatsapp_cta_label:
        typeof d.whatsapp_cta_label === "string"
          ? d.whatsapp_cta_label
          : defaultSanctuaryFallback.whatsapp_cta_label,
      whatsapp_url:
        typeof d.whatsapp_url === "string" && d.whatsapp_url.trim().length > 0
          ? d.whatsapp_url
          : defaultSanctuaryFallback.whatsapp_url,
      tour_cta_label:
        typeof d.tour_cta_label === "string"
          ? d.tour_cta_label
          : defaultSanctuaryFallback.tour_cta_label,
      tour_video_target:
        d.tour_video_target || defaultSanctuaryFallback.tour_video_target,
    };
  }
);

// ----------------- SEO Configs (apps.seo_config: SEOConfig & CategoryPageSEO) -----------------

export const getPageSEO = cache(async (page: string): Promise<PublicPageSEO | null> => {
  try {
    const origin = getBackendOrigin();
    const res = await fetch(`${origin}/api/v1/site-config/seo/${encodeURIComponent(page)}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
});

export const getCategorySEO = cache(async (category: string): Promise<PublicCategorySEO | null> => {
  try {
    const origin = getBackendOrigin();
    const res = await fetch(`${origin}/api/v1/site-config/category-seo/${encodeURIComponent(category)}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json || null;
  } catch {
    return null;
  }
});
export const getAllPageSEO = cache(async (): Promise<PublicPageSEO[]> => {
  try {
    const origin = getBackendOrigin();
    const res = await fetch(`${origin}/api/v1/site-config/seo/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data || json;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
});

export const getAllCategorySEO = cache(async (): Promise<PublicCategorySEO[]> => {
  try {
    const origin = getBackendOrigin();
    const res = await fetch(`${origin}/api/v1/site-config/category-seo/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data || json;
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
});

export function buildMetadataFromSEO(
  seo: PublicPageSEO | PublicCategorySEO | null,
  fallback: Metadata
): Metadata {
  if (!seo || seo.visibility === "HIDDEN") {
    return fallback;
  }

  const title = seo.meta_title || fallback.title || undefined;
  const description = seo.meta_description || fallback.description || undefined;
  const canonicalUrl = seo.canonical_url || fallback.alternates?.canonical || undefined;

  let robots = fallback.robots;
  if (seo.robots) {
    const isNoIndex = seo.robots.includes("noindex");
    const isNoFollow = seo.robots.includes("nofollow");
    robots = {
      index: !isNoIndex,
      follow: !isNoFollow,
    };
  }

  const keywords = "meta_keywords" in seo && typeof seo.meta_keywords === "string" && seo.meta_keywords.trim()
    ? seo.meta_keywords.split(",").map((k) => k.trim())
    : fallback.keywords;

  const ogTitle = ("og_title" in seo && seo.og_title) || seo.meta_title || fallback.openGraph?.title;
  const ogDescription = ("og_description" in seo && seo.og_description) || seo.meta_description || fallback.openGraph?.description;
  const ogImage = ("og_image" in seo && seo.og_image) || ("feature_image" in seo && seo.feature_image) || undefined;
  const ogType = ("og_type" in seo && seo.og_type === "article" ? "article" : "website") as "website" | "article";
  const ogSiteName = ("og_site_name" in seo && seo.og_site_name) || "DREAM CAR HOUSE";

  const twitterTitle = ("twitter_title" in seo && seo.twitter_title) || seo.meta_title || fallback.twitter?.title;
  const twitterDescription = ("twitter_description" in seo && seo.twitter_description) || seo.meta_description || fallback.twitter?.description;
  const twitterImage = ("twitter_image" in seo && seo.twitter_image) || ogImage;

  return {
    ...fallback,
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl as string,
    },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl as string,
      siteName: ogSiteName,
      type: ogType,
      images: ogImage ? [{ url: ogImage, alt: ("feature_image_alt" in seo && seo.feature_image_alt) || "" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}
