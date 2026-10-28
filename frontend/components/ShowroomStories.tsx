"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUI } from "@/lib/UIContext";
import { playNextSupercarSound } from "@/lib/audioEngine";
import type { PublicSiteSettings, PublicVehicle } from "@/lib/types";

export interface ShowroomStoryItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  priceNote: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  whatsappMessage: string;
  timeAgo: string;
  brand: string;
  accentColor: string;
}

function getBrandAccentColor(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes("mercedes")) return "#38bdf8";
  if (b.includes("toyota")) return "#ef4444";
  if (b.includes("bmw")) return "#3b82f6";
  if (b.includes("lexus")) return "#f59e0b";
  if (b.includes("porsche")) return "#ec4899";
  if (b.includes("land rover")) return "#22c55e";
  if (b.includes("byd")) return "#06b6d4";
  if (b.includes("audi")) return "#a855f7";
  return "#10b981";
}

const SHOWROOM_STORIES: ShowroomStoryItem[] = [
  {
    id: "g580",
    tag: "NEW ARRIVAL • KAKRAIL SHOWROOM",
    title: "2025 Mercedes-Benz G 580 EQ",
    subtitle: "1,164 Nm Torque • 4 Individual Electric Motors • Bespoke Nappa Leather",
    priceNote: "Available in Showroom",
    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1600&q=85",
    ctaText: "Inspect Vehicle",
    ctaLink: "/cars/mercedes-benz-g-580-2025-black",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Mercedes-Benz G 580 from your Showroom Story.",
    timeAgo: "2h ago",
    brand: "Mercedes-Benz",
    accentColor: "#38bdf8",
  },
  {
    id: "lc250",
    tag: "FLAGSHIP 4WD • GULSHAN AVENUE",
    title: "2024 Land Cruiser 250 First Edition",
    subtitle: "2400cc Turbo Hybrid • Full-Time 4WD with Torsen Differential • Rigid Chassis",
    priceNote: "Immediate Delivery (5,000 km)",
    image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1600&q=85",
    ctaText: "Inspect Vehicle",
    ctaLink: "/cars/toyota-land-cruiser-250-2024-black-5000km",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Land Cruiser 250 from your Showroom Story.",
    timeAgo: "4h ago",
    brand: "Toyota",
    accentColor: "#ef4444",
  },
  {
    id: "x7",
    tag: "VIP ALLOCATION • GULSHAN LOUNGE",
    title: "BMW X7 xDrive40i M-Sport Package",
    subtitle: "Sky Lounge Panoramic LED Roof • 6-Seater Executive Lounge • 3000cc TwinPower Turbo",
    priceNote: "Brand New Condition (13,000 km)",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=85",
    ctaText: "Inspect Vehicle",
    ctaLink: "/cars/bmw-x7-xdrive40i-2022-black-13000km",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the BMW X7 M-Sport from your Showroom Story.",
    timeAgo: "6h ago",
    brand: "BMW",
    accentColor: "#3b82f6",
  },
  {
    id: "lx600",
    tag: "PRESTIGE COLLECTION • KAKRAIL",
    title: "2023 Lexus LX 600 Ultra Luxury",
    subtitle: "4-Seater Ottoman VIP Suite • 48° Reclining Rear Massage Seats • 3.5L Twin-Turbo V6",
    priceNote: "Prestige Spec • Call for Price",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85",
    ctaText: "Explore Collection",
    ctaLink: "/inventory?brand=Lexus",
    whatsappMessage: "Hello Dream Car House, I saw the Lexus LX 600 in your Stories. What is the current price?",
    timeAgo: "9h ago",
    brand: "Lexus",
    accentColor: "#f59e0b",
  },
  {
    id: "bespoke",
    tag: "CONCIERGE • BESPOKE IMPORT",
    title: "Direct Japan & European Custom Order",
    subtitle: "Order any Rolls-Royce, Porsche GT3, or Maybach spec with white-glove import & registration",
    priceNote: "VIP Concierge Service",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85",
    ctaText: "Connect to Consult",
    ctaLink: "/contact",
    whatsappMessage: "Hello Dream Car House, I want to consult about custom importing a bespoke luxury car.",
    timeAgo: "12h ago",
    brand: "DREAM CAR HOUSE",
    accentColor: "#10b981",
  },
];

