"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VEHICLE_DATA, Vehicle, SHOWROOM_BRANCHES } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

function InventoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openCarModal } = useUI();

  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");

  // Sync with URL parameters on initial load
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const typeParam = searchParams.get("type");
    const branchParam = searchParams.get("branch");
    const qParam = searchParams.get("q");

    if (brandParam) setSelectedBrand(brandParam);
    if (typeParam) setSelectedType(typeParam);
    if (branchParam) setSelectedBranch(branchParam);
    if (qParam) setQuery(qParam);
  }, [searchParams]);

  const filteredVehicles = useMemo(() => {
    return VEHICLE_DATA.filter((car) => {
      // Text search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesQuery =
          car.name.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.year.toString().includes(q);
        if (!matchesQuery) return false;
      }

      // Brand filter
      if (selectedBrand !== "all") {
        if (car.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Type filter
      if (selectedType !== "all") {
        if (car.car_type !== selectedType) return false;
      }

      // Branch filter
      if (selectedBranch !== "all") {
        if (car.branch_id !== selectedBranch) return false;
      }

      return true;
    });
  }, [query, selectedBrand, selectedType, selectedBranch]);

  const resetFilters = () => {
    setQuery("");
    setSelectedBrand("all");
    setSelectedType("all");
    setSelectedBranch("all");
    router.push("/inventory");
  };

  return (
    <div
      id="view-inventory"
      className="inventory-page-wrap max-w-7xl"
    >
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
          onChange={(e) => setQuery(e.target.value)}
          className="cars-search-input"
          placeholder="Search by brand or model (e.g. Mercedes, Land Cruiser, BMW)..."
        />

        <select
          id="cars-filter-brand"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Brands</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="BMW">BMW</option>
          <option value="Lexus">Lexus</option>
          <option value="Toyota">Toyota</option>
          <option value="Audi">Audi</option>
          <option value="Porsche">Porsche</option>
          <option value="Land Rover">Land Rover</option>
          <option value="BYD">BYD</option>
          <option value="Nissan">Nissan</option>
          <option value="Volvo">Volvo</option>
        </select>

        <select
          id="cars-filter-type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="BRAND_NEW">Brand New</option>
          <option value="PRE_OWNED">Pre-Owned</option>
        </select>

        <select
          id="cars-filter-branch"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Showroom Branches</option>
          <option value="kakrail">Kakrail Branch (18, Monsur Ali Soroni)</option>
          <option value="gulshan">Gulshan Branch (House #07, Road #127)</option>
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
            const branch =
              SHOWROOM_BRANCHES[car.branch_id] || SHOWROOM_BRANCHES.kakrail;
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
                  <span className="card-branch-tag">{branch.short_name}</span>
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

export default function InventoryClient() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "8rem 1.5rem", textAlign: "center", color: "#9ca3af" }}>
          Loading inventory directory...
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
