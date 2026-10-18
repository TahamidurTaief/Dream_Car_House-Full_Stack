export interface BrandType {
  id: number;
  name: string;
  image: string;
}

export interface ModelType {
  id: number;
  brand: string;
  model: string;
}

export interface BodyStyleType {
  id: number;
  body: string;
}

export interface FilterData {
  brands: BrandType[];
  models: ModelType[];
  bodyStyles: BodyStyleType[];
  byd_models: ModelType[];
  colors: string[];
  byd_colors: string[];
  byd_body_styles: BodyStyleType[];
}

export interface CarTypeConfig {
  title: string;
  heading: string;
  linkurl: string;
  description: string;
  bannerImage: string;
  baseApiParams: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
}

export const CAR_TYPE_CONFIGS: Record<string, CarTypeConfig> = {
  all: {
    title: "Choose per your preference",
    heading: "Looking for <br /> Reconditioned Unit?",
    linkurl: "/cars/brand-new",
    description:
      "Glance through the widest collection of reconditioned Japanese models & pre-owned European units and choose according to your budget & quality preferences.",
    bannerImage: "/images/banner.png",
    baseApiParams: {},
    seoTitle: "All Cars - Our Complete Inventory",
    seoDescription: "Browse our complete collection of available cars",
  },
  "brand-new": {
    title: "Fresh Arrival",
    heading: "Looking for <br /> Pre-owned Unit?",
    linkurl: "/cars/pre-owned",
    description:
      "Glance through the widest collection of reconditioned Japanese models & pre-owned European units and choose according to your budget & quality preferences.",
    bannerImage: "/images/banner.png",
    baseApiParams: { car_type: "BRAND_NEW, RECONDITIONED" },
    seoTitle: "Brand New Cars - Latest Models",
    seoDescription:
      "Discover our collection of brand new vehicles with full warranty",
  },
  byd: {
    title: "BYD Exclusive Units",
    heading: "Experience the Future  with BYD",
    linkurl: "/byd-cars",
    description:
      "Explore BYD's electric luxury lineup with advanced technology, serene comfort, and effortless performance designed for modern driving.",
    bannerImage: "/images/byd-banner.png",
    baseApiParams: { brand: "BYD" },
    seoTitle: "BYD Exclusive Units - Electric Luxury",
    seoDescription:
      "Experience BYD's premium electric vehicles with innovation, comfort, and refined performance.",
  },
  "pre-owned": {
    title: "Choose per your preference",
    heading: "Looking for <br /> Reconditioned Unit?",
    linkurl: "/cars/brand-new",
    description:
      "Glance through the widest collection of reconditioned Japanese models & pre-owned European units and choose according to your budget & quality preferences.",
    bannerImage: "/images/banner.png",
    baseApiParams: { car_type: "PRE_OWNED" },
    seoTitle: "Pre-Owned Cars - Quality Used Vehicles",
    seoDescription: "Browse our collection of quality pre-owned vehicles",
  },
};
