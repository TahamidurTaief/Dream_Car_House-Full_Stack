export async function fetchInitialCars(
  baseApiParams: Record<string, string> = {},
  availability: string = ""
) {
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
    const params = new URLSearchParams();
    params.append("limit", "12");
    params.append("offset", "0");
    Object.entries(baseApiParams).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    if (availability) params.append("registered", availability);
    const res = await fetch(
      `${base}/api/v1/inventory/?${params.toString()}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return { cars: [], totalPages: 1 };
    const json = await res.json();
    if (json?.success && json.data) {
      return {
        cars: json.data.results || [],
        totalPages: Math.max(1, json.data.total_page || 1),
      };
    }
    return { cars: [], totalPages: 1 };
  } catch {
    return { cars: [], totalPages: 1 };
  }
}
