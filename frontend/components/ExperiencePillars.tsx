"use client";

import React from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicExperienceSection } from "@/lib/types";

interface ExperiencePillarsProps {
  experience?: PublicExperienceSection | null;
}

export default function ExperiencePillars({ experience }: ExperiencePillarsProps) {
  const { openVideoModal } = useUI();

  if (!experience || !experience.pillars || experience.pillars.length < 3) {
    return null;
  }

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
          const num = pillar.pillar_number || String(idx + 1).padStart(2, "0");
          const imgSrc = pillar.image || "";
          const tags = pillar.tags || [];

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
