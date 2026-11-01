"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ALL_RUNWAY_BRANDS } from "@/lib/showroomData";
import { PublicBrand } from "@/lib/types";

export interface RunwayItem {
  name: string;
  filterBrand: string;
  destination_url?: string;
  image?: string | null;
  logo_alt?: string;
  svg?: string;
  originalIndex: number;
}

interface BrandRunwayProps {
  brands?: PublicBrand[];
}

// Sleek Stealth GT Sweeper - Dark carbon silhouette, dual glowing exhaust flames, red LED taillight
const CAR_SVG_SWEEPER = `
<svg width="240" height="74" viewBox="0 0 240 74" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bodyGradSweeper" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#050608" stopOpacity="0.95"/>
      <stop offset="25%" stopColor="#0d1117"/>
      <stop offset="55%" stopColor="#1a202c"/>
      <stop offset="85%" stopColor="#2d3748"/>
      <stop offset="100%" stopColor="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="exhaustGrad" x1="100%" y1="50%" x2="0%" y2="50%">
      <stop offset="0%" stopColor="#ff4500" stopOpacity="0.9"/>
      <stop offset="35%" stopColor="#ff8c00" stopOpacity="0.7"/>
      <stop offset="70%" stopColor="#00bfff" stopOpacity="0.5"/>
      <stop offset="100%" stopColor="#00bfff" stopOpacity="0"/>
    </linearGradient>
    <filter id="exhaustGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Dual high-temp exhaust trails shooting backwards -->
  <polygon points="12,50 -25,47 -20,50 -25,53" fill="url(#exhaustGrad)" filter="url(#exhaustGlow)"/>
  <polygon points="12,54 -28,52 -22,54 -28,57" fill="url(#exhaustGrad)" filter="url(#exhaustGlow)"/>

  <!-- Low-slung supercar aerodynamic chassis -->
  <path d="M12 55 L24 55 Q35 55 48 51 L80 43 Q110 25 155 24 Q185 24 205 38 L228 46 Q238 50 238 56 L12 56 Z" fill="url(#bodyGradSweeper)"/>
  
  <!-- Swept-back greenhouse & stealth cockpit tint -->
  <path d="M85 41 Q110 27 150 26 Q175 26 195 38 Z" fill="#000000" stroke="#4a5568" strokeWidth="0.8"/>
  
  <!-- Front hyper-LED razor blade headlight -->
  <polygon points="228,45 238,48 234,49 226,47" fill="#ffffff" filter="url(#exhaustGlow)"/>
  <line x1="225" y1="47" x2="238" y2="49" stroke="#38bdf8" strokeWidth="1.5"/>

  <!-- Rear continuous lightbar LED -->
  <path d="M12 50 Q16 48 24 49" stroke="#ef4444" strokeWidth="2.5" filter="url(#exhaustGlow)"/>

  <!-- Carbon ceramic wheels with aerodynamic speed spokes -->
  <circle cx="58" cy="54" r="14" fill="#0a0d14" stroke="#4a5568" strokeWidth="2.5"/>
  <circle cx="58" cy="54" r="7" fill="#171923" stroke="#e2e8f0" strokeWidth="1.2"/>
  <circle cx="192" cy="54" r="14" fill="#0a0d14" stroke="#4a5568" strokeWidth="2.5"/>
  <circle cx="192" cy="54" r="7" fill="#171923" stroke="#e2e8f0" strokeWidth="1.2"/>
</svg>`;

// Golden Prestige GT Deployer - Polished metallic silver body, champagne gold accents, xenon white beam
const CAR_SVG_DEPLOYER = `
<svg width="240" height="74" viewBox="0 0 240 74" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bodyGradDeployer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#1a202c"/>
      <stop offset="30%" stopColor="#4a5568"/>
      <stop offset="65%" stopColor="#cbd5e0"/>
      <stop offset="90%" stopColor="#ffffff"/>
      <stop offset="100%" stopColor="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
      <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.4"/>
      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
    </linearGradient>
    <filter id="xenonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Forward-projected laser headlight beam cone -->
  <polygon points="236,47 285,38 285,58" fill="url(#headlightBeam)" opacity="0.6"/>

  <!-- Sculpted GT aerodynamic profile -->
  <path d="M14 55 L26 55 Q36 55 50 51 L84 43 Q114 24 158 23 Q188 23 207 37 L230 45 Q239 49 239 55 L14 56 Z" fill="url(#bodyGradDeployer)"/>
  
  <!-- Panoramic canopy cockpit -->
  <path d="M88 41 Q113 26 153 25 Q178 25 197 37 Z" fill="#090d16" stroke="#d69e2e" strokeWidth="0.75"/>
  
  <!-- Laser headlight cluster -->
  <polygon points="230,44 239,47 236,48 228,46" fill="#ffffff" filter="url(#xenonGlow)"/>
  <circle cx="233" cy="46" r="2" fill="#38bdf8"/>

  <!-- Sleek metallic silver side-blade & gold accent line -->
  <path d="M68 49 L175 49" stroke="#d69e2e" strokeWidth="1.2" opacity="0.85"/>

  <!-- Diamond-cut alloy wheels -->
  <circle cx="60" cy="54" r="14" fill="#090d16" stroke="#d69e2e" strokeWidth="2.5"/>
  <circle cx="60" cy="54" r="7" fill="#2d3748" stroke="#ffffff" strokeWidth="1.5"/>
  <circle cx="194" cy="54" r="14" fill="#090d16" stroke="#d69e2e" strokeWidth="2.5"/>
  <circle cx="194" cy="54" r="7" fill="#2d3748" stroke="#ffffff" strokeWidth="1.5"/>
</svg>`;

