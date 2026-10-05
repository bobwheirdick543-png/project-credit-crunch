import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemePref = "system" | "light" | "dark";
type Ctx = { pref: ThemePref; resolved: "light" | "dark"; setPref: (p: ThemePref) => void };
const ThemeCtx = createContext<Ctx>({ pref: "system", resolved: "dark", setPref: () => {} });

export const themeInitScript = `(function(){try{var p=localStorage.getItem('sl-theme')||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark')}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setPrefState((localStorage.getItem("sl-theme") as ThemePref) || "system");
  }, []);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const d = pref === "dark" || (pref === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", d);
      setResolved(d ? "dark" : "light");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);

  const setPref = (p: ThemePref) => {
    localStorage.setItem("sl-theme", p);
    setPrefState(p);
  };
  return <ThemeCtx.Provider value={{ pref, resolved, setPref }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
