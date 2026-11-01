"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SHOWROOM_BRANCHES } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

export default function Footer({
  settings,
  branches = [],
}: {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
} = {}) {
  const { openCompareModal } = useUI();

  // If database branches exist, use the first branch's ID; else default to kakrail
  const hasDbBranches = branches && branches.length > 0;
  const [activeBranchId, setActiveBranchId] = useState<string>(
    hasDbBranches ? branches[0].branch_id : "kakrail"
  );

  const kakrailFallback = SHOWROOM_BRANCHES.kakrail;
  const gulshanFallback = SHOWROOM_BRANCHES.gulshan;

  const currentDbBranch = hasDbBranches
    ? branches.find((b) => b.branch_id === activeBranchId) || branches[0]
    : null;

  const activeBranchName = currentDbBranch
    ? currentDbBranch.name
    : activeBranchId === "gulshan"
    ? gulshanFallback.name
    : kakrailFallback.name;

  const activeBranchAddress = currentDbBranch
    ? currentDbBranch.address
    : activeBranchId === "gulshan"
    ? gulshanFallback.address
    : kakrailFallback.address;

  const activeBranchMapSrc = currentDbBranch
    ? currentDbBranch.embed_map || "https://maps.google.com/maps?output=embed"
    : activeBranchId === "gulshan"
    ? gulshanFallback.embed_map
    : kakrailFallback.embed_map;

  const activeBranchMapLink = currentDbBranch
    ? currentDbBranch.map_link || "https://maps.google.com"
    : activeBranchId === "gulshan"
    ? gulshanFallback.map_link
    : kakrailFallback.map_link;

  const hotline = settings?.hotline || settings?.phone || "01615-121312";
  const email = settings?.email || "dreamcarhouse101@gmail.com";
  const brandName = settings?.name || "DREAM CAR HOUSE";
  const tagline = settings?.footer_tagline || settings?.tagline || "Where Extraordinary Dreams Meet The Road • Kakrail & Gulshan, Dhaka.";

  return (
    <footer className="site-footer" id="contact">
      <div className="max-w-7xl">
        <div className="footer-grid-3col">
          {/* Col 1: Contact Info */}
          <div className="footer-col-contact">
            <div style={{ marginBottom: "1.1rem" }}>
              <Link href="/" aria-label={`${brandName} Homepage`}>
                <Image
                  src="/assets/dch-logo.webp"
                  alt={`${brandName} Logo`}
                  width={1020}
                  height={350}
                  style={{
                    height: "60px",
                    width: "auto",
                    maxWidth: "280px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.85)) drop-shadow(0 0 14px rgba(255,255,255,0.15))",
                  }}
                  unoptimized
                />
              </Link>
            </div>
            <p className="footer-brand-tagline">
              {tagline}
            </p>

            <ul className="contact-list">
              <li className="contact-item">
                <svg
                  className="contact-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  {hasDbBranches ? (
                    branches.map((b, idx) => (
                      <React.Fragment key={b.branch_id || idx}>
                        {idx > 0 && <br />}
                        <strong>{b.name || b.short_name}</strong>: {b.address}
                      </React.Fragment>
                    ))
                  ) : (
                    <>
                      <strong>Kakrail Branch (Main)</strong>: 18, Shaheed Captain Monsur Ali Soroni, Kakrail
                      <br />
                      <strong>Gulshan Branch</strong>: House #07, Road #127, Gulshan Avenue
                    </>
                  )}
                </span>
              </li>
              <li className="contact-item">
                <svg
                  className="contact-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="contact-link">
                  {hotline}
                </a>
              </li>
              <li className="contact-item">
                <svg
                  className="contact-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href={`mailto:${email}`} className="contact-link">
                  {email}
                </a>
              </li>
              {settings?.opening_hours_text && (
                <li className="contact-item">
                  <svg
                    className="contact-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>
                    {settings.opening_hours_text} <span className="status-open-pill">Open</span>
                  </span>
                </li>
              )}
            </ul>

            <div className="footer-social-row">
              <a
                href={settings?.social_media?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href={settings?.social_media?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href={settings?.social_media?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="footer-social-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Col 2: Interactive Showroom Map */}
          <div className="footer-col-map">
            <div className="map-header-row">
              <h3 className="footer-col-title" style={{ margin: 0 }}>
                Showroom Locations
              </h3>
              <span className="map-subtitle">
                {activeBranchName} • {activeBranchAddress}
              </span>
            </div>
            <div className="footer-branch-tabs">
              {hasDbBranches ? (
                branches.map((b) => (
                  <button
                    key={b.branch_id}
                    type="button"
                    className={`footer-branch-tab ${activeBranchId === b.branch_id ? "active" : ""}`}
                    onClick={() => setActiveBranchId(b.branch_id)}
                  >
                    {b.short_name || b.name}
                  </button>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    className={`footer-branch-tab ${activeBranchId === "kakrail" ? "active" : ""}`}
                    onClick={() => setActiveBranchId("kakrail")}
                  >
                    Kakrail Branch (Main)
                  </button>
                  <button
                    type="button"
                    className={`footer-branch-tab ${activeBranchId === "gulshan" ? "active" : ""}`}
                    onClick={() => setActiveBranchId("gulshan")}
                  >
                    Gulshan Branch
                  </button>
                </>
              )}
            </div>
            <div className="map-embed-wrapper-modern">
              <iframe
                src={activeBranchMapSrc}
                loading="lazy"
                title={`${brandName} Showroom Location - ${activeBranchName}`}
                allowFullScreen
              />
              <div className="map-glow-border"></div>
            </div>
            <div className="map-actions-row">
              <a
                href={activeBranchMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-directions-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>Get Live Directions</span>
              </a>
              <button
                type="button"
                className="map-directions-btn compare-quick-trigger"
                onClick={openCompareModal}
                title="Launch Vehicle Compare Engine"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span>Compare Vehicles</span>
              </button>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="footer-col-links">
            <h3 className="footer-col-title">Showroom Concierge</h3>
            <ul className="footer-nav-list">
              <li>
                <Link href="/inventory" className="footer-nav-link">
                  Complete Inventory
                </Link>
              </li>
              <li>
                <Link href="/cars/brand-new" className="footer-nav-link">
                  Brand New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/cars/reconditioned" className="footer-nav-link">
                  Reconditioned Selection
                </Link>
              </li>
              <li>
                <Link href="/cars/pre-owned" className="footer-nav-link">
                  Certified Pre-Owned
                </Link>
              </li>
              <li>
                <Link href="/sell" className="footer-nav-link">
                  Sell / Consign Your Vehicle
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-nav-link">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="footer-nav-link">
                  Showroom Visual Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-nav-link">
                  Contact & Locations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="footer-bottom-modern">
          <div className="footer-copy-text">
            © 2026 <strong>{brandName}</strong>. All rights reserved. Kakrail & Gulshan, Dhaka, Bangladesh.
          </div>
          <div className="footer-sub-links">
            <span className="footer-sub-label">
              Confidential Private Concierge Advisory
            </span>
            <span className="sep">•</span>
            <Link href="/about" className="footer-sub-link">
              Showroom Heritage
            </Link>
            <span className="sep">•</span>
            <Link href="/contact" className="footer-sub-link">
              VIP Atelier Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
