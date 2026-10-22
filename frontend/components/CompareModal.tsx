"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useUI } from "@/lib/UIContext";
import { VEHICLE_DATA, Vehicle } from "@/lib/showroomData";

export default function CompareModal() {
  const { isCompareOpen, closeCompareModal, openCarModal } = useUI();
  const [car1Id, setCar1Id] = useState<number>(VEHICLE_DATA[0]?.id || 1);
  const [car2Id, setCar2Id] = useState<number>(VEHICLE_DATA[1]?.id || 2);

  if (!isCompareOpen) return null;

  const car1 = VEHICLE_DATA.find((c) => c.id === car1Id) || VEHICLE_DATA[0];
  const car2 = VEHICLE_DATA.find((c) => c.id === car2Id) || VEHICLE_DATA[1];

  return (
    <div className="car-modal-backdrop active" onClick={closeCompareModal}>
      <div
        className="car-modal-box"
        style={{ maxWidth: "56rem", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-x"
          onClick={closeCompareModal}
          aria-label="Close Vehicle Comparison"
          title="Close (ESC)"
        >
          &times;
        </button>

        <div className="appointment-modal-head">
          <span className="consult-pill-tag">VEHICLE BENCHMARK COMPARISON</span>
          <h3 className="appointment-modal-title">Compare Luxury Specifications</h3>
          <p className="appointment-modal-sub">
            Side-by-side technical evaluation of premium showroom inventory.
          </p>
        </div>

        {/* Selection Pickers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
              Select Vehicle 01
            </label>
            <select
              value={car1Id}
              onChange={(e) => setCar1Id(Number(e.target.value))}
              className="appt-input appt-select"
              style={{ width: "100%" }}
            >
              {VEHICLE_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.name} ({c.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.85rem", color: "#9ca3af", marginBottom: "0.5rem" }}>
              Select Vehicle 02
            </label>
            <select
              value={car2Id}
              onChange={(e) => setCar2Id(Number(e.target.value))}
              className="appt-input appt-select"
              style={{ width: "100%" }}
            >
              {VEHICLE_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.name} ({c.year})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Showcase Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.88rem",
              color: "#e5e7eb",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                <th style={{ padding: "0.75rem 1rem", color: "#9ca3af", width: "30%" }}>Feature</th>
                <th style={{ padding: "0.75rem 1rem", width: "35%" }}>
                  <div style={{ fontWeight: 700, color: "#ffffff" }}>{car1.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{car1.brand}</div>
                </th>
                <th style={{ padding: "0.75rem 1rem", width: "35%" }}>
                  <div style={{ fontWeight: 700, color: "#ffffff" }}>{car2.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{car2.brand}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Image preview row */}
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Preview</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <Image
                    src={car1.image}
                    alt={car1.name}
                    width={220}
                    height={140}
                    style={{ borderRadius: "6px", objectFit: "cover" }}
                  />
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <Image
                    src={car2.image}
                    alt={car2.name}
                    width={220}
                    height={140}
                    style={{ borderRadius: "6px", objectFit: "cover" }}
                  />
                </td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Condition</td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>
                  {car1.car_type === "BRAND_NEW" ? "Brand New (00 km)" : "Certified Pre-Owned"}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>
                  {car2.car_type === "BRAND_NEW" ? "Brand New (00 km)" : "Certified Pre-Owned"}
                </td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Model Year</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car1.year}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car2.year}</td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Engine / Technology</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car1.engine_capacity}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car2.engine_capacity}</td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Mileage</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car1.mileage}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car2.mileage}</td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Fuel Architecture</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car1.fuel_type}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car2.fuel_type}</td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Showroom Allocation</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car1.branch_name}</td>
                <td style={{ padding: "0.75rem 1rem" }}>{car2.branch_name}</td>
              </tr>

              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Valuation</td>
                <td style={{ padding: "0.75rem 1rem", color: "#d97706", fontWeight: 700 }}>
                  {car1.price === "Call for Price" ? "Price Upon Request" : car1.price}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "#d97706", fontWeight: 700 }}>
                  {car2.price === "Call for Price" ? "Price Upon Request" : car2.price}
                </td>
              </tr>

              <tr>
                <td style={{ padding: "0.75rem 1rem", color: "#9ca3af" }}>Inspection</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <button
                    type="button"
                    className="pref-inspect-btn"
                    onClick={() => {
                      closeCompareModal();
                      openCarModal(car1);
                    }}
                  >
                    Inspect {car1.name}
                  </button>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <button
                    type="button"
                    className="pref-inspect-btn"
                    onClick={() => {
                      closeCompareModal();
                      openCarModal(car2);
                    }}
                  >
                    Inspect {car2.name}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
