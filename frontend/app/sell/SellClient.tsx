"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { submitSellCarAction, SellCarSubmissionResult } from "@/app/actions/sell";
import type { PublicSiteSettings } from "@/lib/types";

export default function SellClient({
  settings,
}: {
  settings?: PublicSiteSettings;
} = {}) {
  const [fullName, setFullName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SellCarSubmissionResult["data"] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setErrorMessage(null);

    startTransition(async () => {
      const res = await submitSellCarAction({
        name: fullName,
        phone,
        carName: brand,
        carModel: model,
        carYear: year,
        mileage,
        offeredPrice: expectedPrice,
        notes,
      });

      if (!res.ok) {
        setErrorMessage(res.error || "Failed to submit vehicle valuation. Please verify details.");
      } else if (res.data) {
        setSubmissionResult(res.data);
      }
    });
  };

  return (
    <div className="inventory-page-wrap max-w-7xl">
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          background: "#0d0f12",
          border: "1px solid #1f2937",
          padding: "2.5rem",
          borderRadius: "10px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
            CONFIDENTIAL VALUATION & TRADE-IN
          </span>
          <h1 className="section-h2" style={{ marginBottom: "0.5rem" }}>
            Sell Your Luxury Car
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
            Got a luxury vehicle you would like to sell or trade-in? Provide your vehicle details below and our valuation specialists will connect directly with you.
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "8px",
              padding: "0.85rem 1rem",
              marginBottom: "1.5rem",
              color: "#fca5a5",
              fontSize: "0.9rem",
            }}
          >
            {errorMessage}
          </div>
        )}

        {!submissionResult ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="cars-search-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Chowdhury Rahman"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                  Car Brand / Maker *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="cars-search-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Mercedes-Benz"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                  Model *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="cars-search-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. S-Class / G 63"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                  Year *
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="cars-search-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. 2022"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                  Mileage (km) *
                </label>
                <input
                  type="text"
                  required
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="cars-search-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. 15,000"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                  Expected Price in BDT (Optional)
                </label>
                <input
                  type="text"
                  value={expectedPrice}
                  onChange={(e) => setExpectedPrice(e.target.value)}
                  className="cars-search-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. 35,000,000"
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                Your Phone Number / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="cars-search-input"
                style={{ width: "100%" }}
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#d1d5db" }}>
                Vehicle Condition & Package Details (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="cars-search-input"
                style={{ width: "100%", height: "100px", resize: "vertical" }}
                placeholder="Mention any packages, exterior color, registration year, service history..."
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="consult-primary-btn"
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem 1.5rem", opacity: isPending ? 0.7 : 1 }}
            >
              <span>{isPending ? "Submitting to Valuation Desk..." : "Submit Valuation Request"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        ) : (
          <div className="suite-success-message" style={{ display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Valuation Request Successfully Recorded!
              </h4>
            </div>

            <p style={{ color: "#d1d5db", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
              Thank you, <strong>{fullName}</strong>. Your vehicle evaluation request for the <strong>{brand} {model} ({year})</strong> with{" "}
              <strong>{mileage} km</strong> has been recorded in our valuation database (Reference #{submissionResult.id}). Our senior valuation executive will review and contact you directly.
            </p>

            {submissionResult.waUrl && (
              <a
                href={submissionResult.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="consult-whatsapp-btn"
                style={{ width: "100%", justifyContent: "center", padding: "0.85rem 1.5rem", marginBottom: "1rem" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Instant WhatsApp Connect with Valuation Specialist</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                setSubmissionResult(null);
                setFullName("");
                setBrand("");
                setModel("");
                setYear("");
                setMileage("");
                setExpectedPrice("");
                setPhone("");
                setNotes("");
              }}
              style={{
                marginTop: "1.25rem",
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              ← Submit Another Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
