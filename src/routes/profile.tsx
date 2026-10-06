import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({ meta: [{ title: "Profile — Soul Life" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Profile</h1>

        <div className="mt-8 glass-card p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white">
              {(profile?.username ?? "S").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.username ?? "New Soul"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="glass-pill flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  {profile?.city ?? "Nigeria"}
                </span>
                <span className="glass-pill text-xs">LVL {profile?.level ?? 1}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary/10 p-4 text-center">
              <p className="text-2xl font-bold text-primary">ₕ{(profile?.habz ?? 5000).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Wallet</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4 text-center">
              <p className="text-2xl font-bold">{profile?.level ?? 1}</p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4 text-center">
              <p className="text-2xl font-bold">{profile?.soul_rating ?? 0}</p>
              <p className="text-xs text-muted-foreground">Soul Rating</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="glass-button-ghost">Edit Title</button>
            <button className="glass-button-ghost">Edit Badge</button>
            <button className="glass-button-ghost">Edit Theme</button>
          </div>
        </div>
      </main>
    </div>
  );
}
