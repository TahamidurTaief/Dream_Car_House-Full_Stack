"use client";

import React from "react";
import { Vehicle } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

interface VehicleCardProps {
  car: Vehicle;
  layout?: "grid" | "featured";
}

export default function VehicleCard({ car }: VehicleCardProps) {
  const { openCarModal } = useUI();
  const isBrandNew = car.car_type === "BRAND_NEW";

  const waMessage = encodeURIComponent(
    `Hello DREAM CAR HOUSE, I am inquiring about the ${car.name} (${car.year}).`
  );
  const targetPhone = car.branch?.hotline || car.branch?.phone || "";
  let waPhone = targetPhone.replace(/[^0-9]/g, "");
  if (waPhone.startsWith("0")) {
    waPhone = "88" + waPhone;
  } else if (waPhone && !waPhone.startsWith("880") && waPhone.length === 10) {
    waPhone = "880" + waPhone;
  }
  if (!waPhone) waPhone = "8801615121312";
  const waUrl = `https://wa.me/${waPhone}?text=${waMessage}`;

  return (
    <div
      className="preference-car-card group"
      onClick={() => openCarModal(car)}
      style={{ cursor: "pointer" }}
    >
      <div className="pref-car-img-wrap" style={{ position: "relative" }}>
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="pref-car-img"
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 60%, rgba(16, 16, 18, 0.75) 100%)",
            pointerEvents: "none",
          }}
        />
        <span
          className={`pref-car-badge ${
            isBrandNew ? "pref-badge-brandnew" : "pref-badge-preowned"
          }`}
        >
          {isBrandNew ? "Brand New" : "Certified Pre-Owned"}
        </span>
      </div>

      <div className="pref-car-body">
        <div className="pref-car-top">
          <span className="pref-car-brand">{car.brand}</span>
          <span className="pref-car-year">{car.year}</span>
        </div>

        <h3 className="pref-car-title">{car.name}</h3>

        <div className="pref-car-specs">
          <span>{car.engine_capacity}</span>
          <span className="spec-dot">•</span>
          <span>{car.mileage}</span>
          <span className="spec-dot">•</span>
          <span>{car.fuel_type}</span>
        </div>

        <div className="pref-car-footer">
          <button
            type="button"
            className="pref-cta-btn"
            onClick={(e) => {
              e.stopPropagation();
              openCarModal(car);
            }}
          >
            Inspect Details
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pref-wa-icon"
            onClick={(e) => e.stopPropagation()}
            title="Inquire on WhatsApp"
            aria-label={`Inquire about ${car.name} on WhatsApp`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1 .587 1.78.893 2.806.893 3.182 0 5.768-2.586 5.768-5.766.001-3.181-2.585-5.776-5.768-5.776zm3.435 8.163c-.144.404-.836.774-1.17.822-.311.045-.71.07-2.13-.518-1.815-.751-2.986-2.59-3.077-2.711-.091-.121-.739-.984-.739-1.877 0-.893.469-1.332.636-1.514.167-.182.365-.228.487-.228.122 0 .243.002.35.007.112.005.263-.042.412.315.152.365.518 1.265.564 1.356.045.091.076.197.015.318-.061.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.011 1.258.697.621 1.284.814 1.466.905.182.091.289.076.395-.045.106-.121.456-.531.577-.713.121-.182.243-.152.41-.091.167.061 1.062.5 1.244.591.182.091.304.136.35.212.045.076.045.44-.099.844zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.957-1.399C8.414 21.499 10.151 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
