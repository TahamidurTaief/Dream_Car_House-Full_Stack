import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Beg Autos - Our Car Collection in Pictures",
  description:
    "Browse the Beg Autos gallery showcasing our stunning collection of luxury, reconditioned, and pre-owned vehicles in Bangladesh.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.begautos.com/gallery/",
  },
  openGraph: {
    title: "Gallery | Beg Autos",
    description:
      "Browse the Beg Autos gallery showcasing our stunning vehicle collection.",
    url: "https://www.begautos.com/gallery/",
    type: "website",
    siteName: "Beg Autos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Beg Autos",
    description:
      "Browse the Beg Autos gallery showcasing our stunning vehicle collection.",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
