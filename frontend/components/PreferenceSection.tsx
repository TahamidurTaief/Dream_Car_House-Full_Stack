"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VEHICLE_DATA } from "@/lib/showroomData";
import VehicleCard from "./VehicleCard";

export default function PreferenceSection() {
  const [activeTab, setActiveTab] = useState<"BRAND_NEW" | "PRE_OWNED">("BRAND_NEW");

  const brandNewCars = VEHICLE_DATA.filter((c) => c.car_type === "BRAND_NEW");
  const preOwnedCars = VEHICLE_DATA.filter((c) => c.car_type === "PRE_OWNED");

  const currentList = activeTab === "BRAND_NEW" ? brandNewCars : preOwnedCars;
  const showcaseCars = currentList.slice(0, 3);

  return (
    <section className="preference-section max-w-7xl">
      <div className="preference-header-wrap">
        <div>
          <h2 className="section-h2" style={{ margin: 0 }}>
            Choose per your preference
          </h2>
        </div>

        {/* Segment Switcher Controller */}
        <div className="segment-switcher" role="tablist">
          <button
            id="tab-brand-new"
            className={`segment-btn ${activeTab === "BRAND_NEW" ? "active" : ""}`}
            onClick={() => setActiveTab("BRAND_NEW")}
            role="tab"
            aria-selected={activeTab === "BRAND_NEW"}
          >
            <span className="segment-label">Brand New & Reconditioned</span>
            <span className="segment-count" id="count-brand-new">
              {brandNewCars.length}
            </span>
          </button>
          <button
            id="tab-pre-owned"
            className={`segment-btn ${activeTab === "PRE_OWNED" ? "active" : ""}`}
            onClick={() => setActiveTab("PRE_OWNED")}
            role="tab"
            aria-selected={activeTab === "PRE_OWNED"}
          >
            <span className="segment-label">Certified Pre-Owned</span>
            <span className="segment-count" id="count-pre-owned">
              {preOwnedCars.length}
            </span>
          </button>
        </div>
      </div>

      {/* Trust / Guarantee Highlights Bar */}
      <div id="preference-highlights-bar" className="preference-highlights-bar">
        {activeTab === "BRAND_NEW" ? (
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

      {/* Dynamic Vehicle Showcase Grid */}
      <div id="preference-cars-grid" className="preference-showcase-grid">
        {showcaseCars.map((car) => (
          <VehicleCard key={car.id} car={car} layout="grid" />
        ))}
      </div>

      {/* Bottom View All CTA */}
      <div className="preference-bottom-cta">
        <Link
          id="preference-view-all-btn"
          href={`/inventory?type=${activeTab}`}
          className="preference-all-link"
        >
          <span>
            {activeTab === "BRAND_NEW"
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
