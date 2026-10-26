"use client";

import React from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";

export default function Hero() {
  const { theme } = useUI();

  return (
    <section
      className={`hero-showcase-section ${theme === "dark" ? "theme-dark" : "theme-light"}`}
      id="hero-section"
      aria-label="DREAM CAR HOUSE Flagship Luxury Showroom"
    >
      {/* ================= Dual Showroom Background Images (Day vs Night) ================= */}
      <div className="hero-bg-container" aria-hidden="true">
        {/* Night Showroom: dch night.jfif */}
        <div className={`hero-bg-layer hero-bg-night ${theme === "dark" ? "is-active" : "is-inactive"}`}>
          <Image
            src="/assets/dch-night-showroom.webp"
            alt="DREAM CAR HOUSE Night Luxury Showroom - Pinnacle of Luxury Automobiles"
            fill
            priority
            unoptimized
            className="hero-bg-image"
          />
        </div>

        {/* Day Showroom: dch day.jfif */}
        <div className={`hero-bg-layer hero-bg-day ${theme === "light" ? "is-active" : "is-inactive"}`}>
          <Image
            src="/assets/dch-day-showroom.webp"
            alt="DREAM CAR HOUSE Day Luxury Showroom - Pinnacle of Luxury Automobiles"
            fill
            priority
            unoptimized
            className="hero-bg-image"
          />
        </div>
      </div>
    </section>
  );
}

