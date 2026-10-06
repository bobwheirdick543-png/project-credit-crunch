import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Building2, Flame, Map, Shield, ShoppingBag, Sparkles, Users, Wallet, MapPin, Zap,
} from "lucide-react";
import { AppNav } from "@/components/soul/AppNav";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Soul Life" },
      { name: "description", content: "Manage your Soul Life empire, Habz and progress." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login", replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center aurora-bg">
        <p className="text-muted-foreground">Loading your empire...</p>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />

      <main className="mx-auto max-w-6xl px-5 pt-28">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {profile?.username ?? "Soul"}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="glass-pill flex items-center gap-1.5 text-xs">
              <MapPin className="h-3 w-3" />
              {profile?.city ?? "Nigeria"}
            </span>
            <span className="glass-pill text-xs">LVL {profile?.level ?? 1}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Wallet" value={`ₕ${(profile?.habz ?? 5000).toLocaleString()}`} note="Ready to spend" Icon={Wallet} />
          <StatCard label="Vault" value={`ₕ${(profile?.vault ?? 0).toLocaleString()}`} note="Protected savings" Icon={Shield} />
          <StatCard label="Loan" value="ₕ0" note="No active loans" Icon={Building2} />
          <StatCard label="Streak" value="🔥 0 days" note="Keep showing up" Icon={Flame} />
          <StatCard label="Level" value={`${profile?.level ?? 1} · ${profile?.xp ?? 0} XP`} note="Keep grinding" Icon={Zap} />
          <StatCard label="Soul Rating" value={`⭐ ${profile?.soul_rating ?? 0}`} note="Build reputation" Icon={Sparkles} />
        </div>

        {/* Active Boosts */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Active Boosts</h2>
          <div className="glass-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No active boosts. Win cards or visit the market to power up.</p>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>
          <div className="glass-card p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span>Account ready</span>
                <span className="text-muted-foreground">Now</span>
              </li>
              <li className="flex justify-between">
                <span>Welcome bonus received</span>
                <span className="text-primary font-semibold">+ₕ5,000</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/map" className="glass-button">
              <Map className="h-4 w-4" /> Explore Map
            </Link>
            <Link to="/wallet" className="glass-button-ghost">
              <Wallet className="h-4 w-4" /> Open Wallet
            </Link>
            <Link to="/profile" className="glass-button-ghost">
              View Profile
            </Link>
            <Link to="/market" className="glass-button-ghost">
              <ShoppingBag className="h-4 w-4" /> Market
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  Icon,
}: {
  label: string;
  value: string;
  note: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
