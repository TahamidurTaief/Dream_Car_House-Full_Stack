"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { VEHICLE_DATA, Vehicle } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

interface InventoryCarouselProps {
  vehicles?: Vehicle[];
}

export default function InventoryCarousel({ vehicles }: InventoryCarouselProps = {}) {
  const { openCarModal } = useUI();
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // If database vehicles are provided and non-empty, use them; else fallback to VEHICLE_DATA
  const items = vehicles && vehicles.length > 0 ? vehicles : VEHICLE_DATA;

  // 3-tile duplicated dataset for mathematically seamless, infinite bidirectional wrapping
  const marqueeData = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length >= 4) {
      return [...items, ...items, ...items];
    }
    return [...items, ...items, ...items, ...items, ...items, ...items];
  }, [items]);

  // Animation & Physics Refs
  const posRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const startXRef = useRef(0);
  const dragDistRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const isHoveredRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Base auto-scroll speed (pixels per frame at 60fps)
  const BASE_SPEED = 0.85;

  // Render position to DOM
  const updateTransform = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
  }, []);

  // Safe wrapping logic: calculates exact loop width based on 1/3 of the marquee track
  const checkWrap = useCallback(() => {
    if (!trackRef.current) return;
    const singleSetWidth = trackRef.current.scrollWidth / (marqueeData.length / (items.length || 1));
    if (singleSetWidth <= 0) return;

    // Scrolled too far left (negative) -> wrap back right
    if (posRef.current <= -singleSetWidth * 2) {
      posRef.current += singleSetWidth;
    }
    // Scrolled too far right (positive) -> wrap back left
    else if (posRef.current >= -singleSetWidth * 0.2) {
      posRef.current -= singleSetWidth;
    }
  }, [marqueeData.length, items.length]);

  // Main 60FPS physics and auto-scroll animation loop
  useEffect(() => {
    // Initial centering offset so right-drags don't hit edge immediately
    if (trackRef.current) {
      const initialOffset = -(trackRef.current.scrollWidth / 3);
      posRef.current = initialOffset;
      updateTransform();
    }

    const animate = () => {
      if (!isDraggingRef.current) {
        // Apply friction to momentum velocity
        velocityRef.current *= 0.94;
        if (Math.abs(velocityRef.current) < 0.05) {
          velocityRef.current = 0;
        }

        // Auto-cruise when not hovered
        const autoMovement = isHoveredRef.current ? 0 : -BASE_SPEED;
        posRef.current += autoMovement + velocityRef.current;

        checkWrap();
        updateTransform();
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [checkWrap, updateTransform]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Left click only
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    setIsGrabbing(true);
    startXRef.current = e.clientX;
    dragDistRef.current = 0;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const currentX = e.clientX;
    const now = performance.now();
    const deltaX = currentX - lastXRef.current;
    const dt = Math.max(1, now - lastTimeRef.current);

    posRef.current += deltaX;
    dragDistRef.current += Math.abs(deltaX);

    // Track fling velocity (pixels/frame equivalent)
    velocityRef.current = (deltaX / dt) * 16;

    lastXRef.current = currentX;
    lastTimeRef.current = now;

    checkWrap();
    updateTransform();
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsGrabbing(false);
      // Clamp excessive fling velocity
      velocityRef.current = Math.max(-25, Math.min(25, velocityRef.current));
    }
  };

  // Touch Handlers for Mobile & Tablet Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    isDraggingRef.current = true;
    setIsGrabbing(true);
    const touchX = e.touches[0].clientX;
    startXRef.current = touchX;
    dragDistRef.current = 0;
    lastXRef.current = touchX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;

    const touchX = e.touches[0].clientX;
    const now = performance.now();
    const deltaX = touchX - lastXRef.current;
    const dt = Math.max(1, now - lastTimeRef.current);

    posRef.current += deltaX;
    dragDistRef.current += Math.abs(deltaX);

    velocityRef.current = (deltaX / dt) * 16;

    lastXRef.current = touchX;
    lastTimeRef.current = now;

    checkWrap();
    updateTransform();
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsGrabbing(false);
      velocityRef.current = Math.max(-25, Math.min(25, velocityRef.current));
    }
  };

  // Click vs Drag discrimination (prevents accidental modal open on swipe)
  const handleCardClick = (car: Vehicle) => {
    if (dragDistRef.current < 6) {
      openCarModal(car);
    }
  };

  return (
    <section
      className="carousel-section"
      id="carousel-section"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        handleMouseUp();
      }}
    >
      <div className="section-head">
        <h2 className="section-h2">Current Inventory</h2>
        <Link className="see-all-link" href="/inventory">
          See All ({items.length})
        </Link>
      </div>

      <div
        className="carousel-viewport"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className="carousel-track"
          ref={trackRef}
          style={{ cursor: isGrabbing ? "grabbing" : "grab" }}
        >
          {marqueeData.map((car, index) => {
            const branchName =
              car.branch_name ||
              (car.branch_id === "gulshan" ? "Gulshan Branch" : "Kakrail Branch");
            return (
              <div key={`${car.id}-${index}`} className="card-item-slider">
                <div
                  className="group"
                  onClick={() => handleCardClick(car)}
                  style={{ cursor: isGrabbing ? "grabbing" : "pointer" }}
                >
                  <div
                    className="portrait-image-wrapper"
                    style={{ position: "relative" }}
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      draggable={false}
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
