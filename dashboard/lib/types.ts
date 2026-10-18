export type DashboardUser = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  permissions: string[];
};

export type DashboardAccess =
  | { allowed: true; user: DashboardUser; csrfToken?: string }
  | { allowed: false; reason: "UNAUTHENTICATED" | "FORBIDDEN" | "AUTH_UNAVAILABLE" };

export type BrandItem = {
  id: number;
  name: string;
  segment: string;
  image: string;
  listing_footer_text: string;
  status: string;
  target_keyword: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string;
  schema_json: Record<string, unknown> | null;
  h1_title: string | null;
  short_description: string | null;
  long_description: string | null;
  feature_image: string | null;
  feature_image_alt: string | null;
  seo_updated_at: string;
};

export type BrandCascadeImpact = {
  brand_id: number;
  brand_name: string;
  inventory_count: number;
  model_generation_count: number;
  has_cascades: boolean;
};

export type ModelGenerationItem = {
  id: number;
  brand: number;
  brand_name: string;
  model: string;
  status: string;
};

export type BodyStyleItem = {
  id: number;
  body: string;
  status: string;
};

export type InventoryGalleryImage = {
  id: number;
  inventory: number;
  image: string;
  caption: string | null;
  alt_text: string;
  order: number;
};

export type InventoryListItem = {
  id: number;
  name: string;
  car_type: string | null;
  brand: number;
  brand_name: string;
  model: number | null;
  model_generation_name: string;
  model_name: string;
  year: number | null;
  price: string | null;
  fuel_type: string;
  transmission: string;
  registered: string;
  status: string;
  is_featured: boolean;
  feature_image: string | null;
  slug: string;
  indexing: string;
  created_at: string;
  updated_at: string;
};

export type InventoryDetailItem = InventoryListItem & {
  condition: string;
  body_style: number | null;
  body_style_name: string;
  inventory_type: string;
  engine_capacity: string | null;
  drive_type: string | null;
  wheel_base: string | null;
  mileage: string | null;
  color: string | null;
  slightly_negotiable: string;
  youtube: string | null;
  inventory_images: InventoryGalleryImage[];
  description: string | null;
  h1_title: string;
  target_keyword: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  featured_image_alt: string;
  redirect_url: string | null;
  previous_slug: string;
  schema_override: Record<string, unknown> | null;
};

export type StockItem = {
  id: number;
  title: string | null;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type PaginatedList<T> = {
  results: T[];
  total_rows: number;
  total_pages: number;
  current_page: number;
  page_size: number;
};
