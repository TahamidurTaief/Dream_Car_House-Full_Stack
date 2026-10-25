"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Vehicle } from "@/lib/showroomData";
import {
  PublicPreferenceSection,
  PublicPreferenceCategory,
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
}: PreferenceSectionProps) {
  const fallbackCategories: PublicPreferenceCategory[] = [
    {
      id: 1,
      category_key: "BRAND_NEW",
      label: "Brand New & Reconditioned",
      badge: "ZERO METER",
      subtext: "Factory-fresh imported luxury vehicles with complete documentation.",
      image: null,
      cta_text: "Explore All Brand New & Reconditioned Collection",
      cta_url: "/inventory?type=BRAND_NEW",
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
      order: 1,
    },
    {
      id: 2,
      category_key: "PRE_OWNED",
      label: "Certified Pre-Owned",
      badge: "SHOWROOM CERTIFIED",
      subtext: "Multi-point inspected certified luxury vehicles ready for ownership.",
      image: null,
      cta_text: "Explore All Certified Pre-Owned Collection",
      cta_url: "/inventory?type=PRE_OWNED",
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
      order: 2,
    },
  ];

  const categories =
    sectionData?.categories && sectionData.categories.length > 0
      ? sectionData.categories
      : fallbackCategories;

  const [activeTabKey, setActiveTabKey] = useState<string>(
    categories[0]?.category_key || "BRAND_NEW"
  );

  const currentCategory =
    categories.find((c) => c.category_key === activeTabKey) || categories[0];

  const getCategoryCars = (key: string) =>
    vehicles.filter((c) => c.car_type === key);

  const currentList = getCategoryCars(activeTabKey);
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

        {/* Segment Switcher Controller */}
        <div className="segment-switcher" role="tablist">
          {categories.map((cat) => {
            const count = getCategoryCars(cat.category_key).length;
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

      {/* Category Image Banner (if provided) */}
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

      {/* Trust / Guarantee Highlights Bar */}
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

      {/* Dynamic Vehicle Showcase Grid */}
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

      {/* Bottom View All CTA */}
      <div className="preference-bottom-cta">
        <Link
          id="preference-view-all-btn"
          href={
            currentCategory?.cta_url ||
            `/inventory?type=${activeTabKey}`
          }
          className="preference-all-link"
        >
          <span>
            {currentCategory?.cta_text
              ? `${currentCategory.cta_text} (${currentList.length} Units)`
              : `Explore All Collection (${currentList.length} Units)`}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

