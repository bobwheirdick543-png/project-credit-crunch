import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/data/district/types";
import { abujaBusinesses } from "@/data/district/abuja";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/market")({
  ssr: false,
  head: () => ({ meta: [{ title: "The District — Soul Life" }] }),
  component: DistrictHome,
});

function DistrictHome() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const currentState = profile?.city ?? "Abuja";

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  // Filter businesses by user's current state
  const stateBusinesses = abujaBusinesses.filter(
    (b) => b.state.toLowerCase() === currentState.toLowerCase() || currentState === "Abuja"
  );

  // Count businesses per category for this state
  const categoryCounts = CATEGORIES.map((c) => ({
    ...c,
    count: stateBusinesses.filter((b) => b.category === c.id).length,
  }));

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-3xl font-bold">The District</h1>
        </div>
        <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <MapPin className="h-3 w-3" />
          You are in {currentState}
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          Explore businesses in your current city. Shop, eat, and spend Naira.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryCounts.map((c) => (
            <Link
              key={c.id}
              to="/market/$category"
              params={{ category: c.id }}
              className="glass-card glow-hover flex items-center gap-4 p-5 transition-all"
            >
              <span className="text-3xl">{c.emoji}</span>
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.count > 0 ? `${c.count} places` : "Coming soon"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
