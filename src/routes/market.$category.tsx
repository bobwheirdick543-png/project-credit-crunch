import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/data/district/types";
import { getBusinessesByCategory } from "@/data/district";
import { formatNaira } from "@/lib/currency";
import { MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/market/$category")({
  ssr: false,
  head: () => ({ meta: [{ title: "Category — The District" }] }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const currentState = profile?.city ?? "Abuja";

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  const cat = CATEGORIES.find((c) => c.id === category);
  const businesses = getBusinessesByCategory(currentState, category);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">
          {cat?.emoji} {cat?.name ?? category}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <MapPin className="mr-1 inline h-3 w-3" />
          {currentState} · {businesses.length} places
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((b) => (
            <Link
              key={b.id}
              to="/market/$category/$businessId"
              params={{ category, businessId: b.id }}
              className="glass-card glow-hover overflow-hidden transition-all"
            >
              <div className="relative h-40">
                <img src={b.imageUrl} alt={b.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  {b.tier}
                </span>
                <h3 className="absolute bottom-3 left-3 text-lg font-bold text-white drop-shadow">{b.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{b.area}, {b.state}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-0.5 text-primary">
                    <Star className="h-3 w-3 fill-primary" /> {b.rating}
                  </span>
                  <span className="text-muted-foreground">({b.visits.toLocaleString()} visits)</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  From {formatNaira(Math.min(...b.menu.map((m) => m.price)))}
                </p>
              </div>
            </Link>
          ))}

          {businesses.length === 0 && (
            <div className="col-span-full glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">No businesses in this category for {currentState} yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
