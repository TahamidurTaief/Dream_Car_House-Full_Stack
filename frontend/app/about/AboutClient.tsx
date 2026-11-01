"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

export default function AboutClient({
  settings,
  branches = [],
  totalVehicles = 0,
}: {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
  totalVehicles?: number;
} = {}) {
  const { openVideoModal, openAppointmentModal } = useUI();

  const brandName = settings?.name || "DREAM CAR HOUSE";
  const targetPhone = settings?.whatsapp || settings?.hotline || "8801615121312";
  let waPhone = targetPhone.replace(/[^0-9]/g, "");
  if (waPhone.startsWith("0")) {
    waPhone = "88" + waPhone;
  } else if (waPhone && !waPhone.startsWith("880") && waPhone.length === 10) {
    waPhone = "880" + waPhone;
  }
  if (!waPhone) waPhone = "8801615121312";

  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${brandName}, I would like to schedule a private showroom consultation.`)}`;

  return (
    <div className="about-page-wrap">
      {/* 1. Cinematic Hero Header */}
      <section className="about-hero-section">
        <div style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
          <Image
            src="/assets/dch-logo.webp"
            alt={`${brandName} Flagship Logo`}
            width={1020}
            height={350}
            style={{
              height: "72px",
              width: "auto",
              maxWidth: "340px",
              objectFit: "contain",
              filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.85)) drop-shadow(0 0 16px rgba(255,255,255,0.2))",
            }}
            priority
            unoptimized
          />
        </div>
        <div className="about-pill-badge">
          THE {brandName.toUpperCase()} STORY
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
          <div className="about-stat-num">{branches.length || 2}</div>
          <div className="about-stat-label">Dhaka Flagship Showrooms</div>
        </div>
      </section>

      {/* 3. Split Editorial Heritage Story with Interactive Showroom Reel */}
      <section className="about-story-split">
        {/* Interactive Showroom Reel Player Card */}
        <div
          className="about-reel-card group"
          onClick={() => openVideoModal("reel")}
          title={`Click to Watch ${brandName} 4K Showroom Cinematic Reel`}
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
            alt={`${brandName} Flagship Luxury Showroom Floor`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="about-reel-overlay"></div>

          {/* Central Pulsing Play Button */}
          <div className="about-reel-play-circle" aria-label="Play Showroom Cinema Reel">
            <svg viewBox="0 0 24 24" className="about-play-triangle">
              <polygon points="7 4 20 12 7 20 7 4" />
            </svg>
          </div>

          {/* Bottom Reel Badge Information */}
          <div className="about-reel-bottom">
            <span className="about-reel-tag">4K SHOWROOM CINEMA REEL</span>
            <h3 className="about-reel-title">Atelier Floor Tour & Supercar Deliveries</h3>
            <span className="about-reel-hint">Click to play with engine audio ✦</span>
          </div>
        </div>

        {/* Editorial Text Narrative */}
        <div className="about-story-text">
          <span className="about-story-eyebrow">DISTINCTION IN AUTOMOTIVE CURATION</span>
          <h2 className="about-story-heading">Pioneering Luxury Automotive Excellence Across Bangladesh</h2>
          <p className="about-story-p">
            Established with a singular ambition, <strong>{brandName}</strong> has redefined high-end vehicle acquisition in Dhaka. We cater to discerning connoisseurs who demand uncompromising elegance, exceptional mechanical integrity, and absolute transparency.
          </p>
          <p className="about-story-p">
            From zero-kilometer European flagship sedans to custom-spec Japanese hybrid SUVs and hypercars, every automobile in our atelier undergoes an exhaustive 150-point technical provenance check before joining our showroom vaults in Kakrail and Gulshan.
          </p>
          <p className="about-story-p">
            Our private client directors provide end-to-end bespoke concierge services—handling custom global procurement, factory warranty extensions, registration documentation, and ceremonial private handovers.
          </p>

          <div className="about-story-features">
            <div className="about-feature-item">
              <div className="about-feat-check">✓</div>
              <div>
                <strong>Global Auction Grade 5A & 4.5</strong>
                <p>Only the highest-rated Japanese auction sheets with verified original certificates.</p>
              </div>
            </div>
            <div className="about-feature-item">
              <div className="about-feat-check">✓</div>
              <div>
                <strong>Factory-Direct European Orders</strong>
                <p>Bespoke allocations from Mercedes-Benz, Porsche, Range Rover, and BMW ateliers.</p>
              </div>
            </div>
            <div className="about-feature-item">
              <div className="about-feat-check">✓</div>
              <div>
                <strong>Confidential Trade-In Valuations</strong>
                <p>Transparent evaluation and instantaneous settlement for pre-owned luxury models.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Atelier Values 3-Pillar Grid */}
      <section className="about-values-section">
        <div className="about-section-header">
          <span className="about-story-eyebrow">OUR CORE PRINCIPLES</span>
          <h2 className="about-section-title">The Three Pillars of Our Standard</h2>
        </div>

        <div className="about-values-grid">
          <div className="about-value-card">
            <div className="about-value-num">01</div>
            <h3 className="about-value-title">Uncompromising Authenticity</h3>
            <p className="about-value-desc">
              Every vehicle provenance record is publicly verifiable. We provide genuine auction sheets, authentic JAAI/JEVIC verification, and complete service histories.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-num">02</div>
            <h3 className="about-value-title">White-Glove Discretion</h3>
            <p className="about-value-desc">
              We respect the privacy of our distinguished clientele. Private viewing appointments, secluded consultation suites, and confidential handover deliveries.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-num">03</div>
            <h3 className="about-value-title">Long-Term Partnership</h3>
            <p className="about-value-desc">
              Our relationship begins at delivery. Complimentary routine health-checks, priority trade-in buyback agreements, and dedicated concierge assistance for life.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Physical Showroom Sanctuaries */}
      <section className="about-branches-section">
        <div className="about-section-header">
          <span className="about-story-eyebrow">VISIT OUR SHOWROOMS</span>
          <h2 className="about-section-title">
            {branches.length > 0
              ? `${branches.length} Flagship Sanctuaries Across Dhaka`
              : "Two Flagship Sanctuaries Across Dhaka"}
          </h2>
        </div>

        <div className="about-branches-grid">
          {branches.length > 0 ? (
            branches.map((b) => (
              <div key={b.branch_id || b.id} className="about-branch-card">
                <div>
                  <span className="about-branch-tag">{b.tag || "SHOWROOM & VAULT"}</span>
                  <h3 className="about-branch-name">{b.name}</h3>
                  <p className="about-branch-address">{b.address}</p>

                  <div className="about-branch-features">
                    <span className="about-branch-pill">Main Display Floor</span>
                    <span className="about-branch-pill">Private Handover Vault</span>
                    <span className="about-branch-pill">Diagnostic Lab</span>
                  </div>
                </div>

                <div className="about-branch-actions">
                  <button
                    type="button"
                    onClick={() => openAppointmentModal({ branchId: b.branch_id || String(b.id), carName: `${b.name} Consultation` })}
                    className="about-branch-visit-btn"
                  >
                    <span>Schedule Private Viewing</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  {b.map_link && (
                    <a
                      href={b.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-branch-map-link"
                    >
                      <span>Live Google Map Directions</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <>
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
                </div>

                <div className="about-branch-actions">
                  <button
                    type="button"
                    onClick={() => openAppointmentModal({ branchId: "kakrail", carName: "Kakrail Showroom Visit" })}
                    className="about-branch-visit-btn"
                  >
                    <span>Schedule Private Viewing</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-branch-map-link"
                  >
                    <span>Live Google Map Directions</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Branch 2: Gulshan */}
              <div className="about-branch-card">
                <div>
                  <span className="about-branch-tag">EXECUTIVE CLIENT LOUNGE</span>
                  <h3 className="about-branch-name">Gulshan Avenue Showroom</h3>
                  <p className="about-branch-address">
                    House #07, Road #127, Gulshan Avenue, Dhaka
                  </p>

                  <div className="about-branch-features">
                    <span className="about-branch-pill">Bespoke Lounge</span>
                    <span className="about-branch-pill">VIP Atelier Suite</span>
                    <span className="about-branch-pill">Direct Parking</span>
                  </div>
                </div>

                <div className="about-branch-actions">
                  <button
                    type="button"
                    onClick={() => openAppointmentModal({ branchId: "gulshan", carName: "Gulshan Showroom Visit" })}
                    className="about-branch-visit-btn"
                  >
                    <span>Schedule Private Viewing</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-branch-map-link"
                  >
                    <span>Live Google Map Directions</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 6. Bottom VIP Call to Action */}
      <section className="about-cta-section">
        <h2 className="about-cta-title">Begin Your Journey to Automotive Distinction</h2>
        <p className="about-cta-sub">
          Visit our Kakrail or Gulshan viewing lounges or connect with our Senior Automotive Specialist for private procurement.
        </p>

        <div className="about-cta-btn-group">
          <a
            href={waUrl}
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
            className="about-browse-btn"
          >
            <span>Browse Complete Vault</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