export default function BrandRunway({ brands }: BrandRunwayProps = {}) {
  const router = useRouter();

  // Normalize brands (use database brands if present, else fallback to ALL_RUNWAY_BRANDS)
  const brandList: RunwayItem[] = React.useMemo(() => {
    if (brands && brands.length > 0) {
      return brands.map((b, idx) => ({
        name: b.name.toUpperCase(),
        filterBrand: b.name,
        destination_url:
          b.destination_url ||
          `/inventory?brand=${encodeURIComponent(b.name)}`,
        image: b.image || null,
        logo_alt: b.logo_alt || `${b.name} luxury marque`,
        originalIndex: idx,
      }));
    }
    return ALL_RUNWAY_BRANDS.map((b, idx) => ({
      name: b.name,
      filterBrand: b.filterBrand,
      svg: b.svg,
      originalIndex: idx,
    }));
  }, [brands]);

  // Responsive page size: Mobile = 3, Tablet = 6, Desktop = 8
  const [pageSize, setPageSize] = useState<number>(8);
  const [startIndex, setStartIndex] = useState<number>(0);

  const [dissolvedIndexes, setDissolvedIndexes] = useState<number[]>([]);
  const [deployingIndexes, setDeployingIndexes] = useState<number[]>([]);

  const trackRef = useRef<HTMLDivElement>(null);
  const carActorRef = useRef<HTMLDivElement>(null);
  const isCruisingRef = useRef<boolean>(false);

  // Dynamic responsive sizing hook
  const calculatePageSize = useCallback(() => {
    if (typeof window === "undefined") return 8;
    const w = window.innerWidth;
    if (w < 640) return 3;
    if (w < 1024) return 6;
    return 8;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newSize = calculatePageSize();
      setPageSize(newSize);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculatePageSize]);

  const filterByBrand = (item: RunwayItem) => {
    if (item.destination_url) {
      router.push(item.destination_url);
    } else {
      router.push(`/inventory?brand=${encodeURIComponent(item.filterBrand)}`);
    }
  };

  // Run the majestic luxury car cruise with real-time wake synchronization
  const runRunwayCycle = useCallback(() => {
    if (isCruisingRef.current || !trackRef.current || !carActorRef.current) return;
    isCruisingRef.current = true;

    const track = trackRef.current;
    const carActor = carActorRef.current;
    const trackWidth = track.offsetWidth;

    // Phase 1: Carbon Sweeper Car Speeds Across Track (1.9s cruise)
    const cruiseDuration = 1900;
    carActor.innerHTML = CAR_SVG_SWEEPER;
    carActor.style.transition = "none";
    carActor.style.left = "-240px";
    carActor.style.opacity = "1";

    // Force layout reflow before launching physics motion
    void carActor.offsetWidth;

    carActor.style.transition = `left ${cruiseDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`;
    carActor.style.left = `${trackWidth + 60}px`;

    // Real-Time Card Wake Collision Loop (60 FPS calculation)
    const sweepStartTime = performance.now();
    const sweptCards = new Set<number>();

    const checkSweepCollisions = (now: number) => {
      const elapsed = now - sweepStartTime;
      const progress = Math.min(elapsed / cruiseDuration, 1);
      const currentCarFront = -240 + progress * (trackWidth + 300) + 210;

      const cardNodes = track.querySelectorAll<HTMLDivElement>(".runway-brand-card");
      cardNodes.forEach((cardNode) => {
        const idx = Number(cardNode.getAttribute("data-index"));
        if (!sweptCards.has(idx)) {
          const cardLeft = cardNode.offsetLeft;
          if (currentCarFront >= cardLeft + 25) {
            sweptCards.add(idx);
            setDissolvedIndexes((prev) => [...prev, idx]);
          }
        }
      });

      if (progress < 1) {
        requestAnimationFrame(checkSweepCollisions);
      }
    };
    requestAnimationFrame(checkSweepCollisions);

    // Phase 2: Once the track is fully swept, swap the batch seamlessly behind the scenes
    setTimeout(() => {
      carActor.style.opacity = "0";
      carActor.style.transition = "none";
      carActor.style.left = "-240px";

      // Calculate next sequential batch without skipping ANY brand!
      setStartIndex((prev) => (prev + pageSize) % (brandList.length || 1));

      // Initialize all incoming cards in dissolved state so they materialize cleanly
      setDissolvedIndexes(Array.from({ length: pageSize }, (_, i) => i));

      // Phase 3: Golden GT Deployer Car Cruises Across Track, Materializing New Brands
      setTimeout(() => {
        carActor.innerHTML = CAR_SVG_DEPLOYER;
        carActor.style.transition = "none";
        carActor.style.left = "-240px";
        carActor.style.opacity = "1";

        void carActor.offsetWidth;

        carActor.style.transition = `left ${cruiseDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        carActor.style.left = `${trackWidth + 60}px`;

        const deployStartTime = performance.now();
        const deployedCards = new Set<number>();

        const checkDeployCollisions = (now: number) => {
          const elapsed = now - deployStartTime;
          const progress = Math.min(elapsed / cruiseDuration, 1);
          const currentCarBack = -240 + progress * (trackWidth + 300) + 40;

          const cardNodes = track.querySelectorAll<HTMLDivElement>(".runway-brand-card");
          cardNodes.forEach((cardNode) => {
            const idx = Number(cardNode.getAttribute("data-index"));
            if (!deployedCards.has(idx)) {
              const cardLeft = cardNode.offsetLeft;
              // Materialize card immediately behind deployer car
              if (currentCarBack >= cardLeft) {
                deployedCards.add(idx);
                // Remove from dissolved set
                setDissolvedIndexes((prev) => prev.filter((item) => item !== idx));
                // Add to deploying wave set
                setDeployingIndexes((prev) => [...prev, idx]);

                // Clear deploying glow effect after materialization completes
                setTimeout(() => {
                  setDeployingIndexes((prev) => prev.filter((item) => item !== idx));
                }, 750);
              }
            }
          });

          if (progress < 1) {
            requestAnimationFrame(checkDeployCollisions);
          }
        };
        requestAnimationFrame(checkDeployCollisions);

        // Phase 4: Finalize Cycle & Reset Guard Flag
        setTimeout(() => {
          carActor.style.opacity = "0";
          setDissolvedIndexes([]);
          setDeployingIndexes([]);
          isCruisingRef.current = false;
        }, cruiseDuration + 300);
      }, 450);
    }, cruiseDuration + 150);
  }, [pageSize, brandList.length]);

  // Recurring interval: Cruise runs every 19 seconds (allowing ~8 seconds of resting interaction)
  useEffect(() => {
    const timer = setInterval(() => {
      runRunwayCycle();
    }, 19000);

    // Initial first cruise triggers elegantly 3 seconds after page landing
    const initialTimer = setTimeout(() => {
      runRunwayCycle();
    }, 3200);

    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [runRunwayCycle]);

  // Sliced brands for current active view
  const visibleBrands = Array.from({ length: pageSize }, (_, i) => {
    const len = brandList.length || 1;
    const idx = (startIndex + i) % len;
    return { ...brandList[idx], displayIndex: i };
  });

  return (
    <section className="brand-runway-section max-w-7xl" id="marques">
      <div className="runway-header">
        <div className="runway-header-text">
          <span className="runway-eyebrow">WORLD-CLASS AUTOMOTIVE MARQUES</span>
          <h2 className="runway-title">Prestigious Marque Runway</h2>
          <p className="runway-subtitle">
            Curated allocations from the world&apos;s most revered luxury automotive houses.
          </p>
        </div>
        <div className="runway-header-action">
          <button
            type="button"
            className="runway-manual-cruise-btn"
            onClick={runRunwayCycle}
            title="Launch Supercar Cruise"
            aria-label="Cycle Brand Runway"
          >
            <span>Cycle Marque Runway</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Runway Interactive Track */}
      <div className="runway-track-wrap" ref={trackRef}>
        {/* Animated Hypercar Actor (Positioned Dynamically by Physics Loop) */}
        <div className="runway-car-actor" ref={carActorRef}></div>

        {/* Dynamic Brand Cards Grid */}
        <div className="runway-cards-grid">
          {visibleBrands.map((brand, i) => {
            const isDissolved = dissolvedIndexes.includes(i);
            const isDeploying = deployingIndexes.includes(i);

            return (
              <div
                key={`${brand.name}-${brand.originalIndex}-${i}`}
                className={`runway-brand-card ${isDissolved ? "is-dissolved" : ""} ${
                  isDeploying ? "is-deploying" : ""
                }`}
                data-index={i}
                onClick={() => filterByBrand(brand)}
                title={`View ${brand.name} Collection`}
              >
                <div className="brand-badge-inner">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.logo_alt || brand.name}
                      className="brand-runway-img"
                      loading="lazy"
                    />
                  ) : brand.svg ? (
                    <div
                      style={{ display: "contents" }}
                      dangerouslySetInnerHTML={{ __html: brand.svg }}
                    />
                  ) : (
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#e2e8f0" }}>
                      {brand.name.slice(0, 2)}
                    </span>
                  )}
                  <span className="runway-brand-name">{brand.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
