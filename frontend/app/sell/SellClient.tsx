"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { submitSellCarAction, SellCarSubmissionResult } from "@/app/actions/sell";
import { useUI } from "@/lib/UIContext";
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
  const { theme } = useUI();
  const isLight = theme === "light";

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

  // Dynamic Theme Colors (Seamless Day/Night Mode)
  const colors = {
    bgPage: isLight ? "#f0f4f8" : "#060709",
    bgHero: isLight
      ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217, 119, 6, 0.09) 0%, rgba(240, 244, 248, 0) 100%)"
      : "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(6, 7, 9, 0) 100%)",
    heroBorder: isLight ? "rgba(148, 163, 184, 0.25)" : "rgba(255, 255, 255, 0.08)",
    heroTitle: isLight
      ? "linear-gradient(180deg, #0f172a 40%, #334155 100%)"
      : "linear-gradient(180deg, #ffffff 40%, rgba(255, 255, 255, 0.7) 100%)",
    goldGradient: isLight
      ? "linear-gradient(90deg, #d97706 0%, #b45309 60%, #92400e 100%)"
      : "linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
    textPrimary: isLight ? "#0f172a" : "#f3f4f6",
    textSecondary: isLight ? "#475569" : "#9ca3af",
    textMuted: isLight ? "#64748b" : "#6b7280",
    cardBg: isLight ? "#ffffff" : "linear-gradient(180deg, #0e1117 0%, #0a0d12 100%)",
    cardBorder: isLight ? "rgba(148, 163, 184, 0.3)" : "rgba(255, 255, 255, 0.12)",
    cardShadow: isLight
      ? "0 10px 30px -8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(148, 163, 184, 0.18)"
      : "0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    inputBg: isLight ? "#f8fafc" : "#11141a",
    inputBorder: isLight ? "rgba(148, 163, 184, 0.45)" : "rgba(255, 255, 255, 0.12)",
    inputText: isLight ? "#0f172a" : "#ffffff",
    perkCardBg: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.03)",
    perkCardBorder: isLight ? "rgba(148, 163, 184, 0.25)" : "rgba(255, 255, 255, 0.06)",
    perkCardShadow: isLight ? "0 4px 15px rgba(15, 23, 42, 0.04)" : "none",
    stepBoxBg: isLight
      ? "linear-gradient(180deg, rgba(217, 119, 6, 0.06) 0%, rgba(255, 255, 255, 0.95) 100%)"
      : "linear-gradient(180deg, rgba(245, 158, 11, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
    stepBoxBorder: isLight ? "rgba(217, 119, 6, 0.3)" : "rgba(245, 158, 11, 0.2)",
    stepBadgeBg: isLight ? "rgba(217, 119, 6, 0.15)" : "rgba(245, 158, 11, 0.15)",
    stepBadgeText: isLight ? "#b45309" : "#fbbf24",
    pillBg: isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(255, 255, 255, 0.04)",
    pillBorder: isLight ? "rgba(148, 163, 184, 0.35)" : "rgba(255, 255, 255, 0.08)",
    pillText: isLight ? "#334155" : "#9ca3af",
    pillActiveBg: isLight ? "rgba(217, 119, 6, 0.15)" : "rgba(245, 158, 11, 0.2)",
    pillActiveBorder: isLight ? "#d97706" : "#fbbf24",
    pillActiveText: isLight ? "#b45309" : "#fbbf24",
    goldAccent: isLight ? "#b45309" : "#fbbf24",
    divider: isLight ? "rgba(148, 163, 184, 0.25)" : "rgba(255, 255, 255, 0.08)",
    hotlineBoxBg: isLight ? "#ffffff" : "#0c0e12",
    hotlineBoxBorder: isLight ? "rgba(148, 163, 184, 0.28)" : "rgba(255, 255, 255, 0.08)",
    btnSubmitBg: isLight
      ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    btnSubmitText: "#ffffff",
    btnSubmitShadow: isLight
      ? "0 4px 18px rgba(217, 119, 6, 0.35)"
      : "0 4px 20px rgba(245, 158, 11, 0.35)",
  };

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
    <div
      className="sell-page-wrapper"
      style={{
        minHeight: "100vh",
        backgroundColor: colors.bgPage,
        color: colors.textPrimary,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* 1. CINEMATIC HERO HEADER */}
      <section
        style={{
          position: "relative",
          padding: "5rem 1.5rem 3.5rem",
          background: colors.bgHero,
          borderBottom: `1px solid ${colors.heroBorder}`,
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1rem",
              background: colors.heroTitle,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sell Or Trade-In Your <br />
            <span style={{ background: colors.goldGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Luxury Automobile
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
              color: colors.textSecondary,
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
              paddingTop: "1.25rem",
              borderTop: `1px solid ${colors.divider}`,
            }}
          >
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: colors.textPrimary }}>450+</div>
              <div style={{ fontSize: "0.78rem", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>Discreet Acquisitions</div>
            </div>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: colors.goldAccent }}>2 Hours</div>
              <div style={{ fontSize: "0.78rem", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rapid Preliminary Quote</div>
            </div>
            <div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: colors.textPrimary }}>100%</div>
              <div style={{ fontSize: "0.78rem", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>BRTA Legal Protection</div>
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
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: "16px",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: colors.cardShadow,
              transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div style={{ borderBottom: `1px solid ${colors.divider}`, paddingBottom: "1.25rem", marginBottom: "1.75rem" }}>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: colors.textPrimary, marginBottom: "0.35rem" }}>
                Vehicle Valuation Portal
              </h2>
              <p style={{ fontSize: "0.85rem", color: colors.textSecondary }}>
                Enter your automobile details below to initialize valuation dossier.
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: isLight ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "10px",
                  padding: "0.9rem 1.15rem",
                  marginBottom: "1.5rem",
                  color: isLight ? "#b91c1c" : "#fca5a5",
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
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.goldAccent, marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>Step 1</span> • <span>Vehicle Identity</span>
                  </div>

                  {/* Brand Quick Pills */}
                  <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.5rem" }}>
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
                          background: brand === b ? colors.pillActiveBg : colors.pillBg,
                          border: brand === b ? `1px solid ${colors.pillActiveBorder}` : `1px solid ${colors.pillBorder}`,
                          color: brand === b ? colors.pillActiveText : colors.pillText,
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
                        background: brand === "Other" ? colors.pillActiveBg : colors.pillBg,
                        border: brand === "Other" ? `1px solid ${colors.pillActiveBorder}` : `1px solid ${colors.pillBorder}`,
                        color: brand === "Other" ? colors.pillActiveText : colors.pillText,
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
                      style={{
                        width: "100%",
                        marginBottom: "1rem",
                        background: colors.inputBg,
                        borderColor: colors.inputBorder,
                        color: colors.inputText,
                      }}
                    />
                  )}

                  {/* Model & Year */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
                        Model / Trim <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. S 580 / Defender 110"
                        className="cars-search-input"
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
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
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                      />
                    </div>
                  </div>

                  {/* Mileage & Expected Price */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
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
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
                        Expected Price (BDT) <span style={{ color: colors.textMuted }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        placeholder="e.g. 1,65,00,000"
                        className="cars-search-input"
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2: OWNER & LOGISTICS */}
                <div style={{ borderTop: `1px solid ${colors.divider}`, paddingTop: "1.25rem" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.goldAccent, marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>Step 2</span> • <span>Owner & Inspection Preference</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
                        Full Name <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Syed Aminul Haque"
                        className="cars-search-input"
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
                        Contact Phone / WhatsApp <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 01711-XXXXXX"
                        className="cars-search-input"
                        style={{
                          width: "100%",
                          background: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.inputText,
                        }}
                      />
                    </div>
                  </div>

                  {/* Showroom Branch Selection */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
                      Preferred Showroom or Inspection Location
                    </label>
                    <select
                      value={branchPreference}
                      onChange={(e) => setBranchPreference(e.target.value)}
                      className="filter-select"
                      style={{
                        width: "100%",
                        background: colors.inputBg,
                        color: colors.inputText,
                        borderColor: colors.inputBorder,
                      }}
                    >
                      <option value="kakrail">Kakrail Main Flagship Showroom (18, Monsur Ali Soroni)</option>
                      <option value="gulshan">Gulshan Private Lounge (House #07, Road #127, Gulshan Avenue)</option>
                      <option value="residence">Private Residence Inspection (Dhaka City)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: colors.textSecondary, marginBottom: "0.4rem" }}>
                      Additional Notes / Custom Equipment <span style={{ color: colors.textMuted }}>(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Single owner, full authorized dealership service history, panoramic glass roof, rear executive seat package..."
                      className="cars-search-input"
                      style={{
                        width: "100%",
                        resize: "vertical",
                        fontFamily: "inherit",
                        background: colors.inputBg,
                        borderColor: colors.inputBorder,
                        color: colors.inputText,
                      }}
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
                    background: colors.btnSubmitBg,
                    color: colors.btnSubmitText,
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: colors.btnSubmitShadow,
                    transition: "all 0.3s ease",
                  }}
                >
                  {isPending ? "Transmitting Dossier to Valuation Desk..." : "Submit For Official Showroom Valuation →"}
                </button>

                <p style={{ textAlign: "center", fontSize: "0.78rem", color: colors.textMuted, margin: 0 }}>
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
                    background: isLight ? "rgba(22, 163, 74, 0.12)" : "rgba(34, 197, 94, 0.15)",
                    border: isLight ? "1px solid rgba(22, 163, 74, 0.35)" : "1px solid rgba(34, 197, 94, 0.4)",
                    color: isLight ? "#16a34a" : "#4ade80",
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

                <h3 style={{ fontSize: "1.45rem", fontWeight: 700, color: colors.textPrimary, marginBottom: "0.5rem" }}>
                  Valuation Dossier Received
                </h3>

                <p style={{ color: colors.textSecondary, fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "440px", margin: "0 auto 1.5rem" }}>
                  Thank you, <strong>{fullName}</strong>. Your {year} {activeBrandName} {model} has been securely logged into our showroom valuation system (Ref #{submissionResult.id || "DCH-VAL"}).
                </p>

                <div
                  style={{
                    background: isLight ? "rgba(217, 119, 6, 0.08)" : "rgba(245, 158, 11, 0.08)",
                    border: isLight ? "1px solid rgba(217, 119, 6, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
                    borderRadius: "10px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    fontSize: "0.85rem",
                    color: isLight ? "#92400e" : "#fde68a",
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
                    border: `1px solid ${colors.cardBorder}`,
                    color: colors.textSecondary,
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
              <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: colors.goldAccent, marginBottom: "0.4rem" }}>
                Distinguished Excellence
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.textPrimary, marginBottom: "1.25rem" }}>
                Why Private Clients Choose Us
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
                {VALUATION_PERKS.map((perk) => (
                  <div
                    key={perk.title}
                    style={{
                      background: colors.perkCardBg,
                      border: `1px solid ${colors.perkCardBorder}`,
                      borderRadius: "12px",
                      padding: "1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                      boxShadow: colors.perkCardShadow,
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.65rem",
                        borderRadius: "10px",
                        background: isLight ? "rgba(217, 119, 6, 0.12)" : "rgba(245, 158, 11, 0.1)",
                        color: colors.goldAccent,
                        flexShrink: 0,
                      }}
                    >
                      {perk.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 600, color: colors.textPrimary, marginBottom: "0.3rem" }}>
                        {perk.title}
                      </h4>
                      <p style={{ fontSize: "0.84rem", color: colors.textSecondary, lineHeight: 1.5, margin: 0 }}>
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
                background: colors.stepBoxBg,
                border: `1px solid ${colors.stepBoxBorder}`,
                borderRadius: "16px",
                padding: "1.75rem",
                boxShadow: colors.perkCardShadow,
              }}
            >
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: colors.textPrimary, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: colors.goldAccent }}>✦</span> Transparent 4-Step Acquisition Process
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {EVALUATION_STEPS.map((s) => (
                  <div key={s.step} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: colors.stepBadgeText,
                        background: colors.stepBadgeBg,
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
                      <div style={{ fontSize: "0.92rem", fontWeight: 600, color: colors.textPrimary, marginBottom: "0.2rem" }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: colors.textSecondary, lineHeight: 1.45 }}>
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
                background: colors.hotlineBoxBg,
                border: `1px solid ${colors.hotlineBoxBorder}`,
                borderRadius: "14px",
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                boxShadow: colors.perkCardShadow,
              }}
            >
              <div>
                <div style={{ fontSize: "0.78rem", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Direct Valuation Desk Hotline
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.textPrimary }}>
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
                  background: isLight ? "rgba(15, 23, 42, 0.06)" : "rgba(255, 255, 255, 0.08)",
                  border: `1px solid ${colors.cardBorder}`,
                  color: colors.textPrimary,
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
