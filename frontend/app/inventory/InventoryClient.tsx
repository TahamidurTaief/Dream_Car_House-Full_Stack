"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VEHICLE_DATA, Vehicle } from "@/lib/showroomData";
import VehicleCard from "@/components/VehicleCard";

function InventoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
          car.year.toString().includes(q) ||
          car.engine_capacity.toLowerCase().includes(q);
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
    <div className="inventory-page-wrap max-w-7xl" style={{ padding: "8rem 1.5rem 5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
          OFFICIAL INVENTORY DIRECTORY
        </span>
        <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
          Complete Luxury Vehicle Inventory
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Browse all {VEHICLE_DATA.length} available luxury vehicles across our Kakrail and Gulshan showrooms in Dhaka.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="cars-filter-row" style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginBottom: "2.5rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="cars-search-input"
          placeholder="Search by brand or model (e.g. Mercedes, Land Cruiser, BMW)..."
          style={{ flex: "1 1 240px", minWidth: "220px" }}
        />

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="filter-select"
          style={{ flex: "1 1 140px" }}
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="filter-select"
          style={{ flex: "1 1 140px" }}
        >
          <option value="all">All Conditions</option>
          <option value="BRAND_NEW">Brand New</option>
          <option value="PRE_OWNED">Certified Pre-Owned</option>
        </select>

        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="filter-select"
          style={{ flex: "1 1 180px" }}
        >
          <option value="all">All Showroom Branches</option>
          <option value="kakrail">Kakrail Branch (18, Monsur Ali Soroni)</option>
          <option value="gulshan">Gulshan Branch (House #07, Road #127)</option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="hero-pill-btn"
          style={{ padding: "0.65rem 1.25rem", fontSize: "0.88rem", whiteSpace: "nowrap" }}
        >
          Reset Filters
        </button>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
          Showing <strong>{filteredVehicles.length}</strong> of {VEHICLE_DATA.length} luxury vehicles
        </span>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length > 0 ? (
        <div id="inventory-grid" className="cars-grid-layout">
          {filteredVehicles.map((car) => (
            <VehicleCard key={car.id} car={car} layout="grid" />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#0d0f12",
            border: "1px solid #1f2937",
            borderRadius: "8px",
            padding: "3rem 1.5rem",
            textAlign: "center",
          }}
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.5"
            style={{ margin: "0 auto 1rem", display: "block" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
            No Vehicles Match Your Search
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Try adjusting your search terms, clearing brand filters, or contacting our concierge for bespoke procurement.
          </p>
          <button type="button" onClick={resetFilters} className="consult-primary-btn" style={{ margin: "0 auto" }}>
            Reset All Filters
          </button>
        </div>
      )}
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
