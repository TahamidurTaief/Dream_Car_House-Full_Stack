import Link from "next/link";
import { LayoutDashboard, KeyRound } from "lucide-react";
import { getDashboardAccess } from "@/lib/server/auth";
import { PageHeader } from "@/components/page-header";
import { State } from "@/components/states";

export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const access = await getDashboardAccess();

  return (
    <>
      <PageHeader href="/" description="Beg Autos management workspace status." />
      {access.allowed ? (
        <State title="Signed in as active staff">
          <p>
            You are authenticated as <strong>{access.user.username}</strong>.
          </p>
          <Link
            className="button"
            href="/workspace"
            style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <LayoutDashboard size={16} /> Go to Workspace
          </Link>
        </State>
      ) : (
        <State title="Secure management sign-in">
          <p>Active authorized staff credentials are required to access management features.</p>
          <Link
            className="button"
            href="/login"
            style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <KeyRound size={16} /> Sign in
          </Link>
        </State>
      )}
      <section className="note">
        <h2>Preserved public operations</h2>
        <p className="muted">
          Your public website and existing Django admin workflow continue to operate independently.
        </p>
      </section>
    </>
  );
}
