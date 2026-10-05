import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type SoulProfile = {
  id: string;
  email: string;
  username: string | null;
  whatsapp: string | null;
  city: string | null;
  avatar_path: string | null;
  habz: number;
  vault: number;
  level: number;
  xp: number;
  soul_rating: number;
};

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: SoulProfile | null;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<SoulProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const { data: current } = await supabase.auth.getUser();
    if (!current.user) {
      setProfile(null);
      return;
    }
    const { data } = await supabase.from("profiles").select("id,email,username,whatsapp,city,avatar_path,habz,vault,level,xp,soul_rating").eq("id", current.user.id).maybeSingle();
    setProfile(data as SoulProfile | null);
  };

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await refreshProfile();
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, next) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setSession(next);
      if (next) void refreshProfile();
      else setProfile(null);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  const value = useMemo(() => ({ loading, session, user: session?.user ?? null, profile, refreshProfile }), [loading, session, profile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}