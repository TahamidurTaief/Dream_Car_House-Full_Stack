"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import { SHOWROOM_BRANCHES, GalleryPhoto, Vehicle } from "@/lib/showroomData";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

function getCarDrivetrain(car: Vehicle): string {
  const nameLower = (car.name || "").toLowerCase();
  const capLower = (car.engine_capacity || "").toLowerCase();
  if (capLower.includes("electric") || nameLower.includes("g 580")) {
    return "Dual Motor Electric AWD";
  } else if (
    nameLower.includes("mercedes") ||
    nameLower.includes("maybach") ||
    nameLower.includes("amg")
  ) {
    return "9G-Tronic 4MATIC AWD";
  } else if (nameLower.includes("bmw")) {
    return "8-Speed Steptronic xDrive";
  } else if (nameLower.includes("audi")) {
    return "S-Tronic Quattro AWD";
  } else if (
    nameLower.includes("land cruiser") ||
    nameLower.includes("toyota") ||
    nameLower.includes("prado")
  ) {
    return "Full-Time 4WD w/ Crawl Control";
  } else if (nameLower.includes("lexus")) {
    return "10-Speed Direct-Shift 4WD";
  } else if (
    nameLower.includes("defender") ||
    nameLower.includes("range rover")
  ) {
    return "Terrain Response 2 AWD";
  } else if (nameLower.includes("porsche")) {
    return "8-Speed PDK AWD";
  }
  return "Full-Time Intelligent All-Wheel Drive";
}

interface CarModalProps {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
}

