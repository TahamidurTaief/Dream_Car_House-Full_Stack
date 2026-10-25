import type { Metadata } from "next";
import InventoryClient from "./InventoryClient";
import { getPublicInventory, getInventoryFilters, getShowroomBranches } from "@/lib/server/api";

export const metadata: Metadata = {
  title: "Complete Luxury Vehicle Inventory | DREAM CAR HOUSE",
  description:
    "Explore our complete inventory of brand new and certified pre-owned luxury vehicles in Bangladesh. Mercedes-Benz, BMW, Lexus, Toyota, Land Rover, and Porsche.",
  alternates: {
    canonical: "https://dreamcarhouse.com/inventory/",
  },
};

interface PageProps {
  searchParams: Promise<{
    brand?: string;
    type?: string;
    branch?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function InventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageNum = params.page ? parseInt(params.page, 10) : 1;

  let inventoryData: { items: import("@/lib/types").PublicVehicle[]; totalRows: number; totalPages: number } = {
    items: [],
    totalRows: 0,
    totalPages: 1,
  };
  let filterOptions: import("@/lib/types").PublicInventoryFilterOptions = {
    brands: [],
    models: [],
    bodyStyles: [],
    colors: [],
  };
  let branches: import("@/lib/types").PublicShowroomBranch[] = [];

  try {
    const [inv, filters, branchList] = await Promise.all([
      getPublicInventory({
        brand: params.brand,
        type: params.type,
        branch: params.branch,
        q: params.q,
        page: pageNum,
      }),
      getInventoryFilters().catch(() => ({ brands: [], models: [], bodyStyles: [], colors: [] })),
      getShowroomBranches().catch(() => []),
    ]);
    inventoryData = inv;
    filterOptions = filters;
    branches = branchList;
  } catch (error) {
    console.error("[InventoryPage] Server fetch error:", error);
  }

  return (
    <InventoryClient
      initialVehicles={inventoryData.items}
      totalRows={inventoryData.totalRows}
      filterOptions={filterOptions}
      branches={branches}
      initialParams={{
        brand: params.brand || "all",
        type: params.type || "all",
        branch: params.branch || "all",
        q: params.q || "",
      }}
    />
  );
}
