"use client";

import React from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicExperienceSection } from "@/lib/types";

interface ExperiencePillarsProps {
  experience?: PublicExperienceSection | null;
}

export default function ExperiencePillars({ experience }: ExperiencePillarsProps = {}) {
  const { openAppointmentModal, openVideoModal } = useUI();

  // If database has customized experience section with 3+ pillars, render it
  if (experience && experience.pillars && experience.pillars.length >= 3) {
    const data = experience;
    const pillars = data.pillars;

    return (
      <section className="experience-section max-w-7xl" id="experience">
        <div className="experience-header">
          <div className="experience-header-text">
            <h2 className="experience-title">{data.title}</h2>
            {data.subtitle && (
              <p className="experience-subtitle">{data.subtitle}</p>
            )}
          </div>
          <div className="experience-header-action">
            <button
              className="see-video-btn"
              onClick={() => {
                const target = data.video_target === "tour" ? "tour" : "reel";
                openVideoModal(target);
              }}
            >
              <div className="video-play-circle">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </div>
              <span>{data.video_cta_label || "Watch Brand Film"}</span>
            </button>
          </div>
        </div>

        <div className="experience-pillars-grid">
          {pillars.map((pillar, idx) => {
            const isClickable = pillar.action_type && pillar.action_type !== "none";
            const handleCardClick = () => {
              if (pillar.action_type === "video") {
                const target = pillar.action_target === "tour" ? "tour" : "reel";
                openVideoModal(target);
              } else if (pillar.action_type === "appointment") {
                openAppointmentModal();
              }
            };

            return (
              <div
                key={pillar.id || idx}
                className={`pillar-card ${isClickable ? "pillar-interactive" : ""}`}
                onClick={isClickable ? handleCardClick : undefined}
                role={isClickable ? "button" : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    handleCardClick();
                  }
                }}
              >
                <div className="pillar-num">{pillar.number || `0${idx + 1}`}</div>
                {pillar.image && (
                  <div className="pillar-image-wrap">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      width={600}
                      height={400}
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.description}</p>
                {pillar.tag && <span className="pillar-tag">{pillar.tag}</span>}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // Fallback: Photo-First Showroom Showcase Grid (Authentic DREAM CAR HOUSE Architecture)
  return (
    <section className="experience-section max-w-7xl" id="experience">
      <div className="experience-header">
        <div className="experience-header-text">
          <h2 className="experience-title">Inside Our Showrooms</h2>
          <p className="experience-subtitle">
            Kakrail & Gulshan • Dhaka, Bangladesh
          </p>
        </div>
        <div className="experience-header-action">
          <button
            type="button"
            className="experience-vip-consult-btn"
            onClick={() => openAppointmentModal({ carName: "Showroom Visit" })}
            aria-label="Schedule a Showroom Visit"
          >
            <span>Schedule a Visit</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="experience-btn-arrow">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Photo-First Showroom Showcase Grid */}
      <div className="showroom-showcase-grid">
        {/* Card 1: Kakrail Flagship Showroom */}
        <div
          className="showroom-photo-card"
          onClick={() => openAppointmentModal({ branchId: "kakrail", carName: "Kakrail Showroom Visit" })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              openAppointmentModal({ branchId: "kakrail", carName: "Kakrail Showroom Visit" });
            }
          }}
        >
          <div className="showroom-photo-wrap">
            <Image
              src="/assets/dch-night-showroom.webp"
              alt="DREAM CAR HOUSE Kakrail Main Flagship Showroom"
              width={1200}
              height={800}
              loading="lazy"
              className="showroom-img"
            />
            <div className="showroom-photo-gradient"></div>
            <span className="showroom-badge">MAIN FLAGSHIP</span>
          </div>
          <div className="showroom-card-footer">
            <h3 className="showroom-card-title">Kakrail Flagship Showroom</h3>
            <p className="showroom-card-addr">18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka</p>
          </div>
        </div>

        {/* Card 2: Gulshan Avenue Showroom */}
        <div
          className="showroom-photo-card"
          onClick={() => openAppointmentModal({ branchId: "gulshan", carName: "Gulshan Showroom Visit" })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              openAppointmentModal({ branchId: "gulshan", carName: "Gulshan Showroom Visit" });
            }
          }}
        >
          <div className="showroom-photo-wrap">
            <Image
              src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=85"
              alt="DREAM CAR HOUSE Gulshan Avenue Showroom"
              width={1200}
              height={800}
              loading="lazy"
              className="showroom-img"
            />
            <div className="showroom-photo-gradient"></div>
            <span className="showroom-badge">GULSHAN AVENUE</span>
          </div>
          <div className="showroom-card-footer">
            <h3 className="showroom-card-title">Gulshan Avenue Showroom</h3>
            <p className="showroom-card-addr">House #07, Road #127, Gulshan Avenue, Dhaka</p>
          </div>
        </div>

        {/* Card 3: VIP Delivery Handover Lounge */}
        <div
          className="showroom-photo-card"
          onClick={() => openAppointmentModal({ carName: "VIP Delivery Handover Suite" })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              openAppointmentModal({ carName: "VIP Delivery Handover Suite" });
            }
          }}
        >
          <div className="showroom-photo-wrap">
            <Image
              src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"
              alt="VIP Delivery Sanctuary & Handover Lounge"
              width={1200}
              height={800}
              loading="lazy"
              className="showroom-img"
            />
            <div className="showroom-photo-gradient"></div>
            <span className="showroom-badge">VIP SANCTUARY</span>
          </div>
          <div className="showroom-card-footer">
            <h3 className="showroom-card-title">Private Handover Lounge</h3>
            <p className="showroom-card-addr">Ceremonial Unveiling & VIP Delivery Suite</p>
          </div>
        </div>
      </div>
    </section>
  );
}
