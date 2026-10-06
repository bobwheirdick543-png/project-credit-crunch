import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/leaderboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Leaderboard — Soul Life" }] }),
  component: LeaderboardPage,
});

const TABS = ["Global", "Weekly", "Balance", "Messages", "Steal", "Kill"] as const;

const TOP = [
  { rank: 1, name: "KingTunde", amount: "ₕ18.4M", city: "Lagos", level: 20 },
  { rank: 2, name: "AdaBoss", amount: "ₕ12.7M", city: "Abuja", level: 18 },
  { rank: 3, name: "Zainab_K", amount: "ₕ9.1M", city: "Kano", level: 16 },
];

function LeaderboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Global");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Soul Rankings</h1>

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

        <div className="mt-8 space-y-3">
          {TOP.map((p) => (
            <div key={p.rank} className="glass-card flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                  {p.rank}
                </span>
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.city} · LVL {p.level}</p>
                </div>
              </div>
              <p className="font-bold text-primary">{p.amount}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
