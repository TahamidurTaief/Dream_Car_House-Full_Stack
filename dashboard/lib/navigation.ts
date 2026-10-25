export type NavigationItem = Readonly<{
  href:
    | "/"
    | "/workspace"
    | "/workspace/inventory"
    | "/workspace/brands"
    | "/workspace/model-generations"
    | "/workspace/body-styles"
    | "/workspace/stocks"
    | "/workspace/quotes"
    | "/workspace/sell-cars"
    | "/workspace/inbox/contact"
    | "/workspace/inbox/subscribers"
    | "/workspace/content/sliders"
    | "/workspace/content/preferences"
    | "/workspace/content/consultation"
    | "/workspace/content/experience"
    | "/workspace/content/visual-chronicles"
    | "/workspace/content/vip-sanctuary"
    | "/workspace/content/social-media"
    | "/workspace/content/social-features"
    | "/workspace/content/sales-representatives"
    | "/workspace/seo/pages"
    | "/workspace/seo/categories"
    | "/workspace/users"
    | "/workspace/groups"
    | "/workspace/site-settings"
    | "/workspace/branches"
    | "/workspace/preview"
    | "/login";
  label: string;
  symbol: string;
  permission?: string;
}>;

// Only implemented destinations belong here. Future modules live in MODULE_MATRIX.md.
export const navigation: readonly NavigationItem[] = [
  { href: "/", label: "Access status", symbol: "◉" },
  { href: "/workspace", label: "Workspace", symbol: "▦" },
  { href: "/workspace/inventory", label: "Inventory", symbol: "🚗", permission: "inventory.view_inventory" },
  { href: "/workspace/brands", label: "Brands", symbol: "🏷️", permission: "inventory.view_brand" },
  { href: "/workspace/model-generations", label: "Models", symbol: "📑", permission: "inventory.view_modelgeneration" },
  { href: "/workspace/body-styles", label: "Body Styles", symbol: "🚙", permission: "inventory.view_bodystyle" },
  { href: "/workspace/stocks", label: "Stock Items", symbol: "📦", permission: "inventory.view_stock" },
  { href: "/workspace/quotes", label: "Customer Quotes", symbol: "💬", permission: "inventory.view_inventoryquote" },
  { href: "/workspace/sell-cars", label: "Sell Car Leads", symbol: "🤝", permission: "home.view_sellcar" },
  { href: "/workspace/inbox/contact", label: "Contact Inbox", symbol: "✉️", permission: "home.view_contactmessage" },
  { href: "/workspace/inbox/subscribers", label: "Subscribers", symbol: "📬", permission: "home.view_subscriber" },
  { href: "/workspace/content/sliders", label: "Slider Videos", symbol: "🎬", permission: "home.view_slider" },
  { href: "/workspace/content/preferences", label: "Preference Section", symbol: "🎛️", permission: "home.view_preferencesection" },
  { href: "/workspace/content/consultation", label: "Consultation", symbol: "💬", permission: "home.view_consultationsection" },
  { href: "/workspace/content/experience", label: "Experience Pillars", symbol: "🏛️", permission: "home.view_experiencesection" },
  { href: "/workspace/content/visual-chronicles", label: "Visual Chronicles", symbol: "📸", permission: "home.view_visualchroniclessection" },
  { href: "/workspace/content/vip-sanctuary", label: "VIP Sanctuary", symbol: "👑", permission: "home.view_vipsanctuarysection" },
  { href: "/workspace/content/social-media", label: "Social Links", symbol: "🌐", permission: "home.view_socialmedia" },
  { href: "/workspace/content/social-features", label: "Social Features", symbol: "🌟", permission: "home.view_peopletalkaboutus" },
  { href: "/workspace/content/sales-representatives", label: "Sales Reps", symbol: "👤", permission: "home.view_salesrepresentative" },
  { href: "/workspace/seo/pages", label: "Page SEO", symbol: "🔍", permission: "seo_config.view_seoconfig" },
  { href: "/workspace/seo/categories", label: "Category SEO", symbol: "📑", permission: "seo_config.view_categorypageseo" },
  { href: "/workspace/site-settings", label: "Site Settings", symbol: "⚙️", permission: "home.view_sitesettings" },
  { href: "/workspace/branches", label: "Showroom Branches", symbol: "🏢", permission: "home.view_showroombranch" },
  { href: "/workspace/users", label: "Users", symbol: "👥", permission: "auth.view_user" },
  { href: "/workspace/groups", label: "Groups", symbol: "🛡️", permission: "auth.view_group" },
  { href: "/workspace/preview", label: "UI Components", symbol: "❖" },
];

export const allRoutes: Record<string, { label: string; symbol: string }> = {
  "/": { label: "Access status", symbol: "◉" },
  "/workspace": { label: "Workspace", symbol: "▦" },
  "/workspace/inventory": { label: "Inventory", symbol: "🚗" },
  "/workspace/brands": { label: "Brands", symbol: "🏷️" },
  "/workspace/model-generations": { label: "Models", symbol: "📑" },
  "/workspace/body-styles": { label: "Body Styles", symbol: "🚙" },
  "/workspace/stocks": { label: "Stock Items", symbol: "📦" },
  "/workspace/quotes": { label: "Customer Quotes", symbol: "💬" },
  "/workspace/sell-cars": { label: "Sell Car Leads", symbol: "🤝" },
  "/workspace/inbox/contact": { label: "Contact Inbox", symbol: "✉️" },
  "/workspace/inbox/subscribers": { label: "Subscribers", symbol: "📬" },
  "/workspace/content/sliders": { label: "Slider Videos", symbol: "🎬" },
  "/workspace/content/preferences": { label: "Preference Section", symbol: "🎛️" },
  "/workspace/content/consultation": { label: "Consultation Section", symbol: "💬" },
  "/workspace/content/experience": { label: "Experience Pillars", symbol: "🏛️" },
  "/workspace/content/visual-chronicles": { label: "Visual Chronicles", symbol: "📸" },
  "/workspace/content/vip-sanctuary": { label: "VIP Sanctuary", symbol: "👑" },
  "/workspace/content/social-media": { label: "Social Links", symbol: "🌐" },
  "/workspace/content/social-features": { label: "Social Features", symbol: "🌟" },
  "/workspace/content/sales-representatives": { label: "Sales Reps", symbol: "👤" },
  "/workspace/seo/pages": { label: "Page SEO", symbol: "🔍" },
  "/workspace/seo/categories": { label: "Category SEO", symbol: "📑" },
  "/workspace/site-settings": { label: "Site Settings", symbol: "⚙️" },
  "/workspace/branches": { label: "Showroom Branches", symbol: "🏢" },
  "/workspace/users": { label: "Users", symbol: "👥" },
  "/workspace/groups": { label: "Groups", symbol: "🛡️" },
  "/workspace/preview": { label: "UI Components Preview", symbol: "❖" },
  "/login": { label: "Sign in", symbol: "⚿" },
};


