import type { Metadata } from "next";
import Hero from "@/components/Hero";
import InventoryCarousel from "@/components/InventoryCarousel";
import PreferenceSection from "@/components/PreferenceSection";
import BrandRunway from "@/components/BrandRunway";
import ConnectConsult from "@/components/ConnectConsult";
import ExperiencePillars from "@/components/ExperiencePillars";
import VisualChronicles from "@/components/VisualChronicles";
import VipSanctuary from "@/components/VipSanctuary";

export const metadata: Metadata = {
  title: "The Pinnacle of Luxury Automobiles | DREAM CAR HOUSE",
  description:
    "Explore luxury cars in Bangladesh with DREAM CAR HOUSE. Browse our exclusive range of brand new, reconditioned, and pre-owned premium vehicles in Kakrail and Gulshan, Dhaka.",
  alternates: {
    canonical: "https://dreamcarhouse.com",
  },
};

export default function HomePage() {
  return (
    <div id="view-home">
      {/* 1. Hero Flagship Cinema */}
      <Hero />

      {/* 2. Current Inventory Carousel */}
      <InventoryCarousel />

      {/* 3. Studio Preference Switcher (Brand New vs Certified Pre-Owned) */}
      <PreferenceSection />

      {/* 4. Prestigious Automotive Marques Runway */}
      <BrandRunway />

      {/* 5. Private Automotive Concierge: Connect to Consult */}
      <ConnectConsult />

      {/* 6. Experience Beyond Ordinary: 3 Atelier Pillars */}
      <ExperiencePillars />

      {/* 7. Showroom Atelier Visual Chronicles (Interactive 3D Flip Cards) */}
      <VisualChronicles />

      {/* 8. VIP Showroom Invitation & Private Sanctuary Suite */}
      <VipSanctuary />
    </div>
  );
}
