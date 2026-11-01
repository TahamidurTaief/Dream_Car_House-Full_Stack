"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import { submitAppointmentEnquiryAction, AppointmentSubmissionResult } from "@/app/actions/appointment";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

interface AppointmentModalProps {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
}

export default function AppointmentModal({ settings, branches = [] }: AppointmentModalProps = {}) {
  const { isAppointmentOpen, closeAppointmentModal, appointmentPrefill } = useUI();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Brand New & Reconditioned Import");
  const [branch, setBranch] = useState(
    branches[0]?.branch_id || (branches[0]?.id ? String(branches[0].id) : "kakrail")
  );
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submissionResult, setSubmissionResult] = useState<AppointmentSubmissionResult["data"] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (appointmentPrefill.carName) {
      setInterest(`Inquiry for: ${appointmentPrefill.carName}`);
    }
    if (appointmentPrefill.branchId) {
      setBranch(appointmentPrefill.branchId);
    } else if (branches.length > 0 && !branch) {
      setBranch(branches[0].branch_id || String(branches[0].id));
    }
    setSubmissionResult(null);
    setErrorMessage(null);
  }, [appointmentPrefill, isAppointmentOpen, branches, branch]);

  if (!isAppointmentOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    setErrorMessage(null);
    startTransition(async () => {
      const res = await submitAppointmentEnquiryAction({
        fullName,
        phone,
        interest,
        branch,
        date,
        notes,
      });

      if (!res.ok) {
        setErrorMessage(res.error || "Failed to submit appointment. Please verify details.");
      } else if (res.data) {
        setSubmissionResult(res.data);
      }
    });
  };

  const matchedBranch = branches.find((b) => b.branch_id === branch || String(b.id) === branch);
  const branchLabel = matchedBranch
    ? `${matchedBranch.name}${matchedBranch.address ? ` (${matchedBranch.address})` : ""}`
    : branch === "gulshan"
    ? "Gulshan Branch (House #07, Road #127, Gulshan Avenue)"
    : "Kakrail Branch (18, Shaheed Captain Monsur Ali Soroni)";

  const waAppointmentMsg = encodeURIComponent(
    `Hello DREAM CAR HOUSE Concierge,\n\nI would like to schedule a VIP Private Consultation.\n\n• Name: ${fullName}\n• Phone: ${phone}\n• Interest: ${interest}\n• Showroom Branch: ${branchLabel}\n• Preferred Date: ${date || "Earliest Available"}\n• Notes: ${notes || "General VIP Tour"}`
  );
  const waAppointmentUrl = `https://wa.me/8801615121312?text=${waAppointmentMsg}`;

  return (
    <div className="car-modal-backdrop active" onClick={closeAppointmentModal}>
      <div
        className="car-modal-box appointment-box-modern"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "34rem" }}
      >
        <button
          className="modal-close-x"
          onClick={closeAppointmentModal}
          aria-label="Close Appointment Modal"
        >
          &times;
        </button>

        <div className="appointment-modal-head">
          <div style={{ marginBottom: "0.85rem" }}>
            <Image
              src="/assets/dch-logo.webp"
              alt="DREAM CAR HOUSE"
              width={1020}
              height={350}
              style={{
                height: "44px",
                width: "auto",
                maxWidth: "220px",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.85)) drop-shadow(0 0 10px rgba(255,255,255,0.15))",
              }}
              unoptimized
            />
          </div>
          <span className="consult-pill-tag">VIP SHOWROOM RESERVATION</span>
          <h3 className="appointment-modal-title">Book A Private Consultation</h3>
          <p className="appointment-modal-desc">
            Reserve dedicated 1-on-1 time with our Senior Automotive Specialist in our private Kakrail or Gulshan viewing lounges.
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              fontSize: "0.85rem",
              color: "#fca5a5",
            }}
          >
            {errorMessage}
          </div>
        )}

        {!submissionResult ? (
          <form onSubmit={handleSubmit} className="appointment-form-grid">
            <div className="form-group">
              <label htmlFor="appt-name">Full Name *</label>
              <input
                type="text"
                id="appt-name"
                required
                disabled={isPending}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mr. Tariqul Islam"
                className="appt-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="appt-phone">Contact Phone *</label>
              <input
                type="tel"
                id="appt-phone"
                required
                disabled={isPending}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01700-000000"
                className="appt-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="appt-interest">Vehicle or Service of Interest</label>
              <input
                type="text"
                id="appt-interest"
                disabled={isPending}
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="appt-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="appt-branch">Preferred Showroom Branch</label>
              <select
                id="appt-branch"
                disabled={isPending}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="appt-input appt-select"
              >
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <option key={b.id || b.branch_id} value={b.branch_id || String(b.id)}>
                      {b.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="kakrail">Kakrail Flagship Showroom</option>
                    <option value="gulshan">Gulshan Avenue Showroom</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appt-date">Preferred Date</label>
              <input
                type="date"
                id="appt-date"
                disabled={isPending}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="appt-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="appt-notes">Special Requests / Trade-In Valuation Note</label>
              <input
                type="text"
                id="appt-notes"
                disabled={isPending}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Interested in Mercedes G 580 or Land Cruiser 250"
                className="appt-input"
              />
            </div>

            <div className="form-actions full-width">
              <button
                type="submit"
                disabled={isPending}
                className="consult-primary-btn"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: isPending ? 0.7 : 1,
                  cursor: isPending ? "not-allowed" : "pointer",
                }}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                    </svg>
                    <span>Securing Reservation in Database...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm VIP Appointment</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="appointment-success-box">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Reservation Confirmed & Recorded!
              </h4>
            </div>

            <p style={{ color: "#d1d5db", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
              Thank you, <strong>{submissionResult.fullName}</strong>. Your consultation reservation for{" "}
              <strong>{submissionResult.branchLabel}</strong> has been validated and permanently recorded in our showroom database (Booking Ref #{submissionResult.id}).
            </p>

            <div
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
                borderRadius: "8px",
                padding: "0.85rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.82rem",
                color: "#86efac",
                lineHeight: "1.5",
              }}
            >
              <strong>Concierge Status:</strong> Our VIP Client Director has received your enquiry. You can also transmit the details directly to our active WhatsApp desk below for expedited scheduling:
            </div>

            <a
              href={submissionResult.waUrl || waAppointmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="consult-whatsapp-btn"
              style={{ justifyContent: "center" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <span>Transmit Booking Reference via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
