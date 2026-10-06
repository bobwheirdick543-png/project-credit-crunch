import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/map")({
  ssr: false,
  head: () => ({ meta: [{ title: "World Map — Soul Life" }] }),
  component: MapPage,
});

const CITIES = ["Ibadan", "Enugu", "Kano", "Port Harcourt", "Abuja", "Lagos", "BS Island"];

const BUILDINGS = [
  "Vault House", "Empire Tower", "Trade Nexus", "Feast Hall", "Iron Forge",
  "Restoration Hall", "Fortune Den", "Vibe Temple", "Enforcement Post",
  "Judgment Seat", "The Crucible", "Soul Tower", "Gang HQ", "Crypto Exchange",
  "Property Office", "Pet Store", "Card Altar", "Chapel", "Airdrop Tower", "Bank Vault",
];

function MapPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState("Lagos");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Soul Nigeria</h1>
        <p className="mt-1 text-sm text-muted-foreground">Select a city and enter buildings</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`glass-pill px-4 py-2 text-sm font-medium ${
                city === c ? "bg-primary/15 text-primary border-primary/40" : ""
              }`}
            >
              {c === "BS Island" && <Lock className="mr-1 inline h-3 w-3" />}
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">{city} Buildings</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BUILDINGS.map((b) => (
              <button key={b} className="glass-card glow-hover p-4 text-left transition-all">
                <p className="font-semibold">{b}</p>
                <p className="mt-1 text-xs text-muted-foreground">Tap to enter</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
