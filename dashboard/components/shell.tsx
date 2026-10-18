"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Car,
  Building2,
  GitBranch,
  Shapes,
  Boxes,
  Layers,
  KeyRound,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  User,
} from "lucide-react";
import { navigation } from "@/lib/navigation";
import type { DashboardUser } from "@/lib/types";

function getNavIcon(href: string): ReactNode {
  switch (href) {
    case "/":
      return <ShieldCheck size={18} />;
    case "/workspace":
      return <LayoutDashboard size={18} />;
    case "/workspace/inventory":
      return <Car size={18} />;
    case "/workspace/brands":
      return <Building2 size={18} />;
    case "/workspace/model-generations":
      return <GitBranch size={18} />;
    case "/workspace/body-styles":
      return <Shapes size={18} />;
    case "/workspace/stocks":
      return <Boxes size={18} />;
    case "/workspace/preview":
      return <Layers size={18} />;
    case "/login":
      return <KeyRound size={18} />;
    default:
      return <LayoutDashboard size={18} />;
  }
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation">
      <ul className="navigation">
        {navigation.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={onNavigate}
            >
              <span className="nav-symbol" aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {getNavIcon(item.href)}
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Shell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: DashboardUser;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  function closeDrawer() {
    drawer.current?.close();
    opener.current?.focus();
  }

  function trapDrawerFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (media.matches) drawer.current?.close();
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className="shell" data-collapsed={collapsed}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside id="desktop-navigation" className="sidebar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={16} />
          </span>
          <span className="nav-label">Beg Autos</span>
        </div>
        <Navigation />
        <div className="sidebar-footer">
          <button
            className="icon-button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            aria-controls="desktop-navigation"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <span aria-hidden="true">
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </span>
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button
            ref={opener}
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            aria-haspopup="dialog"
            onClick={() => drawer.current?.showModal()}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            <span aria-hidden="true">
              <Menu size={20} />
            </span>
          </button>
          <span className="topbar-title">
            Beg Autos <span className="muted">/ Dashboard</span>
          </span>
          {user ? (
            <span
              className="badge"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent-text)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <User size={13} /> Staff: {user.username}
            </span>
          ) : (
            <span className="badge">Unauthenticated</span>
          )}
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      <dialog
        ref={drawer}
        className="mobile-drawer"
        aria-label="Dashboard navigation"
        onKeyDown={trapDrawerFocus}
        onClick={(event) => {
          if (event.target === drawer.current) closeDrawer();
        }}
      >
        <div className="drawer-content">
          <div className="drawer-heading">
            <strong>Beg Autos</strong>
            <button
              className="icon-button"
              onClick={closeDrawer}
              aria-label="Close navigation"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <X size={18} />
            </button>
          </div>
          <Navigation onNavigate={closeDrawer} />
        </div>
      </dialog>
    </div>
  );
}
