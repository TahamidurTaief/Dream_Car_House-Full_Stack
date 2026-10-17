# AutoDeal - Next.js Standalone Template Project

Standalone Next.js App Router + TypeScript implementation of the **AutoDeal** car dealership, rental & listing template.

- **Root Homepage (`/`)**: Faithfully converts `home07.html` in full.
- **Home 01 (`/home01`)**: Original `index.html`.
- **CSS & Assets**: Original stylesheets are preserved byte-for-byte in `public/app/css/` and `public/forms/end-form/build/sib-styles.css`.
- **Pure CSS**: No Tailwind, component libraries, or altered design frameworks.
- **Request-Time SSR & SEO**: Configured with `export const dynamic = "force-dynamic"` across all converted content pages for request-time dynamic rendering (`ƒ`). Initial server HTML delivers semantic headings, metadata, and prerendered DOM. Sitemap and robots remain static.

---

## Source-to-Route Mapping

All genuine top-level HTML pages have been converted to extensionless App Router routes:

| Source HTML | Next.js Route | Description |
| :--- | :--- | :--- |
| `home07.html` | `/` | Primary Root Homepage (Home 07) |
| `index.html` | `/home01` | Original Home Page 01 |
| `home02.html` – `home06.html` | `/home02` – `/home06` | Alternative Homepage variants 02–06 |
| `home08.html` – `home10.html` | `/home08` – `/home10` | Alternative Homepage variants 08–10 |
| `about-us.html` | `/about-us` | About Us page |
| `listing-list.html` | `/listing-list` | Car listing list view |
| `listing-list-map.html` | `/listing-list-map` | Car listing list with map view |
| `listing-grid.html` | `/listing-grid` | Car listing grid V1 |
| `listing-grid2.html` | `/listing-grid2` | Car listing grid V2 |
| `listing-grid-map.html` | `/listing-grid-map` | Car listing grid with map view |
| `listing-detail-v1.html` – `v5.html` | `/listing-detail-v1` – `v5` | Car detail layouts 1 through 5 |
| `compare.html` | `/compare` | Vehicle comparison tool |
| `dealer-listing.html` | `/dealer-listing` | Dealer directory |
| `dealer-detail.html` | `/dealer-detail` | Dealer profile and inventory |
| `blog.html`, `blog-grid.html` | `/blog`, `/blog-grid` | News and blog archives |
| `blog-detail.html` | `/blog-detail` | Single blog article |
| `contact.html` | `/contact` | Contact page |
| `faq.html` | `/faq` | Frequently Asked Questions |
| `pricing.html` | `/pricing` | Pricing tables |
| `sale-agents.html`, `sale-agents-detail.html` | `/sale-agents`, `/sale-agents-detail` | Sales agents directory and details |
| `dashboard.html` | `/dashboard` | Demo user dashboard (presentation only) |
| `my-listing.html` | `/my-listing` | Demo listing management |
| `my-favorite.html` | `/my-favorite` | Demo saved listings |
| `my-profile.html` | `/my-profile` | Demo user profile |
| `my-review.html` | `/my-review` | Demo user reviews |
| `message.html` | `/message` | Demo messages |
| `change-password.html` | `/change-password` | Demo password reset |
| `add-listing.html` | `/add-listing` | Demo vehicle submission |

### Permanent & Alias Redirects (`next.config.ts`)
- `/home07.html`, `/home07`, `/index.html`, `/index` → Permanent redirect (`308`) to `/`.
- `/compare-1.html`, `/compare-1` → Redirect (`307`) to `/compare`.
- `/my-favorites.html`, `/my-favorites` -> Redirect (`307`) to `/my-favorite`.
- `/properties-list.html`, `/properties-list` -> Redirect (`307`) to `/add-listing`.

---

## Installation & Running

### Requirements
- Node.js 18+ (tested with Node.js 24)
- npm 9+

### Commands
```bash
# Navigate to project directory
cd "C:\Users\taham\Desktop\Downloaded Web Sites\themesflat.co\autodeal-next"

# Install dependencies
npm install

# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## Environment & SITE_URL Configuration

Configure `NEXT_PUBLIC_SITE_URL` in `.env.local` to override the base domain for canonical tags, Open Graph metadata, `sitemap.xml`, and `robots.txt`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- When unset, defaults to `http://localhost:3000`.
- Used automatically by Next.js metadata generators (`app/sitemap.ts` and `app/robots.ts`).

---

## Standalone Scope & Presentation-Only Behavior

This project is a standalone presentation conversion. It is not connected to any backend or external APIs:

1. **No External Submissions**:
   - Active submissions to template demo endpoints (e.g., Brevo/Sendinblue, Mailchimp) have been removed.
   - All forms (contact, newsletter subscription, loan calculator, login/register modals) intercept submission locally and display:
     > *"Form submission is not configured in this standalone presentation demo."*
   - No sensitive data or credentials are transmitted anywhere.

2. **Dashboard & Account Management Pages**:
   - Dashboard, favorites, listings, reviews, and profile pages are static presentation mockups.
   - All account demo pages are marked with `robots: { index: false, follow: true }` and excluded from `sitemap.xml`.

---

## Missing Assets & Source Template Limitations

The source template directory contained several incomplete scraper artifacts that were safely excluded from routes and scripts:

1. **Empty 0-Byte HTML Files (Skipped)**:
   - `compare-1.html` (0 bytes) → Aliased to `/compare`.
   - `my-favorites.html` (0 bytes) → Aliased to `/my-favorite`.
   - `properties-list.html` (0 bytes) → Aliased to `/add-listing`.
2. **Scraper Placeholder Files (Omitted from loading)**:
   - `app/js/switcher.js.html` (0 bytes) → Not loaded.
   - `app/css/assets/fonts/fa-light-300.eot.html` (0 bytes) → Omitted; authentic font files are loaded from `public/assets/fonts/`.
   - `assets/images/section/*.html` (0 bytes) → Background placeholder files not utilized in Home 07.
3. **Visual Parity Status**:
   - DOM hierarchy, CSS loading, SSR output, font assets, and interactive handlers verified via TypeScript (`tsc --noEmit`), ESLint (`npm run lint`), production build (`npm run build`), and HTTP endpoint tests.
   - In-browser graphical rendering is marked **UNVERIFIED** due to subagent sandbox browser driver download restrictions.
