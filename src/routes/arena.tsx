import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/arena")({
  ssr: false,
  head: () => ({ meta: [{ title: "Arena — Soul Life" }] }),
  component: ArenaPage,
});

const TABS = ["Steal", "Rob", "Kill", "Bounties", "Heists", "Blackmail"] as const;

const DESCRIPTIONS: Record<string, string> = {
  Steal: "Quietly take Habz from another Soul. Low risk, moderate reward.",
  Rob: "Force a larger take. Higher risk of being caught.",
  Kill: "Eliminate a rival. High risk, high reward, affects Soul Rating.",
  Bounties: "Place or claim bounties on other players.",
  Heists: "Team up for big coordinated jobs across cities.",
  Blackmail: "Use information to extract payment from targets.",
};

function ArenaPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Steal");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Arena</h1>
        <p className="mt-1 text-sm text-muted-foreground">The streets have rules. Choose your move carefully.</p>

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

        <div className="mt-8 glass-card p-8">
          <h2 className="text-xl font-bold">{tab}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{DESCRIPTIONS[tab]}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Success Chance</p>
              <p className="mt-1 text-lg font-bold">—</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Potential Reward</p>
              <p className="mt-1 text-lg font-bold text-primary">—</p>
            </div>
          </div>

          <button className="glass-button mt-8 w-full sm:w-auto">Find Targets</button>
        </div>
      </main>
    </div>
  );
}
