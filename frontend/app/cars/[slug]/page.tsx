import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VEHICLE_DATA, getVehicleBySlug, getRelatedVehicles } from "@/lib/showroomData";
import VehicleDetailClient from "./VehicleDetailClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all 12 luxury vehicles at build time
export async function generateStaticParams() {
  return VEHICLE_DATA.map((car) => ({
    slug: car.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getVehicleBySlug(slug);

  if (!car) {
    return {
      title: "Vehicle Not Found | DREAM CAR HOUSE",
    };
  }

  const title = `${car.name} (${car.year}) | DREAM CAR HOUSE`;
  const description = `${car.name} ${car.year} in Bangladesh. ${car.engine_capacity}, ${car.mileage}, ${car.fuel_type}. Available at ${car.branch_name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://dreamcarhouse.com/cars/${car.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://dreamcarhouse.com/cars/${car.slug}/`,
      type: "article",
      images: [
        {
          url: car.image,
          width: 1200,
          height: 630,
          alt: `${car.name} (${car.year}) Stance`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [car.image],
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = getVehicleBySlug(slug);

  if (!car) {
    notFound();
  }

  const relatedCars = getRelatedVehicles(car.id, car.brand, 3);

  // Structured Data Schema for Car
  const carSchema = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    model: car.model,
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
    vehicleModelDate: car.year.toString(),
    fuelType: car.fuel_type,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
    },
    image: car.image,
    description: car.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: car.price === "Call for Price" ? "Contact for Price" : car.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: "DREAM CAR HOUSE",
        address: car.branch_address,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dreamcarhouse.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Inventory",
        item: "https://dreamcarhouse.com/inventory/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: car.name,
        item: `https://dreamcarhouse.com/cars/${car.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <VehicleDetailClient car={car} relatedCars={relatedCars} />
    </>
  );
}
