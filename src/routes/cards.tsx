import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { Layers, Sparkles, Zap, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/cards")({
  ssr: false,
  head: () => ({ meta: [{ title: "Cards — Soul Life" }] }),
  component: CardsPage,
});

const TABS = ["Collection", "Active Spawns", "Abilities", "Stats"] as const;

const SAMPLE_CARDS = [
  { name: "Street Hustler", rarity: "Common", power: 12 },
  { name: "Lagos Kingpin", rarity: "Rare", power: 28 },
  { name: "Ancestral Spirit", rarity: "Epic", power: 45 },
  { name: "BS Island Legend", rarity: "Legendary", power: 80 },
];

function CardsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Collection");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Soul Cards</h1>

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
          {tab === "Collection" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SAMPLE_CARDS.map((c) => (
                <div key={c.name} className="glass-card p-5 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
                    <Layers className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.rarity}</p>
                  <p className="mt-2 text-sm font-bold text-primary">Power {c.power}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "Active Spawns" && (
            <div className="glass-card p-8 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">No active card spawns right now.</p>
              <p className="mt-1 text-xs text-muted-foreground">Cards spawn randomly across cities. Check the map.</p>
            </div>
          )}

          {tab === "Abilities" && (
            <div className="glass-card p-8 text-center">
              <Zap className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">Equip cards to unlock special abilities.</p>
            </div>
          )}

          {tab === "Stats" && (
            <div className="glass-card p-8 text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">Card battle stats will appear here once you start collecting.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
