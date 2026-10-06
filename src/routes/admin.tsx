import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { Users, Bell, Settings, Shield, Activity } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Soul Life" }] }),
  component: AdminPage,
});

const TABS = ["Overview", "Users", "Notifications", "Economy", "Moderation"] as const;

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Manage the Soul Life empire</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`glass-pill px-4 py-2 text-sm font-medium ${
                tab === t ? "bg-primary/15 text-primary border-primary/40" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "Overview" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card p-5">
                <Users className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
              <div className="glass-card p-5">
                <Activity className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">Active Today</p>
              </div>
              <div className="glass-card p-5">
                <Bell className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">Pending Reports</p>
              </div>
              <div className="glass-card p-5">
                <Settings className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">System Status</p>
              </div>
            </div>
          )}

          {tab === "Users" && (
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">User management will appear here once connected to Supabase.</p>
            </div>
          )}

          {tab === "Notifications" && (
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">Send system-wide notifications from here.</p>
              <button className="glass-button mt-4">Compose Notification</button>
            </div>
          )}

          {tab === "Economy" && (
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">Monitor total Habz in circulation, adjust rates, and manage the economy.</p>
            </div>
          )}

          {tab === "Moderation" && (
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">Review reports, ban users, and moderate content.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
