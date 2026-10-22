"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RUNWAY_BATCHES } from "@/lib/showroomData";

const CAR_SVG_SWEEPER = `
<svg class="runway-car-svg" viewBox="0 0 170 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 32 C16 28 26 27 36 27 C44 27 52 18 70 15 C90 12 118 14 132 22 C142 23 154 26 160 30 C162 32 162 35 158 36 C150 38 140 38 130 38 C128 33 122 29 114 29 C106 29 100 33 98 38 L54 38 C52 33 46 29 38 29 C30 29 24 33 22 38 L12 38 C8 38 6 35 12 32 Z" fill="#0f1117" stroke="#dc2626" stroke-width="1.2"/>
  <path d="M64 18 C78 15 110 15 124 22 L116 23 C102 18 80 18 66 21 Z" fill="#ef4444" opacity="0.4"/>
  <path d="M74 17 L106 17 L102 23 L70 23 Z" fill="#05070a" opacity="0.95"/>
  <path d="M4 25 L16 25 L14 28 L6 28 Z" fill="#1e293b"/>
  <line x1="8" y1="28" x2="8" y2="33" stroke="#dc2626" stroke-width="1.5"/>
  <circle cx="114" cy="37" r="9" fill="#05070a" stroke="#7f1d1d" stroke-width="2"/>
  <circle cx="114" cy="37" r="4" fill="#dc2626" opacity="0.8"/>
  <circle cx="38" cy="37" r="9" fill="#05070a" stroke="#7f1d1d" stroke-width="2"/>
  <circle cx="38" cy="37" r="4" fill="#dc2626" opacity="0.8"/>
  <path d="M6 30 L16 30" stroke="#ff0033" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="6" cy="30" rx="4" ry="2" fill="#ff0000" filter="drop-shadow(-4px 0 6px #ff0000)"/>
  <polygon points="6,34 0,33 4,36" fill="#f97316"/>
  <line x1="28" y1="39" x2="128" y2="39" stroke="#ef4444" stroke-width="2" opacity="0.8"/>
</svg>`;

const CAR_SVG_DEPLOYER = `
<svg class="runway-car-svg" viewBox="0 0 170 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headlightBeamGrad" x1="158" y1="30" x2="210" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <polygon points="158,30 215,8 215,48" fill="url(#headlightBeamGrad)" opacity="0.75"/>
  <path d="M12 32 C16 28 26 27 36 27 C44 27 52 18 70 15 C90 12 118 14 132 22 C142 23 154 26 160 30 C162 32 162 35 158 36 C150 38 140 38 130 38 C128 33 122 29 114 29 C106 29 100 33 98 38 L54 38 C52 33 46 29 38 29 C30 29 24 33 22 38 L12 38 C8 38 6 35 12 32 Z" fill="#11141a" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1.4"/>
  <path d="M64 18 C78 15 110 15 124 22 L116 23 C102 18 80 18 66 21 Z" fill="#ffffff" opacity="0.4"/>
  <path d="M74 17 L106 17 L102 23 L70 23 Z" fill="#05070a" opacity="0.9"/>
  <circle cx="114" cy="37" r="9" fill="#090d16" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2"/>
  <circle cx="114" cy="37" r="4" fill="#ffffff"/>
  <circle cx="38" cy="37" r="9" fill="#090d16" stroke="rgba(255, 255, 255, 0.7)" stroke-width="2"/>
  <circle cx="38" cy="37" r="4" fill="#ffffff"/>
  <circle cx="158" cy="29" r="3" fill="#ffffff" filter="drop-shadow(0 0 6px #ffffff)"/>
  <path d="M152 28 L158 30" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <line x1="28" y1="39" x2="128" y2="39" stroke="rgba(255, 255, 255, 0.8)" stroke-width="2.5" opacity="0.9"/>
</svg>`;

