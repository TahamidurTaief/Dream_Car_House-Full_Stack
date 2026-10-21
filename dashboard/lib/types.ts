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
  blocked?: boolean;
  block_reason?: string | null;
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

export type InventoryQuoteItem = {
  id: number;
  car: number | null;
  car_name: string | null;
  car_slug: string | null;
  car_price: string | null;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type SellYourCarImageItem = {
  id: number;
  sellcar: number;
  image: string;
};

export type SellCarItem = {
  id: number;
  name: string;
  phone: string;
  car_name: string;
  car_model: string;
  car_year: string;
  mileage: number;
  offered_price: number | null;
  inventory_images: SellYourCarImageItem[];
};

export type ContactMessageItem = {
  id: number;
  topic: string;
  topic_display: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  message: string;
  preferred_contact: string;
  preferred_contact_display: string;
  created_at: string;
  updated_at: string;
};

export type SubscriberItem = {
  id: number;
  email: string;
};

export type SliderItem = {
  id: number;
  heading: string;
  image: string;
  is_public_active: boolean;
};

export type SocialMediaItem = {
  id: number;
  facebook: string;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  is_public_active: boolean;
};

export type PeopleTalkItem = {
  id: number;
  title: string;
  image: string;
  url: string | null;
  is_featured: boolean;
  status: "PUBLISHED" | "DRAFT";
  created_at: string;
  updated_at: string;
};

export type SalesRepresentativeItem = {
  id: number;
  name: string;
  phone_number: string;
  status: "PUBLISHED" | "DRAFT";
  created_at: string;
  updated_at: string;
};

export type SEOConfigItem = {
  id: number;
  page: string;
  page_display: string;
  visibility: "PUBLISHED" | "HIDDEN";
  target_keyword: string | null;
  feature_image: string | null;
  feature_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  robots: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_type: string | null;
  og_site_name: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  schema_json: Record<string, unknown> | null;
  updated_at: string;
};

export type CategoryPageSEOItem = {
  id: number;
  page: string;
  page_display: string;
  category_name: string | null;
  visibility: "PUBLISHED" | "HIDDEN";
  target_keyword: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  schema_json: Record<string, unknown> | null;
  h1_title: string | null;
  short_description: string | null;
  long_description: string | null;
  updated_at: string;
};

export type PermissionItem = {
  id: number;
  name: string;
  codename: string;
  app_label: string;
};

export type GroupItem = {
  id: number;
  name: string;
  user_count: number;
  permission_ids: number[];
  permissions_details: PermissionItem[];
};

export type UserListItem = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  groups: string[];
  last_login: string | null;
  date_joined: string;
};

export type UserDetailItem = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  group_ids: number[];
  groups_details: { id: number; name: string }[];
  permission_ids: number[];
  user_permissions_details: PermissionItem[];
  last_login: string | null;
  date_joined: string;
};

export type OverviewMetrics = {
  inventory?: {
    total: number;
    available: number;
    sold: number;
    booked: number;
    pre_order: number;
  };
  stocks?: {
    total: number;
    published: number;
    unpublished: number;
  };
  quotes?: {
    total: number;
  };
  sell_cars?: {
    total: number;
  };
  contact_messages?: {
    total: number;
    buying: number;
    selling: number;
    after_sales: number;
    other: number;
  };
  subscribers?: {
    total: number;
  };
  users?: {
    total: number;
    active: number;
    staff: number;
    superuser: number;
  };
  groups?: {
    total: number;
  };
};

export type OverviewRecentSubmissions = {
  quotes?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    car_name: string | null;
    created_at: string | null;
  }[];
  sell_cars?: {
    id: number;
    name: string;
    phone: string;
    car_name: string;
    car_model: string;
    car_year: string;
    offered_price: number | null;
    mileage: number;
  }[];
  contact_messages?: {
    id: number;
    name: string;
    topic: string;
    topic_display: string;
    phone: string;
    email: string;
    vehicle: string;
    created_at: string | null;
  }[];
};

export type OverviewData = {
  metrics: OverviewMetrics;
  recent_submissions: OverviewRecentSubmissions;
};

export type PaginatedList<T> = {
  results: T[];
  total_rows: number;
  total_pages: number;
  current_page: number;
  page_size: number;
};
