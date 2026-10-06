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
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-5">
              <p className="font-semibold">{tab} Item {i}</p>
              <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
              <p className="mt-3 font-mono text-primary">ₕ{(i * 500).toLocaleString()}</p>
              <button className="glass-button mt-4 w-full !py-2 text-sm">Buy</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
