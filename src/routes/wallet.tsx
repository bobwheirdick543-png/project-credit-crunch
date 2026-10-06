import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/wallet")({
  ssr: false,
  head: () => ({ meta: [{ title: "Wallet — Soul Life" }] }),
  component: WalletPage,
});

const TABS = ["Balance", "Vault", "Loan", "Transactions", "Crypto"] as const;

function WalletPage() {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Balance");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Wallet</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`glass-pill px-4 py-2 text-sm font-medium transition-colors ${
                tab === t ? "bg-primary/15 text-primary border-primary/40" : ""
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "Balance" && (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="mt-2 text-5xl font-bold text-primary">ₕ{(profile?.habz ?? 5000).toLocaleString()}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button className="glass-button">Deposit</button>
                <button className="glass-button-ghost">Withdraw</button>
                <button className="glass-button-ghost">Transfer</button>
              </div>
            </div>
          )}
          {tab === "Vault" && (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Vault Balance</p>
              <p className="mt-2 text-4xl font-bold">ₕ{(profile?.vault ?? 0).toLocaleString()}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button className="glass-button">Move to Vault</button>
                <button className="glass-button-ghost">Move to Wallet</button>
              </div>
            </div>
          )}
          {tab === "Loan" && (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Outstanding Loan</p>
              <p className="mt-2 text-4xl font-bold">ₕ0</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button className="glass-button">Take Loan</button>
                <button className="glass-button-ghost">Repay</button>
              </div>
            </div>
          )}
          {tab === "Transactions" && (
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            </div>
          )}
          {tab === "Crypto" && (
            <div className="glass-card p-6">
              <p className="text-sm text-muted-foreground">Crypto trading coming soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
