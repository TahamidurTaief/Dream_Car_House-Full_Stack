"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { GALLERY_DATA, GalleryPhoto } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

export default function GalleryClient() {
  const { openGalleryLightbox, openAppointmentModal } = useUI();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "all") return GALLERY_DATA;
    return GALLERY_DATA.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handlePhotoClick = (photo: GalleryPhoto) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    openGalleryLightbox(idx !== -1 ? idx : 0, filteredPhotos);
  };

  return (
    <div className="inventory-page-wrap max-w-7xl" style={{ padding: "7.5rem 1.5rem 5rem" }}>
      {/* Gallery Page Header */}
      <div className="gallery-page-header">
        <div className="gallery-breadcrumb-row" style={{ marginBottom: "1.5rem" }}>
          <Link href="/" className="gallery-back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Return to Home</span>
          </Link>
          <span className="gallery-breadcrumb-sep">/</span>
          <span className="gallery-breadcrumb-current">Showroom Media Gallery</span>
        </div>

        <div className="gallery-header-main" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
          <div>
            <div className="gallery-eyebrow">
              <span className="experience-pulse-dot"></span>
              <span>ATELIER ARCHIVE SPOTLIGHT</span>
            </div>
            <h1 className="gallery-hero-title">Showroom Gallery & Visual Showcase</h1>
            <p className="gallery-hero-desc" style={{ maxWidth: "700px" }}>
              High-definition photography and cinema spotlights of exotic, flagship, and rare luxury vehicles inducted into our Kakrail & Gulshan showrooms.
            </p>
          </div>

          <div className="gallery-stats-counter">
            <span className="gallery-counter-num" id="gallery-counter-badge">
              {filteredPhotos.length}
            </span>
            <span className="gallery-counter-label">Curated Photos</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="gallery-pills-row" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
          <button
            type="button"
            className={`gallery-filter-pill ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            All Showcase ({GALLERY_DATA.length})
          </button>
          <button
            type="button"
            className={`gallery-filter-pill ${selectedCategory === "sedans" ? "active" : ""}`}
            onClick={() => setSelectedCategory("sedans")}
          >
            Flagship Sedans
          </button>
          <button
            type="button"
            className={`gallery-filter-pill ${selectedCategory === "supercars" ? "active" : ""}`}
            onClick={() => setSelectedCategory("supercars")}
          >
            Supercars & GTs
          </button>
          <button
            type="button"
            className={`gallery-filter-pill ${selectedCategory === "suvs" ? "active" : ""}`}
            onClick={() => setSelectedCategory("suvs")}
          >
            Luxury & Off-Road SUVs
          </button>
          <button
            type="button"
            className={`gallery-filter-pill ${selectedCategory === "cockpit" ? "active" : ""}`}
            onClick={() => setSelectedCategory("cockpit")}
          >
            Cockpits & Interiors
          </button>
        </div>
      </div>

      {/* Gallery Photos Grid */}
      <div id="gallery-grid" className="gallery-grid-layout">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="gallery-card-item group"
            onClick={() => handlePhotoClick(photo)}
            style={{ cursor: "pointer" }}
          >
            <div className="gallery-card-media">
              <Image
                src={photo.image}
                alt={photo.title}
                width={800}
                height={550}
                className="gallery-card-img"
                loading="lazy"
              />
              <div className="gallery-card-overlay"></div>
              <span className="gallery-card-pill">{photo.categoryLabel}</span>
              <div className="gallery-card-zoom-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </div>
            <div className="gallery-card-content">
              <h3 className="gallery-card-title">{photo.title}</h3>
              <p className="gallery-card-desc">{photo.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Studio Invitation Banner */}
      <div className="gallery-invitation-banner" style={{ marginTop: "4rem" }}>
        <div className="gallery-invite-text">
          <h3 className="gallery-invite-title">Experience These Masterpieces In Person</h3>
          <p className="gallery-invite-desc">
            Private viewings, mechanical diagnostic inspections, and trade-in valuations available daily across our Kakrail and Gulshan showrooms.
          </p>
        </div>
        <div className="gallery-invite-actions">
          <button type="button" className="consult-primary-btn" onClick={() => openAppointmentModal()}>
            <span>Schedule Private Viewing</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <Link href="/inventory" className="gallery-btn-secondary">
            <span>Browse Available Inventory →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
