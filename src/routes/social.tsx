import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { Heart, Gift, Lock, Send } from "lucide-react";

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

        <div className="mt-8">
          {tab === "Partner" && (
            <div className="glass-card p-8 text-center">
              <Heart className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">No partner yet.</p>
              <p className="mt-1 text-xs text-muted-foreground">Propose to another Soul to start a relationship.</p>
              <button className="glass-button mt-6">Find a Partner</button>
            </div>
          )}

          {tab === "Secret Bonds" && (
            <div className="glass-card p-8 text-center">
              <Lock className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">No secret bonds active.</p>
              <p className="mt-1 text-xs text-muted-foreground">Secret bonds let you share vault access and private messages.</p>
              <button className="glass-button mt-6">Create Secret Bond</button>
            </div>
          )}

          {tab === "Gifts" && (
            <div className="glass-card p-8 text-center">
              <Gift className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">No gifts sent or received yet.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button className="glass-button">Send Gift</button>
                <button className="glass-button-ghost">Gift History</button>
              </div>
            </div>
          )}

          {tab === "Proposals" && (
            <div className="glass-card p-8 text-center">
              <Send className="mx-auto h-10 w-10 text-primary/50" />
              <p className="mt-4 text-sm text-muted-foreground">No pending proposals.</p>
              <p className="mt-1 text-xs text-muted-foreground">When someone proposes, it will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
