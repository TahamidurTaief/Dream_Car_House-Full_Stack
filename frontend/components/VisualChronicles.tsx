"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PublicVisualChroniclesSection } from "@/lib/types";

interface VisualChroniclesProps {
  chronicles?: PublicVisualChroniclesSection | null;
}

export default function VisualChronicles({ chronicles }: VisualChroniclesProps) {
  const [flippedCards, setFlippedCards] = useState<Record<number | string, boolean>>({});

  const toggleFlip = (id: number | string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!chronicles || !chronicles.items || chronicles.items.length === 0) {
    return null;
  }

  const title = chronicles.heading || "";
  const subtitle = chronicles.subtitle || "";
  const statsCount = chronicles.stats_number || "";
  const statsLabel = chronicles.stats_label || "";

  const footerTag = chronicles.archive_tag || "";
  const footerDesc = chronicles.archive_description || "";
  const footerCtaLabel = chronicles.archive_cta_label || "";
  const footerCtaLink = chronicles.archive_cta_url || "/gallery";

  const items = chronicles.items;

  return (
    <section className="socials-section max-w-7xl" id="socials">
      <div className="socials-header">
        <div className="socials-header-text">
          <h2 className="section-h2" style={{ marginBottom: "0.35rem" }}>
            {title}
          </h2>
          <p className="socials-subtitle">{subtitle}</p>
        </div>
        <div className="socials-stats-badge">
          <span className="stats-num">{statsCount}</span>
          <span className="stats-label">{statsLabel}</span>
        </div>
      </div>

      {/* Bespoke Architectural Atelier Grid (Interactive 3D Flip Cards) */}
      <div className="atelier-mosaic-grid">
        {items.map((item, idx) => {
          const cardId = item.id || idx + 1;
          const isFlipped = !!flippedCards[cardId];
          const isHero = item.card_type === "hero";
          const isPortrait = item.card_type === "portrait";

          const tileClass = isHero ? "tile-hero" : isPortrait ? "tile-portrait" : "tile-tri";
          const imgWidth = isHero ? 1200 : isPortrait ? 800 : 600;
          const imgHeight = isHero ? 700 : isPortrait ? 1000 : 500;

          return (
            <div
              key={cardId}
              className={`atelier-flip-card ${tileClass} group ${isFlipped ? "is-flipped" : ""}`}
              onClick={() => toggleFlip(cardId)}
            >
              <div className="atelier-flip-inner">
                <div className="atelier-flip-front">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.front_alt || item.title}
                      width={imgWidth}
                      height={imgHeight}
                      loading="lazy"
                    />
                  ) : (
                    <div className="atelier-front-placeholder" />
                  )}
                  <div className="atelier-front-overlay"></div>
                  {item.front_badge && (
                    <div className="atelier-front-top">
                      <span className="atelier-front-badge">
                        <span>{item.front_badge}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="atelier-flip-back">
                  <div className="atelier-back-header">
                    <span className="atelier-back-pill">{item.back_pill || "EXCLUSIVE SHOWCASE"}</span>
                    <span className="atelier-back-num">{item.back_number || `0${idx + 1}`}</span>
                  </div>

                  <div className="atelier-back-body">
                    {isHero || isPortrait ? (
                      <h3 className="atelier-back-title">{item.title}</h3>
                    ) : (
                      <h4 className="atelier-back-title-sm">{item.title}</h4>
                    )}

                    <p className="atelier-back-desc">{item.description}</p>

                    {item.specs && item.specs.length > 0 && (
                      isHero || isPortrait ? (
                        <div className="atelier-specs-grid">
                          {item.specs.map((spec, sIdx) => (
                            <div key={sIdx} className="atelier-spec-box">
                              <span className="spec-label">{spec.label}</span>
                              <span className="spec-val">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="atelier-specs-compact">
                          {item.specs.map((spec, sIdx) => (
                            <span key={sIdx} className="spec-tag-item">
                              {spec.value || spec.label}
                            </span>
                          ))}
                        </div>
                      )
                    )}
                  </div>

                  <div className="atelier-back-footer">
                    <Link
                      href={item.cta_url || "/inventory"}
                      className="atelier-flip-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{item.cta_label || "Explore Available Inventory"}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atelier Media Footer with "See All Gallery & Media" Navigation */}
      <div className="atelier-media-footer">
        <div className="media-footer-info">
          <div className="media-live-status">
            <span className="media-count-tag">{footerTag}</span>
          </div>
          <p className="media-footer-desc">{footerDesc}</p>
        </div>
        <div className="media-footer-action">
          <Link href={footerCtaLink} className="atelier-see-all-cta">
            <span>{footerCtaLabel}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
