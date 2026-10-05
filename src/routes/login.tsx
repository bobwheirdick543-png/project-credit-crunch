import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell } from "@/components/soul/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { emailSchema, safeNext } from "@/lib/validation";

const searchSchema = z.object({ next: z.string().optional() });
export const Route = createFileRoute("/login")({
  ssr: false, validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Sign in — Soul Life" }, { name: "description", content: "Sign in to continue your Soul Life journey." }, { property: "og:title", content: "Sign in — Soul Life" }, { property: "og:description", content: "Return to your Soul Empire." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate(); const search = Route.useSearch();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [show, setShow] = useState(false); const [remember, setRemember] = useState(true); const [busy, setBusy] = useState(false);
  const next = safeNext(search.next);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); const check = emailSchema.safeParse(email); if (!check.success) return toast.error(check.error.issues[0]?.message ?? "Check your email"); if (!password) return toast.error("Enter your password"); setBusy(true); const { error } = await supabase.auth.signInWithPassword({ email: check.data, password }); setBusy(false); if (error) return toast.error("Email or password is incorrect"); if (!remember) sessionStorage.setItem("sl-session-only", "1"); await navigate({ to: next }); };
  const google = async () => { sessionStorage.setItem("sl-auth-next", next); const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth/callback` }); if (result.error) toast.error(result.error.message); else if (!result.redirected) await navigate({ to: next }); };
  return <AuthShell eyebrow="WELCOME BACK, SOUL" title="Your empire is waiting." copy="Pick up exactly where you left off across Nigeria."><form onSubmit={submit} className="space-y-4"><div><label className="text-sm font-semibold" htmlFor="email">Email address</label><Input id="email" type="email" autoComplete="email" className="glass-input mt-2 h-12" value={email} onChange={(e) => setEmail(e.target.value)} /></div><div><div className="flex justify-between"><label className="text-sm font-semibold" htmlFor="password">Password</label><Link to="/forgot-password" className="text-sm text-primary">Forgot password?</Link></div><div className="relative mt-2"><Input id="password" type={show ? "text" : "password"} autoComplete="current-password" className="glass-input h-12 pr-12" value={password} onChange={(e) => setPassword(e.target.value)} /><Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1 rounded-full" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff /> : <Eye />}</Button></div></div><label className="flex items-center gap-2 text-sm"><Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} /> Remember me</label><Button className="glass-button h-12 w-full" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />} Sign in</Button><div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div><Button type="button" variant="outline" className="glass-button-ghost h-12 w-full" onClick={google}>Continue with Google</Button><p className="text-center text-sm text-muted-foreground">New here? <Link to="/signup" className="font-semibold text-primary">Create an account</Link></p></form></AuthShell>;
}