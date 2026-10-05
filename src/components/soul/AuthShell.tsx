import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import sunset from "@/assets/soul-life-sunset.jpg.asset.json";
import city from "@/assets/soul-life-city.jpg.asset.json";
import { FlameMark } from "./Logo";
import { ThemeControl } from "./ThemeControl";

export function AuthShell({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children: ReactNode }) {
  return (
    <main
      className="relative min-h-svh overflow-hidden"
      style={
        {
          "--zone-image-a": `url(${sunset.url})`,
          "--zone-image-b": `url(${city.url})`,
        } as React.CSSProperties
      }
    >
      {/* Zone A top half */}
      <div
        className="cinematic-zone-a grain-overlay vignette absolute inset-x-0 top-0 h-[60vh]"
        style={{ backgroundImage: "var(--zone-image-a)" }}
      >
        <div className="zone-blend-bottom" />
      </div>

      {/* Zone B bottom half */}
      <div
        className="cinematic-zone-b grain-overlay vignette absolute inset-x-0 bottom-0 h-[55vh]"
        style={{ backgroundImage: "var(--zone-image-b)", marginTop: 0, paddingTop: 0 }}
      >
        <div className="zone-blend-top" />
      </div>

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Link to="/" className="glass-pill flex items-center gap-2 px-4 py-2">
          <FlameMark className="h-6 w-6" />
          <span className="font-display font-bold">SOUL LIFE</span>
        </Link>
        <ThemeControl />
      </header>

      <div className="relative z-10 mx-auto grid min-h-svh max-w-6xl items-center gap-10 px-5 pb-10 pt-28 lg:grid-cols-[1fr_28rem]">
        <div className="max-w-xl text-scene-foreground">
          <p className="font-mono text-xs tracking-[0.25em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-5xl font-bold leading-none text-scene-foreground sm:text-7xl">{title}</h1>
          <p className="mt-5 max-w-md text-lg text-scene-muted">{copy}</p>
        </div>
        <section className="glass-card p-6 sm:p-8">{children}</section>
      </div>
    </main>
  );
}