const STORY_DURATION_MS = 5200; // 5.2 seconds per story slide

export default function ShowroomStories({
  settings,
  vehicles,
}: {
  settings?: PublicSiteSettings;
  vehicles?: PublicVehicle[];
} = {}) {
  const { isStoriesOpen, closeStories } = useUI();
  const router = useRouter();

  const activeStories = React.useMemo<ShowroomStoryItem[]>(() => {
    if (vehicles && vehicles.length > 0) {
      return vehicles.slice(0, 8).map((car, idx) => {
        const branchTag = car.branch_name || car.branch?.name || "DHAKA SHOWROOM";
        const typeLabel = car.car_type === "BRAND_NEW" ? "BRAND NEW ARRIVAL" : "CERTIFIED PRE-OWNED";
        const specsList = [
          car.engine_capacity,
          car.mileage,
          car.fuel_type,
          car.drivetrain,
        ].filter(Boolean);

        return {
          id: String(car.slug || car.id || idx),
          tag: `${typeLabel} • ${branchTag.toUpperCase()}`,
          title: `${car.year ? `${car.year} ` : ""}${car.name}`,
          subtitle: specsList.join(" • ") || "Handpicked luxury allocation at Dream Car House.",
          priceNote: car.price || "Call for Price",
          image: car.image || "/assets/maybach_hero_poster.jpg",
          ctaText: "Inspect Vehicle",
          ctaLink: `/cars/${car.slug || car.id}`,
          whatsappMessage: `Hello ${settings?.name || "Dream Car House"}, I want to inquire about the ${car.name} from your Showroom Story.`,
          timeAgo: `${(idx + 1) * 2}h ago`,
          brand: car.brand || settings?.name || "DREAM CAR HOUSE",
          accentColor: getBrandAccentColor(car.brand || ""),
        };
      });
    }
    return SHOWROOM_STORIES;
  }, [vehicles, settings]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  // Advance to next story
  const nextStory = useCallback(() => {
    if (currentIndex < activeStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
      if (!isMuted) {
        playNextSupercarSound();
      }
    } else {
      // Loop or close stories when all finished
      closeStories();
    }
  }, [currentIndex, activeStories.length, isMuted, closeStories]);

  // Go to previous story
  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
    } else {
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimeRef.current = Date.now();
    }
  }, [currentIndex]);

  // Handle active progress bar timing
  useEffect(() => {
    if (!isStoriesOpen) {
      setCurrentIndex(0);
      setProgress(0);
      setIsPaused(false);
      elapsedBeforePauseRef.current = 0;
      return;
    }

    if (isPaused) {
      return;
    }

    const interval = 40; // 40ms tick for 60fps smoothness
    const timer = setInterval(() => {
      const now = Date.now();
      const totalElapsed = elapsedBeforePauseRef.current + (now - startTimeRef.current);
      const newProgress = Math.min(100, (totalElapsed / STORY_DURATION_MS) * 100);

      setProgress(newProgress);

      if (totalElapsed >= STORY_DURATION_MS) {
        clearInterval(timer);
        nextStory();
      }
    }, interval);

    timerRef.current = timer;

    return () => clearInterval(timer);
  }, [isStoriesOpen, isPaused, currentIndex, nextStory]);

  // Play sound on initial open
  useEffect(() => {
    if (isStoriesOpen && !isMuted) {
      playNextSupercarSound();
    }
  }, [isStoriesOpen]);

  // Hold to pause handlers
  const handleHoldStart = () => {
    if (!isPaused) {
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      setIsPaused(true);
    }
  };

  const handleHoldEnd = () => {
    if (isPaused) {
      startTimeRef.current = Date.now();
      setIsPaused(false);
    }
  };

  // Click on screen: left 35% = prev, right 65% = next
  const handleStoryTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;

    if (ratio < 0.35) {
      prevStory();
    } else {
      nextStory();
    }
  };

  const handleCtaClick = (link: string) => {
    closeStories();
    router.push(link);
  };

  if (!isStoriesOpen) return null;

  const current = activeStories[currentIndex] || activeStories[0];

  const targetPhone = settings?.whatsapp || settings?.hotline || "";
  let waPhone = targetPhone.replace(/[^0-9]/g, "");
  if (waPhone.startsWith("0")) {
    waPhone = "88" + waPhone;
  } else if (waPhone && !waPhone.startsWith("880") && waPhone.length === 10) {
    waPhone = "880" + waPhone;
  }
  const waUrl = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(current.whatsappMessage)}`
    : "";

  return (
    <div className="stories-modal-backdrop" id="stories-modal-backdrop" onClick={closeStories}>
      <div
        className="stories-viewer-container"
        id="stories-viewer-container"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
      >
        {/* Story Progress Bars */}
        <div className="story-progress-strip">
          {activeStories.map((item, idx) => {
            let fillPct = 0;
            if (idx < currentIndex) fillPct = 100;
            else if (idx === currentIndex) fillPct = progress;

            return (
              <div key={item.id} className="story-progress-track">
                <div
                  className="story-progress-fill"
                  style={{
                    width: `${fillPct}%`,
                    backgroundColor: idx === currentIndex ? item.accentColor : "#ffffff",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Top Header Bar */}
        <div className="story-top-header">
          <div className="story-account-info">
            <div className="story-avatar-gold-ring">
              <span className="story-avatar-star">✦</span>
            </div>
            <div>
              <div className="story-account-name-row">
                <span className="story-account-title">DREAM CAR HOUSE</span>
                <span className="story-verified-check">✓</span>
              </div>
              <span className="story-timestamp">{current.timeAgo} • VIP Showroom Live</span>
            </div>
          </div>

          <div className="story-header-actions">
            {/* Pause Indicator */}
            {isPaused && <span className="story-pause-badge">PAUSED</span>}

            {/* Sound Toggle Button */}
            <button
              type="button"
              className="story-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? "Unmute Engine Audio" : "Mute Engine Audio"}
              aria-label="Toggle Story Audio"
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              className="story-icon-btn story-close-btn"
              onClick={(e) => {
                e.stopPropagation();
                closeStories();
              }}
              title="Close Stories (ESC)"
              aria-label="Close Stories"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Story Media / Image Area */}
        <div className="story-media-area" onClick={handleStoryTap}>
          <Image
            key={current.id}
            src={current.image}
            alt={current.title}
            fill
            className="story-bg-image"
            priority
            sizes="(max-width: 768px) 100vw, 450px"
          />

          {/* Vignette Gradients */}
          <div className="story-vignette-top"></div>
          <div className="story-vignette-bottom"></div>

          {/* Tap Navigation Hints (Invisible touch targets) */}
          <div className="story-tap-left" title="Tap for Previous Story"></div>
          <div className="story-tap-right" title="Tap for Next Story"></div>
        </div>

        {/* Story Bottom Content & Actions */}
        <div className="story-bottom-content">
          <div
            className="story-tag-pill"
            style={{
              backgroundColor: `${current.accentColor}22`,
              borderColor: `${current.accentColor}66`,
              color: current.accentColor,
            }}
          >
            <span className="story-tag-pulse" style={{ backgroundColor: current.accentColor }}></span>
            <span>{current.tag}</span>
          </div>

          <h3 className="story-headline">{current.title}</h3>
          <p className="story-subheadline">{current.subtitle}</p>

          <div className="story-meta-row">
            <span className="story-price-pill">{current.priceNote}</span>
            <span className="story-slide-counter">
              Story {currentIndex + 1} of {activeStories.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="story-action-buttons">
            <button
              type="button"
              className="story-primary-cta"
              onClick={(e) => {
                e.stopPropagation();
                handleCtaClick(current.ctaLink);
              }}
            >
              <span>{current.ctaText}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="story-whatsapp-cta"
                onClick={(e) => e.stopPropagation()}
                title="Chat with VIP Concierge on WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