export default function CarModal({ settings, branches = [] }: CarModalProps = {}) {
  const {
    selectedCar,
    closeCarModal,
    openAppointmentModal,
    openLightbox,
    theme,
  } = useUI();

  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "gallery">(
    "overview"
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    setActiveTab("overview");
  }, [selectedCar]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (selectedCar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCar]);

  // Keyboard escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCarModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCarModal]);

  if (!selectedCar) return null;

  // Branch matching (database branch first, else fallback)
  const matchedDbBranch = branches.find(
    (b) =>
      b.branch_id === selectedCar.branch_id ||
      String(b.id) === String(selectedCar.branch_id) ||
      b.name === selectedCar.branch_name
  );

  const fallbackBranch =
    SHOWROOM_BRANCHES[selectedCar.branch_id as "kakrail" | "gulshan"] ||
    SHOWROOM_BRANCHES.kakrail;

  const branch = matchedDbBranch
    ? {
        name: matchedDbBranch.name,
        short_name: matchedDbBranch.short_name || matchedDbBranch.name,
        tag: matchedDbBranch.tag || "Showroom Allocation",
        address: matchedDbBranch.address || fallbackBranch.address,
        phone: matchedDbBranch.phone || fallbackBranch.phone,
        hotline: matchedDbBranch.hotline || fallbackBranch.hotline,
        email: matchedDbBranch.email || fallbackBranch.email,
        hours: matchedDbBranch.hours || fallbackBranch.hours,
        map_link: matchedDbBranch.map_link || fallbackBranch.map_link,
        embed_map: matchedDbBranch.embed_map || fallbackBranch.embed_map,
      }
    : fallbackBranch;

  const isBrandNew = selectedCar.car_type === "BRAND_NEW";
  const drivetrain = selectedCar.transmission || selectedCar.drivetrain || getCarDrivetrain(selectedCar);
  const regText = isBrandNew
    ? "Unregistered Direct Import"
    : selectedCar.registered && selectedCar.registered !== "Available"
    ? selectedCar.registered
    : "Dhaka Metro Verified Papers";

  const galleryList: GalleryPhoto[] =
    selectedCar.images && selectedCar.images.length > 0
      ? selectedCar.images
      : [
          {
            id: 1,
            url: selectedCar.image,
            title: `${selectedCar.name} - Front Angle`,
          },
        ];

  const handleConsultClick = () => {
    const carName = `${selectedCar.year} ${selectedCar.name}`;
    const branchId = selectedCar.branch_id;
    closeCarModal();
    openAppointmentModal({ carName, branchId });
  };

  const handleLaunchLightbox = (startIndex: number) => {
    openLightbox(galleryList, startIndex);
  };

  const waMessage = encodeURIComponent(
    `Hello DREAM CAR HOUSE, I am inquiring about the ${selectedCar.name} (${selectedCar.year}) allocated at your ${branch.name}. Please share the official spec sheet, showroom availability, and confidential valuation.`
  );
  const waUrl = `https://wa.me/8801615121312?text=${waMessage}`;

  return (
    <div
      className={`car-modal-backdrop active ${theme === "light" ? "mode-light" : "mode-dark"}`}
      id="car-modal-backdrop"
      onClick={closeCarModal}
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedCar.name} Details`}
    >
      <div
        className="car-modal-box"
        id="car-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-x"
          onClick={closeCarModal}
          aria-label="Close Vehicle Modal"
        >
          &times;
        </button>

        {/* Modal Top Bar */}
        <div className="car-modal-topbar">
          <div className="modal-title-left">
            <span
              className={`car-badge-pill ${
                isBrandNew ? "pill-brandnew" : "pill-preowned"
              }`}
            >
              {isBrandNew
                ? "BRAND NEW IMPORT"
                : "CERTIFIED PRE-OWNED"}
            </span>
            <span className="car-modal-year">{selectedCar.year}</span>
            <h2 className="car-modal-title">{selectedCar.name}</h2>
          </div>

          <div className="modal-price-right">
            <span className="modal-price-val">{selectedCar.price}</span>
            <span className="modal-price-sub">
              {isBrandNew ? "Direct Port / Ready Showroom Stock" : "Negotiable In-Person Valuation"}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="car-modal-nav-tabs">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview & Allocation
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            High-Res Gallery ({galleryList.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="car-modal-body-scroll">
          {activeTab === "overview" && (
            <div className="modal-tab-content active" id="tab-overview">
              {/* Main Vehicle Hero Photo Showcase */}
              <div
                className="modal-main-photo-wrapper group"
                onClick={() => handleLaunchLightbox(activeImageIndex)}
                title="Click to view full-screen high-res lightbox"
              >
                <img
                  src={
                    galleryList[activeImageIndex]?.url || selectedCar.image
                  }
                  alt={selectedCar.name}
                  className="modal-main-car-photo"
                />
                <div className="modal-photo-badges-strip">
                  <span className="modal-photo-alloc-badge">
                    <span className="live-pulse-dot"></span>
                    <span>PHYSICALLY DISPLAYED AT {branch.name.toUpperCase()}</span>
                  </span>
                  <span className="modal-photo-zoom-hint">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <span>Inspect Fullscreen</span>
                  </span>
                </div>

                {galleryList.length > 1 && (
                  <div className="modal-photo-dots">
                    {galleryList.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        className={`modal-photo-dot ${
                          activeImageIndex === dotIdx ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(dotIdx);
                        }}
                        aria-label={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Showroom Allocation Banner */}
              <div className="showroom-allocation-banner">
                <div className="branch-alloc-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="branch-alloc-info">
                  <div className="branch-alloc-header">
                    <span className="branch-alloc-tag">{branch.tag}</span>
                    <span className="branch-alloc-status">● Open Today 10:00 AM – 10:00 PM</span>
                  </div>
                  <h4 className="branch-alloc-name">{branch.name}</h4>
                  <p className="branch-alloc-addr">{branch.address}</p>
                </div>
                <div className="branch-alloc-actions">
                  <div className="branch-alloc-hours">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{branch.hours}</span>
                  </div>
                  <a
                    href={branch.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-alloc-map-btn"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>

              {/* Dealership Trust Verification */}
              <div className="dch-trust-strip">
                <div className="dch-trust-pill">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>100% Verified Provenance</span>
                </div>
                <div className="dch-trust-pill">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>{isBrandNew ? "Authentic Provenance" : regText}</span>
                </div>
                <div className="dch-trust-pill">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Immediate Handover Ready</span>
                </div>
                <div className="dch-trust-pill">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>150-Point Multi-Audit</span>
                </div>
              </div>

              {/* Vehicle Description */}
              <div className="modal-desc-box">
                <h4 className="modal-section-h4">Vehicle Overview & Provenance</h4>
                <p className="modal-desc-text">{selectedCar.description}</p>
              </div>

              {/* Highlight Specs Pill Strip */}
              <div className="modal-highlight-specs">
                <div className="hl-spec-card">
                  <span className="hl-spec-label">ENGINE / POWERTRAIN</span>
                  <span className="hl-spec-val">{selectedCar.engine_capacity}</span>
                </div>
                <div className="hl-spec-card">
                  <span className="hl-spec-label">MILEAGE</span>
                  <span className="hl-spec-val">{selectedCar.mileage}</span>
                </div>
                <div className="hl-spec-card">
                  <span className="hl-spec-label">FUEL SYSTEM</span>
                  <span className="hl-spec-val">{selectedCar.fuel_type}</span>
                </div>
                <div className="hl-spec-card">
                  <span className="hl-spec-label">DRIVETRAIN</span>
                  <span className="hl-spec-val">{drivetrain}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="modal-tab-content active" id="tab-specs">
              <div className="dch-specs-full-grid">
                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">MANUFACTURER</span>
                    <span className="dch-spec-value">{selectedCar.brand}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">MODEL NAME</span>
                    <span className="dch-spec-value">{selectedCar.name}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">MODEL YEAR</span>
                    <span className="dch-spec-value">{selectedCar.year}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">PRICE ESTIMATE</span>
                    <span className="dch-spec-value">{selectedCar.price}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 14 14" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">CURRENT MILEAGE</span>
                    <span className="dch-spec-value">{selectedCar.mileage}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">ENGINE CAPACITY</span>
                    <span className="dch-spec-value">{selectedCar.engine_capacity}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">FUEL SYSTEM</span>
                    <span className="dch-spec-value">{selectedCar.fuel_type}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">TRANSMISSION</span>
                    <span className="dch-spec-value">{drivetrain}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">SHOWROOM ALLOCATION</span>
                    <span className="dch-spec-value">{branch.name}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">REGISTRATION</span>
                    <span className="dch-spec-value">{regText}</span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">INSPECTION AUDIT</span>
                    <span className="dch-spec-value">
                      {isBrandNew
                        ? "Factory Pre-Delivery Inspection (PDI)"
                        : "150-Point Certified"}
                    </span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">VEHICLE STATUS</span>
                    <span className="dch-spec-value">
                      {selectedCar.status
                        ? selectedCar.status === "AVAILABLE"
                          ? "Physically Available"
                          : selectedCar.status
                        : "Physically Available"}
                    </span>
                  </div>
                </div>

                <div className="dch-spec-tile">
                  <div className="dch-spec-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="dch-spec-texts">
                    <span className="dch-spec-label">HANDOVER</span>
                    <span className="dch-spec-value">Immediate Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="modal-tab-content active" id="tab-gallery">
              <div className="modal-gallery-grid-dense">
                {galleryList.map((photo, pIdx) => (
                  <div
                    key={photo.id || pIdx}
                    className="modal-gallery-thumb-dense group"
                    onClick={() => handleLaunchLightbox(pIdx)}
                    title={`Click to view image ${pIdx + 1} in fullscreen`}
                  >
                    <img src={photo.url} alt={photo.title || `${selectedCar.name} ${pIdx + 1}`} loading="lazy" />
                    <div className="dense-thumb-overlay">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Actions Bar */}
        <div className="car-modal-bottom-actions">
          <div className="modal-actions-group">
            <button
              type="button"
              className="consult-primary-btn modal-action-btn"
              onClick={handleConsultClick}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span>Book Showroom Viewing</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="consult-whatsapp-btn modal-action-btn"
              title="Inquire directly on WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <span>WhatsApp Valuation Desk</span>
            </a>

            <a
              href={`tel:${branch.hotline ? branch.hotline.replace(/[^0-9+]/g, "") : "01615121312"}`}
              className="consult-phone-btn modal-action-btn"
              title="Call Showroom Desk"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{branch.phone || branch.hotline || "01615-121312"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
