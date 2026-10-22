import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us • The Atelier & Provenance | DREAM CAR HOUSE",
  description:
    "Learn about DREAM CAR HOUSE, Bangladesh's premier luxury automotive showroom with flagship locations in Kakrail and Gulshan, Dhaka.",
  alternates: {
    canonical: "https://dreamcarhouse.com/about/",
  },
};

export default function AboutPage() {
  return (
    <div className="inventory-page-wrap max-w-7xl">
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="preference-badge" style={{ marginBottom: "0.35rem", display: "inline-block" }}>
            ATELIER HERITAGE & PROVENANCE
          </span>
          <h1 className="section-h2" style={{ marginBottom: "0.85rem" }}>
            The Story of DREAM CAR HOUSE
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1.05rem", lineHeight: "1.7", maxWidth: "680px", margin: "0 auto" }}>
            Where extraordinary automotive aspirations converge with unparalleled engineering, bespoke procurement, and white-glove advisory across Dhaka.
          </p>
        </div>

        {/* Hero Image Frame */}
        <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "3rem", border: "1px solid #1f2937" }}>
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
            alt="DREAM CAR HOUSE Showroom Ambiance"
            width={1200}
            height={600}
            style={{ width: "100%", height: "auto", display: "block" }}
            priority
          />
        </div>

        {/* Editorial Narrative */}
        <div style={{ color: "#d1d5db", fontSize: "1.02rem", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p>
            DREAM CAR HOUSE was founded with a singular, uncompromising vision: to establish Dhaka’s foremost luxury automotive destination where discerning connoisseurs can explore, acquire, and trade the world&apos;s most coveted motorcars with absolute peace of mind.
          </p>
          <p>
            Operating across two flagship showrooms in <strong>Kakrail (Shaheed Captain Monsur Ali Soroni)</strong> and <strong>Gulshan Avenue (Road #127)</strong>, our curated portfolio encompasses zero-meter factory imports, bespoke executive saloons, track-bred supercars, and certified pre-owned collectors&apos; editions from Mercedes-Benz, Maybach, Rolls-Royce, Porsche, Lexus, BMW, and Toyota.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", margin: "3.5rem 0" }}>
          <div style={{ background: "#0d0f12", border: "1px solid #1f2937", padding: "1.75rem", borderRadius: "8px" }}>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              150+ Point Audit
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
              Certified Provenance
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Every vehicle undergoes rigorous computerized diagnostic evaluations, chassis measurements, battery health checks, and genuine paper audits.
            </p>
          </div>

          <div style={{ background: "#0d0f12", border: "1px solid #1f2937", padding: "1.75rem", borderRadius: "8px" }}>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              Direct Global
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
              Bespoke Procurement
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Exclusive relationships with authorized dealerships in London, Stuttgart, and Tokyo facilitate direct, turnkey container importation with verified manifests.
            </p>
          </div>

          <div style={{ background: "#0d0f12", border: "1px solid #1f2937", padding: "1.75rem", borderRadius: "8px" }}>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              VIP Sanctuary
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#ffffff", marginBottom: "0.5rem" }}>
              Private Lounge
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.88rem", lineHeight: "1.6" }}>
              Discreet private handover suites, ceremonial car unveilings, champagne reception, and confidential documentation management.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/inventory" className="consult-primary-btn" style={{ padding: "0.85rem 1.75rem" }}>
            <span>Explore Current Inventory</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <Link href="/contact" className="gallery-btn-secondary" style={{ padding: "0.85rem 1.75rem" }}>
            <span>Visit Showrooms →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
