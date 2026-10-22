"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "@/lib/showroomData";
import { useUI } from "@/lib/UIContext";

interface VehicleCardProps {
  car: Vehicle;
  layout?: "grid" | "carousel";
}

export default function VehicleCard({ car, layout = "grid" }: VehicleCardProps) {
  const { openCarModal } = useUI();
  const isBrandNew = car.car_type === "BRAND_NEW";

  const waMessage = encodeURIComponent(
    `Hello DREAM CAR HOUSE, I am inquiring about the ${car.name} (${car.year}) allocated at your ${car.branch_name}. Please share the official spec sheet, availability, and confidential valuation.`
  );
  const waUrl = `https://wa.me/8801615121312?text=${waMessage}`;

  return (
    <div
      className={`pref-car-card group ${layout === "carousel" ? "carousel-card-item" : ""}`}
      onClick={() => openCarModal(car)}
      style={{ cursor: "pointer" }}
    >
      <div className="pref-car-img-wrap">
        <Image
          src={car.image}
          alt={car.name}
          width={600}
          height={380}
          className="pref-car-img"
          loading="lazy"
        />
        <span className={`pref-car-badge ${isBrandNew ? "pref-badge-brandnew" : "pref-badge-preowned"}`}>
          {isBrandNew ? "Brand New" : "Certified Pre-Owned"}
        </span>
        <span className="pref-branch-tag">
          {car.branch_id === "kakrail" ? "Kakrail Flagship" : "Gulshan Avenue"}
        </span>
      </div>

      <div className="pref-car-body">
        <div className="pref-car-meta">
          <span>{car.brand} • {car.year}</span>
        </div>
        <h3 className="pref-car-title">{car.name}</h3>

        <div className="pref-specs-row">
          <div className="pref-spec-item">
            <span className="pref-spec-label">Engine</span>
            <span className="pref-spec-val">{car.engine_capacity}</span>
          </div>
          <div className="pref-spec-item">
            <span className="pref-spec-label">Mileage</span>
            <span className="pref-spec-val">{car.mileage}</span>
          </div>
          <div className="pref-spec-item">
            <span className="pref-spec-label">Fuel</span>
            <span className="pref-spec-val">{car.fuel_type}</span>
          </div>
        </div>

        <div className="pref-action-row" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="pref-inspect-btn"
            onClick={() => openCarModal(car)}
            aria-label={`Inspect ${car.name}`}
          >
            Inspect Details
          </button>
          <Link
            href={`/cars/${car.slug}`}
            className="pref-page-link"
            title="View Full Page Spec"
            aria-label="View Full Page Spec"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pref-wa-btn"
            title="Chat on WhatsApp"
            aria-label="WhatsApp Concierge"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
