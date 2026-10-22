"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { VEHICLE_DATA, Vehicle } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

export default function InventoryCarousel() {
  const { openCarModal } = useUI();
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate list to achieve a seamless, infinite loop with 0 jumping/glitching (exact dream_car_house)
  const marqueeData = [...VEHICLE_DATA, ...VEHICLE_DATA];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleMouseEnter = () => {
      track.style.animationPlayState = "paused";
    };
    const handleMouseLeave = () => {
      track.style.animationPlayState = "running";
    };
    const handleTouchStart = () => {
      track.style.animationPlayState = "paused";
    };
    const handleTouchEnd = () => {
      track.style.animationPlayState = "running";
    };

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);
    track.addEventListener("touchstart", handleTouchStart, { passive: true });
    track.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
      track.removeEventListener("touchstart", handleTouchStart);
      track.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <section id="carousel-section" className="carousel-section max-w-7xl">
      <div className="section-head">
        <h2 className="section-h2">Current Inventory</h2>
        <Link className="see-all-link" href="/inventory">
          See All
        </Link>
      </div>

      <div className="inventory-slider-container">
        <div
          ref={trackRef}
          id="home-slider-track"
          className="inventory-slider-track"
        >
          {marqueeData.map((car, index) => {
            const branchName =
              car.branch_id === "kakrail" ? "Kakrail Branch" : "Gulshan Branch";
            return (
              <div key={`${car.id}-${index}`} className="card-item-slider">
                <div
                  className="group"
                  onClick={() => openCarModal(car)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="portrait-image-wrapper"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                    />
                    <span className="card-branch-tag">{branchName}</span>
                  </div>
                  <h3 className="card-car-title">{car.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

