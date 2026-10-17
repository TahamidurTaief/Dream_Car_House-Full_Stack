import type { NextConfig } from "next";

const backendBaseUrl =
  process.env.NEXT_INTERNAL_API_ORIGIN?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const allowedDevOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.0.105:3000",
  "https://begautos.com",
  "https://www.begautos.com",
  ...(process.env.NEXT_ALLOWED_DEV_ORIGINS
    ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : []),
];

// Car IDs that no longer exist in inventory (deleted/purged). The dynamic
// lookup in app/car-details/[id]/page.tsx has nothing to resolve these to
// and would 404, so they're sent straight to the general listing instead.
const DELETED_CAR_IDS = [
  3, 4, 5, 6, 7, 8, 10, 11, 15, 17, 18, 20, 21, 24, 25, 26, 29, 32, 33, 34, 35,
  36, 38, 40, 41, 42, 43, 44, 45, 46, 47, 50, 52, 53, 54, 55, 57, 58, 59, 60,
  61, 62, 64, 65, 67, 68, 69, 70, 73, 74, 75, 77, 78, 79, 80, 81, 83, 85, 87,
  88, 90, 91, 92, 94, 95, 96, 97, 99, 100, 102, 104, 106, 107, 109, 110, 111,
  114, 115, 116, 117, 118, 120, 121, 122, 123, 124, 125, 126, 127, 128, 130,
  131, 133, 135, 136, 137, 138, 139, 141, 142, 144, 146, 150, 153, 155, 156,
  157, 158, 160, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 175,
  176, 177, 178, 179, 187, 188, 189, 190,
];

// Legacy/misspelled/renamed car slugs → current slug, or the brand page when
// the exact car could no longer be identified. Collected from Search Console
// crawl-error and URL Inspection exports.
const LEGACY_CAR_SLUGS: Record<string, string> = {
  "/cars/lexus-rx-200t-2015-red-41000km/": "/cars/lexus-rx-200t-2016-red-wine-41000km",
  // Note: source data gave this path two conflicting destinations (with and
  // without trailing slash). Next's redirect matcher ignores trailing slashes,
  // so only one can ever fire — kept the one matching the actual car in the slug.
  "/cars/toyota-alphard-red-wine-2018": "/cars/toyota-alphard-2018-red-wine-37000km",
  "/cars/mercedes-benz-e-class-2017-black-20000km": "/cars/mercedes-benz-e-class-2017-black-20000miles",
  "/cars/mazda-3-2020-white-42000km": "/cars/mazda-3-2020-white-42000miles",
  "/cars/2016-toyota-2016-4500cc-pearl": "/cars/brand/toyota",
  "/cars/mercedes-benz-c160-2017-blue-17000km": "/cars/mercedes-benz-c-160-2017-blue-17000km",
  "/cars/mercedes-benz-b-1602006-black-17000km": "/cars/mercedes-benz-b-160-2006-black-17000km",
  "/cars/toyota-land-cruiser-prado-2023-bronze": "/cars/toyota-land-cruiser-prado-2023-bronze-950km",
  "/cars/toyota-land-cruiser-prado-2023-bronze/": "/cars/toyota-land-cruiser-prado-2023-bronze-950km",
  "/cars/toyota-land-cruiser-prado-2023-2025-bronze": "/cars/toyota-land-cruiser-prado-2023-bronze-950km",
  "/cars/byd-seal-6-2026-c-gray-00km/": "/cars/brand/byd",
  "/cars/byd-seal-6-2026-c-gray-00km": "/cars/brand/byd",
  "/cars/toyota-2024-2500cc-black/": "/cars/brand/toyota",
  "/cars/honda-civic-fl1-2021-black-23000km/": "/cars/honda-civic-fl1-2021-black-20000km",
  "/cars/lexus-nx-300h-2018-pearl-57000km": "/cars/lexus-nx-300h-2018-white-57000km",
  "/cars/lexus-nx-300h-2018-pearl-57000km/": "/cars/lexus-nx-300h-2018-white-57000km",
  "/cars/mercedes-benz-2020-white/": "/cars/brand/mercedes-benz",
  "/cars/toyota-alphard-2023-black-6000km": "/cars/toyota-alphard-2022-black-7000km",
  "/cars/toyota-alphard-2023-black-6000km/": "/cars/toyota-alphard-2022-black-7000km",
  "/cars/toyota-alphard-2022-black-52000km": "/cars/toyota-alphard-2022-black-7000km",
  "/cars/toyota-land-cruiser-v8-2013-white-pearl-90000km/": "/cars/toyota-land-cruiser-vx-v8-2013-white-pearl-90000km",
  "/cars/mercedes-benz-gls450-2020-blue-11000km": "/cars/mercedes-benz-gls-450-2020-blue-11000km",
  "/cars/mercedes-benz-gls450-2020-blue/": "/cars/mercedes-benz-gls-450-2020-blue-11000km",
  "/cars/2023-honda-": "/cars/brand/honda",
  "/cars/toyouta-corolla-touring-2022-pearl-150000km": "/cars/toyota-corolla-touring-wxb-2022-white",
  "/cars/honda-cr-v-2021-": "/cars/honda-cr-v-2021-grey-33000km",
  "/cars/toyota-alphard-2024-bronze-9000km/": "/cars/toyota-alphard-2024-bronze-8000km",
  "/cars/toyota-voxy2022-black-48000km": "/cars/toyota-voxy-2022-black-48000km",
  "/cars/toyota-rav4-2019-black-63000km": "/cars/toyota-rav-4-2019-black-63000km",
  "/cars/mercedes-": "/cars/brand/mercedes-benz",
  "/cars/bmw-740le-2017-black-15000km": "/cars/bmw-740le-2017-black-16000miles",
  "/cars/mercedes-benz-gls450-2020-white-9000km": "/cars/mercedes-benz-gls-450-2020-white-9000km",
  "/cars/mercedes-benz-gls450-2020-white-9000km/": "/cars/mercedes-benz-gls-450-2020-white-9000km",
  "/cars/mercedes-benz-e300e-2019-grey-10000km": "/cars/mercedes-benz-e-300e-2019-grey-8000km",
  "/cars/bmw-745le-2019-black-19000km": "/cars/bmw-745le-2019-black-15000km",
  "/cars/range-rover-vogue-2020-white-5000km": "/cars/range-rover-vogue-2020-white-5000miles",
  "/cars/lexus-lx-600-2023-white-450km": "/cars/lexus-lx-600-2023-white-00km",
  "/cars/mercedes-benz-gls450-2020-white-23000km": "/cars/mercedes-benz-gls-450-2020-white-23000km",
  "/cars/range-rover-vogue-2024-white-2000miles": "/cars/range-rover-vogue-2024-black-2000miles",
  "/cars/rollsroyce-spectre-2024-black": "/cars/rollsroyce-spectre-2024-black-00km",
  "/cars/mercedes-benz-c-class-2021-blue-18000km": "/cars/mercedes-benz-c-class-2021-blue-14000miles",
  "/cars/mercedes-benz-glb200-2023-black-13000km": "/cars/mercedes-benz-glb-200-2023-black-13000miles",
  "/cars/toyota-alphard-2024-black-2000km": "/cars/brand/toyota",
  "/cars/lexus-rx-300f-2020-black-34000km": "/cars/lexus-rx-300-f-sport-2020-black-34000km",
  "/byd-sealion-6-awd-2026-arctic-white-00km": "/cars/byd-sealion-6-awd-2026-arctic-white-00km",
};

