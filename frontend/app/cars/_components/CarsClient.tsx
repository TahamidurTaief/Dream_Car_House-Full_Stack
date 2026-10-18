"use client";

import VehicleCard from "@/components/ui/VehicleCard";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PriceRangeFilter from "./PriceRangeFilter";
import { BodyStyleType, BrandType, ModelType } from "./types";
import SearchBar from "@/components/ui/searchbar";

/* -----------------------
   Types
   ----------------------- */
interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  engine_capacity: string;
  fuel_type: string;
  mileage: string;
  price: string | number;
  feature_image: string | null;
  body_style?: number;
  car_type?: string;
  registered: string;
  availability?: string;
  slug?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    total_page: number;
    current_page: number;
    pagesize: number;
    total_rows: number;
    next: string | null;
    previous: string | null;
    results: Car[];
  };
}

interface Config {
  title: string;
  heading: string;
  linkurl: string;
  description: string;
  bannerImage: string;
  baseApiParams: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  /** Availability filter selected on first load, absent a URL override.
   * Defaults to "Available". Only the brand listing page sets this to ""
   * (no filter) so sold cars show too, sorted to the bottom by the API. */
  defaultAvailability?: string;
}

interface CarsClientProps {
  config: Config;
  brands: Array<BrandType>;
  models: Array<ModelType>;
  bodyStyles: Array<BodyStyleType>;
  model_names?: string[]; // kept for backward compat, unused
  colors?: string[];
  initialCars?: Car[];
  initialTotalPages?: number;
}

/* -----------------------
   Utility helpers
   ----------------------- */



/* -----------------------
   BYD banner slides config
   ----------------------- */
const BYD_BANNER_SLIDES = [
  {
    heading: "Looking for <br />Reconditioned Unit?",
    linkurl: "/cars/brand-new",
    bgImage: "/images/banner.png",
  },
  {
    heading: "Looking for <br />Pre-owned Unit?",
    linkurl: "/cars/pre-owned",
    bgImage: "/images/banner.png",
  },
] as const;

/* -----------------------
   Component start
   ----------------------- */
