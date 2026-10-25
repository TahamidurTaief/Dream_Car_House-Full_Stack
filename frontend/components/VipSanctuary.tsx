"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicVipSanctuarySection } from "@/lib/types";

interface VipSanctuaryProps {
  sanctuary?: PublicVipSanctuarySection | null;
}

export default function VipSanctuary({ sanctuary }: VipSanctuaryProps) {
  const { openAppointmentModal, openVideoModal } = useUI();

  if (!sanctuary) {
    return null;
  }

  const bgImageUrl =
    sanctuary.background_image ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2560&q=95";
  const eyebrow = sanctuary.eyebrow || "";
  const title = sanctuary.title || "";
  const narrative = sanctuary.description || "";

  const primaryCtaLabel = sanctuary.primary_cta_label || "Schedule Private Viewing";
  const secondaryCtaLabel = sanctuary.secondary_cta_label || "Browse Available Vault →";
  const secondaryCtaLink = sanctuary.secondary_cta_url || "/inventory";

  const cardBadge = sanctuary.card_badge || "";
  const cardTitle = sanctuary.card_title || "";
  const liveStatusText = sanctuary.card_live_pill || "";
  const showroomLocation = sanctuary.location_text || "";
  const viewingHours = sanctuary.hours_text || "";
  const hotline = sanctuary.phone_text || "";
  const whatsappUrl = sanctuary.whatsapp_url || "";
  const videoTourTarget = sanctuary.tour_video_target === "reel" ? "reel" : "tour";

  const pillars = sanctuary.value_pillars || [];

  // Helper to render pillar icons
  const renderPillarIcon = (iconName?: string) => {
    if (iconName === "globe") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    }
    if (iconName === "star") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    }
    // Default shield
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    );
  };

  // Render title cleanly with highlight span if present
  const renderTitle = () => {
    const highlight = "Automotive Excellence";
    if (title.includes(highlight)) {
      const parts = title.split(highlight);
      return (
        <>
          {parts[0]}
          <span className="vip-title-gold">{highlight}</span>
          {parts[1] || ""}
        </>
      );
    }
    return title;
  };

  return (
    <section className="vip-sanctuary-section" id="sanctuary">
      <Image
        className="vip-sanctuary-bg"
        src={bgImageUrl}
        alt="DREAM CAR HOUSE Showroom Atmosphere"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
        loading="lazy"
      />
      <div className="vip-sanctuary-overlay"></div>

      <div className="vip-sanctuary-container max-w-7xl">
        <div className="vip-sanctuary-grid">
          {/* Left Column: Editorial Invitation & Value Pillars */}
          <div className="vip-sanctuary-narrative">
            <div className="vip-sanctuary-eyebrow">
              <span>{eyebrow}</span>
            </div>

            <h2 className="vip-sanctuary-title">{renderTitle()}</h2>

            <p className="vip-sanctuary-desc">{narrative}</p>

            {/* Value Pillars Row */}
            <div className="vip-pillars-row">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="vip-pillar-item">
                  <div className="vip-pillar-icon">{renderPillarIcon(pillar.icon)}</div>
                  <div className="vip-pillar-info">
                    <span className="vip-pillar-title">{pillar.title}</span>
                    <span className="vip-pillar-sub">{pillar.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="vip-actions-row">
              <button className="vip-primary-btn" onClick={() => openAppointmentModal()}>
                <span>{primaryCtaLabel}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <Link href={secondaryCtaLink} className="vip-secondary-btn">
                <span>{secondaryCtaLabel}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Studio & Concierge Card */}
          <div className="vip-studio-card">
            <div className="vip-card-glow"></div>

            <div className="vip-card-head">
              <div>
                <span className="vip-card-badge">{cardBadge}</span>
                <h3 className="vip-card-title">{cardTitle}</h3>
              </div>
              <div className="vip-live-pill">
                <span>{liveStatusText}</span>
              </div>
            </div>

            <div className="vip-studio-features">
              {showroomLocation ? (
                <div className="vip-feature-row">
                  <div className="vip-feature-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="vip-feature-text">
                    <span className="vip-feat-label">Showroom Location</span>
                    <span className="vip-feat-val">{showroomLocation}</span>
                  </div>
                </div>
              ) : null}

              {viewingHours ? (
                <div className="vip-feature-row">
                  <div className="vip-feature-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="vip-feature-text">
                    <span className="vip-feat-label">VIP Viewing Hours</span>
                    <span className="vip-feat-val">{viewingHours}</span>
                  </div>
                </div>
              ) : null}

              {hotline ? (
                <div className="vip-feature-row">
                  <div className="vip-feature-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="vip-feature-text">
                    <span className="vip-feat-label">Direct Concierge Hotline</span>
                    <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="vip-feat-val vip-phone-link">
                      {hotline}
                    </a>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Card Bottom Quick Connect Buttons */}
            <div className="vip-card-cta-group">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="vip-wa-btn"
                title="WhatsApp Concierge"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                <span>WhatsApp Concierge</span>
              </a>

              <button
                className="vip-tour-btn"
                onClick={() => openVideoModal(videoTourTarget)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Showroom Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

