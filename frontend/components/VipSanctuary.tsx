"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicVipSanctuarySection } from "@/lib/types";

interface VipSanctuaryProps {
  sanctuary?: PublicVipSanctuarySection | null;
}

export default function VipSanctuary({ sanctuary }: VipSanctuaryProps = {}) {
  const { openAppointmentModal, openVideoModal } = useUI();

  const bgImageUrl =
    sanctuary?.background_image ||
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2560&q=95";
  const eyebrow = sanctuary?.eyebrow || "KAKRAIL & GULSHAN • DHAKA";
  const title = sanctuary?.title || "Step Into The Realm of Automotive Excellence";
  const narrative =
    sanctuary?.description ||
    "DREAM CAR HOUSE specializes in bringing you the finest selection of luxury cars from around the world. With a handpicked collection of the most prestigious brands, DREAM CAR HOUSE takes pride in offering only the highest quality vehicles that combine sophistication, performance, and innovation. Whether you're searching for a sleek sports coupe, a refined executive sedan, or an iconic luxury SUV, DREAM CAR HOUSE is your ultimate destination in Dhaka.";

  const primaryCtaLabel = sanctuary?.primary_cta_label || "Schedule Private Viewing";
  const secondaryCtaLabel = sanctuary?.secondary_cta_label || "Browse Available Vault →";
  const secondaryCtaLink = sanctuary?.secondary_cta_url || "/inventory";

  const cardBadge = sanctuary?.card_badge || "FLAGSHIP SANCTUARY";
  const cardTitle = sanctuary?.card_title || "Atelier Showroom Suite";
  const liveStatusText = sanctuary?.card_live_pill || "● OPEN TODAY";
  const showroomLocation = sanctuary?.location_text || "18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000";
  const viewingHours = sanctuary?.hours_text || "Daily 10:00 AM – 10:00 PM (Private Viewings by Reservation)";
  const hotline = sanctuary?.phone_text || "01615-121312";
  const whatsappUrl =
    sanctuary?.whatsapp_url ||
    "https://wa.me/8801615121312?text=Hello%20DREAM%20CAR%20HOUSE,%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20vehicle";
  const videoTourTarget = sanctuary?.tour_video_target === "reel" ? "reel" : "tour";

  const pillars = sanctuary?.value_pillars;

  // Render title cleanly with highlight span
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
        priority={false}
      />
      <div className="vip-sanctuary-overlay"></div>

      <div className="max-w-7xl" style={{ position: "relative", zIndex: 2 }}>
        <div className="vip-sanctuary-grid">
          {/* Left Column: Editorial Invitation & Value Pillars */}
          <div className="vip-sanctuary-narrative">
            <div className="vip-sanctuary-eyebrow">
              <span>{eyebrow}</span>
            </div>

            <h2 className="vip-sanctuary-title">{renderTitle()}</h2>

            <p className="vip-sanctuary-desc">{narrative}</p>

            {/* Atelier Value Badges Strip */}
            <div className="vip-value-strip">
              {pillars && pillars.length > 0 ? (
                pillars.map((p, idx) => (
                  <div className="vip-value-pill" key={idx}>
                    <span className="vip-pill-icon">✦</span>
                    <div className="vip-pill-texts">
                      <span className="vip-pill-title">{p.title}</span>
                      <span className="vip-pill-sub">{p.subtext}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="vip-value-pill">
                    <span className="vip-pill-icon">✦</span>
                    <div className="vip-pill-texts">
                      <span className="vip-pill-title">Verified Provenance</span>
                      <span className="vip-pill-sub">Full Service & Global History</span>
                    </div>
                  </div>
                  <div className="vip-value-pill">
                    <span className="vip-pill-icon">✦</span>
                    <div className="vip-pill-texts">
                      <span className="vip-pill-title">Bespoke Concierge</span>
                      <span className="vip-pill-sub">Dedicated 1-on-1 Advisory</span>
                    </div>
                  </div>
                  <div className="vip-value-pill">
                    <span className="vip-pill-icon">✦</span>
                    <div className="vip-pill-texts">
                      <span className="vip-pill-title">Private Vault Handover</span>
                      <span className="vip-pill-sub">Confidential Ceremonial Delivery</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Editorial CTAs */}
            <div className="vip-cta-row">
              <button
                className="vip-primary-btn"
                onClick={() => openAppointmentModal()}
              >
                <span>{primaryCtaLabel}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <Link href={secondaryCtaLink} className="vip-secondary-btn">
                <span>{secondaryCtaLabel}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Physical Showroom Atelier Card */}
          <div className="vip-showroom-card">
            <div className="vip-card-header">
              <span className="vip-card-tag">{cardBadge}</span>
              <span className="vip-card-live-dot">{liveStatusText}</span>
            </div>

            <h3 className="vip-card-title">{cardTitle}</h3>

            <div className="vip-card-features">
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
            </div>

            {/* Card Bottom Quick Connect Buttons */}
            <div className="vip-card-cta-group">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="vip-wa-btn"
                title="Chat with VIP Concierge on WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp Concierge</span>
              </a>

              <button className="vip-tour-btn" onClick={() => openVideoModal(videoTourTarget)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Watch Brand Film</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