export default function CarsClient({
  config,
  brands,
  models,
  bodyStyles,
  colors = [],
  initialCars,
  initialTotalPages,
}: CarsClientProps) {
  // constants
  const availabilities = useMemo(() => ["Available", "Sold", "Booked", "Pre-Order"], []);
  const colorOptions = useMemo(() => {
    return (colors || [])
      .map((color) => color.trim())
      .filter((color) => color.length > 0);
  }, [colors]);
  const isBYDPage = config.baseApiParams.brand === "BYD";

  // BYD banner slider state
  const [activeBydSlide, setActiveBydSlide] = useState(0);
  useEffect(() => {
    if (!isBYDPage) return;
    const interval = setInterval(() => {
      setActiveBydSlide((prev) => (prev + 1) % BYD_BANNER_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isBYDPage]);

  // pagination constants
  const carsPerPage = 12;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* -----------------------
     Component State
     - combine related data into grouped states where sensible
     ----------------------- */
  const [carsData, setCarsData] = useState<{ cars: Car[]; totalPages: number }>(
    {
      cars: initialCars ?? [],
      totalPages: initialTotalPages ?? 1,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filter/search/pagination states
  const [search, setSearch] = useState<string>(
    () => searchParams.get("q") ?? ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(
    () => searchParams.get("q") ?? ""
  ); // applied search
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    () => searchParams.get("brand_id") ?? ""
  );
  const [selectedModelId, setSelectedModelId] = useState<string>(
    () => searchParams.get("model_id") ?? ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    () => searchParams.get("color") ?? ""
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    () => searchParams.get("year") ?? ""
  );
  const [selectedEngineCapacity, setSelectedEngineCapacity] = useState<string>(
    () => searchParams.get("engine_capacity") ?? ""
  );
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<string>(
    () => searchParams.get("body_style") ?? ""
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(
    () => searchParams.get("price_range") ?? ""
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string>(
    () => searchParams.get("availability") ?? (config.defaultAvailability ?? "Available")
  );

  const [currentPage, setCurrentPage] = useState<number>(
    () => Number(searchParams.get("page") ?? "1")
  );

  // refs
  const mountedRef = useRef(true);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* -----------------------
     Debounce search input (600ms)
     - sets debouncedSearch which triggers main fetch effect
     ----------------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 600);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (!isBYDPage && selectedBrandId) params.set("brand_id", selectedBrandId);
    if (selectedModelId) params.set("model_id", selectedModelId);
    if (isBYDPage && selectedColor) params.set("color", selectedColor);
    if (selectedYear) params.set("year", selectedYear);
    if (selectedEngineCapacity)
      params.set("engine_capacity", selectedEngineCapacity);
    if (selectedBodyStyle) params.set("body_style", selectedBodyStyle);
    if (selectedPriceRange) params.set("price_range", selectedPriceRange);
    if (
      selectedAvailability &&
      selectedAvailability !== (config.defaultAvailability ?? "Available")
    )
      params.set("availability", selectedAvailability);
    if (currentPage > 1) params.set("page", String(currentPage));

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  }, [
    debouncedSearch,
    selectedBrandId,
    selectedModelId,
    selectedColor,
    selectedYear,
    selectedEngineCapacity,
    selectedBodyStyle,
    selectedPriceRange,
    selectedAvailability,
    currentPage,
    isBYDPage,
    pathname,
    router,
    config.defaultAvailability,
  ]);

  /* -----------------------
     Handlers (memoized)
     ----------------------- */
  const resetFilters = useCallback(() => {
    setSelectedBrandId("");
    setSelectedModelId("");
    setSelectedColor("");
    setSelectedYear("");
    setSelectedEngineCapacity("");
    setSelectedBodyStyle("");
    setSelectedPriceRange("");
    setSelectedAvailability(config.defaultAvailability ?? "Available");
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
    router.replace(pathname, { scroll: false });
  }, [router, pathname, config.defaultAvailability]);

  const applyFilters = useCallback(() => {
    setCurrentPage(1);
    setShowMobileFilters(false);
    // debouncedSearch already used, so no extra action needed
  }, []);

  /* -----------------------
     buildApiUrl memoized
     - memoize based on deps so we don't rebuild unnecessarily
     ----------------------- */
  const buildApiUrl = useCallback(
    (page = 1) => {
      const baseUrl = `/api/v1/inventory/`;
      const params = new URLSearchParams();

      // pagination
      params.append("limit", String(carsPerPage));
      params.append("offset", String((page - 1) * carsPerPage));

      // base params for car type
      Object.entries(config.baseApiParams || {}).forEach(([k, v]) => {
        if (v != null && v !== "") params.append(k, v);
      });

      if (isBYDPage) params.set("brand", "BYD");

      if (debouncedSearch) params.append("q", debouncedSearch);
      if (!isBYDPage && selectedBrandId) params.append("brand_id", selectedBrandId);
      if (selectedModelId) params.append("model_id", selectedModelId);
      if (isBYDPage && selectedColor) params.append("color", selectedColor);
      if (selectedYear) params.append("year", selectedYear);
      if (selectedEngineCapacity)
        params.append("engine_capacity", selectedEngineCapacity);
      if (selectedBodyStyle) params.append("body_style", selectedBodyStyle);

      // price range logic
      if (selectedPriceRange) {
        if (selectedPriceRange === "under-1000000") {
          params.append("price_max", "1000000");
        } else if (selectedPriceRange === "3000000-plus") {
          params.append("price_min", "3000000");
        } else if (selectedPriceRange.includes("-")) {
          const [min, max] = selectedPriceRange.split("-");
          if (min && min !== "0") params.append("price_min", min);
          if (max && max !== "5000000") params.append("price_max", max);
        } else if (selectedPriceRange === "1000000-2000000") {
          params.append("price_min", "1000000");
          params.append("price_max", "2000000");
        } else if (selectedPriceRange === "2000000-3000000") {
          params.append("price_min", "2000000");
          params.append("price_max", "3000000");
        }
      }

      if (selectedAvailability === "Available") {
          params.append("registered", "Available,Pre-Order");
      } else if (selectedAvailability) {
          params.append("registered", selectedAvailability);
      }

      return `${baseUrl}?${params.toString()}`;
    },
    [
      carsPerPage,
      config.baseApiParams,
      debouncedSearch,
      selectedBrandId,
      selectedModelId,
      selectedColor,
      selectedYear,
      selectedEngineCapacity,
      selectedBodyStyle,
      selectedPriceRange,
      selectedAvailability,
      isBYDPage,
    ]
  );

  /* -----------------------
     Single effect to fetch data when any filter/pagination changes.
     - cancels stale requests using AbortController
     - groups state updates to reduce re-renders
     ----------------------- */
  useEffect(() => {
    // Build URL for current page
    const apiUrl = buildApiUrl(currentPage);
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    (async () => {
      if (isFirstLoad.current && (initialCars?.length ?? 0) > 0) {
        isFirstLoad.current = false;
        setLoading(false);
        return;
      }
      isFirstLoad.current = false;
      try {
        const res = await fetch(apiUrl, { signal: controller.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `${res.status} ${res.statusText}`);
        }
        const data: ApiResponse = await res.json();

        if (!mountedRef.current) return; // component unmounted

        if (data?.success && data.data) {
          setCarsData({
            cars: data.data.results || [],
            totalPages: Math.max(1, data.data.total_page || 1),
          });
        } else {
          setCarsData({ cars: [], totalPages: 1 });
          setError(data?.message || "Failed to fetch cars data");
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        if (err instanceof Error) {
          console.error("Error fetching cars:", err.message);
          setError(err.message);
        } else {
          console.error("Unknown error fetching cars:", err);
          setError("An error occurred while fetching cars");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    // cleanup on deps change
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    buildApiUrl,
    currentPage,
    // buildApiUrl already includes all other deps (debouncedSearch, filters)
  ]);

  /* -----------------------
     Pagination helper
     ----------------------- */
  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    // scroll to top of list on page change
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  /* -----------------------
     Memoized option lists to avoid re-creating arrays/JSX repeatedly
     ----------------------- */
  const brandOptions = useMemo(
    () => brands.map((b) => ({ key: b.id, label: b.name, value: String(b.id) })),
    [brands]
  );
  const modelOptions = useMemo(
    () => models.map((m) => ({ key: m.id, label: m.model, value: String(m.id) })),
    [models]
  );
  const bodyStyleOptions = useMemo(
    () => bodyStyles.map((b) => ({ key: b.id, label: b.body, value: String(b.id) })),
    [bodyStyles]
  );
  const modelDropdownOptions = modelOptions;
  const modelDropdownValue = selectedModelId;


  /* -----------------------
     Render
     ----------------------- */
  const { cars, totalPages } = carsData;
  return (
    <div className="dream-listing-layout flex flex-col md:flex-row gap-8 relative min-h-screen">
      {/* Left column (filters) */}
      <div className="w-full md:w-[21.2%]">
        <>
          {/* Mobile top controls */}
          <div className="md:hidden grid grid-cols-1 w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDebouncedSearch(search.trim());
              }}
            >
              <SearchBar query={search} setQuery={setSearch} />
            </form>
            <div className="flex justify-center mb-4 mt-5">
              <button
                className="w-full bg-page border border-line text-ink py-2 rounded hover:bg-panel transition flex items-center justify-center gap-2"
                onClick={() => setShowMobileFilters((s) => !s)}
                aria-expanded={showMobileFilters}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {showMobileFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          <div className={`${showMobileFilters ? "block" : "hidden md:block"}`}>
            <div className="dream-filter-panel md:sticky md:top-24 md:mb-15 relative z-50">
              {/* Desktop search */}
              <form
                className="max-md:hidden sm:mb-7"
                onSubmit={(e) => e.preventDefault()}
              >
                <SearchBar query={search} setQuery={setSearch} />
              </form>

              <h2 className="text-xl font-bold mb-4">Filter</h2>

              <div className="relative z-50">
                <PriceRangeFilter
                  selectedPriceRange={selectedPriceRange}
                  onPriceRangeChange={setSelectedPriceRange}
                />
              </div>

              {/* Brand */}
              {!isBYDPage && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="brand">
                    Brand
                  </label>
                  {brandOptions.length > 0 ? (
                    <div className="relative">
                      <select
                        id="brand"
                        className="w-full p-2 bg-page border border-line rounded appearance-none"
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                      >
                        <option value="">All Brands</option>
                        {brandOptions.map((b) => (
                          <option key={b.key} value={String(b.key)}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted text-sm">No brands available</p>
                  )}
                </div>
              )}

              {/* Model */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="modelGeneration"
                >
                  {isBYDPage ? "BYD Model" : "Model Generation"}
                </label>
                {modelDropdownOptions.length > 0 ? (
                  <div className="relative">
                    <select
                      id="modelGeneration"
                      className="w-full p-2 bg-page border border-line rounded appearance-none"
                      value={modelDropdownValue}
                      onChange={(e) => setSelectedModelId(e.target.value)}
                    >
                      <option value="">{isBYDPage ? "All BYD Models" : "All Models"}</option>
                      {modelDropdownOptions.map((m) => (
                        <option key={m.key} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted text-sm">No models available</p>
                )}
              </div>

              {/* Colors - BYD only */}
              {isBYDPage && colorOptions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="color">
                  Colors
                </label>
                <div className="relative">
                  <select
                    id="color"
                    className="w-full p-2 bg-page border border-line rounded appearance-none"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    <option value="">All Colors</option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              )}

              {/* Availability */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="availability"
                >
                  Availability
                </label>
                <div className="relative">
                  <select
                    id="availability"
                    className="w-full p-2 bg-page border border-line rounded appearance-none"
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                  >
                    <option value="">All</option>
                    {availabilities.map((av) => (
                      <option key={av} value={av}>
                        {av}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Body Style */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  htmlFor="body_style"
                >
                  Body Style
                </label>
                {bodyStyleOptions.length > 0 ? (
                  <div className="relative">
                    <select
                      id="body_style"
                      className="w-full p-2 bg-page border border-line rounded appearance-none"
                      value={selectedBodyStyle}
                      onChange={(e) => setSelectedBodyStyle(e.target.value)}
                    >
                      <option value="">All Body style</option>
                      {bodyStyleOptions.map((s) => (
                        <option key={s.key} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted text-sm">No body styles available</p>
                )}
              </div>

              <div className="md:hidden flex gap-2">
                <button
                  className="flex-1 bg-soft border border-line text-ink py-2 rounded hover:bg-soft transition"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-accent text-ink py-2 rounded hover:bg-accent-hover transition"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>

              <button
                className="w-full bg-page border border-line text-ink py-2 rounded hover:bg-panel transition mt-4"
                onClick={resetFilters}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </>
      </div>

      {/* Right column (listings) */}
      <div className="w-full md:w-4/5">
        {/* Banner – single poster or BYD slider */}
        <div className="container mx-auto mb-8">
          {isBYDPage ? (
            <div className="relative overflow-hidden rounded-[5px]">
              {BYD_BANNER_SLIDES.map((slide, index) => (
                <Link
                  key={index}
                  href={slide.linkurl}
                  className={`block transition-opacity duration-700 ${
                    index === activeBydSlide
                      ? "opacity-100"
                      : "absolute inset-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div
                    className="relative bg-cover bg-no-repeat bg-center h-20 md:h-28 lg:h-35 w-full cursor-pointer"
                    style={{ backgroundImage: `url('${slide.bgImage}')` }}
                  >
                    <div className="dream-media absolute inset-0 bg-black/50 flex items-end p-3 md:p-5">
                      <div className="flex items-center justify-between w-full text-ink">
                        <div className="group">
                          <h2
                            className="text-xl md:text-3xl font-semibold mb-2 transition-all duration-300 group-hover:translate-x-1"
                            dangerouslySetInnerHTML={{ __html: slide.heading }}
                          />
                        </div>
                        <svg
                          className="w-8 h-8 text-gray-700 rounded-[4px] bg-white p-1 ml-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {/* Dot indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {BYD_BANNER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Slide ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeBydSlide ? "bg-white" : "bg-white/40"
                    }`}
                    onClick={() => setActiveBydSlide(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Link href={config.linkurl}>
              <div
                className="relative bg-cover bg-no-repeat bg-center h-20 md:h-28 lg:h-35 w-full cursor-pointer rounded-[5px]"
                style={{ backgroundImage: `url('${config.bannerImage}')` }}
              >
                <div className="dream-media absolute inset-0 bg-black/50 flex items-end p-3 md:p-5">
                  <div className="flex items-center justify-between w-full text-ink">
                    <div className="group">
                      <h2
                        className="text-xl md:text-3xl font-semibold mb-2 transition-all duration-300 group-hover:translate-x-1"
                        dangerouslySetInnerHTML={{ __html: config.heading }}
                      />
                    </div>
                    <svg
                      className="w-8 h-8 text-gray-700 rounded-[4px] bg-white p-1 ml-4 group-hover:translate-x-1 transition-transform duration-200"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Loading / Error / Empty */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted">Loading cars...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p className="text-xl">{error}</p>
            <button
              className="mt-4 bg-soft text-ink px-4 py-2 rounded hover:bg-soft"
              onClick={() => {
                setCurrentPage(1); /* triggers effect */
              }}
            >
              Try Again
            </button>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted">
              No cars found matching your filters.
            </p>
            <button
              className="mt-4 bg-soft text-ink px-4 py-2 rounded hover:bg-soft"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="dream-listing-grid">
              {cars.map((car) => <VehicleCard key={car.id} car={car} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 mb-8 flex justify-between items-center">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 text-ink hover:text-ink"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    if (pageNum < 1 || pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          currentPage === pageNum
                            ? "bg-soft text-ink"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-1 text-muted">...</span>
                      <button
                        onClick={() => paginate(totalPages)}
                        className="w-8 h-8 flex items-center justify-center rounded text-muted hover:text-ink"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 text-muted hover:text-ink"
                >
                  <span>Next</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
