"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import { playSupercarRevSound } from "@/lib/audioEngine";

export default function Header() {
  const { isDrawerOpen, openDrawer, closeDrawer } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWheelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDrawerOpen) {
      closeDrawer();
      return;
    }

    // Play supercar engine rev & burnout sound
    playSupercarRevSound();

    // Trigger 1440° burnout spin animation
    setIsSpinning(true);

    // Open hypercar drawer after burnout spin reaches high speed
    setTimeout(() => {
      setIsSpinning(false);
      openDrawer();
    }, 1150);
  };

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* Left Sparkle / AI Button */}
        <div>
          <button
            className="header-ai-btn"
            onClick={openDrawer}
            title="Explore VIP Showroom Features"
            aria-label="Explore VIP Showroom Features"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              <path d="M20 3v4"></path>
              <path d="M22 5h-4"></path>
              <path d="M4 17v2"></path>
              <path d="M5 18H3"></path>
            </svg>
          </button>
        </div>

        {/* Center Logo (Strictly Centered) */}
        <div className="header-logo">
          <Link href="/">
            <div className="logo-text">DREAM CAR HOUSE</div>
          </Link>
        </div>

        {/* Right Corner: 3D Photorealistic Supercar Wheel Trigger */}
        <div>
          <button
            className={`header-wheel-trigger ${isSpinning ? "wheel-spinning" : ""} ${isDrawerOpen ? "menu-active" : ""}`}
            id="header-menu-btn"
            onClick={handleWheelClick}
            aria-label="Open Luxury Showroom Menu"
            title="Click to Spin Wheel & Launch Supercar Menu"
          >
            <div className="wheel-disc-wrapper">
              <Image
                src="/assets/supercar_wheel.png"
                alt="Supercar Forged Wheel"
                width={54}
                height={54}
                className="realistic-wheel-img"
                priority
              />
              <div className="wheel-light-sweep"></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
