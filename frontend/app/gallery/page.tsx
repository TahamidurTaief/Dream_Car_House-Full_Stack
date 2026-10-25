import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";
import { getPageSEO, buildMetadataFromSEO, getVisualChroniclesSection } from "@/lib/server/api";
import type { GalleryPhoto } from "@/lib/showroomData";

const fallbackMetadata: Metadata = {
  title: "Showroom Media Gallery & Atelier Chronicles | DREAM CAR HOUSE",
  description:
    "Explore high-definition photography and cinema spotlights of exotic, flagship, and rare luxury vehicles at DREAM CAR HOUSE Kakrail and Gulshan showrooms.",
  alternates: {
    canonical: "https://dreamcarhouse.com/gallery/",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO("gallery");
  return buildMetadataFromSEO(seo, fallbackMetadata);
}

export default async function GalleryPage() {
  let initialPhotos: GalleryPhoto[] | undefined = undefined;
  try {
    const chronicles = await getVisualChroniclesSection();
    if (chronicles?.items && chronicles.items.length > 0) {
      initialPhotos = chronicles.items.map((item, idx) => {
        const cat: GalleryPhoto["category"] =
          item.card_type === "portrait"
            ? "sedans"
            : item.card_type === "hero"
            ? "supercars"
            : idx % 2 === 0
            ? "suvs"
            : "cockpit";
        return {
          id: item.id,
          title: item.title,
          category: cat,
          categoryLabel: item.front_badge || "Showroom Spotlight",
          image: item.image || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85",
          desc: item.description,
        };
      });
    }
  } catch {
    initialPhotos = undefined;
  }

  return <GalleryClient initialPhotos={initialPhotos} />;
}
