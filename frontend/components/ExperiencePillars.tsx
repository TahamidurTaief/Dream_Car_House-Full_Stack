"use client";

import React from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";

export default function ExperiencePillars() {
  const { openVideoModal } = useUI();

  return (
    <section className="experience-section max-w-7xl" id="experience">
      <div className="experience-header">
        <div className="experience-header-text">
          <div className="experience-eyebrow">
            <span className="experience-pulse-dot"></span>
            <span>ATELIER EXCELLENCE</span>
          </div>
          <h2 className="experience-title">Experience Beyond Ordinary at DREAM CAR HOUSE</h2>
          <p className="experience-subtitle">
            Dhaka's benchmark in high-luxury automotive delivery, certified diagnostic inspection, and bespoke global procurement.
          </p>
        </div>
        <div className="experience-header-action">
          <button className="see-video-btn" onClick={() => openVideoModal("reel")}>
            <div className="video-play-circle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
            <span>Watch Showroom Reel</span>
          </button>
        </div>
      </div>

      <div className="experience-pillars-grid">
        {/* Pillar 01: The VIP Delivery Vault */}
        <div className="experience-card">
          <div className="experience-card-media">
            <Image
              src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80"
              alt="VIP Delivery Vault"
              width={600}
              height={400}
              loading="lazy"
            />
            <div className="experience-card-gradient"></div>
            <div className="experience-card-badge">PRIVATE SANCTUARY</div>
            <div className="experience-card-num">01</div>
          </div>
          <div className="experience-card-content">
            <h3 className="experience-card-title">The VIP Delivery Vault</h3>
            <p className="experience-card-desc">
              An exclusive private handover suite featuring theatrical automotive unveiling, champagne reception, and confidential documentation transfer.
            </p>
            <div className="experience-card-tags">
              <span className="exp-tag">Soundproof Suite</span>
              <span className="exp-tag">Ceremonial Reveal</span>
            </div>
          </div>
        </div>

        {/* Pillar 02: 150-Point Certified Audit */}
        <div className="experience-card">
          <div className="experience-card-media">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
              alt="150-Point Certified Audit"
              width={600}
              height={400}
              loading="lazy"
            />
            <div className="experience-card-gradient"></div>
            <div className="experience-card-badge">PRECISION AUDIT</div>
            <div className="experience-card-num">02</div>
          </div>
          <div className="experience-card-content">
            <h3 className="experience-card-title">150-Point Certified Audit</h3>
            <p className="experience-card-desc">
              Exhaustive computerized diagnostics, chassis integrity checks, battery health analysis, and robotic paint-depth verification before showroom induction.
            </p>
            <div className="experience-card-tags">
              <span className="exp-tag">Computer Diagnostics</span>
              <span className="exp-tag">Zero Imperfection</span>
            </div>
          </div>
        </div>

        {/* Pillar 03: White-Glove Global Procurement */}
        <div className="experience-card">
          <div className="experience-card-media">
            <Image
              src="https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=80"
              alt="White-Glove Global Concierge"
              width={600}
              height={400}
              loading="lazy"
            />
            <div className="experience-card-gradient"></div>
            <div className="experience-card-badge">BESPOKE IMPORT</div>
            <div className="experience-card-num">03</div>
          </div>
          <div className="experience-card-content">
            <h3 className="experience-card-title">Global Bespoke Concierge</h3>
            <p className="experience-card-desc">
              Direct sourcing of rare luxury allocations from London, Stuttgart, and Tokyo. Secured container logistics, customs facilitation, and doorstep delivery.
            </p>
            <div className="experience-card-tags">
              <span className="exp-tag">UK & Japan Sourcing</span>
              <span className="exp-tag">Turnkey Import</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
