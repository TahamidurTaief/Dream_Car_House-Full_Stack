"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import { SHOWROOM_BRANCHES, GalleryPhoto } from "@/lib/showroomData";

export default function CarModal() {
  const { selectedCar, closeCarModal, openAppointmentModal, openGalleryLightbox } = useUI();
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    setActiveImgIdx(0);
  }, [selectedCar]);

  if (!selectedCar) return null;

  const branch = SHOWROOM_BRANCHES[selectedCar.branch_id] || SHOWROOM_BRANCHES["kakrail"];
  const isBrandNew = selectedCar.car_type === "BRAND_NEW";

  const galleryList =
    selectedCar.images && selectedCar.images.length > 0
      ? selectedCar.images
      : [{ url: selectedCar.image, caption: "Front 3/4 Exterior Stance", tag: "EXTERIOR" }];

  const currentImage = galleryList[activeImgIdx] || galleryList[0];

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % galleryList.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  const handleExpandToCinema = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Convert car images into gallery photo structure and launch fullscreen lightbox
    const convertedPhotos: GalleryPhoto[] = galleryList.map((img, i) => ({
      id: i + 100,
      title: `${selectedCar.name} • ${img.caption}`,
      category: "sedans",
      categoryLabel: selectedCar.brand,
      image: img.url,
      desc: selectedCar.description,
    }));
    openGalleryLightbox(activeImgIdx, convertedPhotos);
  };

  const waMessage = encodeURIComponent(
    `Hello DREAM CAR HOUSE, I am inquiring about the ${selectedCar.name} (${selectedCar.year}) allocated at your ${branch.name}. Please share the official spec sheet, showroom availability, and confidential valuation.`
  );
  const waUrl = `https://wa.me/8801615121312?text=${waMessage}`;

  return (
    <div className="car-modal-backdrop active" onClick={closeCarModal}>
      <div className="car-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-x"
          onClick={closeCarModal}
          aria-label="Close Car Details"
          title="Close (ESC)"
        >
          &times;
        </button>

        <div id="modal-body-content">
          <div className="beg-car-modal-wrapper">
            {/* Top Status & Studio Allocation Beacon Bar */}
            <div className="beg-modal-top-bar">
              <div className="beg-modal-badges">
                {isBrandNew ? (
                  <span className="car-badge-pill pill-brandnew">
                    <span className="pill-dot"></span>BRAND NEW • ZERO METER
                  </span>
                ) : (
                  <span className="car-badge-pill pill-preowned">
                    <span className="pill-dot"></span>CERTIFIED PRE-OWNED
                  </span>
                )}
                <div className="beg-showroom-beacon">
                  <span className="beacon-pulse"></span>
                  <span>{branch.name.toUpperCase()} • PHYSICAL ALLOCATION</span>
                </div>
              </div>
            </div>

            {/* Main 2-Column Showcase Grid */}
            <div className="beg-car-grid">
              {/* Left Column: Multi-Photo Cinema Showcase */}
              <div className="beg-car-visual-col">
                <div
                  className="beg-car-img-frame"
                  onClick={handleExpandToCinema}
                  style={{ cursor: "pointer" }}
                  title="Inspect in Full Cinema Mode"
                >
                  <Image
                    src={currentImage.url}
                    alt={selectedCar.name}
                    width={800}
                    height={500}
                    className="beg-car-img"
                    priority
                  />
                  <div className="beg-car-img-overlay"></div>

                  {/* Top-Right: Image Counter & Cinema Lightbox Button */}
                  <div className="beg-img-counter-wrap">
                    <span className="beg-img-counter-pill">
                      {activeImgIdx + 1} / {galleryList.length}
                    </span>
                    <button
                      type="button"
                      className="beg-img-expand-btn"
                      onClick={handleExpandToCinema}
                      title="Inspect in Full Cinema Mode"
                      aria-label="Inspect in Full Cinema Mode"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </button>
                  </div>

                  {/* Prev & Next Gallery Navigation Arrows */}
                  {galleryList.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="beg-gallery-arrow beg-gallery-prev"
                        onClick={prevImg}
                        aria-label="Previous Photo"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="beg-gallery-arrow beg-gallery-next"
                        onClick={nextImg}
                        aria-label="Next Photo"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Bottom Left: Photo Angle Caption */}
                  <div className="beg-photo-angle-pill">{currentImage.caption}</div>
                </div>

                {/* Multi-Photo Thumbnail Strip */}
                {galleryList.length > 1 && (
                  <div className="beg-thumbnail-strip-wrap">
                    <div className="beg-thumbnail-strip">
                      {galleryList.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`beg-thumb-btn ${idx === activeImgIdx ? "active" : ""}`}
                          onClick={() => setActiveImgIdx(idx)}
                          aria-label={`View photo ${idx + 1}: ${img.caption}`}
                        >
                          <Image src={img.url} alt={img.caption} width={120} height={80} />
                          <span className="thumb-tag">{img.tag || idx + 1}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Physical Showroom Branch Allocation Box */}
                <div className="beg-branch-allocation-box">
                  <div className="branch-alloc-head">
                    <div className="branch-alloc-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="branch-alloc-meta">
                      <div className="branch-alloc-eyebrow">PHYSICAL VEHICLE ALLOCATION</div>
                      <div className="branch-alloc-name">{branch.name}</div>
                      <div className="branch-alloc-address">{branch.address}</div>
                    </div>
                  </div>
                  <div className="branch-alloc-actions">
                    <div className="branch-alloc-hours">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                      </svg>
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>

                {/* Dealership Trust Verification */}
                <div className="beg-trust-strip">
                  <div className="beg-trust-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <span>100% Genuine Mileage</span>
                  </div>
                  <div className="beg-trust-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span>Dhaka Metro Papers</span>
                  </div>
                  <div className="beg-trust-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Vault Ready Unit</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Vehicle Details, Technical Specifications & Action Suite */}
              <div className="beg-car-info-col">
                <div className="beg-car-header">
                  <div className="beg-brand-year-tag">
                    {selectedCar.brand.toUpperCase()} • PRODUCTION {selectedCar.year}
                  </div>
                  <h2 className="beg-car-title">{selectedCar.name}</h2>
                  <div className="beg-car-price-row">
                    <span className="beg-price-label">SHOWROOM VALUATION</span>
                    <span className="beg-price-value">
                      {selectedCar.price === "Call for Price"
                        ? "Price Upon Request • VIP Consultation"
                        : selectedCar.price}
                    </span>
                  </div>
                </div>

                <div className="beg-specs-table-wrap">
                  <span className="beg-specs-heading">OFFICIAL FACTORY SPECIFICATIONS</span>
                  <div className="beg-specs-grid-modern">
                    <div className="spec-card-cell">
                      <span className="spec-cell-label">Engine / Power</span>
                      <span className="spec-cell-val">{selectedCar.engine_capacity}</span>
                    </div>
                    <div className="spec-card-cell">
                      <span className="spec-cell-label">Mileage Recorded</span>
                      <span className="spec-cell-val">{selectedCar.mileage}</span>
                    </div>
                    <div className="spec-card-cell">
                      <span className="spec-cell-label">Fuel Architecture</span>
                      <span className="spec-cell-val">{selectedCar.fuel_type}</span>
                    </div>
                    <div className="spec-card-cell">
                      <span className="spec-cell-label">Drivetrain</span>
                      <span className="spec-cell-val">
                        {selectedCar.drivetrain || "Full-Time Intelligent All-Wheel Drive"}
                      </span>
                    </div>
                    <div className="spec-card-cell">
                      <span className="spec-cell-label">Registration Papers</span>
                      <span className="spec-cell-val">
                        {isBrandNew ? "Unregistered Direct Import" : "Dhaka Metro Verified Papers"}
                      </span>
                    </div>
                    <div className="spec-card-cell">
                      <span className="spec-cell-label">Induction Status</span>
                      <span className="spec-cell-val" style={{ color: "#22c55e", fontWeight: 600 }}>
                        Physically In Showroom
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Narrative */}
                <div className="beg-editorial-desc">
                  <p>{selectedCar.description}</p>
                </div>

                {/* VIP Action Suite */}
                <div className="beg-cta-suite">
                  <button
                    type="button"
                    className="consult-primary-btn"
                    style={{ flex: 1, justifyContent: "center" }}
                    onClick={() => {
                      closeCarModal();
                      openAppointmentModal({
                        carName: selectedCar.name,
                        carYear: selectedCar.year,
                        branchId: selectedCar.branch_id,
                      });
                    }}
                  >
                    <span>Book VIP Viewing</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="consult-whatsapp-btn"
                    style={{ padding: "0.85rem 1.25rem" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/cars/${selectedCar.slug}`}
                    className="gallery-btn-secondary"
                    style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                    onClick={closeCarModal}
                  >
                    <span>Full Spec Page →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
