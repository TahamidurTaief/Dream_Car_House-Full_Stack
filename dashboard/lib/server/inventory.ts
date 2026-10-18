import "server-only";
import { cookies } from "next/headers";
import { requestDashboard, type ApiResult } from "./transport";
import { getManagementAccess } from "./api";
import { hasPermission } from "./auth";

import type {
  BrandItem,
  ModelGenerationItem,
  BodyStyleItem,
  InventoryGalleryImage,
  InventoryListItem,
  InventoryDetailItem,
  StockItem,
  PaginatedList,
  BrandCascadeImpact,
} from "../types";

export type {
  BrandItem,
  ModelGenerationItem,
  BodyStyleItem,
  InventoryGalleryImage,
  InventoryListItem,
  InventoryDetailItem,
  StockItem,
  PaginatedList,
  BrandCascadeImpact,
};

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const sessionid = cookieStore.get("sessionid")?.value;
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const cookieHeader = `sessionid=${sessionid}${csrftoken ? `; csrftoken=${csrftoken}` : ""}`;
  const origin = process.env.DASHBOARD_API_ORIGIN || "http://127.0.0.1:8000";
  return { origin, cookieHeader, csrftoken };
}

// ----------------- Brand -----------------
export async function getBrands(searchParams?: {
  q?: string;
  status?: string;
  segment?: string;
  page?: string | number;
  page_size?: string | number;
}): Promise<ApiResult<PaginatedList<BrandItem>>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_brand")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_brand permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  const params = new URLSearchParams();
  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.status) params.set("status", searchParams.status);
  if (searchParams?.segment) params.set("segment", searchParams.segment);
  if (searchParams?.page) params.set("page", String(searchParams.page));
  if (searchParams?.page_size) params.set("page_size", String(searchParams.page_size));

  const path = `brands/${params.toString() ? `?${params.toString()}` : ""}`;
  return requestDashboard<PaginatedList<BrandItem>>({
    origin,
    path,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as PaginatedList<BrandItem>,
  });
}

export async function getBrand(id: number): Promise<ApiResult<BrandItem>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_brand")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_brand permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  return requestDashboard<BrandItem>({
    origin,
    path: `brands/${id}/`,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BrandItem,
  });
}

export async function getBrandImpact(id: number): Promise<ApiResult<{
  brand_id: number;
  brand_name: string;
  inventory_count: number;
  model_generation_count: number;
  has_cascades: boolean;
}>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  return requestDashboard<BrandCascadeImpact>({
    origin,
    path: `brands/${id}/impact/`,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BrandCascadeImpact,
  });
}

// ----------------- Model Generations -----------------
export async function getModelGenerations(searchParams?: {
  brand?: string | number;
  q?: string;
  status?: string;
  page?: string | number;
  page_size?: string | number;
}): Promise<ApiResult<PaginatedList<ModelGenerationItem>>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_modelgeneration")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_modelgeneration permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  const params = new URLSearchParams();
  if (searchParams?.brand) params.set("brand", String(searchParams.brand));
  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.status) params.set("status", searchParams.status);
  if (searchParams?.page) params.set("page", String(searchParams.page));
  if (searchParams?.page_size) params.set("page_size", String(searchParams.page_size));

  const path = `model-generations/${params.toString() ? `?${params.toString()}` : ""}`;
  return requestDashboard<PaginatedList<ModelGenerationItem>>({
    origin,
    path,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as PaginatedList<ModelGenerationItem>,
  });
}

// ----------------- Body Styles -----------------
export async function getBodyStyles(searchParams?: {
  q?: string;
  status?: string;
  page?: string | number;
  page_size?: string | number;
}): Promise<ApiResult<PaginatedList<BodyStyleItem>>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_bodystyle")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_bodystyle permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  const params = new URLSearchParams();
  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.status) params.set("status", searchParams.status);
  if (searchParams?.page) params.set("page", String(searchParams.page));
  if (searchParams?.page_size) params.set("page_size", String(searchParams.page_size));

  const path = `body-styles/${params.toString() ? `?${params.toString()}` : ""}`;
  return requestDashboard<PaginatedList<BodyStyleItem>>({
    origin,
    path,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as PaginatedList<BodyStyleItem>,
  });
}

// ----------------- Inventory -----------------
export async function getInventoryList(searchParams?: {
  q?: string;
  status?: string;
  registered?: string;
  brand?: string | number;
  car_type?: string;
  is_featured?: string;
  ordering?: string;
  page?: string | number;
  page_size?: string | number;
}): Promise<ApiResult<PaginatedList<InventoryListItem>>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_inventory")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_inventory permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  const params = new URLSearchParams();
  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.status) params.set("status", searchParams.status);
  if (searchParams?.registered) params.set("registered", searchParams.registered);
  if (searchParams?.brand) params.set("brand", String(searchParams.brand));
  if (searchParams?.car_type) params.set("car_type", searchParams.car_type);
  if (searchParams?.is_featured) params.set("is_featured", searchParams.is_featured);
  if (searchParams?.ordering) params.set("ordering", searchParams.ordering);
  if (searchParams?.page) params.set("page", String(searchParams.page));
  if (searchParams?.page_size) params.set("page_size", String(searchParams.page_size));

  const path = `inventory/${params.toString() ? `?${params.toString()}` : ""}`;
  return requestDashboard<PaginatedList<InventoryListItem>>({
    origin,
    path,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as PaginatedList<InventoryListItem>,
  });
}

export async function getInventoryDetail(id: number): Promise<ApiResult<InventoryDetailItem>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_inventory")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_inventory permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  return requestDashboard<InventoryDetailItem>({
    origin,
    path: `inventory/${id}/`,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as InventoryDetailItem,
  });
}

// ----------------- Stock -----------------
export async function getStockList(searchParams?: {
  q?: string;
  status?: string;
  page?: string | number;
  page_size?: string | number;
}): Promise<ApiResult<PaginatedList<StockItem>>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_stock")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_stock permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  const params = new URLSearchParams();
  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.status) params.set("status", searchParams.status);
  if (searchParams?.page) params.set("page", String(searchParams.page));
  if (searchParams?.page_size) params.set("page_size", String(searchParams.page_size));

  const path = `stocks/${params.toString() ? `?${params.toString()}` : ""}`;
  return requestDashboard<PaginatedList<StockItem>>({
    origin,
    path,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as PaginatedList<StockItem>,
  });
}

export const getStocks = getStockList;

export async function getStockDetail(id: number): Promise<ApiResult<StockItem>> {
  const access = await getManagementAccess();
  if (!access.ok) return access;
  if (!hasPermission(access.data.user, "inventory.view_stock")) {
    return { ok: false, error: { code: "FORBIDDEN", message: "Missing view_stock permission." } };
  }

  const { origin, cookieHeader, csrftoken } = await getAuthHeaders();
  return requestDashboard<StockItem>({
    origin,
    path: `stocks/${id}/`,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as StockItem,
  });
}

export const getStock = getStockDetail;
