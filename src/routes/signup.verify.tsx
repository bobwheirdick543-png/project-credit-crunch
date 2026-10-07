import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/soul/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/verify")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Verify email — Soul Life" },
      { name: "description", content: "Enter the 6-digit code sent to your email to finish creating your Soul Life account." },
    ],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sl-signup-email") || "";
    setEmail(stored);
    if (!stored) {
      void navigate({ to: "/signup", replace: true });
      return;
    }
    inputRef.current?.focus();
  }, [navigate]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }

    if (!data.session) {
      setBusy(false);
      toast.error("Verification succeeded, but no login session was returned. Please sign in.");
      return;
    }

    sessionStorage.removeItem("sl-signup-email");
    sessionStorage.removeItem("sl-signup-whatsapp");
    setBusy(false);
    toast.success("Email verified. Welcome to Soul Life.");
    await navigate({ to: "/signup/profile", replace: true });
  };

  return (
    <AuthShell
      eyebrow="VERIFY YOUR EMAIL"
      title="Enter your 6-digit code."
      copy={"We sent a 6-digit verification code to " + email + ". Enter it below to verify your email and finish signing in."}
    >
      <form onSubmit={verify} className="space-y-5">
        <div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="glass-input h-14 w-full text-center text-2xl font-mono tracking-[0.4em]"
            aria-label="6-digit verification code"
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Check your email for the 6-digit Soul Life verification code.
          </p>
        </div>

        <button type="submit" className="glass-button flex h-12 w-full items-center justify-center gap-2" disabled={busy}>
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {busy ? "Verifying..." : "Verify code"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link to="/signup" className="font-semibold text-primary">Go back</Link>
        </p>
      </form>
    </AuthShell>
  );
}
