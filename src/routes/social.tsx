import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/social")({
  ssr: false,
  head: () => ({ meta: [{ title: "Social — Soul Life" }] }),
  component: SocialPage,
});

const TABS = ["Partner", "Secret Bonds", "Gifts", "Proposals"] as const;

function SocialPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Partner");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Social</h1>

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

        <div className="mt-8 glass-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {tab === "Partner" && "No partner yet. Propose to another Soul."}
            {tab === "Secret Bonds" && "No secret bonds active."}
            {tab === "Gifts" && "No gifts sent or received yet."}
            {tab === "Proposals" && "No pending proposals."}
          </p>
        </div>
      </main>
    </div>
  );
}
