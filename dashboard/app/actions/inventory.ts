"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { requestDashboard, type ApiResult } from "@/lib/server/transport";
import type {
  BrandItem,
  BrandCascadeImpact,
  ModelGenerationItem,
  BodyStyleItem,
  InventoryDetailItem,
  InventoryGalleryImage,
  StockItem,
} from "@/lib/types";

async function getAuthContext() {
  const cookieStore = await cookies();
  const sessionid = cookieStore.get("sessionid")?.value;
  const csrftoken = cookieStore.get("csrftoken")?.value;
  const cookieHeader = `sessionid=${sessionid}${csrftoken ? `; csrftoken=${csrftoken}` : ""}`;
  const origin = process.env.DASHBOARD_API_ORIGIN || "http://127.0.0.1:8000";
  return { origin, cookieHeader, csrftoken };
}

// ----------------- Brand Actions -----------------
export async function createBrandAction(formData: FormData): Promise<ApiResult<BrandItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<BrandItem>({
    origin,
    path: "brands/",
    method: "POST",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BrandItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/brands");
  }
  return res;
}

export async function updateBrandAction(id: number, formData: FormData): Promise<ApiResult<BrandItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<BrandItem>({
    origin,
    path: `brands/${id}/`,
    method: "PATCH",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BrandItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/brands");
    revalidatePath(`/workspace/brands/${id}`);
  }
  return res;
}

export async function getBrandCascadeImpactAction(id: number): Promise<ApiResult<BrandCascadeImpact>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  return requestDashboard<BrandCascadeImpact>({
    origin,
    path: `brands/${id}/impact/`,
    method: "GET",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BrandCascadeImpact,
  });
}

export async function deleteBrandAction(id: number, confirm = false): Promise<ApiResult<{ message: string; deleted_id: number }>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<{ message: string; deleted_id: number }>({
    origin,
    path: `brands/${id}/${confirm ? "?confirm=true" : ""}`,
    method: "DELETE",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as { message: string; deleted_id: number },
  });
  if (res.ok) {
    revalidatePath("/workspace/brands");
  }
  return res;
}

// ----------------- Model Generation Actions -----------------
export async function createModelGenerationAction(data: {
  brand: number;
  model: string;
  status?: string;
}): Promise<ApiResult<ModelGenerationItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<ModelGenerationItem>({
    origin,
    path: "model-generations/",
    method: "POST",
    body: data,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as ModelGenerationItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/model-generations");
  }
  return res;
}

export async function updateModelGenerationAction(id: number, data: {
  brand?: number;
  model?: string;
  status?: string;
}): Promise<ApiResult<ModelGenerationItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<ModelGenerationItem>({
    origin,
    path: `model-generations/${id}/`,
    method: "PATCH",
    body: data,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as ModelGenerationItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/model-generations");
  }
  return res;
}

export async function deleteModelGenerationAction(id: number): Promise<ApiResult<{ message: string; deleted_id: number }>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<{ message: string; deleted_id: number }>({
    origin,
    path: `model-generations/${id}/`,
    method: "DELETE",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as { message: string; deleted_id: number },
  });
  if (res.ok) {
    revalidatePath("/workspace/model-generations");
  }
  return res;
}

// ----------------- Body Style Actions -----------------
export async function createBodyStyleAction(data: { body: string; status?: string }): Promise<ApiResult<BodyStyleItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<BodyStyleItem>({
    origin,
    path: "body-styles/",
    method: "POST",
    body: data,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BodyStyleItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/body-styles");
  }
  return res;
}

export async function updateBodyStyleAction(id: number, data: { body?: string; status?: string }): Promise<ApiResult<BodyStyleItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<BodyStyleItem>({
    origin,
    path: `body-styles/${id}/`,
    method: "PATCH",
    body: data,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as BodyStyleItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/body-styles");
  }
  return res;
}

export async function deleteBodyStyleAction(id: number): Promise<ApiResult<{ message: string; deleted_id: number }>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<{ message: string; deleted_id: number }>({
    origin,
    path: `body-styles/${id}/`,
    method: "DELETE",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as { message: string; deleted_id: number },
  });
  if (res.ok) {
    revalidatePath("/workspace/body-styles");
  }
  return res;
}

// ----------------- Inventory Actions -----------------
export async function createInventoryAction(formData: FormData): Promise<ApiResult<InventoryDetailItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<InventoryDetailItem>({
    origin,
    path: "inventory/",
    method: "POST",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as InventoryDetailItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/inventory");
  }
  return res;
}

export async function updateInventoryAction(id: number, formData: FormData): Promise<ApiResult<InventoryDetailItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<InventoryDetailItem>({
    origin,
    path: `inventory/${id}/`,
    method: "PATCH",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as InventoryDetailItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/inventory");
    revalidatePath(`/workspace/inventory/${id}`);
  }
  return res;
}

export async function deleteInventoryAction(id: number): Promise<ApiResult<{ message: string; deleted_id: number }>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<{ message: string; deleted_id: number }>({
    origin,
    path: `inventory/${id}/`,
    method: "DELETE",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as { message: string; deleted_id: number },
  });
  if (res.ok) {
    revalidatePath("/workspace/inventory");
  }
  return res;
}

export async function uploadInventoryGalleryImageAction(inventoryId: number, formData: FormData): Promise<ApiResult<InventoryGalleryImage>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<InventoryGalleryImage>({
    origin,
    path: `inventory/${inventoryId}/images/`,
    method: "POST",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as InventoryGalleryImage,
  });
  if (res.ok) {
    revalidatePath(`/workspace/inventory/${inventoryId}`);
  }
  return res;
}

export async function deleteInventoryGalleryImageAction(imageId: number, inventoryId: number): Promise<ApiResult<{ message: string; deleted_id: number }>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<{ message: string; deleted_id: number }>({
    origin,
    path: `inventory/images/${imageId}/`,
    method: "DELETE",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as { message: string; deleted_id: number },
  });
  if (res.ok) {
    revalidatePath(`/workspace/inventory/${inventoryId}`);
  }
  return res;
}

// ----------------- Stock Actions -----------------
export async function createStockAction(formData: FormData): Promise<ApiResult<StockItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<StockItem>({
    origin,
    path: "stocks/",
    method: "POST",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as StockItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/stocks");
  }
  return res;
}

export async function updateStockAction(id: number, formData: FormData): Promise<ApiResult<StockItem>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<StockItem>({
    origin,
    path: `stocks/${id}/`,
    method: "PATCH",
    body: formData,
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as StockItem,
  });
  if (res.ok) {
    revalidatePath("/workspace/stocks");
  }
  return res;
}

export async function deleteStockAction(id: number): Promise<ApiResult<{ message: string; deleted_id: number }>> {
  const { origin, cookieHeader, csrftoken } = await getAuthContext();
  const res = await requestDashboard<{ message: string; deleted_id: number }>({
    origin,
    path: `stocks/${id}/`,
    method: "DELETE",
    cookie: cookieHeader,
    csrfToken: csrftoken,
    decode: (val) => val as { message: string; deleted_id: number },
  });
  if (res.ok) {
    revalidatePath("/workspace/stocks");
  }
  return res;
}
