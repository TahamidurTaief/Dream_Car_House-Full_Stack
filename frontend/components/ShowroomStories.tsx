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
    tag: "BRAND NEW ARRIVAL • KAKRAIL MAIN VAULT",
    title: "Mercedes-Benz G 580 Electric",
    subtitle: "Quad-Motor Edition ONE • 116 kWh Battery • G-Turn Capable",
    priceNote: "Exclusive Allocation • BDT 4.85 Crore",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1400&q=90",
    ctaText: "Inspect G 580 Vault",
    ctaLink: "/cars/mercedes-g580-electric",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Mercedes-Benz G 580 Electric from your Showroom Story.",
    timeAgo: "2h ago",
    brand: "MERCEDES-BENZ",
    accentColor: "#38bdf8",
  },
  {
    id: "gt3rs",
    tag: "TRACK WEAPON • GULSHAN SHOWROOM",
    title: "Porsche 911 GT3 RS (992)",
    subtitle: "Weissach Package • 4.0L Naturally Aspirated • 9,000 RPM",
    priceNote: "Private Vault Stock • BDT 5.40 Crore",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90",
    ctaText: "View GT3 RS Details",
    ctaLink: "/cars/porsche-911-gt3-rs",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Porsche 911 GT3 RS from your Showroom Story.",
    timeAgo: "4h ago",
    brand: "PORSCHE",
    accentColor: "#ec4899",
  },
  {
    id: "lc250",
    tag: "FIRST EDITION • READY FOR HANDOVER",
    title: "Toyota Land Cruiser 250",
    subtitle: "Heritage Round LEDs • 2.4L i-FORCE MAX Turbo Hybrid 4WD",
    priceNote: "Showroom Ready • BDT 2.65 Crore",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=90",
    ctaText: "Schedule LC 250 Test",
    ctaLink: "/cars/land-cruiser-250-first-edition",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Land Cruiser 250 First Edition from your Showroom Story.",
    timeAgo: "6h ago",
    brand: "TOYOTA",
    accentColor: "#ef4444",
  },
  {
    id: "maybach",
    tag: "V12 PINNACLE • FIRST CLASS SUITE",
    title: "Mercedes-Maybach S 680",
    subtitle: "6.0L Bi-Turbo V12 • 621 HP • Two-Tone Nautical Blue / High-Tech Silver",
    priceNote: "VIP Flagship Allocation",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=90",
    ctaText: "Reserve Maybach Lounge",
    ctaLink: "/cars/mercedes-maybach-s680",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Mercedes-Maybach S 680 from your Showroom Story.",
    timeAgo: "12h ago",
    brand: "MAYBACH",
    accentColor: "#eab308",
  },
  {
    id: "defender",
    tag: "V8 CARPATHIAN • GULSHAN ATELIER",
    title: "Land Rover Defender 110 V8",
    subtitle: "5.0L Supercharged V8 518 HP • Satin Protective Film • Quad Exhausts",
    priceNote: "In Showroom • BDT 3.25 Crore",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=90",
    ctaText: "Explore Defender V8",
    ctaLink: "/cars/defender-110-v8-carpathian",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Defender 110 V8 from your Showroom Story.",
    timeAgo: "1d ago",
    brand: "LAND ROVER",
    accentColor: "#22c55e",
  },
  {
    id: "lx600",
    tag: "VIP 4-SEATER EXECUTIVE • VIP SUITE",
    title: "Lexus LX 600 VIP Executive",
    subtitle: "Twin-Turbo 3.5L V6 • Rear Ottoman Recliner • Mark Levinson 25-Speaker",
    priceNote: "Direct Allocation • BDT 3.95 Crore",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=90",
    ctaText: "Book LX 600 Viewing",
    ctaLink: "/cars/lexus-lx600-vip",
    whatsappMessage: "Hello Dream Car House, I want to inquire about the Lexus LX 600 VIP from your Showroom Story.",
    timeAgo: "2d ago",
    brand: "LEXUS",
    accentColor: "#f59e0b",
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

  const startTimestampRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Advance to next story
  const nextStory = useCallback(() => {
    if (currentIndex < activeStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimestampRef.current = performance.now();
      if (!isMuted) {
        playNextSupercarSound();
      }
    } else {
      closeStories();
    }
  }, [currentIndex, activeStories.length, isMuted, closeStories]);

  // Go to previous story
  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimestampRef.current = performance.now();
      if (!isMuted) {
        playNextSupercarSound();
      }
    } else {
      setProgress(0);
      elapsedBeforePauseRef.current = 0;
      startTimestampRef.current = performance.now();
    }
  }, [currentIndex, isMuted]);

  // Main 60fps timer animation loop
  useEffect(() => {
    if (!isStoriesOpen) return;

    startTimestampRef.current = performance.now() - elapsedBeforePauseRef.current;

    const tick = (now: number) => {
      if (!isPaused) {
        const elapsed = now - startTimestampRef.current;
        const currentProgress = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);
        setProgress(currentProgress);

        if (elapsed >= STORY_DURATION_MS) {
          nextStory();
          return;
        }
      } else {
        startTimestampRef.current = now - elapsedBeforePauseRef.current;
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isStoriesOpen, currentIndex, isPaused, nextStory]);

  // Keyboard controls
  useEffect(() => {
    if (!isStoriesOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeStories();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        nextStory();
      } else if (e.key === "ArrowLeft") {
        prevStory();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStoriesOpen, nextStory, prevStory, closeStories]);

  // Reset when opening
  useEffect(() => {
    if (isStoriesOpen) {
      setCurrentIndex(0);
      setProgress(0);
      setIsPaused(false);
      elapsedBeforePauseRef.current = 0;
      document.body.style.overflow = "hidden";
      playNextSupercarSound();
    } else {
      document.body.style.overflow = "";
    }
  }, [isStoriesOpen]);

  // Pause on touch/mouse hold
  const handleHoldStart = () => {
    setIsPaused(true);
    elapsedBeforePauseRef.current = (progress / 100) * STORY_DURATION_MS;
  };

  const handleHoldEnd = () => {
    setIsPaused(false);
    startTimestampRef.current = performance.now() - elapsedBeforePauseRef.current;
  };

  const handleNavigateToCar = (link: string) => {
    closeStories();
    router.push(link);
  };

  if (!isStoriesOpen) return null;

  const current = activeStories[currentIndex] || activeStories[0];

  const targetPhone = settings?.whatsapp || settings?.hotline || "8801615121312";
  let waPhone = targetPhone.replace(/[^0-9]/g, "");
  if (waPhone.startsWith("0")) {
    waPhone = "88" + waPhone;
  } else if (waPhone && !waPhone.startsWith("880") && waPhone.length === 10) {
    waPhone = "880" + waPhone;
  }
  if (!waPhone) waPhone = "8801615121312";

  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(current.whatsappMessage)}`;

  return (
    <div className="stories-modal-backdrop" id="stories-modal-backdrop" onClick={closeStories}>
      <div
        className="story-viewer-card"
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
              <div key={item.id} className="story-bar-track">
                <div
                  className="story-bar-fill"
                  style={{
                    width: `${fillPct}%`,
                    backgroundColor: idx === currentIndex ? item.accentColor : "#ffffff",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header */}
        <div className="story-header-overlay">
          <div className="story-creator-info">
            <div className="story-creator-avatar">
              <Image
                src="/assets/dch-logo.webp"
                alt="DREAM CAR HOUSE"
                width={1020}
                height={350}
                style={{ width: "36px", height: "auto", objectFit: "contain" }}
                unoptimized
              />
            </div>
            <div className="story-creator-texts">
              <span className="story-creator-title">{current.brand}</span>
              <span className="story-creator-sub">{current.timeAgo} • VIP Showroom Spotlight</span>
            </div>
          </div>

          <div className="story-header-actions">
            <button
              className="story-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              title={isMuted ? "Unmute Supercar Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>

            <button
              className="story-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                closeStories();
              }}
              title="Close Stories (Esc)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Story Background Photo */}
        <div className="story-photo-canvas">
          <Image
            src={current.image}
            alt={current.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 440px"
            className="story-canvas-img"
          />
          <div className="story-photo-vignette" />
        </div>

        {/* Story Tap Navigation Zones (Left 35% = Prev, Right 65% = Next) */}
        <div
          className="story-tap-zone zone-left"
          onClick={(e) => {
            e.stopPropagation();
            prevStory();
          }}
          title="Previous Story"
        />
        <div
          className="story-tap-zone zone-right"
          onClick={(e) => {
            e.stopPropagation();
            nextStory();
          }}
          title="Next Story"
        />

        {/* Story Bottom Content Card */}
        <div className="story-bottom-panel" onClick={(e) => e.stopPropagation()}>
          <div className="story-pill-row">
            <span className="story-alloc-tag" style={{ borderColor: current.accentColor, color: current.accentColor }}>
              {current.tag}
            </span>
          </div>

          <h3 className="story-headline">{current.title}</h3>
          <p className="story-subheadline">{current.subtitle}</p>

          <div className="story-meta-row">
            <span className="story-price-pill">{current.priceNote}</span>
            <span className="story-slide-counter">
              Story {currentIndex + 1} of {activeStories.length}
            </span>
          </div>

          <div className="story-interactive-row">
            <button
              className="story-primary-inspect-btn"
              onClick={() => handleNavigateToCar(current.ctaLink)}
            >
              <span>{current.ctaText}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

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
          </div>
        </div>
      </div>
    </div>
  );
}
