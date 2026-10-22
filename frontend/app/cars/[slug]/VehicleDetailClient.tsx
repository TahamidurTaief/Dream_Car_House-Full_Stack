"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Vehicle, SHOWROOM_BRANCHES, GalleryPhoto } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";
import VehicleCard from "@/components/VehicleCard";

interface VehicleDetailClientProps {
  car: Vehicle;
  relatedCars: Vehicle[];
}

export default function VehicleDetailClient({ car, relatedCars }: VehicleDetailClientProps) {
  const { openAppointmentModal, openGalleryLightbox } = useUI();
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const branch = SHOWROOM_BRANCHES[car.branch_id] || SHOWROOM_BRANCHES["kakrail"];
  const isBrandNew = car.car_type === "BRAND_NEW";

  const galleryList =
    car.images && car.images.length > 0
      ? car.images
      : [{ url: car.image, caption: "Front 3/4 Exterior Stance", tag: "EXTERIOR" }];

  const currentImage = galleryList[activeImgIdx] || galleryList[0];

  const handleExpandToCinema = () => {
    const convertedPhotos: GalleryPhoto[] = galleryList.map((img, i) => ({
      id: i + 200,
      title: `${car.name} • ${img.caption}`,
      category: "sedans",
      categoryLabel: car.brand,
      image: img.url,
      desc: car.description,
    }));
    openGalleryLightbox(activeImgIdx, convertedPhotos);
  };

  const nextImg = () => {
    setActiveImgIdx((prev) => (prev + 1) % galleryList.length);
  };

  const prevImg = () => {
    setActiveImgIdx((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  const waMessage = encodeURIComponent(
    `Hello DREAM CAR HOUSE, I am inquiring about the ${car.name} (${car.year}) allocated at your ${branch.name}. Please share the official spec sheet, availability, and confidential valuation.`
  );
  const waUrl = `https://wa.me/8801615121312?text=${waMessage}`;

  return (
    <div className="car-detail-page-container max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#9ca3af" }}>
        <Link href="/" style={{ color: "#d1d5db" }}>
          Home
        </Link>
        <span>/</span>
        <Link href="/inventory" style={{ color: "#d1d5db" }}>
          Inventory
        </Link>
        <span>/</span>
        <span style={{ color: "#ffffff", fontWeight: 600 }}>{car.name}</span>
      </nav>

      {/* Top Status & Allocation Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isBrandNew ? (
            <span className="car-badge-pill pill-brandnew">
              <span className="pill-dot"></span>BRAND NEW • ZERO METER
            </span>
          ) : (
            <span className="car-badge-pill pill-preowned">
              <span className="pill-dot"></span>CERTIFIED PRE-OWNED
            </span>
          )}
          <span className="beg-showroom-beacon" style={{ display: "inline-flex" }}>
            <span className="beacon-pulse"></span>
            <span>{branch.name.toUpperCase()} • PHYSICAL ALLOCATION</span>
          </span>
        </div>

        <Link
          href="/inventory"
          className="gallery-back-btn"
          style={{ fontSize: "0.82rem", padding: "0.45rem 0.9rem" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to All Inventory</span>
        </Link>
      </div>

      {/* Main 2-Column Grid */}
      <div className="beg-car-grid">
        {/* Left Column: Visual Showcase */}
        <div className="beg-car-visual-col">
          <div
            className="beg-car-img-frame"
            onClick={handleExpandToCinema}
            style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden" }}
            title="Inspect in Full Cinema Mode"
          >
            <Image
              src={currentImage.url}
              alt={car.name}
              width={900}
              height={560}
              className="beg-car-img"
              priority
            />
            <div className="beg-car-img-overlay"></div>

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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>

            {galleryList.length > 1 && (
              <>
                <button
                  type="button"
                  className="beg-gallery-arrow beg-gallery-prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImg();
                  }}
                  aria-label="Previous Photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="beg-gallery-arrow beg-gallery-next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImg();
                  }}
                  aria-label="Next Photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}

            <div className="beg-photo-angle-pill">{currentImage.caption}</div>
          </div>

          {/* Thumbnail Strip */}
          {galleryList.length > 1 && (
            <div className="beg-thumbnail-strip-wrap" style={{ marginTop: "1rem" }}>
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

          {/* Branch Allocation Box */}
          <div className="beg-branch-allocation-box" style={{ marginTop: "1.5rem" }}>
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
          <div className="beg-trust-strip" style={{ marginTop: "1rem" }}>
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

        {/* Right Column: Specifications & Action Suite */}
        <div className="beg-car-info-col">
          <div className="beg-car-header">
            <div className="beg-brand-year-tag">
              {car.brand.toUpperCase()} • PRODUCTION {car.year}
            </div>
            <h1 className="beg-car-title" style={{ fontSize: "2rem", lineHeight: "1.25", marginTop: "0.35rem" }}>
              {car.name}
            </h1>
            <div className="beg-car-price-row" style={{ marginTop: "0.85rem" }}>
              <span className="beg-price-label">SHOWROOM VALUATION</span>
              <span className="beg-price-value" style={{ fontSize: "1.4rem" }}>
                {car.price === "Call for Price" ? "Price Upon Request • VIP Consultation" : car.price}
              </span>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="beg-specs-table-wrap" style={{ marginTop: "1.5rem" }}>
            <span className="beg-specs-heading">OFFICIAL FACTORY SPECIFICATIONS</span>
            <div className="beg-specs-grid-modern">
              <div className="spec-card-cell">
                <span className="spec-cell-label">Brand Marque</span>
                <span className="spec-cell-val">{car.brand}</span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Model Line</span>
                <span className="spec-cell-val">{car.model}</span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Production Year</span>
                <span className="spec-cell-val">{car.year}</span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Condition Grade</span>
                <span className="spec-cell-val">
                  {isBrandNew ? "Brand New (00 km)" : "Certified Pre-Owned"}
                </span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Engine / Powertrain</span>
                <span className="spec-cell-val">{car.engine_capacity}</span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Mileage Recorded</span>
                <span className="spec-cell-val">{car.mileage}</span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Fuel Architecture</span>
                <span className="spec-cell-val">{car.fuel_type}</span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Drivetrain</span>
                <span className="spec-cell-val">
                  {car.drivetrain || "Full-Time Intelligent All-Wheel Drive"}
                </span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Registration</span>
                <span className="spec-cell-val">
                  {isBrandNew ? "Unregistered Direct Import" : "Dhaka Metro Verified Papers"}
                </span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Showroom Location</span>
                <span className="spec-cell-val" style={{ color: "#22c55e", fontWeight: 600 }}>
                  {branch.short_name}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="beg-editorial-desc" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
              Atelier Overview & Provenance
            </h3>
            <p>{car.description}</p>
          </div>

          {/* Action Suite */}
          <div className="beg-cta-suite" style={{ marginTop: "2rem" }}>
            <button
              type="button"
              className="consult-primary-btn"
              style={{ flex: 1, justifyContent: "center" }}
              onClick={() =>
                openAppointmentModal({
                  carName: car.name,
                  carYear: car.year,
                  branchId: car.branch_id,
                })
              }
            >
              <span>Book Private Viewing</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="consult-whatsapp-btn"
              style={{ padding: "0.85rem 1.5rem" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      {relatedCars.length > 0 && (
        <section style={{ marginTop: "5rem", paddingTop: "3rem", borderTop: "1px solid #1f2937" }}>
          <div style={{ marginBottom: "2rem" }}>
            <span className="preference-badge" style={{ marginBottom: "0.25rem", display: "inline-block" }}>
              COMPLEMENTARY ALLOCATIONS
            </span>
            <h2 className="section-h2">Similar Luxury Automobiles</h2>
          </div>

          <div className="cars-grid-layout">
            {relatedCars.map((relCar) => (
              <VehicleCard key={relCar.id} car={relCar} layout="grid" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
