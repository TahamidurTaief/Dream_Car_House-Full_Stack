"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

export default function NavDrawer({
  settings,
  branches,
}: {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
} = {}) {
  const { isDrawerOpen, closeDrawer, openAppointmentModal } = useUI();
  const [isOpen, setIsOpen] = useState(true);

  const brandName = settings?.name || "DREAM CAR HOUSE";
  const tagline = settings?.tagline || "Premier Luxury Automotive Showroom • Kakrail & Gulshan";
  const hotline = settings?.hotline || "01615-121312";
  const hoursText = settings?.opening_hours_text || "10:00 AM - 10:00 PM";
  const waTarget = (settings?.whatsapp || hotline).replace(/[^0-9]/g, "");

  // Real-time Showroom Open/Closed status check (10:00 AM to 10:00 PM BST)
  useEffect(() => {
    const checkShowroomStatus = () => {
      try {
        const now = new Date();
        const dhakaTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
        const dhakaDate = new Date(dhakaTimeStr);
        const hours = dhakaDate.getHours();
        setIsOpen(hours >= 10 && hours < 22);
      } catch {
        const localHours = new Date().getHours();
        setIsOpen(localHours >= 10 && localHours < 22);
      }
    };
    checkShowroomStatus();
    const interval = setInterval(checkShowroomStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isDrawerOpen ? "open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Luxury Slide-Out Aside */}
      <aside
        className={`drawer ${isDrawerOpen ? "open" : ""}`}
        aria-label="Showroom Navigation Drawer"
        aria-hidden={!isDrawerOpen}
      >
        {/* Drawer Header: Monogram & Close Trigger */}
        <div className="drawer-header">
          <div className="drawer-brand-block">
            <Link href="/" onClick={closeDrawer} style={{ display: "inline-block", textDecoration: "none" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <Image
                  src="/assets/dch-logo.webp"
                  alt={`${brandName} Logo`}
                  width={1020}
                  height={350}
                  style={{
                    height: "46px",
                    width: "auto",
                    maxWidth: "240px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.9)) drop-shadow(0 0 12px rgba(255,255,255,0.2))",
                  }}
                  unoptimized
                />
                <span className="drawer-brand-sub">
                  {tagline}
                </span>
              </div>
            </Link>
          </div>

          <button
            className="drawer-close-btn"
            id="drawer-close-btn"
            onClick={closeDrawer}
            aria-label="Close Showroom Drawer"
            title="Close Drawer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Primary Showroom Navigation Links */}
        <nav className="drawer-nav">
          <ul className="drawer-nav-list">
            <li>
              <Link href="/" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">01</span>
                <span className="drawer-nav-title">Showroom Home</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/inventory" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">02</span>
                <span className="drawer-nav-title">Complete Inventory</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/cars/brand-new" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">03</span>
                <span className="drawer-nav-title">Brand New Arrivals</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/cars/reconditioned" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">04</span>
                <span className="drawer-nav-title">Reconditioned Units</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/cars/pre-owned" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">05</span>
                <span className="drawer-nav-title">Certified Pre-Owned</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/sell" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">06</span>
                <span className="drawer-nav-title">Sell / Consign Car</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/about" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">07</span>
                <span className="drawer-nav-title">Our Heritage & Story</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">08</span>
                <span className="drawer-nav-title">Visual Chronicles</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="drawer-nav-item" onClick={closeDrawer}>
                <span className="drawer-nav-num">09</span>
                <span className="drawer-nav-title">Contact Showrooms</span>
                <svg className="drawer-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer: Live Concierge Card & Quick Actions */}
        <div className="drawer-footer-card">
          <div className="drawer-live-status">
            <span className={`drawer-status-dot ${isOpen ? "open" : "closed"}`}></span>
            <span className={`drawer-status-text ${isOpen ? "status-open" : "status-closed"}`}>
              {isOpen
                ? `SHOWROOM OPEN TODAY • ${hoursText}`
                : `SHOWROOM CLOSED NOW • ${hoursText}`}
            </span>
          </div>

          <div className="drawer-concierge-phone">
            <span className="drawer-phone-label">VIP Concierge Line</span>
            <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="drawer-phone-val">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "4px" }}
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              {hotline}
            </a>
          </div>

          <div className="drawer-cta-group">
            <button
              className="drawer-primary-btn"
              onClick={() => {
                closeDrawer();
                openAppointmentModal();
              }}
            >
              <span>Book VIP Viewing</span>
            </button>

            <a
              href={`https://wa.me/${waTarget.startsWith("88") ? waTarget : `88${waTarget}`}?text=Hello%20${encodeURIComponent(brandName)},%20I%20would%20like%20to%20inquire%20about%20a%20luxury%20vehicle`}
              target="_blank"
              rel="noopener noreferrer"
              className="drawer-wa-btn"
              title="Chat on WhatsApp"
              aria-label="WhatsApp Concierge"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
