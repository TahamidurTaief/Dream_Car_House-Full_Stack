"use client";

import React, { useState } from "react";
import { SHOWROOM_BRANCHES, SHOWROOM } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";
import type { PublicShowroomBranch, PublicSiteSettings } from "@/lib/types";

interface ContactClientProps {
  branches?: PublicShowroomBranch[];
  settings?: PublicSiteSettings | null;
}

export default function ContactClient({ branches = [], settings }: ContactClientProps = {}) {
  const { openAppointmentModal } = useUI();

  const hasDbBranches = branches && branches.length > 0;
  const [activeTab, setActiveTab] = useState<string>(
    hasDbBranches ? branches[0].branch_id : "kakrail"
  );

  const kakrail = SHOWROOM_BRANCHES.kakrail;
  const gulshan = SHOWROOM_BRANCHES.gulshan;

  const currentDbBranch = hasDbBranches
    ? branches.find((b) => b.branch_id === activeTab) || branches[0]
    : null;

  const branchName = currentDbBranch ? currentDbBranch.name : activeTab === "gulshan" ? gulshan.name : kakrail.name;
  const branchTag = currentDbBranch ? currentDbBranch.tag || "SHOWROOM ATELIER" : activeTab === "gulshan" ? gulshan.tag : kakrail.tag;
  const branchAddress = currentDbBranch ? currentDbBranch.address : activeTab === "gulshan" ? gulshan.address : kakrail.address;
  const branchPhone = currentDbBranch ? currentDbBranch.phone : activeTab === "gulshan" ? gulshan.phone : kakrail.phone;
  const branchHours = currentDbBranch ? currentDbBranch.hours : activeTab === "gulshan" ? gulshan.hours : kakrail.hours;
  const branchMapSrc = currentDbBranch ? currentDbBranch.embed_map || kakrail.embed_map : activeTab === "gulshan" ? gulshan.embed_map : kakrail.embed_map;
  const branchMapLink = currentDbBranch ? currentDbBranch.map_link || kakrail.map_link : activeTab === "gulshan" ? gulshan.map_link : kakrail.map_link;

  const hotline = settings?.hotline || "01615-121312";
  const email = settings?.email || "dreamcarhouse101@gmail.com";
  const brandName = settings?.name || "DREAM CAR HOUSE";

  return (
    <div className="inventory-page-wrap max-w-7xl">
      <div className="contact-page-container">
        {/* Page Header */}
        <div className="contact-header-wrap">
          <span className="contact-eyebrow-badge">
            OFFICIAL SHOWROOM DIRECTORY
          </span>
          <h1 className="contact-page-title">
            Contact & Showroom Locations
          </h1>
          <p className="contact-page-sub">
            Visit our state-of-the-art luxury showrooms or connect directly with our VIP executive sales concierge across Kakrail & Gulshan.
          </p>
        </div>

        {/* Dynamic Showroom Branch Cards */}
        {hasDbBranches ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
            {branches.map((b) => {
              const isActive = (currentDbBranch?.branch_id || "") === b.branch_id;
              return (
                <div
                  key={b.id || b.branch_id}
                  style={{
                    background: "#0d0f12",
                    border: isActive ? "1px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.10)",
                    borderRadius: "10px",
                    padding: "2rem",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span className="car-badge-pill pill-brandnew" style={{ fontSize: "0.72rem" }}>
                      {b.tag || "SHOWROOM ATELIER"}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#22c55e", fontWeight: 600 }}>● OPEN TODAY</span>
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
                    {b.name}
                  </h3>
                  {b.address && (
                    <p style={{ color: "rgba(255, 255, 255, 0.60)", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                      {b.address}
                    </p>
                  )}
                  {b.phone && (
                    <div style={{ fontSize: "0.88rem", color: "#d1d5db", marginBottom: "0.5rem" }}>
                      <strong>Direct Phone:</strong>{" "}
                      <a href={`tel:${b.phone}`} style={{ color: "#ffffff", textDecoration: "underline" }}>
                        {b.phone}
                      </a>
                    </div>
                  )}
                  {b.hours && (
                    <div style={{ fontSize: "0.88rem", color: "#d1d5db", marginBottom: "1.5rem" }}>
                      <strong>Visiting Hours:</strong> {b.hours}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => openAppointmentModal({ branchId: b.branch_id || String(b.id), carName: `${b.name} Visit` })}
                    className="consult-primary-btn"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <span>Schedule Appointment</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="contact-branches-grid">
            {/* Kakrail Branch Card */}
            <div className={`contact-branch-card ${activeTab === "kakrail" ? "active" : ""}`}>
              <div className="contact-card-top">
                <span className="car-badge-pill pill-brandnew">
                  {kakrail.tag}
                </span>
                <span className="contact-live-pill">● OPEN TODAY</span>
              </div>
              <h3 className="contact-branch-heading">{kakrail.name}</h3>
              <p className="contact-branch-desc">{kakrail.address}</p>

              <div className="contact-detail-row">
                <strong>Direct Phone:</strong>
                <a href={`tel:${kakrail.phone}`} className="contact-link-inline">
                  {kakrail.phone}
                </a>
              </div>
              <div className="contact-detail-row">
                <strong>Visiting Hours:</strong> {kakrail.hours}
              </div>

              <div className="contact-card-action">
                <button
                  type="button"
                  onClick={() => openAppointmentModal({ branchId: "kakrail", carName: "Kakrail Showroom Visit" })}
                  className="consult-primary-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>

            {/* Gulshan Branch Card */}
            <div className={`contact-branch-card ${activeTab === "gulshan" ? "active" : ""}`}>
              <div className="contact-card-top">
                <span className="car-badge-pill pill-brandnew">
                  {gulshan.tag}
                </span>
                <span className="contact-live-pill">● OPEN TODAY</span>
              </div>
              <h3 className="contact-branch-heading">{gulshan.name}</h3>
              <p className="contact-branch-desc">{gulshan.address}</p>

              <div className="contact-detail-row">
                <strong>Direct Phone:</strong>
                <a href={`tel:${gulshan.phone}`} className="contact-link-inline">
                  {gulshan.phone}
                </a>
              </div>
              <div className="contact-detail-row">
                <strong>Visiting Hours:</strong> {gulshan.hours}
              </div>

              <div className="contact-card-action">
                <button
                  type="button"
                  onClick={() => openAppointmentModal({ branchId: "gulshan", carName: "Gulshan Showroom Visit" })}
                  className="consult-primary-btn"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Google Map Card */}
        <div className="contact-map-card">
          <div className="contact-map-header">
            <h3 className="contact-map-title">
              Live Map: {branchName}
            </h3>
            <div className="footer-branch-tabs" style={{ margin: 0 }}>
              {hasDbBranches ? (
                branches.map((b) => (
                  <button
                    key={b.branch_id}
                    type="button"
                    className={`footer-branch-tab ${activeTab === b.branch_id ? "active" : ""}`}
                    onClick={() => setActiveTab(b.branch_id)}
                  >
                    {b.short_name || b.name}
                  </button>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    className={`footer-branch-tab ${activeTab === "kakrail" ? "active" : ""}`}
                    onClick={() => setActiveTab("kakrail")}
                  >
                    Kakrail Branch
                  </button>
                  <button
                    type="button"
                    className={`footer-branch-tab ${activeTab === "gulshan" ? "active" : ""}`}
                    onClick={() => setActiveTab("gulshan")}
                  >
                    Gulshan Branch
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="map-embed-wrapper-modern" style={{ height: "400px" }}>
            <iframe
              src={branchMapSrc}
              loading="lazy"
              title={`${brandName} Location - ${branchName}`}
              allowFullScreen
            />
          </div>

          <div className="contact-map-footer">
            <span className="contact-map-addr-text">
              {branchAddress}
            </span>
            <a
              href={branchMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="map-directions-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>Get Live Directions</span>
            </a>
          </div>
        </div>

        {/* Global WhatsApp & Hotline Direct Contact Banner */}
        <div className="contact-banner-card">
          <div className="contact-banner-info">
            <h3 className="contact-banner-title">
              Connect with Corporate VIP Concierge
            </h3>
            <p className="contact-banner-desc">
              Official Hotline: <strong>{hotline}</strong> • Email: <strong>{email}</strong>
            </p>
          </div>

          <a
            href={`https://wa.me/8801615121312?text=Hello%20${encodeURIComponent(brandName)},%20I%20am%20inquiring%20about%20a%20luxury%20vehicle%20at%20your%20Dhaka%20showroom.`}
            target="_blank"
            rel="noopener noreferrer"
            className="consult-whatsapp-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            <span>Direct WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
}
