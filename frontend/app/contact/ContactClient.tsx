"use client";

import React, { useState } from "react";
import { SHOWROOM_BRANCHES, SHOWROOM } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

export default function ContactClient() {
  const { openAppointmentModal } = useUI();
  const [activeTab, setActiveTab] = useState<"kakrail" | "gulshan">("kakrail");

  const kakrail = SHOWROOM_BRANCHES.kakrail;
  const gulshan = SHOWROOM_BRANCHES.gulshan;
  const currentBranch = SHOWROOM_BRANCHES[activeTab];

  return (
    <div className="inventory-page-wrap max-w-7xl" style={{ padding: "8rem 1.5rem 5rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
            OFFICIAL SHOWROOM DIRECTORY
          </span>
          <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
            Contact & Showroom Locations
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
            Visit our state-of-the-art luxury showrooms or connect directly with our VIP executive sales concierge.
          </p>
        </div>

        {/* 2 Showroom Branch Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {/* Kakrail */}
          <div
            style={{
              background: "#0d0f12",
              border: activeTab === "kakrail" ? "1px solid #ffffff" : "1px solid #1f2937",
              borderRadius: "10px",
              padding: "2rem",
              transition: "border-color 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span className="car-badge-pill pill-brandnew" style={{ fontSize: "0.72rem" }}>
                FLAGSHIP SHOWROOM
              </span>
              <span style={{ fontSize: "0.78rem", color: "#22c55e", fontWeight: 600 }}>● OPEN TODAY</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
              {kakrail.name}
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
              {kakrail.address}
            </p>
            <div style={{ fontSize: "0.88rem", color: "#d1d5db", marginBottom: "0.5rem" }}>
              <strong>Direct Phone:</strong>{" "}
              <a href={`tel:${kakrail.phone}`} style={{ color: "#ffffff", textDecoration: "underline" }}>
                {kakrail.phone}
              </a>
            </div>
            <div style={{ fontSize: "0.88rem", color: "#d1d5db", marginBottom: "1.5rem" }}>
              <strong>Hours:</strong> {kakrail.hours}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                className="consult-primary-btn"
                style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}
                onClick={() => openAppointmentModal({ branchId: "kakrail" })}
              >
                Book Kakrail Viewing
              </button>
              <button
                type="button"
                className="gallery-btn-secondary"
                style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}
                onClick={() => setActiveTab("kakrail")}
              >
                View Map
              </button>
            </div>
          </div>

          {/* Gulshan */}
          <div
            style={{
              background: "#0d0f12",
              border: activeTab === "gulshan" ? "1px solid #ffffff" : "1px solid #1f2937",
              borderRadius: "10px",
              padding: "2rem",
              transition: "border-color 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span className="car-badge-pill pill-preowned" style={{ fontSize: "0.72rem" }}>
                GULSHAN AVENUE ATELIER
              </span>
              <span style={{ fontSize: "0.78rem", color: "#22c55e", fontWeight: 600 }}>● OPEN TODAY</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem" }}>
              {gulshan.name}
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
              {gulshan.address}
            </p>
            <div style={{ fontSize: "0.88rem", color: "#d1d5db", marginBottom: "0.5rem" }}>
              <strong>Direct Phone:</strong>{" "}
              <a href={`tel:${gulshan.phone}`} style={{ color: "#ffffff", textDecoration: "underline" }}>
                {gulshan.phone}
              </a>
            </div>
            <div style={{ fontSize: "0.88rem", color: "#d1d5db", marginBottom: "1.5rem" }}>
              <strong>Hours:</strong> {gulshan.hours}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                className="consult-primary-btn"
                style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}
                onClick={() => openAppointmentModal({ branchId: "gulshan" })}
              >
                Book Gulshan Viewing
              </button>
              <button
                type="button"
                className="gallery-btn-secondary"
                style={{ padding: "0.6rem 1rem", fontSize: "0.82rem" }}
                onClick={() => setActiveTab("gulshan")}
              >
                View Map
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Google Map Section */}
        <div style={{ background: "#0d0f12", border: "1px solid #1f2937", borderRadius: "10px", padding: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
              Live Map: {currentBranch.name}
            </h3>
            <div className="footer-branch-tabs" style={{ margin: 0 }}>
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
            </div>
          </div>

          <div className="map-embed-wrapper-modern" style={{ height: "380px" }}>
            <iframe
              src={currentBranch.embed_map}
              loading="lazy"
              title={`DREAM CAR HOUSE Location - ${currentBranch.name}`}
              allowFullScreen
            />
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              {currentBranch.address}
            </span>
            <a
              href={currentBranch.map_link}
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
        <div
          style={{
            background: "linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)",
            border: "1px solid #1f2937",
            borderRadius: "10px",
            padding: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.35rem" }}>
              Connect with Corporate VIP Concierge
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>
              Official Hotline: <strong>01615-121312</strong> • Email: <strong>dreamcarhouse101@gmail.com</strong>
            </p>
          </div>

          <a
            href="https://wa.me/8801615121312?text=Hello%20DREAM%20CAR%20HOUSE,%20I%20am%20inquiring%20about%20a%20luxury%20vehicle%20at%20your%20Dhaka%20showroom."
            target="_blank"
            rel="noopener noreferrer"
            className="consult-whatsapp-btn"
            style={{ padding: "0.85rem 1.75rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
