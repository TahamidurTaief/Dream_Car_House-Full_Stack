"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RUNWAY_BATCHES } from "@/lib/showroomData";

export default function BrandRunway() {
  const [activeBatchIdx, setActiveBatchIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Automatic batch rotation every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveBatchIdx((prev) => (prev + 1) % RUNWAY_BATCHES.length);
        setIsAnimating(false);
      }, 700);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleBatchClick = (idx: number) => {
    if (idx === activeBatchIdx || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveBatchIdx(idx);
      setIsAnimating(false);
    }, 600);
  };

  const currentBatch = RUNWAY_BATCHES[activeBatchIdx];

  return (
    <section className="brand-strip-section" id="brand-runway-section">
      <div className="max-w-7xl">
        <div className="runway-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="preference-badge" style={{ marginBottom: "0.25rem", display: "inline-block" }}>
                OFFICIAL PARTNERSHIPS
              </span>
              <h2 className="section-h2" style={{ marginBottom: "0.25rem" }}>
                Prestigious Automotive Marques
              </h2>
              <p className="runway-subtext">
                Official luxury dealerships & certified engineering partners at DREAM CAR HOUSE.
              </p>
            </div>

            {/* Batch Navigation Pills */}
            <div className="runway-batch-pills" style={{ display: "flex", gap: "0.5rem" }}>
              {RUNWAY_BATCHES.map((batch, idx) => (
                <button
                  key={batch.id}
                  type="button"
                  onClick={() => handleBatchClick(idx)}
                  className={`runway-batch-btn ${activeBatchIdx === idx ? "active" : ""}`}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    border: activeBatchIdx === idx ? "1px solid #ffffff" : "1px solid #1f2937",
                    background: activeBatchIdx === idx ? "rgba(255,255,255,0.12)" : "rgba(10,12,16,0.6)",
                    color: activeBatchIdx === idx ? "#ffffff" : "#9ca3af",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {batch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Asphalt Runway Track */}
        <div className="runway-track-wrapper" id="runway-track-wrapper">
          {/* Road Asphalt Grid / Markings */}
          <div className="runway-road-surface">
            <div className="runway-speed-lines"></div>
            <div className="runway-center-dashes"></div>
          </div>

          {/* Dynamic Particle FX Layer */}
          <div className="runway-fx-layer"></div>

          {/* The 8 Brand Logos in one horizontal row */}
          <div className={`brand-runway-row ${isAnimating ? "runway-dissolving" : ""}`}>
            {currentBatch.brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/inventory?brand=${encodeURIComponent(brand.filterBrand)}`}
                className="brand-runway-item group"
                title={`Filter inventory by ${brand.filterBrand}`}
              >
                <div
                  className="brand-icon-wrap"
                  dangerouslySetInnerHTML={{ __html: brand.svg }}
                />
                <span className="brand-name-label">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
