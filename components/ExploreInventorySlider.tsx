"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Link from "next/link";

interface CarType {
  id: number;
  name: string;
  count: string;
  image: string;
}

const INITIAL_INVENTORY: CarType[] = [
  { id: 1, name: "Hatchback", count: "271 Car", image: "/assets/images/section/car-slide1.png" },
  { id: 2, name: "Sedan", count: "354 Car", image: "/assets/images/section/car-slide2.png" },
  { id: 3, name: "SUV", count: "512 Car", image: "/assets/images/section/car-slide3.png" },
  { id: 4, name: "Coupe", count: "189 Car", image: "/assets/images/section/car-slide1.png" },
  { id: 5, name: "Convertible", count: "142 Car", image: "/assets/images/section/car-slide2.png" },
  { id: 6, name: "Crossover", count: "298 Car", image: "/assets/images/section/car-slide3.png" },
];

export default function ExploreInventorySlider() {
  // Triple the items so there's always plenty visible on any screen width
  const [items, setItems] = useState<CarType[]>([
    ...INITIAL_INVENTORY,
    ...INITIAL_INVENTORY,
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(380);
  const gap = 40;

  const updateWidth = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth <= 575) {
      setCardWidth(containerWidth);
    } else if (containerWidth <= 991) {
      setCardWidth((containerWidth - 20) / 2);
    } else {
      setCardWidth((containerWidth - 80) / 3);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [updateWidth]);

  const slideNext = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const step = cardWidth + gap;

    await controls.start({
      x: -step,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    });

    // Seamless forward rotation: move first item to end
    setItems((prev) => [...prev.slice(1), prev[0]]);
    controls.set({ x: 0 });
    setIsAnimating(false);
  }, [cardWidth, controls, gap, isAnimating]);

  const slidePrev = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const step = cardWidth + gap;

    // Prepend last item and set offset to -step, then slide to 0
    setItems((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
    controls.set({ x: -step });

    await controls.start({
      x: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
    });

    setIsAnimating(false);
  }, [cardWidth, controls, gap, isAnimating]);

  // Automatic sliding every 3 seconds (smooth, continuous forward, no reverse)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      slideNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, slideNext]);

  return (
    <div
      className="explore-inventory-motion-container relative"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ overflow: "hidden", padding: "10px 0 20px" }}
    >
      <motion.div
        className="explore-inventory-track"
        animate={controls}
        initial={{ x: 0 }}
        style={{
          display: "flex",
          gap: `${gap}px`,
          width: "max-content",
          willChange: "transform",
        }}
      >
        {items.map((car, index) => (
          <div
            key={`${car.id}-${index}`}
            style={{ width: `${cardWidth}px`, flexShrink: 0 }}
            className="inventory-card-wrapper"
          >
            <Link href="/listing-grid" className="tf-listing-slide block">
              <div className="img-style">
                <img
                  src={car.image}
                  alt={car.name}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <div className="content-style center">
                <div className="fs-16 fw-6 lh-22 text-color-2 font-2">{car.name}</div>
                <p className="fs-12">{car.count}</p>
              </div>
            </Link>
          </div>
        ))}
      </motion.div>

      {/* Manual Navigation Controls */}
      <div
        className="swiper-button-prev style-2"
        role="button"
        tabIndex={0}
        onClick={slidePrev}
        onKeyDown={(e) => e.key === "Enter" && slidePrev()}
        style={{ cursor: "pointer", zIndex: 10 }}
        aria-label="Previous slide"
      />
      <div
        className="swiper-button-next style-2"
        role="button"
        tabIndex={0}
        onClick={slideNext}
        onKeyDown={(e) => e.key === "Enter" && slideNext()}
        style={{ cursor: "pointer", zIndex: 10 }}
        aria-label="Next slide"
      />
    </div>
  );
}
