import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getPageSEO, buildMetadataFromSEO } from "@/lib/server/api";

const fallbackMetadata: Metadata = {
  title: "About Us • The Showroom Legacy & Provenance | DREAM CAR HOUSE",
  description:
    "Learn about DREAM CAR HOUSE, Dhaka's premier luxury automotive destination with flagship showrooms in Kakrail and Gulshan, Dhaka.",
  alternates: {
    canonical: "https://dreamcarhouse.com/about/",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("about");
  return buildMetadataFromSEO(seo, fallbackMetadata);
}

export default function AboutPage() {
  return <AboutClient />;
}
