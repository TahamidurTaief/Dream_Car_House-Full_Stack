"use client";

import React, { useState, useMemo, useEffect, useRef, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Vehicle } from "@/lib/showroomData";
import {
  PublicShowroomBranch,
  PublicInventoryFilterOptions,
  PublicSiteSettings,
} from "@/lib/types";
import { useUI } from "@/lib/UIContext";

interface InventoryClientProps {
  initialVehicles: Vehicle[];
  totalRows?: number;
  totalPages?: number;
  currentPage?: number;
  filterOptions?: PublicInventoryFilterOptions;
  branches?: PublicShowroomBranch[];
  settings?: PublicSiteSettings;
  initialParams?: {
    brand?: string;
    type?: string;
    branch?: string;
    body_style?: string;
    q?: string;
  };
}

function InventoryContent({
  initialVehicles = [],
  totalRows = 0,
  totalPages = 1,
  currentPage = 1,
  filterOptions,
  branches = [],
  settings,
  initialParams,
}: InventoryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openCarModal } = useUI();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialParams?.q || "");
  const [selectedBrand, setSelectedBrand] = useState(initialParams?.brand || "all");
  const [selectedType, setSelectedType] = useState(initialParams?.type || "all");
  const [selectedBranch, setSelectedBranch] = useState(initialParams?.branch || "all");
  const [selectedBodyStyle, setSelectedBodyStyle] = useState(initialParams?.body_style || "all");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with URL parameters on browser navigation (Back/Forward)
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const typeParam = searchParams.get("type");
    const branchParam = searchParams.get("branch");
    const bodyStyleParam = searchParams.get("body_style");
    const qParam = searchParams.get("q");

    setSelectedBrand(brandParam || "all");
    setSelectedType(typeParam || "all");
    setSelectedBranch(branchParam || "all");
    setSelectedBodyStyle(bodyStyleParam || "all");
    setQuery(qParam || "");
  }, [searchParams]);

  // Compute available brands dynamically
  const availableBrands = useMemo(() => {
    if (filterOptions?.brands && filterOptions.brands.length > 0) {
      return filterOptions.brands.map((b) => b.name);
    }
    const set = new Set<string>();
    initialVehicles.forEach((car) => {
      if (car.brand) set.add(car.brand);
    });
    return Array.from(set).sort();
  }, [filterOptions, initialVehicles]);

  // Compute available body styles dynamically
  const availableBodyStyles = useMemo(() => {
    if (filterOptions?.bodyStyles && filterOptions.bodyStyles.length > 0) {
      return filterOptions.bodyStyles.map((b) => b.body);
    }
    const set = new Set<string>();
    initialVehicles.forEach((car) => {
      if (car.body_style) set.add(car.body_style);
    });
    return Array.from(set).sort();
  }, [filterOptions, initialVehicles]);

  // Update URL search parameters smoothly
  const applyFilters = (updates: Record<string, string>, resetPage = true) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || !value.trim()) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    if (resetPage) {
      nextParams.delete("page");
    }

    const nextUrl = nextParams.toString() ? `/inventory?${nextParams.toString()}` : "/inventory";
    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  // Debounced search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setQuery(nextVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      applyFilters({ q: nextVal }, true);
    }, 350);
  };

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    if (targetPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(targetPage));
    }

    const nextUrl = nextParams.toString() ? `/inventory?${nextParams.toString()}` : "/inventory";
    startTransition(() => {
      router.push(nextUrl, { scroll: true });
    });

    // Smooth scroll to inventory header
    if (typeof window !== "undefined") {
      const el = document.getElementById("view-inventory");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const resetAllFilters = () => {
    setQuery("");
    setSelectedBrand("all");
    setSelectedType("all");
    setSelectedBranch("all");
    setSelectedBodyStyle("all");
    startTransition(() => {
      router.push("/inventory", { scroll: false });
    });
  };

  // Instant client-side responsiveness combined with SSR
  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter((car) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesQuery =
          (car.name || "").toLowerCase().includes(q) ||
          (car.brand || "").toLowerCase().includes(q) ||
          (car.model || "").toLowerCase().includes(q) ||
          String(car.year || "").includes(q);
        if (!matchesQuery) return false;
      }

      // Brand filter
      if (selectedBrand !== "all") {
        if ((car.brand || "").toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Type filter
      if (selectedType !== "all") {
        if (car.car_type !== selectedType) return false;
      }

      // Branch filter
      if (selectedBranch !== "all") {
        const carBranchId = car.branch_id || car.branch?.branch_id;
        if (carBranchId !== selectedBranch) return false;
      }

      // Body Style filter
      if (selectedBodyStyle !== "all") {
        if ((car.body_style || "").toLowerCase() !== selectedBodyStyle.toLowerCase()) return false;
      }

      return true;
    });
  }, [initialVehicles, query, selectedBrand, selectedType, selectedBranch, selectedBodyStyle]);

  // Construct dynamic showroom branches string
  const branchesDescription = useMemo(() => {
    if (branches.length === 0) return "our flagship showrooms in Dhaka";
    const names = branches.map((b) => b.short_name || b.name);
    if (names.length === 1) return `our ${names[0]} showroom`;
    return `our ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} showrooms`;
  }, [branches]);

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedBrand !== "all" ||
    selectedType !== "all" ||
    selectedBranch !== "all" ||
    selectedBodyStyle !== "all";

  return (
    <div id="view-inventory" className="inventory-page-wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          Curated Luxury Automobiles
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Browse our complete collection of verified luxury vehicles across {branchesDescription}.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="cars-filter-row">
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <input
            type="text"
            id="cars-search-input"
            value={query}
            onChange={handleSearchChange}
            className="cars-search-input"
            style={{ width: "100%", paddingRight: query ? "2.2rem" : "1.25rem" }}
            placeholder="Search brand, model, or year (e.g. Mercedes, Land Cruiser, 2024)..."
            aria-label="Search luxury inventory"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                applyFilters({ q: "" }, true);
              }}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "1rem",
                padding: "4px",
              }}
              title="Clear search"
              aria-label="Clear search text"
            >
              ✕
            </button>
          ) : null}
        </div>

        {/* Brand Dropdown */}
        <select
          id="cars-filter-brand"
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            applyFilters({ brand: e.target.value }, true);
          }}
          className="filter-select"
          aria-label="Filter by Brand"
        >
          <option value="all">All Brands ({availableBrands.length})</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Condition / Car Type Dropdown */}
        <select
          id="cars-filter-type"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            applyFilters({ type: e.target.value }, true);
          }}
          className="filter-select"
          aria-label="Filter by Vehicle Condition"
        >
          <option value="all">All Conditions</option>
          <option value="BRAND_NEW">Brand New</option>
          <option value="PRE_OWNED">Certified Pre-Owned</option>
        </select>

        {/* Showroom Branch Dropdown */}
        <select
          id="cars-filter-branch"
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
            applyFilters({ branch: e.target.value }, true);
          }}
          className="filter-select"
          aria-label="Filter by Showroom Branch"
        >
          <option value="all">All Showrooms ({branches.length})</option>
          {branches.map((b) => (
            <option key={b.id} value={b.branch_id}>
              {b.short_name || b.name}
            </option>
          ))}
        </select>

        {/* Body Style Dropdown (if available in backend data) */}
        {availableBodyStyles.length > 0 && (
          <select
            id="cars-filter-body"
            value={selectedBodyStyle}
            onChange={(e) => {
              setSelectedBodyStyle(e.target.value);
              applyFilters({ body_style: e.target.value }, true);
            }}
            className="filter-select"
            aria-label="Filter by Body Style"
          >
            <option value="all">All Body Styles</option>
            {availableBodyStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        )}

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="hero-pill-btn"
            style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Active Filter Chips & Counter Bar */}
      <div className="inventory-stats-bar">
        <div className="inventory-count-text">
          Showing{" "}
          <span className="inventory-count-highlight">
            {filteredVehicles.length}
          </span>{" "}
          {totalRows > 0 ? (
            <>
              of <span className="inventory-count-highlight">{totalRows}</span> Luxury Vehicles
            </>
          ) : (
            "Luxury Vehicles"
          )}
          {isPending && <span style={{ marginLeft: "0.5rem", color: "#60a5fa" }}>• Updating...</span>}
        </div>

        {hasActiveFilters && (
          <div className="inventory-active-chips">
            {query.trim() && (
              <span
                className="inventory-filter-chip"
                onClick={() => {
                  setQuery("");
                  applyFilters({ q: "" }, true);
                }}
                title="Remove keyword filter"
              >
                Keyword: &quot;{query}&quot; ✕
              </span>
            )}
            {selectedBrand !== "all" && (
              <span
                className="inventory-filter-chip"
                onClick={() => {
                  setSelectedBrand("all");
                  applyFilters({ brand: "all" }, true);
                }}
                title="Remove brand filter"
              >
                Brand: {selectedBrand} ✕
              </span>
            )}
            {selectedType !== "all" && (
              <span
                className="inventory-filter-chip"
                onClick={() => {
                  setSelectedType("all");
                  applyFilters({ type: "all" }, true);
                }}
                title="Remove type filter"
              >
                Type: {selectedType === "BRAND_NEW" ? "Brand New" : "Certified Pre-Owned"} ✕
              </span>
            )}
            {selectedBranch !== "all" && (
              <span
                className="inventory-filter-chip"
                onClick={() => {
                  setSelectedBranch("all");
                  applyFilters({ branch: "all" }, true);
                }}
                title="Remove branch filter"
              >
                Showroom: {branches.find((b) => b.branch_id === selectedBranch)?.short_name || selectedBranch} ✕
              </span>
            )}
            {selectedBodyStyle !== "all" && (
              <span
                className="inventory-filter-chip"
                onClick={() => {
                  setSelectedBodyStyle("all");
                  applyFilters({ body_style: "all" }, true);
                }}
                title="Remove body style filter"
              >
                Body: {selectedBodyStyle} ✕
              </span>
            )}
            <button
              type="button"
              onClick={resetAllFilters}
              style={{
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                fontSize: "0.8rem",
                textDecoration: "underline",
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Luxury Cars Grid */}
      <div id="inventory-grid" className="cars-grid-layout">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((car) => {
            const isBrandNew = car.car_type === "BRAND_NEW";
            const branchLabel = car.branch_name || car.branch?.short_name || car.branch?.name || "";

            // Dynamic WhatsApp URL
            const targetPhone = car.branch?.hotline || car.branch?.phone || settings?.whatsapp || settings?.hotline || "";
            let waPhone = targetPhone.replace(/[^0-9]/g, "");
            if (waPhone.startsWith("0")) {
              waPhone = "88" + waPhone;
            } else if (waPhone && !waPhone.startsWith("880") && waPhone.length === 10) {
              waPhone = "880" + waPhone;
            }
            const waMessage = encodeURIComponent(
              `Hello ${settings?.name || "DREAM CAR HOUSE"}, I am inquiring about the ${car.name} (${car.year}) priced at ${car.price || "Call for Price"}.`
            );
            const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${waMessage}` : "";

            return (
              <div
                key={car.id}
                className="pref-car-card group inventory-card-box"
                onClick={() => openCarModal(car)}
                style={{ cursor: "pointer" }}
              >
                <div className="pref-car-img-wrap">
                  <img
                    src={car.image}
                    alt={`${car.name} (${car.year})`}
                    loading="lazy"
                    className="pref-car-img"
                  />
                  <span
                    className={`pref-car-badge ${
                      isBrandNew ? "pref-badge-brandnew" : "pref-badge-preowned"
                    }`}
                  >
                    {isBrandNew ? "Brand New" : "Certified Pre-Owned"}
                  </span>
                  {branchLabel && (
                    <span className="card-branch-pill">
                      {branchLabel}
                    </span>
                  )}
                </div>

                <div className="pref-car-body">
                  <div className="pref-car-meta">
                    {car.brand} • {car.year} {car.condition ? `• ${car.condition}` : ""}
                  </div>
                  <h3 className="pref-car-title">{car.name}</h3>

                  <div className="pref-specs-row">
                    <div className="pref-spec-item">
                      <span className="pref-spec-label">Engine</span>
                      <span className="pref-spec-val">{car.engine_capacity}</span>
                    </div>
                    <div className="pref-spec-item">
                      <span className="pref-spec-label">Mileage</span>
                      <span className="pref-spec-val">{car.mileage}</span>
                    </div>
                    <div className="pref-spec-item">
                      <span className="pref-spec-label">Fuel</span>
                      <span className="pref-spec-val">{car.fuel_type}</span>
                    </div>
                  </div>

                  {/* Highlighted Luxury Price Row */}
                  <div className="pref-price-container">
                    <span className="pref-price-label">Price</span>
                    <span className="pref-price-val">
                      {car.price || "Call for Price"}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="pref-action-row" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="pref-inspect-btn"
                      onClick={() => openCarModal(car)}
                      aria-label={`Inspect ${car.name}`}
                    >
                      Inspect Details
                    </button>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pref-wa-btn"
                        title="Inquire on WhatsApp"
                        aria-label="WhatsApp Concierge"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "5rem 1.5rem",
              background: "#0d0f14",
              borderRadius: "12px",
              border: "1px dashed #374151",
            }}
          >
            <h3
              style={{
                fontSize: "1.35rem",
                color: "#fff",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              No luxury vehicles match your criteria
            </h3>
            <p style={{ color: "#9ca3af", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
              We could not find any available vehicles matching your current selection. Try resetting
              your filters or exploring our other branches.
            </p>
            <button
              type="button"
              className="hero-pill-btn"
              onClick={resetAllFilters}
              style={{ margin: "0 auto", display: "inline-block" }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Luxury Pagination Controls */}
      {totalPages > 1 && (
        <div className="inventory-pagination-wrap">
          <nav className="inventory-pagination" aria-label="Inventory pagination">
            <button
              type="button"
              className="inv-page-btn inv-page-nav-btn"
              disabled={currentPage <= 1 || isPending}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous Page"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`inv-page-btn ${p === currentPage ? "active" : ""}`}
                disabled={isPending}
                onClick={() => handlePageChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className="inv-page-btn inv-page-nav-btn"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next Page"
            >
              Next →
            </button>
          </nav>
          <div className="inventory-page-indicator">
            Page {currentPage} of {totalPages} • Total {totalRows} luxury vehicles
          </div>
        </div>
      )}
    </div>
  );
}

export default function InventoryClient(props: InventoryClientProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "8rem 1.5rem", textAlign: "center", color: "#9ca3af" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          Loading curated luxury inventory...
        </div>
      }
    >
      <InventoryContent {...props} />
    </Suspense>
  );
}
