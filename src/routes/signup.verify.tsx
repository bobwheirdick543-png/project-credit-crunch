import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
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
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("sl-signup-email") || "";
    setEmail(stored);

    const finishLinkVerification = async () => {
      const params = new URLSearchParams(window.location.search);
      const authCode = params.get("code");
      const authError = params.get("error_description") || params.get("error");

      if (authError) {
        toast.error(decodeURIComponent(authError.replace(/\+/g, " ")));
        return;
      }

      if (authCode) {
        setBusy(true);
        const { error } = await supabase.auth.exchangeCodeForSession(authCode);
        setBusy(false);

        if (error) {
          toast.error("This verification link is invalid or has expired.");
          return;
        }

        setConfirmed(true);
        toast.success("Your email has been confirmed.");
        sessionStorage.removeItem("sl-signup-email");
        return;
      }

      const tokenHash = params.get("token_hash");
      if (tokenHash) {
        setBusy(true);
        const { error } = await supabase.auth.verifyOtp({
          type: "email",
          token_hash: tokenHash,
        });
        setBusy(false);

        if (error) {
          toast.error("This verification link is invalid or has expired.");
          return;
        }

        setConfirmed(true);
        toast.success("Your email has been confirmed.");
        sessionStorage.removeItem("sl-signup-email");
        return;
      }

      // Supabase's client-side implicit flow can place the confirmed session
      // in the URL hash. The client consumes it automatically, so check the
      // resulting session when there is no code/token_hash in the query.
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email_confirmed_at) {
        setConfirmed(true);
        toast.success("Your email has been confirmed.");
        sessionStorage.removeItem("sl-signup-email");
        return;
      }

      if (!stored) {
        void navigate({ to: "/signup" });
      }
    };

    void finishLinkVerification();
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

    setConfirmed(true);
    toast.success("Your email has been confirmed.");
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

    toast.success("Verification email sent again.");
  };

  if (confirmed) {
    return (
      <AuthShell
        eyebrow="EMAIL CONFIRMED"
        title="You're verified."
        copy="Your email address has been successfully confirmed. Your Soul Life account is ready for the next step."
      >
        <div className="space-y-5 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <p className="text-sm text-muted-foreground">
            Your email has been confirmed successfully.
          </p>
          <button
            type="button"
            className="glass-button h-12 w-full"
            onClick={() => navigate({ to: "/signup/profile" })}
          >
            Continue to Soul Life
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="VERIFY YOUR EMAIL"
      title="Check your inbox."
      copy={`We sent a confirmation email to ${email || "your email"}. Click the Verify Email button in that message to confirm your address.`}
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
            aria-label="6-digit verification code"
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            If your email contains a verification code instead of a button, enter it here.
          </p>
        </div>

        <button type="submit" className="glass-button h-12 w-full" disabled={busy}>
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Verify & Continue
        </button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the email?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={resending || !email}
            className="font-semibold text-primary hover:underline"
          >
            {resending ? "Sending..." : "Resend email"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link to="/signup" className="font-semibold text-primary">
            Go back
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
