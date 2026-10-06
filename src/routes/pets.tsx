import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/pets")({
  ssr: false,
  head: () => ({ meta: [{ title: "Pets — Soul Life" }] }),
  component: PetsPage,
});

function PetsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-6xl px-5 pt-28">
        <h1 className="text-3xl font-bold">Soul Companions</h1>
        <div className="mt-8 glass-card p-8 text-center">
          <p className="text-sm text-muted-foreground">You don't have a pet yet.</p>
          <button className="glass-button mt-6">Adopt a Pet</button>
        </div>
      </main>
    </div>
  );
}
