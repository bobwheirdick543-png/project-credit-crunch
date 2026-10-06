import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/soul/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { usernameSchema } from "@/lib/validation";

const CITIES = ["Ibadan", "Enugu", "Kano", "Port Harcourt", "Abuja", "Lagos"];

export const Route = createFileRoute("/signup/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Build your profile — Soul Life" },
      { name: "description", content: "Choose your Soul Life name and first Nigerian city." },
    ],
  }),
  component: ProfileSetup,
});

function ProfileSetup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("Ibadan");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) void navigate({ to: "/login", search: { next: "/signup/profile" } });
    });
  }, [navigate]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0]?.message ?? "Choose another username");
    }

    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      return navigate({ to: "/login", search: { next: "/signup/profile" } });
    }

    const { data: taken } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", parsed.data)
      .neq("id", user.id)
      .maybeSingle();

    if (taken) {
      setBusy(false);
      return toast.error("That username is taken");
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? sessionStorage.getItem("sl-signup-email") ?? "",
        username: parsed.data,
        whatsapp: sessionStorage.getItem("sl-signup-whatsapp"),
        city,
        habz: 5000,
        vault: 0,
        level: 1,
        xp: 0,
        soul_rating: 0,
      },
      { onConflict: "id" }
    );

    setBusy(false);
    if (error) return toast.error(error.message);
    await navigate({ to: "/signup/welcome" });
  };

  return (
    <AuthShell
      eyebrow="CREATE YOUR SOUL"
      title="Choose where it begins."
      copy="Your name becomes your identity across every street, deal and leaderboard."
    >
      <form onSubmit={save} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Username</label>
          <input
            className="glass-input h-12"
            placeholder="e.g. KingTunde"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="mt-2 text-xs text-muted-foreground">3–24 letters, numbers or underscores.</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">Starting city</p>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                  city === c
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card/50 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {city === c && <Check className="h-4 w-4" />}
                {c}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="glass-button h-12 w-full" disabled={busy}>
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Create my Soul
        </button>
      </form>
    </AuthShell>
  );
}
