import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Showroom Media Gallery & Atelier Chronicles | DREAM CAR HOUSE",
  description:
    "Explore high-definition photography and cinema spotlights of exotic, flagship, and rare luxury vehicles at DREAM CAR HOUSE Kakrail and Gulshan showrooms.",
  alternates: {
    canonical: "https://dreamcarhouse.com/gallery/",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
