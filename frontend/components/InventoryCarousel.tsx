"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { VEHICLE_DATA } from "@/lib/showroomData";
import VehicleCard from "./VehicleCard";

export default function InventoryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section id="carousel-section" className="carousel-section max-w-7xl">
      <div className="section-head">
        <div>
          <span className="preference-badge" style={{ marginBottom: "0.25rem", display: "inline-block" }}>
            SHOWROOM SHOWCASE
          </span>
          <h2 className="section-h2">Current Inventory</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="carousel-nav-arrows">
            <button
              type="button"
              onClick={scrollLeft}
              className="carousel-arrow-btn"
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="carousel-arrow-btn"
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <Link className="see-all-link" href="/inventory">
            See All ({VEHICLE_DATA.length})
          </Link>
        </div>
      </div>

      <div className="inventory-slider-container">
        <div
          ref={trackRef}
          id="home-slider-track"
          className="inventory-slider-track"
        >
          {VEHICLE_DATA.map((car) => (
            <div key={car.id} className="carousel-slide-item">
              <VehicleCard car={car} layout="carousel" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
