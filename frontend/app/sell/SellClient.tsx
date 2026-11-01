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
    textPrimary: isLight ? "#0f172a" : "#ffffff",
    textSecondary: isLight ? "#475569" : "#9ca3af",
    textMuted: isLight ? "#64748b" : "#6b7280",
    cardBg: isLight ? "#ffffff" : "#0d0f14",
    cardBorder: isLight ? "rgba(148, 163, 184, 0.3)" : "rgba(255, 255, 255, 0.10)",
    cardShadow: isLight
      ? "0 10px 30px -8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(148, 163, 184, 0.18)"
      : "0 20px 40px rgba(0, 0, 0, 0.5)",
    inputBg: isLight ? "#f8fafc" : "#12151c",
    inputBorder: isLight ? "rgba(148, 163, 184, 0.4)" : "rgba(255, 255, 255, 0.12)",
    inputText: isLight ? "#0f172a" : "#ffffff",
    pillBg: isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(255, 255, 255, 0.04)",
    pillBorder: isLight ? "rgba(148, 163, 184, 0.3)" : "rgba(255, 255, 255, 0.08)",
    pillText: isLight ? "#334155" : "#9ca3af",
    pillActiveBg: isLight ? "rgba(217, 119, 6, 0.12)" : "rgba(245, 158, 11, 0.2)",
    pillActiveBorder: isLight ? "#d97706" : "#fbbf24",
    pillActiveText: isLight ? "#b45309" : "#fbbf24",
    goldAccent: isLight ? "#b45309" : "#fbbf24",
    divider: isLight ? "rgba(148, 163, 184, 0.2)" : "rgba(255, 255, 255, 0.08)",
    btnSubmitBg: isLight
      ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
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
    <div className="inventory-page-wrap max-w-7xl">
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        
        {/* Clean, Elegant Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="section-h2" style={{ marginBottom: "0.65rem", color: colors.textPrimary }}>
            Sell Your Luxury Car
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto" }}>
            Submit your vehicle specifications for a discreet appraisal, peak market valuation, and instant settlement across our Kakrail & Gulshan flagships.
          </p>
        </div>

        {/* The Valuation Form Card */}
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "14px",
            padding: "clamp(1.5rem, 3.5vw, 2.75rem)",
            boxShadow: colors.cardShadow,
            transition: "all 0.3s ease",
          }}
        >
          {errorMessage && (
            <div
              style={{
                background: isLight ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "10px",
                padding: "0.85rem 1.15rem",
                marginBottom: "1.5rem",
                color: isLight ? "#b91c1c" : "#fca5a5",
                fontSize: "0.88rem",
              }}
            >
              {errorMessage}
            </div>
          )}

          {!submissionResult ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Brand Pills */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.5rem" }}>
                  Select Brand / Manufacturer <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.75rem" }}>
                  {POPULAR_BRANDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleBrandPillClick(b)}
                      style={{
                        padding: "0.4rem 0.85rem",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
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
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: brand === "Other" ? colors.pillActiveBg : colors.pillBg,
                      border: brand === "Other" ? `1px solid ${colors.pillActiveBorder}` : `1px solid ${colors.pillBorder}`,
                      color: brand === "Other" ? colors.pillActiveText : colors.pillText,
                    }}
                  >
                    Other
                  </button>
                </div>

                {brand === "Other" && (
                  <input
                    type="text"
                    required
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="Enter Brand Name (e.g. Maserati, Bentley)..."
                    className="cars-search-input"
                    style={{
                      width: "100%",
                      marginBottom: "0.75rem",
                      background: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.inputText,
                    }}
                  />
                )}
              </div>

              {/* Model & Year */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
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
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
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
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
                    Expected Price in BDT <span style={{ color: colors.textMuted, fontWeight: 400 }}>(Optional)</span>
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

              {/* Name & Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", borderTop: `1px solid ${colors.divider}`, paddingTop: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
                    Your Full Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chowdhury Rahman"
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
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
                    Phone Number / WhatsApp <span style={{ color: "#ef4444" }}>*</span>
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

              {/* Showroom Branch Preference */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
                  Preferred Valuation Location
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
                  <option value="residence">Doorstep Private Inspection (Dhaka City)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: colors.textSecondary, marginBottom: "0.4rem" }}>
                  Vehicle Highlights / Condition Notes <span style={{ color: colors.textMuted, fontWeight: 400 }}>(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Single owner, authorized service records, sunroof, pristine interior condition..."
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

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isPending}
                className="hero-pill-btn"
                style={{
                  width: "100%",
                  padding: "0.95rem 1.5rem",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: isPending ? "not-allowed" : "pointer",
                  background: colors.btnSubmitBg,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(217, 119, 6, 0.3)",
                  transition: "all 0.25s ease",
                  marginTop: "0.5rem",
                }}
              >
                {isPending ? "Submitting Valuation..." : "Submit Vehicle Details →"}
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem", fontSize: "0.8rem", color: colors.textMuted }}>
                <span>🔒 100% Confidential Valuation</span>
                <span>Direct Hotline: <strong style={{ color: colors.textPrimary }}>{hotline}</strong></span>
              </div>
            </form>
          ) : (
            /* SUCCESS CONFIRMATION */
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: colors.textPrimary, marginBottom: "0.5rem" }}>
                Valuation Details Received
              </h3>

              <p style={{ color: colors.textSecondary, fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "440px", margin: "0 auto 1.5rem" }}>
                Thank you, <strong>{fullName}</strong>. Your {year} {activeBrandName} {model} has been securely logged for valuation (Ref #{submissionResult.id || "DCH-VAL"}).
              </p>

              {submissionResult.waUrl && (
                <a
                  href={submissionResult.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="consult-whatsapp-btn"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "0.85rem 1.5rem",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                    marginBottom: "1rem",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                  </svg>
                  <span>Connect with Valuation Team on WhatsApp</span>
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
                  padding: "0.6rem 1.25rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
              >
                ← Submit Another Vehicle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
