import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { ThemeControl } from "@/components/soul/ThemeControl";

export const Route = createFileRoute("/settings")({
  ssr: false,
  head: () => ({ meta: [{ title: "Settings — Soul Life" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Settings</h1>

        <div className="mt-8 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold">Theme</h2>
            <p className="mt-1 text-sm text-muted-foreground">Choose light, dark, or system</p>
            <div className="mt-4">
              <ThemeControl />
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-semibold">Notifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage how you receive alerts</p>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-semibold">Privacy</h2>
            <p className="mt-1 text-sm text-muted-foreground">Control who can see your activity</p>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-semibold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Email, password, and linked accounts</p>
          </div>

          <div className="glass-card border-destructive/30 p-6">
            <h2 className="font-semibold text-destructive">Danger Zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">Delete account or reset progress</p>
            <button className="mt-4 rounded-full border border-destructive/50 px-4 py-2 text-sm text-destructive">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
