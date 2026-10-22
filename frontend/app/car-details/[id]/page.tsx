import { notFound } from "next/navigation";
import { VEHICLE_DATA, getVehicleById, getRelatedVehicles } from "@/lib/showroomData";
import VehicleDetailClient from "../../cars/[slug]/VehicleDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return VEHICLE_DATA.map((car) => ({
    id: car.id.toString(),
  }));
}

export default async function CarDetailByIdPage({ params }: PageProps) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  const car = getVehicleById(numId);

  if (!car) {
    notFound();
  }

  const relatedCars = getRelatedVehicles(car.id, car.brand, 3);

  return <VehicleDetailClient car={car} relatedCars={relatedCars} />;
}
