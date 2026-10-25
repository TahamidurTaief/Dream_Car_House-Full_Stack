"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Vehicle } from "@/lib/showroomData";
import { PublicShowroomBranch, PublicInventoryFilterOptions } from "@/lib/types";
import { useUI } from "@/lib/UIContext";

interface InventoryClientProps {
  initialVehicles: Vehicle[];
  totalRows?: number;
  filterOptions?: PublicInventoryFilterOptions;
  branches?: PublicShowroomBranch[];
  initialParams?: {
    brand?: string;
    type?: string;
    branch?: string;
    q?: string;
  };
}

function InventoryContent({
  initialVehicles = [],
  filterOptions,
  branches = [],
  initialParams,
}: InventoryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openCarModal } = useUI();

  const [query, setQuery] = useState(initialParams?.q || "");
  const [selectedBrand, setSelectedBrand] = useState(initialParams?.brand || "all");
  const [selectedType, setSelectedType] = useState(initialParams?.type || "all");
  const [selectedBranch, setSelectedBranch] = useState(initialParams?.branch || "all");

  // Sync with URL parameters on browser navigation
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const typeParam = searchParams.get("type");
    const branchParam = searchParams.get("branch");
    const qParam = searchParams.get("q");

    if (brandParam !== null) setSelectedBrand(brandParam);
    if (typeParam !== null) setSelectedType(typeParam);
    if (branchParam !== null) setSelectedBranch(branchParam);
    if (qParam !== null) setQuery(qParam);
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

  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter((car) => {
      // Text search
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

      return true;
    });
  }, [initialVehicles, query, selectedBrand, selectedType, selectedBranch]);

  const updateFilters = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value.trim()) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    const nextUrl = nextParams.toString() ? `/inventory?${nextParams.toString()}` : "/inventory";
    router.replace(nextUrl, { scroll: false });
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedBrand("all");
    setSelectedType("all");
    setSelectedBranch("all");
    router.push("/inventory");
  };

  return (
    <div id="view-inventory" className="inventory-page-wrap max-w-7xl">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          Choose per your preference
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Browse all available luxury vehicles across our Kakrail and Gulshan showrooms.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="cars-filter-row">
        <input
          type="text"
          id="cars-search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateFilters("q", e.target.value);
          }}
          className="cars-search-input"
          placeholder="Search by brand or model (e.g. Mercedes, Land Cruiser, BMW)..."
        />

        <select
          id="cars-filter-brand"
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            updateFilters("brand", e.target.value);
          }}
          className="filter-select"
        >
          <option value="all">All Brands</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          id="cars-filter-type"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            updateFilters("type", e.target.value);
          }}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="BRAND_NEW">Brand New</option>
          <option value="PRE_OWNED">Pre-Owned</option>
        </select>

        <select
          id="cars-filter-branch"
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
            updateFilters("branch", e.target.value);
          }}
          className="filter-select"
        >
          <option value="all">All Showroom Branches</option>
          {branches.length > 0 ? (
            branches.map((b) => (
              <option key={b.id} value={b.branch_id}>
                {b.name}
              </option>
            ))
          ) : (
            <>
              <option value="kakrail">Kakrail Branch (18, Monsur Ali Soroni)</option>
              <option value="gulshan">Gulshan Branch (House #07, Road #127)</option>
            </>
          )}
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="hero-pill-btn"
          style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}
        >
          Reset Filters
        </button>
      </div>

      {/* Cars Grid */}
      <div id="inventory-grid" className="cars-grid-layout">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((car) => {
            const branchLabel =
              car.branch_name ||
              (car.branch_id === "gulshan" ? "Gulshan Branch" : "Kakrail Branch");
            return (
              <div
                key={car.id}
                className="group inventory-card-box"
                onClick={() => openCarModal(car)}
                style={{
                  background: "#0d0f12",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #1f2937",
                  cursor: "pointer",
                  transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <div
                  className="portrait-image-wrapper"
                  style={{ marginBottom: "0.5rem", position: "relative" }}
                >
                  <img src={car.image} alt={car.name} loading="lazy" />
                  <span className="card-branch-tag">{branchLabel}</span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  {car.brand} • {car.year}
                </div>
                <h3 className="card-car-title" style={{ marginBottom: "0.5rem" }}>
                  {car.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #1f2937",
                    paddingTop: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#e5e7eb",
                      fontWeight: 600,
                    }}
                  >
                    {car.mileage}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    {car.fuel_type}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                color: "#fff",
                marginBottom: "0.5rem",
              }}
            >
              No vehicles found
            </h3>
            <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
              Try resetting your filters or search keyword.
            </p>
            <button
              type="button"
              className="hero-pill-btn"
              onClick={resetFilters}
              style={{ margin: "0 auto", display: "inline-block" }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InventoryClient(props: InventoryClientProps) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "8rem 1.5rem", textAlign: "center", color: "#9ca3af" }}>
          Loading inventory directory...
        </div>
      }
    >
      <InventoryContent {...props} />
    </Suspense>
  );
}
