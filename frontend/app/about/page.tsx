import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us • The Showroom Legacy & Provenance | DREAM CAR HOUSE",
  description:
    "Learn about DREAM CAR HOUSE, Dhaka's premier luxury automotive destination with flagship showrooms in Kakrail and Gulshan, Dhaka.",
  alternates: {
    canonical: "https://dreamcarhouse.com/about/",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
