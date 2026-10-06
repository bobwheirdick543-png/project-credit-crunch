import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AuthShell } from "@/components/soul/AuthShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup/welcome")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Welcome — Soul Life" },
      { name: "description", content: "Your Soul Life begins now." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const { profile, user, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login" });
    }
    if (!loading && user) {
      setReady(true);
    }
  }, [loading, user, navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center aurora-bg">
        <p className="text-muted-foreground">Preparing your empire...</p>
      </div>
    );
  }

  return (
    <AuthShell
      eyebrow="YOU'RE IN"
      title={`Welcome, ${profile?.username ?? "Soul"}.`}
      copy="Your journey across Nigeria starts now. Here's what you begin with."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-primary">ₕ5,000</p>
            <p className="mt-1 text-xs text-muted-foreground">Starting Wallet</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-2xl font-bold">LVL 1</p>
            <p className="mt-1 text-xs text-muted-foreground">Fresh Soul</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-lg font-bold">{profile?.city ?? "Nigeria"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Starting City</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-2xl font-bold">⭐ 0</p>
            <p className="mt-1 text-xs text-muted-foreground">Soul Rating</p>
          </motion.div>
        </div>

        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="glass-button h-12 w-full"
        >
          Enter Soul Empire →
        </button>
      </div>
    </AuthShell>
  );
}
