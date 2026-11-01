"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VEHICLE_DATA, Vehicle } from "@/lib/showroomData";
import {
  PublicPreferenceSection,
  PublicPreferenceHighlight,
} from "@/lib/types";
import VehicleCard from "./VehicleCard";

interface PreferenceSectionProps {
  vehicles?: Vehicle[];
  sectionData?: PublicPreferenceSection | null;
}

export default function PreferenceSection({
  vehicles = [],
  sectionData,
}: PreferenceSectionProps = {}) {
  // Use database categories if populated; else fallback to authentic defaults
  const hasDbCategories =
    sectionData?.categories && sectionData.categories.length > 0;
  const categories = sectionData?.categories || [];

  const [activeTabKey, setActiveTabKey] = useState<string>(
    hasDbCategories ? categories[0].category_key : "BRAND_NEW"
  );

  const allVehicles = vehicles && vehicles.length > 0 ? vehicles : VEHICLE_DATA;

  // Handling Fallback Tabs
  const [fallbackTab, setFallbackTab] = useState<"BRAND_NEW" | "PRE_OWNED">("BRAND_NEW");

  const brandNewCars = allVehicles.filter((c) => c.car_type === "BRAND_NEW");
  const preOwnedCars = allVehicles.filter((c) => c.car_type === "PRE_OWNED");

  if (hasDbCategories) {
    const currentCategory =
      categories.find((c) => c.category_key === activeTabKey) || categories[0];
    const currentList = allVehicles.filter((c) => c.car_type === activeTabKey);
    const showcaseCars = currentList.slice(0, 3);

    return (
      <section className="preference-section max-w-7xl">
        <div className="preference-header-wrap">
          <div>
            {sectionData?.badge && (
              <span
                className="preference-badge"
                style={{ marginBottom: "0.5rem", display: "inline-block" }}
              >
                {sectionData.badge}
              </span>
            )}
            <h2 className="section-h2" style={{ margin: 0 }}>
              {sectionData?.heading || "Choose per your preference"}
            </h2>
            {sectionData?.subtext && (
              <p className="preference-subtext" style={{ marginTop: "0.35rem" }}>
                {sectionData.subtext}
              </p>
            )}
          </div>

          <div className="segment-switcher" role="tablist">
            {categories.map((cat) => {
              const count = allVehicles.filter((c) => c.car_type === cat.category_key).length;
              const isActive = activeTabKey === cat.category_key;
              const idSuffix = cat.category_key.toLowerCase().replace(/_/g, "-");
              return (
                <button
                  key={cat.category_key}
                  id={`tab-${idSuffix}`}
                  className={`segment-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveTabKey(cat.category_key)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span className="segment-label">{cat.label}</span>
                  <span className="segment-count" id={`count-${idSuffix}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {currentCategory?.image && (
          <div
            className="preference-category-banner"
            style={{
              marginBottom: "1.5rem",
              borderRadius: "10px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <img
              src={currentCategory.image}
              alt={currentCategory.label}
              style={{
                width: "100%",
                maxHeight: "220px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        <div id="preference-highlights-bar" className="preference-highlights-bar">
          {currentCategory?.highlights && currentCategory.highlights.length > 0 ? (
            currentCategory.highlights.map((h: PublicPreferenceHighlight, i: number) => (
              <div key={i} className="highlight-pill-card">
                <div className="highlight-pill-accent"></div>
                <div className="highlight-pill-content">
                  <h4>{h.title}</h4>
                  <p>{h.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: "#9ca3af", fontSize: "0.85rem", padding: "0.5rem" }}>
              Official certified luxury specifications apply.
            </div>
          )}
        </div>

        <div id="preference-cars-grid" className="preference-showcase-grid">
          {showcaseCars.length > 0 ? (
            showcaseCars.map((car) => (
              <VehicleCard key={car.id} car={car} layout="grid" />
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem 1rem",
                color: "#9ca3af",
              }}
            >
              No vehicles currently listed in this category.
            </div>
          )}
        </div>

        <div className="preference-bottom-cta">
          <Link
            id="preference-view-all-btn"
            href={currentCategory?.cta_url || `/inventory?type=${activeTabKey}`}
            className="preference-all-link"
          >
            <span>
              {currentCategory?.cta_text
                ? `${currentCategory.cta_text} (${currentList.length} Units)`
                : `Explore All Collection (${currentList.length} Units)`}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    );
  }

  // Fallback: Authentic Tarik Dual Segment Switcher
  const currentList = fallbackTab === "BRAND_NEW" ? brandNewCars : preOwnedCars;
  const showcaseCars = currentList.slice(0, 3);

  return (
    <section className="preference-section max-w-7xl">
      <div className="preference-header-wrap">
        <div>
          <h2 className="section-h2" style={{ margin: 0 }}>
            Choose per your preference
          </h2>
        </div>

        <div className="segment-switcher" role="tablist">
          <button
            id="tab-brand-new"
            className={`segment-btn ${fallbackTab === "BRAND_NEW" ? "active" : ""}`}
            onClick={() => setFallbackTab("BRAND_NEW")}
            role="tab"
            aria-selected={fallbackTab === "BRAND_NEW"}
          >
            <span className="segment-label">Brand New & Reconditioned</span>
            <span className="segment-count" id="count-brand-new">
              {brandNewCars.length}
            </span>
          </button>
          <button
            id="tab-pre-owned"
            className={`segment-btn ${fallbackTab === "PRE_OWNED" ? "active" : ""}`}
            onClick={() => setFallbackTab("PRE_OWNED")}
            role="tab"
            aria-selected={fallbackTab === "PRE_OWNED"}
          >
            <span className="segment-label">Certified Pre-Owned</span>
            <span className="segment-count" id="count-pre-owned">
              {preOwnedCars.length}
            </span>
          </button>
        </div>
      </div>

      <div id="preference-highlights-bar" className="preference-highlights-bar">
        {fallbackTab === "BRAND_NEW" ? (
          <>
            <div className="highlight-pill-card">
              <div className="highlight-pill-accent"></div>
              <div className="highlight-pill-content">
                <h4>Zero / Minimal Mileage</h4>
                <p>Factory-fresh original condition, untouched luxury and precision.</p>
              </div>
            </div>
            <div className="highlight-pill-card">
              <div className="highlight-pill-accent"></div>
              <div className="highlight-pill-content">
                <h4>Direct Global Import</h4>
                <p>Handpicked auction grades with verified import manifests.</p>
              </div>
            </div>
            <div className="highlight-pill-card">
              <div className="highlight-pill-accent"></div>
              <div className="highlight-pill-content">
                <h4>Full Showroom Warranty</h4>
                <p>Complete documentation & personalized post-delivery support.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="highlight-pill-card">
              <div className="highlight-pill-accent"></div>
              <div className="highlight-pill-content">
                <h4>150+ Point Multi-Inspection</h4>
                <p>Comprehensive engine, transmission, suspension & ECU check.</p>
              </div>
            </div>
            <div className="highlight-pill-card">
              <div className="highlight-pill-accent"></div>
              <div className="highlight-pill-content">
                <h4>Dhaka Metro Registered</h4>
                <p>100% verified legal papers with authentic ownership history.</p>
              </div>
            </div>
            <div className="highlight-pill-card">
              <div className="highlight-pill-accent"></div>
              <div className="highlight-pill-content">
                <h4>Showroom Ready</h4>
                <p>Immediate physical test drive & instant ownership handover.</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div id="preference-cars-grid" className="preference-showcase-grid">
        {showcaseCars.map((car) => (
          <VehicleCard key={car.id} car={car} layout="grid" />
        ))}
      </div>

      <div className="preference-bottom-cta">
        <Link
          id="preference-view-all-btn"
          href={`/inventory?type=${fallbackTab}`}
          className="preference-all-link"
        >
          <span>
            {fallbackTab === "BRAND_NEW"
              ? `Explore All Brand New & Reconditioned Collection (${brandNewCars.length} Units)`
              : `Explore All Certified Pre-Owned Collection (${preOwnedCars.length} Units)`}
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
