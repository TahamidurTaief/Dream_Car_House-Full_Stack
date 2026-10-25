"use client";

import React from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicExperienceSection } from "@/lib/types";

interface ExperiencePillarsProps {
  experience?: PublicExperienceSection | null;
}

const defaultExperience: PublicExperienceSection = {
  title: "Experience Beyond Ordinary",
  subtitle:
    "Dhaka's benchmark in high-luxury automotive delivery, certified diagnostic inspection, and bespoke global procurement.",
  video_cta_label: "Watch Showroom Reel",
  video_target: "reel",
  pillars: [
    {
      id: 1,
      pillar_number: "01",
      badge: "PRIVATE SANCTUARY",
      title: "The VIP Delivery Vault",
      description:
        "An exclusive private handover suite featuring theatrical automotive unveiling, champagne reception, and confidential documentation transfer.",
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80",
      tags: ["Soundproof Suite", "Ceremonial Reveal"],
      order: 1,
    },
    {
      id: 2,
      pillar_number: "02",
      badge: "PRECISION AUDIT",
      title: "150-Point Certified Audit",
      description:
        "Exhaustive computerized diagnostics, chassis integrity checks, battery health analysis, and robotic paint-depth verification before showroom induction.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
      tags: ["Computer Diagnostics", "Zero Imperfection"],
      order: 2,
    },
    {
      id: 3,
      pillar_number: "03",
      badge: "BESPOKE IMPORT",
      title: "Global Bespoke Concierge",
      description:
        "Direct sourcing of rare luxury allocations from London, Stuttgart, and Tokyo. Secured container logistics, customs facilitation, and doorstep delivery.",
      image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=80",
      tags: ["UK & Japan Sourcing", "Turnkey Import"],
      order: 3,
    },
  ],
};

export default function ExperiencePillars({ experience }: ExperiencePillarsProps) {
  const { openVideoModal } = useUI();

  const data = experience || defaultExperience;
  const pillars =
    data.pillars && data.pillars.length >= 3
      ? data.pillars
      : defaultExperience.pillars;

  return (
    <section className="experience-section max-w-7xl" id="experience">
      <div className="experience-header">
        <div className="experience-header-text">
          <h2 className="experience-title">{data.title || defaultExperience.title}</h2>
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
            <span>{data.video_cta_label || defaultExperience.video_cta_label}</span>
          </button>
        </div>
      </div>

      <div className="experience-pillars-grid">
        {pillars.map((pillar, idx) => {
          const fallbackPillar = defaultExperience.pillars[idx] || defaultExperience.pillars[0];
          const num = pillar.pillar_number || String(idx + 1).padStart(2, "0");
          const imgSrc = pillar.image || fallbackPillar.image || "";
          const tags = pillar.tags && pillar.tags.length > 0 ? pillar.tags : fallbackPillar.tags;

          return (
            <div className="experience-card" key={pillar.id || idx}>
              <div className="experience-card-media">
                {/* Use unoptimized to handle remote Unsplash and local backend uploaded images without domain config restriction */}
                <Image
                  src={imgSrc}
                  alt={pillar.title}
                  width={600}
                  height={400}
                  loading="lazy"
                  unoptimized
                />
                <div className="experience-card-gradient"></div>
                <div className="experience-card-badge">{pillar.badge}</div>
                <div className="experience-card-num">{num}</div>
              </div>
              <div className="experience-card-content">
                <h3 className="experience-card-title">{pillar.title}</h3>
                <p className="experience-card-desc">{pillar.description}</p>
                <div className="experience-card-tags">
                  {tags.map((tag, tIdx) => (
                    <span className="exp-tag" key={tIdx}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
