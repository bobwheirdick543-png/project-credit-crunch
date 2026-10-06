import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, ChevronDown, LogOut, Menu, X, LayoutDashboard, Map, Wallet, ShoppingBag,
  Heart, Shield, Swords, PawPrint, Layers, Trophy, User, Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { FlameMark } from "./Logo";
import { ThemeControl } from "./ThemeControl";

const links = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/map", label: "World Map", Icon: Map },
  { to: "/wallet", label: "Wallet", Icon: Wallet },
  { to: "/market", label: "Market", Icon: ShoppingBag },
  { to: "/social", label: "Social", Icon: Heart },
  { to: "/gangs", label: "Gangs", Icon: Shield },
  { to: "/arena", label: "Arena", Icon: Swords },
  { to: "/pets", label: "Pets", Icon: PawPrint },
  { to: "/cards", label: "Cards", Icon: Layers },
  { to: "/leaderboard", label: "Leaderboard", Icon: Trophy },
  { to: "/profile", label: "Profile", Icon: User },
  { to: "/settings", label: "Settings", Icon: Settings },
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
    void supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => setUnread(count ?? 0));

    const channel = supabase
      .channel(`nav-notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => {
          void supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("is_read", false)
            .then(({ count }) => setUnread(count ?? 0));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
        <nav className="glass-card mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <FlameMark className="h-6 w-6" />
              <span className="hidden font-display font-bold sm:block">SOUL LIFE</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="glass-pill px-3 py-1.5 font-mono text-xs">
              ₕ{(profile?.habz ?? 5000).toLocaleString()}
            </span>

            <Button asChild size="icon" variant="ghost" className="relative rounded-full">
              <Link to="/notifications" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              aria-label="Account menu"
              onClick={() => setAccountOpen((v) => !v)}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {(profile?.username ?? user?.email ?? "S").slice(0, 1).toUpperCase()}
              </span>
            </Button>
          </div>
        </nav>

        {accountOpen && (
          <div className="glass-card absolute right-4 top-20 z-50 w-64 p-4">
            <p className="font-semibold">{profile?.username ?? "New Soul"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            <div className="mt-4">
              <ThemeControl />
            </div>
            <Button variant="ghost" className="mt-3 w-full justify-start gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        )}
      </header>

      {/* Hamburger Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <aside
            className="glass-card h-full w-[min(88vw,20rem)] rounded-none border-y-0 border-l-0 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold">SOUL EMPIRE</span>
              <Button size="icon" variant="ghost" onClick={() => setOpen(false)} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="mt-8 grid gap-1">
              {links.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    pathname === to
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 border-t border-border pt-4">
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={logout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
