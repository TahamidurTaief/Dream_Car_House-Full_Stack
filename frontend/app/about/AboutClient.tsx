"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";

export default function AboutClient() {
  const { openVideoModal, openAppointmentModal } = useUI();

  return (
    <div className="about-page-wrap">
      {/* 1. Cinematic Hero Header */}
      <section className="about-hero-section">
        <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
          <Image
            src="/assets/dch-logo.webp"
            alt="DREAM CAR HOUSE Flagship Logo"
            width={180}
            height={68}
            style={{ height: "52px", width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}
            priority
          />
        </div>
        <div className="about-pill-badge">
          THE DREAM CAR HOUSE STORY
        </div>
        <h1 className="about-main-title">
          Where Automotive Passion Meets Unrivaled Luxury
        </h1>
        <p className="about-hero-sub">
          Dhaka&apos;s benchmark in factory-fresh zero-meter imports, bespoke executive saloons, and confidential white-glove automotive advisory.
        </p>
      </section>

      {/* 2. Key Showroom Trust Metrics */}
      <section className="about-stats-grid" aria-label="Showroom Key Metrics">
        <div className="about-stat-card">
          <div className="about-stat-num">15+</div>
          <div className="about-stat-label">Years of Motoring Trust</div>
        </div>
        <div className="about-stat-card">
          <div className="about-stat-num">150+</div>
          <div className="about-stat-label">Point Diagnostic Audit</div>
        </div>
        <div className="about-stat-card">
          <div className="about-stat-num">100%</div>
          <div className="about-stat-label">Verified Global Provenance</div>
        </div>
        <div className="about-stat-card">
          <div className="about-stat-num">2</div>
          <div className="about-stat-label">Dhaka Flagship Showrooms</div>
        </div>
      </section>

      {/* 3. Split Editorial Heritage Story with Interactive Showroom Reel */}
      <section className="about-story-split">
        {/* Interactive Showroom Reel Player Card */}
        <div
          className="about-reel-card group"
          onClick={() => openVideoModal("reel")}
          title="Click to Watch DREAM CAR HOUSE 4K Showroom Cinematic Reel"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openVideoModal("reel");
            }
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85"
            alt="DREAM CAR HOUSE Flagship Luxury Showroom Floor"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="about-reel-overlay"></div>

          {/* Central Pulsing Play Button */}
          <div className="about-reel-play-center">
            <div className="about-play-circle" aria-label="Play Reel">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="7 4 20 12 7 20 7 4" />
              </svg>
            </div>
            <span className="about-play-label">WATCH SHOWROOM REEL</span>
          </div>

          {/* Bottom Bar Info */}
          <div className="about-reel-bottom">
            <span className="about-reel-title-sub">Flagship Automotive Showcase</span>
            <span className="about-reel-duration-pill">4K REEL • 01:45</span>
          </div>
        </div>

        {/* Editorial Text */}
        <div className="about-story-text">
          <span className="about-story-eyebrow">OUR HERITAGE & PHILOSOPHY</span>
          <h2 className="about-story-title">
            An Uncompromising Pursuit of Automotive Perfection
          </h2>
          <p className="about-story-p">
            DREAM CAR HOUSE was founded with a singular, uncompromising vision: to establish Dhaka’s foremost luxury automotive destination where discerning connoisseurs can explore, acquire, and commission the world&apos;s most coveted motorcars with absolute peace of mind.
          </p>
          <p className="about-story-p">
            Operating across two flagship showrooms in <strong>Kakrail (Shaheed Captain Monsur Ali Soroni)</strong> and <strong>Gulshan Avenue (Road #127)</strong>, our curated portfolio encompasses zero-meter factory imports, bespoke executive saloons, track-bred supercars, and certified pre-owned collectors&apos; editions from Mercedes-Maybach, Rolls-Royce, Porsche, Lexus, BMW, and Toyota.
          </p>

          <div className="about-quote-box">
            <p>
              &ldquo;We do not merely deliver motorcars; we curate trust, pedigree, and lifelong relationships for Dhaka&apos;s most discerning motorists.&rdquo;
            </p>
          </div>

          <button
            type="button"
            className="see-video-btn"
            onClick={() => openVideoModal("tour")}
            style={{ alignSelf: "flex-start", marginTop: "0.25rem" }}
          >
            <div className="video-play-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
            <span>Watch Full Showroom Tour (02:30)</span>
          </button>
        </div>
      </section>

      {/* 4. The 4 Pillars of Showroom Distinction */}
      <section className="about-pillars-section">
        <div className="about-section-header">
          <span className="about-story-eyebrow">THE FOUR PILLARS</span>
          <h2 className="about-section-title">Why Connoisseurs Choose DREAM CAR HOUSE</h2>
        </div>

        <div className="about-pillars-grid">
          {/* Pillar 1 */}
          <div className="about-pillar-card">
            <div className="about-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="about-pillar-title">Direct Global Import</h3>
            <p className="about-pillar-desc">
              Exclusive relationships with premier authorized dealerships in Stuttgart, Tokyo, and London facilitate direct, turnkey container importation with verified manifests.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="about-pillar-card">
            <div className="about-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="about-pillar-title">150+ Point Diagnostic Audit</h3>
            <p className="about-pillar-desc">
              Every vehicle undergoes exhaustive computerized diagnostic scans, chassis laser measurements, high-voltage battery audits, and genuine BRTA paper verifications.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="about-pillar-card">
            <div className="about-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="about-pillar-title">Private Handover Vault</h3>
            <p className="about-pillar-desc">
              An exclusive soundproof delivery sanctuary featuring theatrical automotive unveilings, champagne reception, and confidential documentation management.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="about-pillar-card">
            <div className="about-pillar-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
            </div>
            <h3 className="about-pillar-title">White-Glove Concierge</h3>
            <p className="about-pillar-desc">
              Lifetime vehicle documentation support, tailored financing advisory, genuine factory parts procurement, and guaranteed priority buy-back valuations.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Physical Showroom Sanctuaries in Dhaka */}
      <section className="about-branches-section">
        <div className="about-section-header">
          <span className="about-story-eyebrow">VISIT OUR SHOWROOMS</span>
          <h2 className="about-section-title">Two Flagship Sanctuaries Across Dhaka</h2>
        </div>

        <div className="about-branches-grid">
          {/* Branch 1: Kakrail */}
          <div className="about-branch-card">
            <div>
              <span className="about-branch-tag">PRIMARY SHOWROOM & VAULT</span>
              <h3 className="about-branch-name">Kakrail Flagship Showroom</h3>
              <p className="about-branch-address">
                18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000
              </p>

              <div className="about-branch-features">
                <span className="about-branch-pill">Main Display Floor</span>
                <span className="about-branch-pill">Private Handover Vault</span>
                <span className="about-branch-pill">Diagnostic Lab</span>
              </div>

              <div className="about-branch-timing">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Sat – Thu: 10:00 AM – 9:00 PM (Fri Closed)</span>
              </div>
            </div>

            <div className="about-branch-actions">
              <a
                href="https://maps.google.com/?q=Kakrail,Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="about-dir-btn"
              >
                <span>Get Directions</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="tel:01615121312" className="about-call-btn">
                <span>01615-121312</span>
              </a>
            </div>
          </div>

          {/* Branch 2: Gulshan */}
          <div className="about-branch-card">
            <div>
              <span className="about-branch-tag">BOUTIQUE CONSULTATION DESK</span>
              <h3 className="about-branch-name">Gulshan Avenue Lounge</h3>
              <p className="about-branch-address">
                Road #127, Gulshan Avenue, Gulshan-2, Dhaka-1212
              </p>

              <div className="about-branch-features">
                <span className="about-branch-pill">Executive Consultation</span>
                <span className="about-branch-pill">Bespoke Custom Orders</span>
                <span className="about-branch-pill">VIP Coffee Bar</span>
              </div>

              <div className="about-branch-timing">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Sat – Thu: 11:00 AM – 8:00 PM (Fri Closed)</span>
              </div>
            </div>

            <div className="about-branch-actions">
              <a
                href="https://maps.google.com/?q=Gulshan+Avenue,Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="about-dir-btn"
              >
                <span>Get Directions</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="tel:01615121312" className="about-call-btn">
                <span>01615-121312</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VIP Consultation Concierge CTA with Glowing WhatsApp Button */}
      <section className="about-cta-card">
        <h2 className="about-cta-title">
          Experience The Difference in Person
        </h2>
        <p className="about-cta-desc">
          Schedule an exclusive showroom walkthrough or speak directly with our senior automotive curators to discuss custom procurement of your next masterpiece.
        </p>

        <div className="about-cta-btn-group">
          {/* Custom Styled Emerald WhatsApp Button */}
          <a
            href="https://wa.me/8801615121312?text=Hello%20Dream%20Car%20House,%20I%20would%20like%20to%20schedule%20a%20private%20showroom%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="about-wa-btn"
            id="about-wa-consult-btn"
            title="Chat directly with Senior Showroom Concierge on WhatsApp"
          >
            <svg viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Inquire on WhatsApp</span>
          </a>

          <Link
            href="/inventory"
            className="consult-primary-btn"
            style={{ padding: "0.9rem 2rem", fontSize: "0.95rem" }}
          >
            <span>Explore Current Inventory</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            type="button"
            className="gallery-btn-secondary"
            onClick={openAppointmentModal}
            style={{ padding: "0.9rem 2rem", fontSize: "0.95rem", cursor: "pointer" }}
          >
            <span>Schedule Showroom Tour</span>
          </button>
        </div>
      </section>
    </div>
  );
}