export default function BrandRunway() {
  const router = useRouter();
  const [activeBatchIdx, setActiveBatchIdx] = useState(0);
  const [dissolvedIndexes, setDissolvedIndexes] = useState<number[]>([]);
  const [deployingIndexes, setDeployingIndexes] = useState<number[]>([]);

  const trackRef = useRef<HTMLDivElement>(null);
  const carActorRef = useRef<HTMLDivElement>(null);
  const fxLayerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const pendingBatchRef = useRef<number | null>(null);

  const filterByBrand = (brandName: string) => {
    router.push(`/inventory?brand=${encodeURIComponent(brandName)}`);
  };

  const runRunwayCycle = () => {
    if (isAnimatingRef.current) return;
    if (isHoveredRef.current && pendingBatchRef.current === null) return;

    isAnimatingRef.current = true;
    const track = trackRef.current;
    const carActor = carActorRef.current;
    const fxLayer = fxLayerRef.current;

    if (!track || !carActor) {
      isAnimatingRef.current = false;
      return;
    }

    const cards = Array.from(track.querySelectorAll<HTMLElement>(".runway-brand-card"));
    if (!cards.length) {
      isAnimatingRef.current = false;
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const trackWidth = track.clientWidth || trackRect.width;

    const cardData = cards.map((c, i) => {
      const r = c.getBoundingClientRect();
      const centerX = r.left + r.width / 2 - trackRect.left;
      const centerY = r.top + r.height / 2 - trackRect.top;
      return {
        idx: i,
        ratio: Math.max(0.08, Math.min(0.92, centerX / trackWidth)),
        x: centerX,
        y: centerY,
      };
    });

    // PHASE 1: CAR 1 SWEEPS & LOGOS DISSOLVE
    carActor.innerHTML = CAR_SVG_SWEEPER;
    carActor.style.transition = "none";
    carActor.style.left = "-220px";
    void carActor.offsetWidth;

    const sweepDuration = 3800; // ms
    carActor.style.transition = `left ${sweepDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    carActor.style.left = "calc(100% + 80px)";

    cardData.forEach((item) => {
      const triggerTime = Math.max(120, item.ratio * sweepDuration - 100);
      setTimeout(() => {
        // Dust puffs
        if (fxLayer) {
          for (let p = 0; p < 4; p++) {
            const puff = document.createElement("div");
            puff.className = "fx-dust-puff";
            const size = 35 + Math.random() * 40;
            puff.style.width = `${size}px`;
            puff.style.height = `${size}px`;
            puff.style.left = `${item.x + (Math.random() * 30 - 15)}px`;
            puff.style.top = `${item.y + (Math.random() * 20 - 10)}px`;
            fxLayer.appendChild(puff);
            setTimeout(() => puff.remove(), 950);
          }
        }
        setDissolvedIndexes((prev) => [...prev, item.idx]);
      }, triggerTime);
    });

    // When Car 1 finishes: SWAP BATCH & RUN CAR 2
    setTimeout(() => {
      carActor.style.transition = "none";
      carActor.style.left = "-220px";

      const nextBatch =
        pendingBatchRef.current !== null
          ? pendingBatchRef.current
          : (activeBatchIdx + 1) % RUNWAY_BATCHES.length;
      pendingBatchRef.current = null;

      setActiveBatchIdx(nextBatch);
      // All cards start dissolved in new batch
      setDissolvedIndexes([0, 1, 2, 3, 4, 5, 6, 7]);
      setDeployingIndexes([]);

      // PHASE 2: CAR 2 DEPLOYS NEW LOGOS
      setTimeout(() => {
        carActor.innerHTML = CAR_SVG_DEPLOYER;
        carActor.style.transition = "none";
        carActor.style.left = "-220px";
        void carActor.offsetWidth;

        const deployDuration = 3600;
        carActor.style.transition = `left ${deployDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
        carActor.style.left = "calc(100% + 80px)";

        cardData.forEach((item) => {
          const triggerTime = Math.max(120, item.ratio * deployDuration - 80);
          setTimeout(() => {
            // Friction flare spark
            if (fxLayer) {
              const flare = document.createElement("div");
              flare.className = "fx-stamp-flare";
              flare.style.left = `${item.x - 30}px`;
              flare.style.top = `${item.y - 30}px`;
              fxLayer.appendChild(flare);
              setTimeout(() => flare.remove(), 600);
            }

            setDissolvedIndexes((prev) => prev.filter((id) => id !== item.idx));
            setDeployingIndexes((prev) => [...prev, item.idx]);
          }, triggerTime);
        });

        setTimeout(() => {
          carActor.style.transition = "none";
          carActor.style.left = "-220px";
          isAnimatingRef.current = false;
        }, deployDuration + 400);
      }, 700);
    }, sweepDuration + 200);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      runRunwayCycle();
    }, 9000);
    return () => clearInterval(timer);
  }, [activeBatchIdx]);

  const currentBatch = RUNWAY_BATCHES[activeBatchIdx];

  return (
    <section className="brand-strip-section" id="brand-runway-section">
      <div className="max-w-7xl">
        <div className="runway-header">
          <h2 className="section-h2" style={{ marginBottom: "0.25rem" }}>
            Prestigious Automotive Marques
          </h2>
          <p className="runway-subtext">
            Official luxury dealerships & certified engineering partners at DREAM CAR HOUSE.
          </p>
        </div>

        {/* Asphalt Runway Track */}
        <div
          ref={trackRef}
          className="runway-track-wrapper"
          id="runway-track-wrapper"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
        >
          {/* Road Surface */}
          <div className="runway-road-surface">
            <div className="runway-speed-lines"></div>
            <div className="runway-center-dashes"></div>
          </div>

          {/* Dynamic Particle FX Layer */}
          <div ref={fxLayerRef} className="runway-fx-layer" id="runway-fx-layer"></div>

          {/* The Moving Car Actor */}
          <div ref={carActorRef} className="runway-car-actor" id="runway-car-actor"></div>

          {/* The 8 Brand Logos in ONE Single Line */}
          <div className="brand-runway-row" id="brand-runway-row">
            {currentBatch.brands.map((brand, i) => {
              const isDissolved = dissolvedIndexes.includes(i);
              const isDeploying = deployingIndexes.includes(i);

              return (
                <div
                  key={`${brand.name}-${i}`}
                  className={`runway-brand-card ${isDissolved ? "is-dissolved" : ""} ${
                    isDeploying ? "is-deploying" : ""
                  }`}
                  data-index={i}
                  onClick={() => filterByBrand(brand.filterBrand)}
                  title={`View ${brand.name} Collection`}
                >
                  <div className="brand-badge-inner">
                    <div
                      style={{ display: "contents" }}
                      dangerouslySetInnerHTML={{ __html: brand.svg }}
                    />
                    <span className="runway-brand-name">{brand.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

