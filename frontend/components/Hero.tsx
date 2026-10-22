"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUI } from "@/lib/UIContext";

export default function Hero() {
  const { openAppointmentModal } = useUI();
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Show YouTube video after smooth fade-in
    const timer = setTimeout(() => {
      setIsVideoReady(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section" id="hero-section">
      {/* Background Video Engine */}
      <div className="hero-video-wrap">
        <div
          className="hero-poster-backdrop"
          id="hero-poster-backdrop"
          style={{ backgroundImage: `url('/assets/maybach_hero_poster.jpg')` }}
        />
        <iframe
          id="hero-youtube-iframe"
          className={`hero-youtube-iframe ${isVideoReady ? "is-ready" : ""}`}
          src="https://www.youtube-nocookie.com/embed/7cxfVWs4YGw?autoplay=1&mute=1&loop=1&playlist=7cxfVWs4YGw&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1&start=45"
          title="DREAM CAR HOUSE Flagship Cinema"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">The Pinnacle of Luxury Automobiles</h1>
        <div className="hero-pills">
          <Link className="hero-pill-btn" href="/inventory?type=BRAND_NEW">
            Brand New
          </Link>
          <Link className="hero-pill-btn" href="/inventory?type=PRE_OWNED">
            Pre-Owned
          </Link>
          <button className="hero-pill-btn" onClick={() => openAppointmentModal()}>
            Connect to Consult
          </button>
        </div>
      </div>

      {/* Animated Bounce Down Arrow */}
      <a href="#carousel-section" className="arrow-down animate-bounce" aria-label="Scroll to Current Inventory">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M19.281 14.0306L12.531 20.7806C12.4614 20.8504 12.3787 20.9057 12.2876 20.9434C12.1966 20.9812 12.099 21.0006 12.0004 21.0006C11.9019 21.0006 11.8043 20.9812 11.7132 20.9434C11.6222 20.9057 11.5394 20.8504 11.4698 20.7806L4.71979 14.0306C4.57906 13.8899 4.5 13.699 4.5 13.501C4.5 13.301 4.57906 13.1101 4.71979 12.9694C4.86052 12.8286 5.05139 12.7496 5.25042 12.7496C5.44944 12.7496 5.64031 12.8286 5.78104 12.9694L11.2504 18.4397V3.75C11.2504 3.55109 11.3294 3.36032 11.4701 3.21967C11.6107 3.07902 11.8015 3 12.0004 3C12.1993 3 12.3901 3.07902 12.5307 3.21967C12.6714 3.36032 12.7504 3.55109 12.7504 3.75V18.4397L18.2198 12.9694C18.3605 12.8286 18.5514 12.7496 18.7504 12.7496C18.9494 12.7496 19.1403 12.8286 19.281 12.9694C19.4218 13.1101 19.5008 13.301 19.5008 13.5C19.5008 13.699 19.4218 13.8899 19.281 14.0306Z"
            fill="white"
          />
        </svg>
      </a>
    </section>
  );
}
