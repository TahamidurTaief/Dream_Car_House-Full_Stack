// app/car-details/[id]/page.tsx
// Legacy route — redirects to slug-based URL via 301 Moved Permanently
import { notFound, permanentRedirect } from "next/navigation";

export default async function CarDetailLegacy({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  const backendUrl =
    process.env.NEXT_INTERNAL_API_ORIGIN ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://127.0.0.1:8000";

  try {
    const response = await fetch(`${backendUrl}/api/v1/inventory/detail/${id}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      notFound();
    }

    const data = await response.json();
    
    if (data?.success && data?.data?.slug) {
      permanentRedirect(`/cars/${data.data.slug}`);
    } else {
      notFound();
    }
  } catch (error) {
    notFound();
  }
}
