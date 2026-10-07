import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { FlameMark } from "./Logo";
import { ThemeControl } from "./ThemeControl";

// Public images (works on Vercel + Lovable)
const CITY_IMG = "/IMG_7492.jpeg";   // Ferris wheel / city — top
const SUNSET_IMG = "/IMG_7493.jpeg"; // Car + palms — lower

export function AuthShell({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-svh">
      {/* Background — city on top */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${CITY_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
        <Link to="/" className="glass-pill flex items-center gap-2 px-4 py-2">
          <FlameMark className="h-5 w-5" />
          <span className="font-display text-sm font-bold">SOUL LIFE</span>
        </Link>
        <ThemeControl />
      </header>

      {/* Main content — form near top */}
      <main className="relative z-10 mx-auto flex max-w-md flex-col px-5 pt-8 pb-10 sm:pt-12">
        <div className="mb-6 text-center sm:text-left">
          <p className="font-mono text-[11px] tracking-[0.25em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-white/70">{copy}</p>
        </div>

        <section className="glass-card p-5 sm:p-6">{children}</section>
      </main>

      {/* Footer — same as homepage */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <FlameMark />
              <span className="font-display text-lg font-bold text-white">Soul Life</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Live your Soul Life. A grounded Nigerian life sim built by and for the Blacklisted Souls.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Game</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><a href="/#features" className="hover:text-primary">Features</a></li>
              <li><a href="/#cities" className="hover:text-primary">Cities</a></li>
              <li><a href="/#leaderboard" className="hover:text-primary">Leaderboard</a></li>
              <li><a href="#" className="hover:text-primary">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Community</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-primary">WhatsApp</a></li>
              <li><a href="#" className="hover:text-primary">Discord</a></li>
              <li><a href="#" className="hover:text-primary">Twitter/X</a></li>
              <li><a href="#" className="hover:text-primary">Instagram</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-primary">Terms</a></li>
              <li><a href="#" className="hover:text-primary">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-white/10 px-5 py-5 text-xs text-white/50">
          <span>© 2026 Soul Life. All rights reserved.</span>
          <span>Made in Nigeria 🇳🇬</span>
        </div>
      </footer>
    </div>
  );
}
