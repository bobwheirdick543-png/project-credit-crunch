import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FlameMark } from "./Logo";
import { ThemeControl } from "./ThemeControl";

const links = [
  ["/dashboard", "Dashboard"], ["/map", "World Map"], ["/wallet", "Wallet"], ["/market", "Market"],
  ["/social", "Social"], ["/gangs", "Gangs"], ["/arena", "Arena"], ["/pets", "Pets"],
  ["/cards", "Cards"], ["/leaderboard", "Leaderboard"], ["/profile", "Profile"], ["/settings", "Settings"],
] as const;

export function AppNav() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  useEffect(() => {
    if (!user) return;
    void supabase.from("notifications").select("id", { count: "exact", head: true }).eq("is_read", false).then(({ count }) => setUnread(count ?? 0));
    const channel = supabase.channel(`nav-notifications-${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, () => {
      void supabase.from("notifications").select("id", { count: "exact", head: true }).eq("is_read", false).then(({ count }) => setUnread(count ?? 0));
    }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [user]);
  const logout = async () => { await supabase.auth.signOut(); await navigate({ to: "/login", replace: true }); };
  return <>
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <nav className="glass-card mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full px-2 sm:px-4">
        <div className="flex items-center gap-2"><Button size="icon" variant="ghost" className="rounded-full" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></Button><Link to="/dashboard" className="flex items-center gap-2"><FlameMark className="h-6 w-6" /><span className="hidden font-display font-bold sm:block">SOUL LIFE</span></Link></div>
        <div className="flex items-center gap-2"><span className="glass-pill px-3 py-2 font-mono text-xs">ₕ{(profile?.habz ?? 5000).toLocaleString()}</span><Button asChild size="icon" variant="ghost" className="relative rounded-full"><Link to="/notifications" aria-label="Notifications"><Bell />{unread > 0 && <span className="absolute right-0 top-0 min-w-4 rounded-full bg-destructive px-1 text-[10px] text-primary-foreground">{unread}</span>}</Link></Button><Button size="icon" variant="ghost" className="rounded-full" aria-label="Account menu" onClick={() => setAccountOpen((v) => !v)}>{(profile?.username ?? user?.email ?? "S").slice(0,1).toUpperCase()}<ChevronDown className="hidden sm:block" /></Button></div>
      </nav>
      {accountOpen && <div className="glass-card absolute right-4 top-20 w-64 p-4"><p className="font-semibold">{profile?.username ?? "New Soul"}</p><p className="truncate text-xs text-muted-foreground">{user?.email}</p><div className="mt-4"><ThemeControl /></div><Button variant="ghost" className="mt-3 w-full justify-start" onClick={logout}><LogOut /> Sign out</Button></div>}
    </header>
    {open && <div className="fixed inset-0 z-50 bg-overlay" onClick={() => setOpen(false)}><aside className="glass-card h-full w-[min(88vw,22rem)] rounded-none border-y-0 border-l-0 p-4" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><span className="font-display text-xl font-bold">SOUL EMPIRE</span><Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></Button></div><nav className="mt-8 grid gap-1">{links.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${pathname === to ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>{label}</Link>)}</nav></aside></div>}
  </>;
}