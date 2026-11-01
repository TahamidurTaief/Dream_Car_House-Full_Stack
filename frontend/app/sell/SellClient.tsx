"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { submitSellCarAction, SellCarSubmissionResult } from "@/app/actions/sell";
import type { PublicSiteSettings } from "@/lib/types";

const POPULAR_BRANDS = [
  "Mercedes-Benz",
  "BMW",
  "Lexus",
  "Toyota",
  "Porsche",
  "Land Rover",
  "Audi",
  "BYD",
];

const VALUATION_PERKS = [
  {
    title: "Instant Bank Settlement",
    desc: "Guaranteed same-day electronic funds transfer or bank certified cheque upon mutual inspection agreement.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    title: "Full BRTA Legal Transfer",
    desc: "Our senior legal concierge manages complete ownership transfer & documentation with zero hassle for you.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Peak Market Valuation",
    desc: "Transparent, benchmark appraisals based on real-time Dhaka luxury automotive market demand.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: "Private Doorstep Inspection",
    desc: "Opt for a confidential physical inspection at your residence or visit our Kakrail & Gulshan flagships.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

const EVALUATION_STEPS = [
  {
    step: "01",
    title: "Submit Specification",
    desc: "Provide your luxury vehicle's brand, model, year, mileage, and optional photos.",
  },
  {
    step: "02",
    title: "Preliminary Appraisal",
    desc: "Our Senior Valuation Director assesses current market data and provides an estimated value within 2 hours.",
  },
  {
    step: "03",
    title: "150-Point Verification",
    desc: "Comprehensive physical check at our state-of-the-art facility or your preferred location.",
  },
  {
    step: "04",
    title: "Payout & Handover",
    desc: "Immediate fund transfer, ownership documentation finalized, and complimentary chauffeur return.",
  },
];

export default function SellClient({
  settings,
}: {
  settings?: PublicSiteSettings;
} = {}) {
  const [fullName, setFullName] = useState("");
  const [brand, setBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [branchPreference, setBranchPreference] = useState("kakrail");
  const [notes, setNotes] = useState("");

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SellCarSubmissionResult["data"] | null>(null);

  const activeBrandName = brand === "Other" ? customBrand : brand;
  const hotline = settings?.hotline || "01615-121312";
  const brandName = settings?.name || "DREAM CAR HOUSE";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setErrorMessage(null);

    const finalBrand = activeBrandName.trim();
    if (!finalBrand) {
      setErrorMessage("Please select or enter the vehicle brand.");
      return;
    }

    startTransition(async () => {
      const combinedNotes = [
        branchPreference ? `Preferred Showroom: ${branchPreference.toUpperCase()}` : "",
        notes ? `Client Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await submitSellCarAction({
        name: fullName,
        phone,
        carName: finalBrand,
        carModel: model,
        carYear: year,
        mileage,
        offeredPrice: expectedPrice,
        notes: combinedNotes,
      });

      if (!res.ok) {
        setErrorMessage(res.error || "Failed to submit vehicle valuation. Please verify details.");
      } else if (res.data) {
        setSubmissionResult(res.data);
      }
    });
  };

  const handleBrandPillClick = (b: string) => {
    setBrand(b);
    if (b !== "Other") {
      setCustomBrand("");
    }
  };

  return (
    <div className="sell-page-wrapper" style={{ minHeight: "100vh", backgroundColor: "#060709", color: "#f3f4f6" }}>
      {/* 1. CINEMATIC HERO HEADER */}
      <section
        style={{
          position: "relative",
          padding: "5rem 1.5rem 3.5rem",
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(6, 7, 9, 0) 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem", borderRadius: "9999px", background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", color: "#fbbf24", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }}></span>
            Confidential Private Client Advisory • Dhaka
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1rem",
              background: "linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sell Or Trade-In Your <br />
            <span style={{ background: "linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Luxury Automobile
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: "#9ca3af",
              lineHeight: 1.6,
              maxWidth: "680px",
              margin: "0 auto 2rem",
            }}
          >
            Dhaka&apos;s benchmark in white-glove automotive acquisitions. Receive highest market valuations, instant bank settlement, and seamless BRTA ownership transition with zero complications.
          </p>

          {/* Quick Metrics */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
              flexWrap: "wrap",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>450+</div>
              <div style={{ fontSize: "0.78rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Discreet Acquisitions</div>
            </div>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fbbf24" }}>2 Hours</div>
              <div style={{ fontSize: "0.78rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Rapid Preliminary Quote</div>
            </div>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>100%</div>
              <div style={{ fontSize: "0.78rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>BRTA Legal Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN WORKSPACE: FORM + PERKS */}
      <div className="max-w-7xl" style={{ margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
          
          {/* LEFT: THE LUXURY APPRAISAL FORM */}
          <div
            style={{
              background: "linear-gradient(180deg, #0e1117 0%, #0a0d12 100%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1.25rem", marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}>
                Vehicle Valuation Portal
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                Enter your automobile details below to initialize valuation dossier.
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  borderRadius: "10px",
                  padding: "0.9rem 1.15rem",
                  marginBottom: "1.5rem",
                  color: "#fca5a5",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {!submissionResult ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* STEP 1: VEHICLE PROFILE */}
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>Step 1</span> • <span>Vehicle Identity</span>
                  </div>

                  {/* Brand Quick Pills */}
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.5rem" }}>
                    Select Marque / Manufacturer <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.85rem" }}>
                    {POPULAR_BRANDS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleBrandPillClick(b)}
                        style={{
                          padding: "0.4rem 0.85rem",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          background: brand === b ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.04)",
                          border: brand === b ? "1px solid #fbbf24" : "1px solid rgba(255, 255, 255, 0.08)",
                          color: brand === b ? "#fbbf24" : "#9ca3af",
                        }}
                      >
                        {b}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleBrandPillClick("Other")}
                      style={{
                        padding: "0.4rem 0.85rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        background: brand === "Other" ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.04)",
                        border: brand === "Other" ? "1px solid #fbbf24" : "1px solid rgba(255, 255, 255, 0.08)",
                        color: brand === "Other" ? "#fbbf24" : "#9ca3af",
                      }}
                    >
                      Other Marque
                    </button>
                  </div>

                  {brand === "Other" && (
                    <input
                      type="text"
                      required
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      placeholder="Enter Vehicle Brand (e.g. Bentley, Maserati, Ferrari)..."
                      className="cars-search-input"
                      style={{ width: "100%", marginBottom: "1rem" }}
                    />
                  )}

                  {/* Model & Year */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                        Model / Trim <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. S 580 / Defender 110"
                        className="cars-search-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                        Production Year <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="2000"
                        max="2026"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g. 2023"
                        className="cars-search-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Mileage & Expected Price */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                        Mileage (km) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        placeholder="e.g. 18,500"
                        className="cars-search-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                        Expected Price (BDT) <span style={{ color: "#6b7280" }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        placeholder="e.g. 1,65,00,000"
                        className="cars-search-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2: OWNER & LOGISTICS */}
                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>Step 2</span> • <span>Owner & Inspection Preference</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                        Full Name <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Syed Aminul Haque"
                        className="cars-search-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                        Contact Phone / WhatsApp <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 01711-XXXXXX"
                        className="cars-search-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {/* Showroom Branch Selection */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                      Preferred Showroom or Inspection Location
                    </label>
                    <select
                      value={branchPreference}
                      onChange={(e) => setBranchPreference(e.target.value)}
                      className="filter-select"
                      style={{ width: "100%", background: "#11141a", color: "#fff", borderColor: "rgba(255, 255, 255, 0.12)" }}
                    >
                      <option value="kakrail">Kakrail Main Flagship Showroom (18, Monsur Ali Soroni)</option>
                      <option value="gulshan">Gulshan Private Lounge (House #07, Road #127, Gulshan Avenue)</option>
                      <option value="residence">Private Residence Inspection (Dhaka City)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "#d1d5db", marginBottom: "0.4rem" }}>
                      Additional Notes / Custom Equipment <span style={{ color: "#6b7280" }}>(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Single owner, full authorized dealership service history, panoramic glass roof, rear executive seat package..."
                      className="cars-search-input"
                      style={{ width: "100%", resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="hero-pill-btn"
                  style={{
                    width: "100%",
                    padding: "1rem 2rem",
                    fontSize: "1rem",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    cursor: isPending ? "not-allowed" : "pointer",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "#050608",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(245, 158, 11, 0.35)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isPending ? "Transmitting Dossier to Valuation Desk..." : "Submit For Official Showroom Valuation →"}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>
                  🔒 Strictly Confidential. Your information is protected under {brandName} Private Client Non-Disclosure protocols.
                </p>
              </form>
            ) : (
              /* SUCCESS STATE */
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    color: "#4ade80",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                  Valuation Dossier Received
                </h3>

                <p style={{ color: "#d1d5db", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "440px", margin: "0 auto 1.5rem" }}>
                  Thank you, <strong>{fullName}</strong>. Your {year} {activeBrandName} {model} has been securely logged into our showroom valuation system (Ref #{submissionResult.id || "DCH-VAL"}).
                </p>

                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.25)",
                    borderRadius: "10px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    fontSize: "0.85rem",
                    color: "#fde68a",
                    lineHeight: 1.5,
                    textAlign: "left",
                  }}
                >
                  <strong>Next Concierge Step:</strong> Our Senior Valuation Director is examining real-time Dhaka sales indices for this vehicle. Connect on WhatsApp to expedite same-day appraisal:
                </div>

                {submissionResult.waUrl && (
                  <a
                    href={submissionResult.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="consult-whatsapp-btn"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "0.95rem 1.5rem",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      marginBottom: "1rem",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                    <span>Instant WhatsApp Connect with Valuation Director</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmissionResult(null);
                    setFullName("");
                    setBrand("");
                    setCustomBrand("");
                    setModel("");
                    setYear("");
                    setMileage("");
                    setExpectedPrice("");
                    setPhone("");
                    setNotes("");
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#9ca3af",
                    padding: "0.65rem 1.25rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  ← Submit Another Automobile
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: THE 4 PRESTIGE ADVANTAGES + 4 PROCESS STEPS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Why Choose Dream Car House */}
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fbbf24", marginBottom: "0.4rem" }}>
                Distinguished Excellence
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>
                Why Private Clients Choose Us
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                {VALUATION_PERKS.map((perk) => (
                  <div
                    key={perk.title}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                      transition: "border-color 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.65rem",
                        borderRadius: "10px",
                        background: "rgba(245, 158, 11, 0.1)",
                        color: "#fbbf24",
                        flexShrink: 0,
                      }}
                    >
                      {perk.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.3rem" }}>
                        {perk.title}
                      </h4>
                      <p style={{ fontSize: "0.84rem", color: "#9ca3af", lineHeight: 1.5, margin: 0 }}>
                        {perk.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent 4-Step Process */}
            <div
              style={{
                background: "linear-gradient(180deg, rgba(245, 158, 11, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "16px",
                padding: "1.75rem",
              }}
            >
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#fbbf24" }}>✦</span> Transparent 4-Step Acquisition Process
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {EVALUATION_STEPS.map((s) => (
                  <div key={s.step} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#fbbf24",
                        background: "rgba(245, 158, 11, 0.15)",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "#e5e7eb", marginBottom: "0.2rem" }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.45 }}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Telephone Concierge Callout */}
            <div
              style={{
                background: "#0c0e12",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "14px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.78rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Direct Valuation Desk Hotline
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>
                  {hotline}
                </div>
              </div>

              <a
                href={`tel:${hotline.replace(/[^0-9+]/g, "")}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.6rem 1.15rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Desk
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
