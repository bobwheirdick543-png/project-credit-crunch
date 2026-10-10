import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
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

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">The District</h1>
        <div className="mb-8 mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <MapPin className="h-3 w-3" />
          You are in {currentState}
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          Explore businesses in your current city. Shop, eat, and spend Naira.
        </p>

        {/* Placeholder — ready for new District content */}
        <div className="glass-card p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            The District is being rebuilt.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            New content coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
