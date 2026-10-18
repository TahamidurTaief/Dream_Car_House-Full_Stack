import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Car,
  Building2,
  GitBranch,
  Shapes,
  Boxes,
  ArrowRight,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { getManagementAccess } from "@/lib/server/api";
import { PageHeader } from "@/components/page-header";
import { State } from "@/components/states";
import { logoutAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const access = await getManagementAccess();

  if (!access.ok) {
    if (access.error.code === "UNAUTHENTICATED") {
      redirect("/login?next=/workspace");
    }

    return (
      <>
        <PageHeader href="/workspace" description="Management access" />
        <State title="Access Forbidden" tone="error">
          <p>{access.error.message}</p>
          <p>Active authorized staff credentials are required.</p>
        </State>
      </>
    );
  }

  const { user } = access.data;

  return (
    <>
      <PageHeader
        href="/workspace"
        description="Authenticated management workspace."
      />
      <div className="state">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <User size={20} style={{ color: "var(--accent)" }} />
          <h2 style={{ margin: 0 }}>Welcome, {user.username}</h2>
        </div>
        <p className="muted" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
          <ShieldCheck size={16} style={{ color: "var(--success)" }} />
          Role: <strong>{user.is_superuser ? "Superuser" : user.is_staff ? "Staff Member" : "Regular User"}</strong>
        </p>
        <p className="muted">
          Active permissions: {user.is_superuser ? "Full system access (*)" : `${user.permissions.length} model permission(s) granted`}
        </p>

        <section style={{ marginTop: "var(--space-4)" }}>
          <form action={logoutAction} className="logout-form">
            <button
              type="submit"
              className="button"
              style={{
                background: "var(--hover)",
                color: "var(--text)",
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </form>
        </section>
      </div>

      <section className="note">
        <h2>Management Modules</h2>
        <p className="muted" style={{ marginBottom: "var(--space-4)" }}>
          All business modules enforce active staff and specific Django model permissions.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-3)" }}>
          <div style={{ padding: "var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <Car size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Inventory</h3>
              </div>
              <p className="muted" style={{ fontSize: "var(--font-size-sm)", margin: "0 0 var(--space-3) 0" }}>
                Showroom car stock, pricing, specs, media galleries, and search indexing.
              </p>
            </div>
            <Link
              href="/workspace/inventory"
              className="button button--secondary"
              style={{ fontSize: "var(--font-size-xs)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)", width: "fit-content" }}
            >
              Manage Vehicles <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ padding: "var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <Building2 size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Brands</h3>
              </div>
              <p className="muted" style={{ fontSize: "var(--font-size-sm)", margin: "0 0 var(--space-3) 0" }}>
                Vehicle brands, logos, segments, on-page rich content, and JSON-LD schema.
              </p>
            </div>
            <Link
              href="/workspace/brands"
              className="button button--secondary"
              style={{ fontSize: "var(--font-size-xs)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)", width: "fit-content" }}
            >
              Manage Brands <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ padding: "var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <GitBranch size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Model Generations</h3>
              </div>
              <p className="muted" style={{ fontSize: "var(--font-size-sm)", margin: "0 0 var(--space-3) 0" }}>
                Model generations linked strictly to parent brands with cascade guards.
              </p>
            </div>
            <Link
              href="/workspace/model-generations"
              className="button button--secondary"
              style={{ fontSize: "var(--font-size-xs)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)", width: "fit-content" }}
            >
              Manage Models <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ padding: "var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <Shapes size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Body Styles</h3>
              </div>
              <p className="muted" style={{ fontSize: "var(--font-size-sm)", margin: "0 0 var(--space-3) 0" }}>
                Vehicle body styles (SUV, Sedan, Hatchback, Coupe, etc.).
              </p>
            </div>
            <Link
              href="/workspace/body-styles"
              className="button button--secondary"
              style={{ fontSize: "var(--font-size-xs)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)", width: "fit-content" }}
            >
              Manage Body Styles <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ padding: "var(--space-3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--surface)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
                <Boxes size={18} style={{ color: "var(--accent)" }} />
                <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Stock Items</h3>
              </div>
              <p className="muted" style={{ fontSize: "var(--font-size-sm)", margin: "0 0 var(--space-3) 0" }}>
                Showroom arrival banners, shipment teasers, and media banners.
              </p>
            </div>
            <Link
              href="/workspace/stocks"
              className="button button--secondary"
              style={{ fontSize: "var(--font-size-xs)", display: "inline-flex", alignItems: "center", gap: "var(--space-2)", width: "fit-content" }}
            >
              Manage Stock Banners <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
