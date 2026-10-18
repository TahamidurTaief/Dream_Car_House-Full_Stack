export type NavigationItem = Readonly<{
  href:
    | "/"
    | "/workspace"
    | "/workspace/inventory"
    | "/workspace/brands"
    | "/workspace/model-generations"
    | "/workspace/body-styles"
    | "/workspace/stocks"
    | "/workspace/preview"
    | "/login";
  label: string;
  symbol: string;
}>;

// Only implemented destinations belong here. Future modules live in MODULE_MATRIX.md.
export const navigation = [
  { href: "/", label: "Access status", symbol: "◉" },
  { href: "/workspace", label: "Workspace", symbol: "▦" },
  { href: "/workspace/inventory", label: "Inventory", symbol: "🚗" },
  { href: "/workspace/brands", label: "Brands", symbol: "🏷️" },
  { href: "/workspace/model-generations", label: "Models", symbol: "📑" },
  { href: "/workspace/body-styles", label: "Body Styles", symbol: "🚙" },
  { href: "/workspace/stocks", label: "Stock Items", symbol: "📦" },
  { href: "/workspace/preview", label: "UI Components", symbol: "❖" },
] as const satisfies readonly NavigationItem[];

export const allRoutes: Record<string, { label: string; symbol: string }> = {
  "/": { label: "Access status", symbol: "◉" },
  "/workspace": { label: "Workspace", symbol: "▦" },
  "/workspace/inventory": { label: "Inventory", symbol: "🚗" },
  "/workspace/brands": { label: "Brands", symbol: "🏷️" },
  "/workspace/model-generations": { label: "Models", symbol: "📑" },
  "/workspace/body-styles": { label: "Body Styles", symbol: "🚙" },
  "/workspace/stocks": { label: "Stock Items", symbol: "📦" },
  "/workspace/preview": { label: "UI Components Preview", symbol: "❖" },
  "/login": { label: "Sign in", symbol: "⚿" },
};
