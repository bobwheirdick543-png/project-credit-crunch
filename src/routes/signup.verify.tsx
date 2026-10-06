import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/soul/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/verify")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Verify email — Soul Life" },
      { name: "description", content: "Confirm your email to continue creating your Soul." },
    ],
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sl-signup-email") || "";
    setEmail(stored);
    if (!stored) {
      void navigate({ to: "/signup" });
    }
  }, [navigate]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Email verified");
    await navigate({ to: "/signup/profile" });
  };

  const resend = async () => {
    if (!email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verification code resent");
  };

  return (
    <AuthShell
      eyebrow="VERIFY YOUR EMAIL"
      title="Check your inbox."
      copy={`We sent a 6-digit code to ${email || "your email"}. Enter it below to continue.`}
    >
      <form onSubmit={verify} className="space-y-5">
        <div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="glass-input h-14 text-center text-2xl tracking-[0.4em] font-mono"
          />
        </div>

        <button type="submit" className="glass-button h-12 w-full" disabled={busy}>
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Verify & Continue
        </button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-semibold text-primary hover:underline"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Wrong email? <Link to="/signup" className="font-semibold text-primary">Go back</Link>
        </p>
      </form>
    </AuthShell>
  );
}
