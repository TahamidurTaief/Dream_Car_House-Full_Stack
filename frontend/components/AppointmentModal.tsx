"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useUI } from "@/lib/UIContext";
import { submitAppointmentEnquiryAction, AppointmentSubmissionResult } from "@/app/actions/appointment";
import type { PublicSiteSettings, PublicShowroomBranch } from "@/lib/types";

interface AppointmentModalProps {
  settings?: PublicSiteSettings;
  branches?: PublicShowroomBranch[];
}

export default function AppointmentModal({ settings, branches = [] }: AppointmentModalProps) {
  const { isAppointmentOpen, closeAppointmentModal, appointmentPrefill } = useUI();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("Brand New & Reconditioned Import");
  const [branch, setBranch] = useState(branches[0]?.branch_id || (branches[0]?.id ? String(branches[0].id) : ""));
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submissionResult, setSubmissionResult] = useState<AppointmentSubmissionResult["data"] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (appointmentPrefill.carName) {
      setNotes(`Interested in ${appointmentPrefill.carName} (${appointmentPrefill.carYear || 2024})`);
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
    : branch || "DREAM CAR HOUSE Showroom";

  return (
    <div className="car-modal-backdrop active" onClick={closeAppointmentModal}>
      <div className="car-modal-box appointment-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-x"
          onClick={closeAppointmentModal}
          aria-label="Close Consultation Modal"
          title="Close (ESC)"
        >
          &times;
        </button>

        <div className="appointment-modal-head">
          <span className="consult-pill-tag">VIP SHOWROOM RESERVATION</span>
          <h3 className="appointment-modal-title">Book A Private Consultation</h3>
          <p className="appointment-modal-sub">
            Experience dedicated automotive advisory across our Kakrail and Gulshan showrooms.
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
              color: "#fca5a5",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
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
          <form id="appointment-form" onSubmit={handleSubmit} className="appointment-form-grid">
            <div className="form-group">
              <label htmlFor="appt-name">Full Name *</label>
              <input
                type="text"
                id="appt-name"
                required
                disabled={isPending}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Asif Mahmud"
                className="appt-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="appt-phone">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                id="appt-phone"
                required
                disabled={isPending}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="appt-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="appt-interest">Consultation Interest</label>
              <select
                id="appt-interest"
                disabled={isPending}
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="appt-input appt-select"
              >
                <option value="Brand New & Reconditioned Import">Brand New & Reconditioned Import</option>
                <option value="Certified Pre-Owned Selection">Certified Pre-Owned Selection</option>
                <option value="Sell / Trade-In Valuation">Sell / Trade-In Valuation</option>
                <option value="General Showroom VIP Tour">General Showroom VIP Tour</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appt-branch">Showroom Branch</label>
              <select
                id="appt-branch"
                disabled={isPending}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="appt-input appt-select"
              >
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <option key={b.id} value={b.branch_id || String(b.id)}>
                      {b.name}{b.address ? ` (${b.address})` : ""}
                    </option>
                  ))
                ) : (
                  <option value="">Showroom Headquarters</option>
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
              <label htmlFor="appt-notes">Specific Vehicle or Query (Optional)</label>
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
          <div className="suite-success-message" style={{ display: "block", marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                Reservation Confirmed & Saved!
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
              href={submissionResult.waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="consult-whatsapp-btn"
              style={{ width: "100%", justifyContent: "center", padding: "0.85rem 1.5rem" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Transmit Reservation via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={closeAppointmentModal}
              style={{
                marginTop: "1rem",
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
