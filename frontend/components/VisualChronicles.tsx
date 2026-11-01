"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PublicVisualChroniclesSection } from "@/lib/types";

interface VisualChroniclesProps {
  chronicles?: PublicVisualChroniclesSection | null;
}

export default function VisualChronicles({ chronicles }: VisualChroniclesProps = {}) {
  const [flippedCards, setFlippedCards] = useState<Record<number | string, boolean>>({});

  const toggleFlip = (id: number | string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasDbItems = chronicles?.items && chronicles.items.length > 0;

  const title = chronicles?.heading || "DREAM CAR HOUSE Visual Chronicles";
  const subtitle =
    chronicles?.subtitle ||
    "Curated high-resolution photography, delivery spotlights, and automotive cinema from our Kakrail & Gulshan showrooms.";
  const statsCount = chronicles?.stats_number || "19+";
  const statsLabel = chronicles?.stats_label || "Curated Masterpieces";

  const footerTag = chronicles?.archive_tag || "19+ SHOWROOM ARCHIVE EDITIONS";
  const footerDesc =
    chronicles?.archive_description ||
    "Explore high-definition exterior profiles, handcrafted cockpits, and delivery chronicles.";
  const footerCtaLabel = chronicles?.archive_cta_label || "See All Gallery & Media (19+ Photos)";
  const footerCtaLink = chronicles?.archive_cta_url || "/gallery";

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
        {hasDbItems ? (
          chronicles.items.map((item, idx) => {
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
                      <span className="atelier-back-pill">{item.back_pill || "EXCLUSIVE"}</span>
                      <span className="atelier-back-num">{String(idx + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="atelier-back-body">
                      <h3 className={isHero ? "atelier-back-title" : "atelier-back-title-sm"}>
                        {item.title}
                      </h3>
                      <p className="atelier-back-desc">{item.description}</p>

                      {item.specs && item.specs.length > 0 && (
                        <div className={isHero ? "atelier-specs-grid" : "atelier-specs-compact"}>
                          {item.specs.map((spec, sIdx) => (
                            <span key={sIdx} className="spec-tag-item">
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="atelier-back-footer">
                      <Link
                        href={item.cta_url || "/inventory"}
                        className="atelier-flip-action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{item.cta_label || "View Details"}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M7 17L17 7M7 7h10v10" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <>
            {/* Tile 1: Widescreen Hero Showcase (Col 1-7) */}
            <div
              className={`atelier-flip-card tile-hero group ${flippedCards[1] ? "is-flipped" : ""}`}
              onClick={() => toggleFlip(1)}
            >
              <div className="atelier-flip-inner">
                <div className="atelier-flip-front">
                  <Image
                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85"
                    alt="Mercedes-Maybach S 680"
                    width={1200}
                    height={700}
                    loading="lazy"
                  />
                  <div className="atelier-front-overlay"></div>
                  <div className="atelier-front-top">
                    <span className="atelier-front-badge">
                      <span>FLAGSHIP ARRIVAL</span>
                    </span>
                    <span className="atelier-3d-hint">Click to Flip ✦</span>
                  </div>
                  <div className="atelier-front-bottom">
                    <span className="atelier-front-marque">MERCEDES-MAYBACH</span>
                    <h3 className="atelier-front-title">S 680 4MATIC Sedan</h3>
                    <p className="atelier-front-sub">6.0L V12 Bi-Turbo • First Class Rear Executive Suite</p>
                  </div>
                </div>

                <div className="atelier-flip-back">
                  <div className="atelier-back-header">
                    <span className="atelier-back-pill">ATELIER SHOWCASE</span>
                    <span className="atelier-back-num">01</span>
                  </div>

                  <div className="atelier-back-body">
                    <h3 className="atelier-back-title">Mercedes-Maybach S 680</h3>
                    <p className="atelier-back-desc">
                      The undisputed pinnacle of automotive luxury. Handcrafted 6.0-liter V12 Bi-Turbo engine delivering 621 hp, paired with intelligent 4MATIC all-wheel drive and active road-noise cancellation.
                    </p>

                    <div className="atelier-specs-grid">
                      <div className="spec-box">
                        <span className="spec-val">621 HP</span>
                        <span className="spec-lbl">V12 Bi-Turbo</span>
                      </div>
                      <div className="spec-box">
                        <span className="spec-val">4.4s</span>
                        <span className="spec-lbl">0-100 km/h</span>
                      </div>
                      <div className="spec-box">
                        <span className="spec-val">900 Nm</span>
                        <span className="spec-lbl">Peak Torque</span>
                      </div>
                    </div>
                  </div>

                  <div className="atelier-back-footer">
                    <Link
                      href="/inventory"
                      className="atelier-flip-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Inspect Vehicle</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2: Portrait Showcase (Col 8-12) */}
            <div
              className={`atelier-flip-card tile-portrait group ${flippedCards[2] ? "is-flipped" : ""}`}
              onClick={() => toggleFlip(2)}
            >
              <div className="atelier-flip-inner">
                <div className="atelier-flip-front">
                  <Image
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90"
                    alt="Porsche 911 GT3 RS"
                    width={800}
                    height={1000}
                    loading="lazy"
                  />
                  <div className="atelier-front-overlay"></div>
                  <div className="atelier-front-top">
                    <span className="atelier-front-badge badge-porsche">
                      <span>TRACK MONSTER</span>
                    </span>
                  </div>
                  <div className="atelier-front-bottom">
                    <span className="atelier-front-marque">PORSCHE</span>
                    <h3 className="atelier-front-title">911 GT3 RS (992)</h3>
                    <p className="atelier-front-sub">4.0L Atmospheric Flat-6 • 9,000 RPM Redline</p>
                  </div>
                </div>

                <div className="atelier-flip-back">
                  <div className="atelier-back-header">
                    <span className="atelier-back-pill">MOTORSPORT VAULT</span>
                    <span className="atelier-back-num">02</span>
                  </div>

                  <div className="atelier-back-body">
                    <h3 className="atelier-back-title">Porsche 911 GT3 RS</h3>
                    <p className="atelier-back-desc">
                      Radical aerodynamics featuring DRS active wing, carbon-fiber monocoque components, and Weissach Package lightweight magnesium wheels.
                    </p>

                    <div className="atelier-specs-compact">
                      <span className="spec-tag-item">518 HP</span>
                      <span className="spec-tag-item">9,000 RPM</span>
                      <span className="spec-tag-item">DRS Wing</span>
                      <span className="spec-tag-item">Weissach Pkg</span>
                    </div>
                  </div>

                  <div className="atelier-back-footer">
                    <Link
                      href="/inventory"
                      className="atelier-flip-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Explore Marque</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 3: Precision Detail Card */}
            <div
              className={`atelier-flip-card tile-tri group ${flippedCards[3] ? "is-flipped" : ""}`}
              onClick={() => toggleFlip(3)}
            >
              <div className="atelier-flip-inner">
                <div className="atelier-flip-front">
                  <Image
                    src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=95"
                    alt="Toyota Land Cruiser 250"
                    width={600}
                    height={500}
                    loading="lazy"
                  />
                  <div className="atelier-front-overlay"></div>
                  <div className="atelier-front-top">
                    <span className="atelier-front-badge">
                      <span>LEGENDARY 4WD</span>
                    </span>
                  </div>
                </div>

                <div className="atelier-flip-back">
                  <div className="atelier-back-header">
                    <span className="atelier-back-pill">OFF-ROAD ICON</span>
                    <span className="atelier-back-num">03</span>
                  </div>

                  <div className="atelier-back-body">
                    <h4 className="atelier-back-title-sm">Land Cruiser 250 First Edition</h4>
                    <p className="atelier-back-desc">
                      Heritage round LED headlamps, full-time 4WD with Torsen limited-slip center differential, and Multi-Terrain Monitor.
                    </p>

                    <div className="atelier-specs-compact">
                      <span className="spec-tag-item">2.4L Turbo Hybrid</span>
                      <span className="spec-tag-item">Crawl Control</span>
                      <span className="spec-tag-item">SDM Bar</span>
                    </div>
                  </div>

                  <div className="atelier-back-footer">
                    <Link
                      href="/inventory"
                      className="atelier-flip-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>View Spotlight</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 4: Handcrafted Cockpit Detail */}
            <div
              className={`atelier-flip-card tile-tri group ${flippedCards[4] ? "is-flipped" : ""}`}
              onClick={() => toggleFlip(4)}
            >
              <div className="atelier-flip-inner">
                <div className="atelier-flip-front">
                  <Image
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=95"
                    alt="Bespoke Executive Lounge Cockpit"
                    width={600}
                    height={500}
                    loading="lazy"
                  />
                  <div className="atelier-front-overlay"></div>
                  <div className="atelier-front-top">
                    <span className="atelier-front-badge">
                      <span>CABIN APPOINTMENT</span>
                    </span>
                  </div>
                </div>

                <div className="atelier-flip-back">
                  <div className="atelier-back-header">
                    <span className="atelier-back-pill">FIRST CLASS SUITE</span>
                    <span className="atelier-back-num">04</span>
                  </div>

                  <div className="atelier-back-body">
                    <h4 className="atelier-back-title-sm">Bespoke Lounge Cockpit</h4>
                    <p className="atelier-back-desc">
                      Handcrafted semi-aniline hides, open-pore walnut trim, and multi-contour active hot-stone massage chairs.
                    </p>

                    <div className="atelier-specs-compact">
                      <span className="spec-tag-item">Burmester 4D</span>
                      <span className="spec-tag-item">Heated Ottomans</span>
                      <span className="spec-tag-item">Ambient 64</span>
                    </div>
                  </div>

                  <div className="atelier-back-footer">
                    <Link
                      href="/gallery"
                      className="atelier-flip-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>View Spotlight</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 5: Flagship Luxury SUV */}
            <div
              className={`atelier-flip-card tile-tri group ${flippedCards[5] ? "is-flipped" : ""}`}
              onClick={() => toggleFlip(5)}
            >
              <div className="atelier-flip-inner">
                <div className="atelier-flip-front">
                  <Image
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=95"
                    alt="Range Rover SV Autobiography"
                    width={600}
                    height={500}
                    loading="lazy"
                  />
                  <div className="atelier-front-overlay"></div>
                  <div className="atelier-front-top">
                    <span className="atelier-front-badge">
                      <span>FLAGSHIP OFF-ROAD</span>
                    </span>
                  </div>
                </div>

                <div className="atelier-flip-back">
                  <div className="atelier-back-header">
                    <span className="atelier-back-pill">BRITISH LUXURY</span>
                    <span className="atelier-back-num">05</span>
                  </div>

                  <div className="atelier-back-body">
                    <h4 className="atelier-back-title-sm">Range Rover SV Autobiography</h4>
                    <p className="atelier-back-desc">
                      Long wheelbase executive edition in Santorini Black. All-wheel steering, electronic air suspension, and deployable executive tables.
                    </p>

                    <div className="atelier-specs-compact">
                      <span className="spec-tag-item">4.4L Twin-Turbo</span>
                      <span className="spec-tag-item">Air Suspension</span>
                      <span className="spec-tag-item">All-Wheel Steer</span>
                    </div>
                  </div>

                  <div className="atelier-back-footer">
                    <Link
                      href="/inventory"
                      className="atelier-flip-action-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>View Spotlight</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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
