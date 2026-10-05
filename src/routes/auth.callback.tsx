import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { safeNext } from "@/lib/validation";

export const Route = createFileRoute("/auth/callback")({ ssr: false, head: () => ({ meta: [{ title: "Completing sign in — Soul Life" }, { name: "description", content: "Completing your secure Soul Life sign in." }, { property: "og:title", content: "Completing sign in — Soul Life" }, { property: "og:description", content: "Completing your secure sign in." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Callback });
function Callback() { const navigate = useNavigate(); useEffect(() => { const finish = async () => { const { data } = await supabase.auth.getSession(); const next = safeNext(sessionStorage.getItem("sl-auth-next")); sessionStorage.removeItem("sl-auth-next"); await navigate({ to: data.session ? next : "/login", replace: true }); }; void finish(); }, [navigate]); return <div className="aurora-bg flex min-h-svh items-center justify-center"><LoaderCircle className="h-9 w-9 animate-spin text-primary" /><span className="sr-only">Completing sign in</span></div>; }