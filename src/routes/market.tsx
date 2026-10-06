import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/market")({
  ssr: false,
  head: () => ({ meta: [{ title: "Market — Soul Life" }] }),
  component: MarketPage,
});

const TABS = ["Shop", "Inventory", "Properties", "Vehicles", "Crypto"] as const;

const SHOP_ITEMS = [
  { name: "Street Energy Drink", price: 150, desc: "+10 XP for 1 hour" },
  { name: "Hustle Kit", price: 800, desc: "Boost daily earnings" },
  { name: "Black Market Pass", price: 2500, desc: "Unlock rare deals" },
  { name: "Soul Shield", price: 1200, desc: "Protect against steals" },
  { name: "Lucky Charm", price: 500, desc: "Higher drop rates" },
  { name: "City Map Upgrade", price: 3000, desc: "Reveal hidden buildings" },
];

const PROPERTIES = [
  { name: "Buka Stall", price: 15000, city: "Ibadan", income: "ₕ200/day" },
  { name: "Phone Accessory Shop", price: 45000, city: "Lagos", income: "ₕ600/day" },
  { name: "Mini Hotel", price: 180000, city: "Abuja", income: "ₕ2,400/day" },
  { name: "Club Lounge", price: 350000, city: "Port Harcourt", income: "ₕ5,000/day" },
];

const VEHICLES = [
  { name: "Okada", price: 2500, speed: "Low" },
  { name: "Keke Napep", price: 8000, speed: "Medium" },
  { name: "Toyota Corolla", price: 45000, speed: "High" },
  { name: "Lexus GX", price: 220000, speed: "Luxury" },
];

function MarketPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Shop");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Market</h1>

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

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tab === "Shop" && SHOP_ITEMS.map((item) => (
            <div key={item.name} className="glass-card p-5">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              <p className="mt-3 font-mono text-primary">ₕ{item.price.toLocaleString()}</p>
              <button className="glass-button mt-4 w-full !py-2 text-sm">Buy</button>
            </div>
          ))}

          {tab === "Properties" && PROPERTIES.map((p) => (
            <div key={p.name} className="glass-card p-5">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.city} · {p.income}</p>
              <p className="mt-3 font-mono text-primary">ₕ{p.price.toLocaleString()}</p>
              <button className="glass-button mt-4 w-full !py-2 text-sm">Purchase</button>
            </div>
          ))}

          {tab === "Vehicles" && VEHICLES.map((v) => (
            <div key={v.name} className="glass-card p-5">
              <p className="font-semibold">{v.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">Speed: {v.speed}</p>
              <p className="mt-3 font-mono text-primary">ₕ{v.price.toLocaleString()}</p>
              <button className="glass-button mt-4 w-full !py-2 text-sm">Buy</button>
            </div>
          ))}

          {tab === "Inventory" && (
            <div className="col-span-full glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Your inventory is empty. Buy items from the Shop.</p>
            </div>
          )}

          {tab === "Crypto" && (
            <div className="col-span-full glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Crypto trading coming soon. Watch this space.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