const nextConfig: NextConfig = {
  // Prevent Next trailing-slash redirect from fighting Django APPEND_SLASH redirects.
  skipTrailingSlashRedirect: true,
  allowedDevOrigins,
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: `${backendBaseUrl}/api/:path*/`,
      },
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path((?!api|_next|favicon.ico).*)",
        has: [{ type: "host", value: "begautos.com" }],
        destination: "https://www.begautos.com/:path*",
        permanent: true,
      },
      // Note: We cannot statically redirect /car-details/:id to /cars/:slug here
      // because mapping the legacy ID to the new slug requires a database lookup.
      // This redirect is handled dynamically in app/car-details/[id]/page.tsx
      {
        source: "/byd-cars",
        destination: "/cars/brand/byd",
        permanent: true,
      },
      // Legacy ID-based URLs for cars that were deleted from inventory —
      // see DELETED_CAR_IDS above for why these can't use the dynamic lookup.
      ...DELETED_CAR_IDS.map((id) => ({
        source: `/car-details/${id}`,
        destination: "/cars",
        permanent: true,
      })),
      {
        source: "/car",
        destination: "/cars",
        permanent: true,
      },
      // Legacy/corrected car slugs — see LEGACY_CAR_SLUGS above.
      ...Object.entries(LEGACY_CAR_SLUGS).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      // Stray URLs with trailing special characters picked up by crawlers.
      {
        source: "/&",
        destination: "/",
        permanent: true,
      },
      {
        source: "/$",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    // Django backend handles all image optimization — no double-processing.
    // In local dev the backend runs on 127.0.0.1/localhost, and Next's image
    // optimizer refuses to proxy images resolving to a private/loopback IP
    // (SSRF protection) — so optimization is skipped in dev only. Production
    // media is served from real public domains, so this never applies there.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      // --- Production ---
      { protocol: "https", hostname: "begautos.com", pathname: "/**" },
      { protocol: "https", hostname: "www.begautos.com", pathname: "/**" },
      { protocol: "https", hostname: "author.begautos.com", pathname: "/**" },
      // --- Staging ---
      { protocol: "https", hostname: "begautos.passmcq.com", pathname: "/**" },
      {
        protocol: "http",
        hostname: "nkgooc0kcg8g4sg0048g4g4g.156.67.111.163.sslip.io",
        pathname: "/**",
      },
      // --- Local Development ---
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
      // --- LAN Development ---
      { protocol: "http", hostname: "192.168.0.107", port: "8000", pathname: "/**" },
      { protocol: "http", hostname: "192.168.0.102", port: "8000", pathname: "/**" },
    ],
  },
};

export default nextConfig;
