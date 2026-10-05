import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type ThemePref } from "@/lib/theme";

export function ThemeControl() {
  const { pref, setPref } = useTheme();
  const options: Array<{ value: ThemePref; label: string; Icon: typeof Sun }> = [
    { value: "system", label: "Use system theme", Icon: Monitor },
    { value: "light", label: "Use light theme", Icon: Sun },
    { value: "dark", label: "Use dark theme", Icon: Moon },
  ];
  return <div className="glass-pill flex p-1">{options.map(({ value, label, Icon }) => <Button key={value} type="button" size="icon" variant={pref === value ? "default" : "ghost"} className="h-8 w-8 rounded-full" aria-label={label} title={label} onClick={() => setPref(value)}><Icon /></Button>)}</div>;
}