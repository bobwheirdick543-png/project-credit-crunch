import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import {
  Zap, Building2, Users, Crown, ChevronDown, Check, ChevronLeft, ChevronRight, Lock, MessageCircle, Monitor, Sun, Moon, ArrowRight, MapPin,
} from "lucide-react";
import { Intro } from "@/components/soul/Intro";
import { Logo, FlameMark } from "@/components/soul/Logo";
import { useTheme, type ThemePref } from "@/lib/theme";
import { Link } from "@tanstack/react-router";

const StreetScene = lazy(() => import("@/components/soul/StreetScene"));

// Public folder images (works on both Lovable and Vercel)
const SUNSET_IMG = "/IMG_7493.jpeg"; // car + palms + sunset (Zone A)
const CITY_IMG = "/IMG_7492.jpeg";   // ferris wheel + city reflection (Zone B)

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "SOUL LIFE — Live Your Soul Life | Nigerian Life Simulation" },
      { name: "description", content: "From the streets to everything. Build your empire across seven Nigerian cities and BS Island in Soul Life by Blacklisted Souls." },
      { property: "og:title", content: "SOUL LIFE — Live Your Soul Life" },
      { property: "og:description", content: "A grounded Nigerian life simulation. Hustle, build, connect and rule across Nigeria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const INTRO_KEY = "sl-intro-seen";

function Home() {
  const [intro, setIntro] = useState(() => {
    const t = Number(localStorage.getItem(INTRO_KEY) || 0);
    return Date.now() - t > 24 * 3600 * 1000;
  });
  const done = useCallback(() => { localStorage.setItem(INTRO_KEY, String(Date.now())); setIntro(false); }, []);
  const replay = () => { window.scrollTo({ top: 0 }); setIntro(true); };

  return (
    <div id="top" className="relative">
      <AnimatePresence>{intro && <Intro onDone={done} />}</AnimatePresence>
      <Nav />

      {/* ZONE A - Sunset / Car + Palms */}
      <section
        className="cinematic-zone-a relative flex min-h-[100svh] items-center overflow-hidden pb-32 pt-32 sm:min-h-[110svh]"
        style={{ "--zone-image-a": `url(${SUNSET_IMG})` } as React.CSSProperties}
      >
        <div className="zone-blend-bottom" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="hero-copy-scrim py-6">
              <p className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.28em] text-primary sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" /> ELEVATE YOUR LIFE
              </p>

              <h1 className="text-5xl font-bold leading-[1.04] text-scene-foreground sm:text-7xl lg:text-8xl">
                Live Your<br />
                <span className="text-hero-gradient">Soul Life</span><br />
                in Nigeria
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-relaxed text-scene-muted sm:text-xl">
                From the streets to everything. Build your empire across Nigeria with premium experiences that last a lifetime.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/signup" className="glass-button min-h-14 px-8 text-base">
                  Enter Soul Empire <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#features" className="glass-button-ghost min-h-14 px-8 text-scene-foreground">
                  Explore the world <ChevronDown className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-10 w-full max-w-3xl -translate-x-1/2 px-5">
          <div className="glass-card grid grid-cols-3 items-center px-4 py-5 sm:px-8">
            {[
              { v: "12K+", l: "Happy Players" },
              { v: "7", l: "Cities" },
              { v: "4.9", l: "Player Rating" },
            ].map((s, i) => (
              <div key={s.l} className={`flex min-w-0 flex-col items-center px-2 text-center ${i > 0 ? "border-l border-primary/25" : ""}`}>
                <span className="text-2xl font-bold text-scene-foreground sm:text-3xl">{s.v}</span>
                <span className="mt-1 text-[10px] text-scene-muted sm:text-xs">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONE B - City / Ferris wheel */}
      <section
        className="cinematic-zone-b relative"
        style={{ "--zone-image-b": `url(${CITY_IMG})` } as React.CSSProperties}
      >
        <div className="zone-blend-top" />

        <Features />
        <WorldPreview />
        <Cities />
        <Leaderboard />
        <Community />
        <Footer onReplay={replay} />
      </section>
    </div>
  );
}

function ThemeSwitch() {
  const { pref, setPref } = useTheme();
  const opts: { v: ThemePref; I: typeof Sun; l: string }[] = [
    { v: "system", I: Monitor, l: "System" },
    { v: "light", I: Sun, l: "Light" },
    { v: "dark", I: Moon, l: "Dark" },
  ];
  return (
    <div className="glass flex rounded-full p-1">
      {opts.map(({ v, I, l }) => (
        <button
          key={v}
          aria-label={l}
          onClick={() => setPref(v)}
          className={`rounded-full p-1.5 transition-colors ${pref === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <I className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="glass-card mx-auto flex max-w-5xl items-center justify-between rounded-full px-5 py-2.5">
        <Logo />
        <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-primary">Experience</a>
          <a href="#world" className="transition-colors hover:text-primary">World</a>
          <a href="#cities" className="transition-colors hover:text-primary">Cities</a>
          <a href="#leaderboard" className="transition-colors hover:text-primary">Leaderboard</a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:block">
            Login
          </Link>
          <Link to="/signup" className="glass-button px-5 py-2.5 text-sm">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-scene-foreground sm:text-4xl lg:text-5xl">{title}</h2>
    </motion.div>
  );
}

const FEATURES = [
  { I: Zap, t: "Hustle", d: "Start from nothing. Grind, scramble, survive. Every Habz counts." },
  { I: Building2, t: "Build", d: "Own businesses. Buy properties. Build an empire from the ground up." },
  { I: Users, t: "Connect", d: "Marry, fight, form gangs. Your relationships shape your story." },
  { I: Crown, t: "Rule", d: "Climb the leaderboard. Become a legend. Leave a legacy." },
];

function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
      <Header eyebrow="What You Can Do" title="Everything. This is your life." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ I, t, d }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card glow-hover p-6"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-primary/15 p-3 text-primary">
              <I className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-scene-foreground">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WorldPreview() {
  return (
    <section id="world" className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-5">
      <div className="glass-card relative h-80 overflow-hidden sm:h-[400px] lg:col-span-3">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
        <Suspense fallback={null}>
          <StreetScene />
        </Suspense>
      </div>
      <div className="lg:col-span-2">
        <div className="glass-card p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">Step Into The World</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-scene-foreground sm:text-3xl">A living Nigeria. Every street. Every city.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            From Ibadan to Lagos, Enugu to Abuja — explore a fully simulated Nigeria. Enter properties, meet live players, stake your claim.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-2.5 text-sm">
            {["7 cities + BS Island", "Real-time multiplayer", "Day/night cycle", "Dynamic weather"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
          <Link to="/map" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3">
            Explore the Map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const CITIES = [
  { n: "Ibadan", l: 1, d: "Ancient wisdom. Slow living." },
  { n: "Enugu", l: 3, d: "Coal city grit. Red earth." },
  { n: "Kano", l: 5, d: "Trade empire. Ancient walls." },
  { n: "Port Harcourt", l: 8, d: "Oil money. Industrial pulse." },
  { n: "Abuja", l: 12, d: "Power center. Clean streets." },
  { n: "Lagos", l: 15, d: "Hustle capital. Endless motion." },
  { n: "BS Island", l: 20, d: "Endgame paradise. Private luxury." },
];

function Skyline({ seed }: { seed: number }) {
  return (
    <svg viewBox="0 0 200 90" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
      {Array.from({ length: 9 }).map((_, i) => {
        const h = 20 + ((seed * 13 + i * 29) % 55);
        return (
          <rect
            key={i}
            x={i * 22 + 2}
            y={90 - h}
            width={18}
            height={h}
            className={i % 3 === 0 ? "fill-primary/50" : i % 3 === 1 ? "fill-secondary/40" : "fill-foreground/15"}
          />
        );
      })}
    </svg>
  );
}

function Cities() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  return (
    <section id="cities" className="relative z-10 py-24">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-5">
        <Header eyebrow="Your Nigeria" title="Seven cities. One empire." />
        <div className="mb-12 hidden gap-2 sm:flex">
          <button aria-label="Previous" onClick={() => scroll(-1)} className="glass rounded-full p-2.5 hover:text-primary">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button aria-label="Next" onClick={() => scroll(1)} className="glass rounded-full p-2.5 hover:text-primary">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
      >
        {CITIES.map((c, i) => (
          <div key={c.n} className="glass-card glow-hover w-68 shrink-0 snap-start overflow-hidden sm:w-72">
            <div className="relative h-36 bg-gradient-to-b from-primary/10 to-secondary/10">
              <Skyline seed={i + 1} />
              <span className="glass absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px]">
                {c.l > 1 && <Lock className="h-3 w-3" />} LVL {c.l}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-scene-foreground">{c.n}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TOP = [
  { r: 2, m: "🥈", u: "AdaBoss", w: "ₕ12.7M", c: "Abuja", l: 18 },
  { r: 1, m: "🥇", u: "KingTunde", w: "ₕ18.4M", c: "Lagos", l: 20 },
  { r: 3, m: "🥉", u: "Zainab_K", w: "ₕ9.1M", c: "Kano", l: 16 },
];

function Leaderboard() {
  return (
    <section id="leaderboard" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
      <Header eyebrow="Top Souls This Week" title="Who's running Nigeria?" />
      <div className="grid items-end gap-5 sm:grid-cols-3">
        {TOP.map((p, i) => (
          <div
            key={p.u}
            className={`animate-float ${p.r === 1 ? "order-first sm:order-none" : ""}`}
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <div className={`glass-card p-6 text-center ${p.r === 1 ? "glow-primary sm:pb-10 sm:pt-8" : ""}`}>
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-lg font-bold text-white">
                {p.u.slice(0, 2).toUpperCase()}
                <span className="absolute -bottom-1 -right-1 text-lg">{p.m}</span>
              </div>
              <p className="font-display text-base font-bold text-scene-foreground">{p.u}</p>
              <p className="mt-1 font-display text-xl font-bold text-primary">{p.w}</p>
              <div className="mt-3 flex justify-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span className="glass flex items-center gap-1 rounded-full px-2 py-0.5">
                  <MapPin className="h-3 w-3" />
                  {p.c}
                </span>
                <span className="glass rounded-full px-2 py-0.5">LVL {p.l}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="community" className="relative z-10 mx-auto max-w-6xl px-5 py-20">
      <div className="glass-card relative overflow-hidden p-9 text-center sm:p-14">
        <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <h2 className="relative text-2xl font-bold tracking-tight text-scene-foreground sm:text-4xl">Join the Blacklisted Souls</h2>
        <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Soul Life lives in our WhatsApp community. Trade, strategize, and build alliances with other Souls in real time.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            <MessageCircle className="h-4 w-4" /> Join WhatsApp
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-discord px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            <Users className="h-4 w-4" /> Join Discord
          </a>
        </div>
        <p className="relative mt-5 font-mono text-xs text-primary">2,847 Souls already inside</p>
      </div>
    </section>
  );
}

function Footer({ onReplay }: { onReplay: () => void }) {
  const cols = [
    { h: "Game", l: ["Features", "Cities", "Leaderboard", "Roadmap"] },
    { h: "Community", l: ["WhatsApp", "Discord", "Twitter/X", "Instagram"] },
  ];
  return (
    <footer className="relative z-10 border-t border-primary/20 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <FlameMark />
            <span className="font-display text-lg font-bold">Soul Life</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Live your Soul Life. A grounded Nigerian life sim built by and for the Blacklisted Souls.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{c.h}</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#" className="transition-colors hover:text-primary">{x}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="transition-colors hover:text-primary">Terms</a></li>
            <li><a href="#" className="transition-colors hover:text-primary">Privacy</a></li>
            <li>
              <button onClick={onReplay} className="mt-1 text-xs text-muted-foreground transition-colors hover:text-primary">
                Replay Intro
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-primary/15 px-5 py-5 text-xs text-muted-foreground">
        <span>© 2026 Soul Life. All rights reserved.</span>
        <span>Made in Nigeria 🇳🇬</span>
      </div>
    </footer>
  );
}
