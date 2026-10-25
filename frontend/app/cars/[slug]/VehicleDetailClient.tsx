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

  const branch = car.branch
    ? {
        id: car.branch.branch_id || car.branch_id || "kakrail",
        name: car.branch.name || car.branch_name || "Kakrail Branch & Showroom",
        short_name: car.branch.short_name || "Kakrail Branch",
        tag: car.branch.tag || "Flagship Showroom",
        address: car.branch.address || car.branch_address || "18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000",
        phone: car.branch.phone || "01615-121312",
        hotline: car.branch.hotline || "+880 1615-121312",
        email: car.branch.email || "dreamcarhouse101@gmail.com",
        hours: car.branch.hours || "Saturday – Thursday: 10:00 AM – 9:00 PM (Friday Closed)",
        map_link: car.branch.map_link || "https://maps.google.com/?q=18+Shaheed+Captain+Mansur+Ali+Soroni+Kakrail+Dhaka",
        embed_map: "",
      }
    : SHOWROOM_BRANCHES[car.branch_id] || SHOWROOM_BRANCHES["kakrail"];
  const [isCopied, setIsCopied] = useState(false);
  const isBrandNew = car.car_type === "BRAND_NEW";

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://dreamcarhouse.com";
    const shareUrl = `${origin}/cars/${car.slug}`;
    const shareTitle = `${car.name} (${car.year}) | DREAM CAR HOUSE`;
    const shareText = `Explore this ${car.name} (${car.year}) at DREAM CAR HOUSE:`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          return;
        }
      }
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2400);
      }
    } catch (clipErr) {
      console.error("Clipboard copy failed", clipErr);
    }
  };

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
          <span className="dch-showroom-beacon" style={{ display: "inline-flex" }}>
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
      <div className="dch-car-grid">
        {/* Left Column: Visual Showcase */}
        <div className="dch-car-visual-col">
          <div
            className="dch-car-img-frame"
            onClick={handleExpandToCinema}
            style={{ cursor: "pointer", borderRadius: "10px", overflow: "hidden" }}
            title="Inspect in Full Cinema Mode"
          >
            <Image
              src={currentImage.url}
              alt={car.featured_image_alt || car.name}
              width={900}
              height={560}
              className="dch-car-img"
              priority
            />
            <div className="dch-car-img-overlay"></div>

            <div className="dch-img-counter-wrap">
              <span className="dch-img-counter-pill">
                {activeImgIdx + 1} / {galleryList.length}
              </span>
              <button
                type="button"
                className="dch-img-expand-btn"
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
                  className="dch-gallery-arrow dch-gallery-prev"
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
                  className="dch-gallery-arrow dch-gallery-next"
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

            <div className="dch-photo-angle-pill">{currentImage.caption}</div>
          </div>

          {/* Thumbnail Strip */}
          {galleryList.length > 1 && (
            <div className="dch-thumbnail-strip-wrap" style={{ marginTop: "1rem" }}>
              <div className="dch-thumbnail-strip">
                {galleryList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`dch-thumb-btn ${idx === activeImgIdx ? "active" : ""}`}
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
          <div className="dch-branch-allocation-box" style={{ marginTop: "1.5rem" }}>
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
          <div className="dch-trust-strip" style={{ marginTop: "1rem" }}>
            <div className="dch-trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Genuine Mileage</span>
            </div>
            <div className="dch-trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Dhaka Metro Papers</span>
            </div>
            <div className="dch-trust-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Vault Ready Unit</span>
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Action Suite */}
        <div className="dch-car-info-col">
          <div className="dch-car-header">
            <div className="dch-brand-year-tag">
              {car.brand.toUpperCase()} • PRODUCTION {car.year}
            </div>
            <h1 className="dch-car-title" style={{ fontSize: "2rem", lineHeight: "1.25", marginTop: "0.35rem" }}>
              {car.h1_title || car.name}
            </h1>
            <div className="dch-car-price-row" style={{ marginTop: "0.85rem" }}>
              <div className="dch-valuation-top-bar">
                <span className="dch-price-label">SHOWROOM VALUATION</span>
                <button
                  type="button"
                  id="vehicle-detail-share-btn"
                  className={`dch-share-car-btn ${isCopied ? "is-copied" : ""}`}
                  onClick={handleShare}
                  title="Share this vehicle (WhatsApp, Social, or Copy Direct Link)"
                  aria-label="Share this vehicle"
                >
                  {isCopied ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              <div className="dch-price-value" style={{ fontSize: "1.4rem" }}>
                {car.price === "Call for Price" ? "Price Upon Request • VIP Consultation" : car.price}
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="dch-specs-table-wrap" style={{ marginTop: "1.5rem" }}>
            <span className="dch-specs-heading">OFFICIAL FACTORY SPECIFICATIONS</span>
            <div className="dch-specs-grid-modern">
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
                  {car.condition === "NEW" || isBrandNew ? "Brand New (00 km)" : "Certified Pre-Owned"}
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
              {car.transmission && (
                <div className="spec-card-cell">
                  <span className="spec-cell-label">Transmission</span>
                  <span className="spec-cell-val">{car.transmission}</span>
                </div>
              )}
              {car.color && (
                <div className="spec-card-cell">
                  <span className="spec-cell-label">Exterior Color</span>
                  <span className="spec-cell-val">{car.color}</span>
                </div>
              )}
              {car.body_style && (
                <div className="spec-card-cell">
                  <span className="spec-cell-label">Body Architecture</span>
                  <span className="spec-cell-val">{car.body_style}</span>
                </div>
              )}
              <div className="spec-card-cell">
                <span className="spec-cell-label">Registration</span>
                <span className="spec-cell-val">
                  {car.registration_number || (isBrandNew ? "Unregistered Direct Import" : "Dhaka Metro Verified Papers")}
                </span>
              </div>
              <div className="spec-card-cell">
                <span className="spec-cell-label">Vehicle Status</span>
                <span
                  className="spec-cell-val"
                  style={{
                    color: car.registered?.toLowerCase() === "sold" ? "#ef4444" : "#22c55e",
                    fontWeight: 600,
                  }}
                >
                  {car.registered || "Physically Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="dch-editorial-desc" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
              Atelier Overview & Provenance
            </h3>
            {car.description && car.description.includes("<") && car.description.includes(">") ? (
              <div
                dangerouslySetInnerHTML={{ __html: car.description }}
                style={{ color: "#d1d5db", lineHeight: "1.7", fontSize: "0.95rem" }}
              />
            ) : (
              <p>{car.description}</p>
            )}
          </div>

          {/* Video Walkaround Presentation */}
          {car.youtube && (
            <div className="dch-video-walkaround-section" style={{ marginTop: "2rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.75rem" }}>
                Official Cinematic Walkaround
              </h3>
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: "10px",
                  background: "#0a0c10",
                  border: "1px solid #1f2937",
                }}
              >
                <iframe
                  src={
                    car.youtube.includes("watch?v=")
                      ? car.youtube.replace("watch?v=", "embed/")
                      : car.youtube.includes("youtu.be/")
                      ? car.youtube.replace("youtu.be/", "www.youtube.com/embed/")
                      : car.youtube
                  }
                  title={`${car.name} Video Walkaround`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Twin VIP Action Suite */}
          <div className="dch-vip-actions" style={{ marginTop: "2rem" }}>
            {/* 1. Titanium White Schedule Private Viewing Button */}
            <button
              type="button"
              className="dch-viewing-vip-btn"
              onClick={() =>
                openAppointmentModal({
                  carName: car.name,
                  carYear: car.year,
                  branchId: car.branch_id,
                })
              }
            >
              <div className="dch-viewing-icon-box">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a0c10"
                  strokeWidth="2.2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="dch-btn-text-wrap">
                <span
                  className="dch-btn-main"
                  style={{ color: "#0a0c10" }}
                >
                  BOOK PRIVATE VIEWING
                </span>
                <span
                  className="dch-btn-sub"
                  style={{ color: "#475569" }}
                >
                  Showroom Appointment
                </span>
              </div>
            </button>

            {/* 2. VIP WhatsApp Concierge Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dch-wa-vip-btn"
              id="dch-wa-action-btn-detail"
            >
              <div className="dch-wa-icon-box">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="#ffffff"
                >
                  <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.838.497 3.633 1.442 5.213L2 22l4.908-1.408c1.517.854 3.238 1.439 5.123 1.439 5.535 0 10.031-4.496 10.031-10.031C22.062 6.496 17.566 2 12.031 2zm5.795 14.285c-.244.686-1.42 1.321-1.956 1.378-.536.057-1.196.229-3.957-.869-3.327-1.323-5.46-4.717-5.626-4.94-.166-.223-1.352-1.8-1.352-3.433 0-1.633.856-2.438 1.161-2.771.305-.333.666-.416.888-.416.222 0 .444.002.638.012.206.01.482-.078.754.577.28.674.957 2.33.1042 2.502.085.172.142.374.028.6-.114.226-.172.367-.342.566-.17.199-.358.444-.512.597-.171.171-.349.356-.15.698.199.342.887 1.464 1.902 2.37 1.309 1.168 2.413 1.53 2.756 1.701.343.171.543.143.744-.086.2-.229.856-.998 1.085-1.341.229-.343.457-.286.771-.171.314.114 1.996.941 2.339 1.112.343.171.571.257.657.4.086.143.086.828-.158 1.514z" />
                </svg>
              </div>
              <div className="dch-btn-text-wrap">
                <span className="dch-btn-main">
                  INQUIRE ON WHATSAPP
                </span>
                <span className="dch-btn-sub">
                  Direct Concierge Desk
                </span>
              </div>
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
