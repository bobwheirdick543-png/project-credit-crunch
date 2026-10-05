import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  Zap, Building2, Users, Crown, Play, ChevronDown, Check, ChevronLeft, ChevronRight, Lock, MessageCircle, Monitor, Sun, Moon, ArrowRight, MapPin,
} from "lucide-react";
import { Intro } from "@/components/soul/Intro";
import { Logo, FlameMark } from "@/components/soul/Logo";
import { useTheme, type ThemePref } from "@/lib/theme";
import sunset from "@/assets/soul-life-sunset.jpg.asset.json";
import cityImage from "@/assets/soul-life-city.jpg.asset.json";
import { Link } from "@tanstack/react-router";

const StreetScene = lazy(() => import("@/components/soul/StreetScene"));

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

      {/* ZONE A */}
      <section
        className="cinematic-zone-a grain-overlay vignette relative flex min-h-[140svh] items-center overflow-hidden pb-24 pt-32"
        style={{ "--zone-image-a": `url(${sunset.url})` } as React.CSSProperties}
      >
        <div className="zone-blend-bottom" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
              ● Elevate Your Life
            </p>
            <h1 className="text-[3.25rem] font-semibold leading-[1.05] tracking-tight text-scene-foreground sm:text-6xl lg:text-7xl">
              Live Your<br />
              <span className="text-hero-gradient">Soul Life</span><br />
              in Nigeria
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-scene-muted sm:text-lg">
              From the streets to everything. Build your empire across Nigeria with premium experiences that last a lifetime.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="glass-button">
                Enter Soul Empire <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#world" className="glass-button-ghost">
                <Play className="h-4 w-4" /> Watch Story
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating stats bar - ArtVista style */}
        <div className="absolute bottom-16 left-1/2 z-10 w-full max-w-3xl -translate-x-1/2 px-5">
          <div className="glass-card flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3">
              <span className="text-lg font-semibold text-scene-foreground sm:text-xl">12K+</span>
              <span className="text-[11px] text-muted-foreground sm:text-xs">Happy Players</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3">
              <span className="text-lg font-semibold text-scene-foreground sm:text-xl">7</span>
              <span className="text-[11px] text-muted-foreground sm:text-xs">Cities</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center text-center sm:flex-row sm:gap-3">
              <span className="text-lg font-semibold text-scene-foreground sm:text-xl">4.9</span>
              <span className="text-[11px] text-muted-foreground sm:text-xs">Player Rating</span>
            </div>
          </div>
        </div>

        <a
          href="#features"
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center font-mono text-[10px] tracking-[0.2em] text-primary/80"
        >
          SCROLL
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </a>
      </section>

      {/* ZONE B */}
      <section
        className="cinematic-zone-b grain-overlay vignette relative"
        style={{ "--zone-image-b": `url(${cityImage.url})` } as React.CSSProperties}
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
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Experience</a>
          <a href="#world" className="transition-colors hover:text-foreground">World</a>
          <a href="#cities" className="transition-colors hover:text-foreground">Cities</a>
          <a href="#leaderboard" className="transition-colors hover:text-foreground">Leaderboard</a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <Link to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block">
            Login
          </Link>
          <Link to="/signup" className="glass-button !px-5 !py-2.5 text-sm">
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-scene-foreground sm:text-4xl lg:text-5xl">{title}</h2>
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
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-28">
      <Header eyebrow="What You Can Do" title="Everything. This is your life." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ I, t, d }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card glow-hover p-7"
          >
            <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
              <I className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-scene-foreground">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WorldPreview() {
  return (
    <section id="world" className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-5">
      <div className="glass-card relative h-80 overflow-hidden sm:h-[420px] lg:col-span-3">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <Suspense fallback={null}>
          <StreetScene />
        </Suspense>
      </div>
      <div className="lg:col-span-2">
        <div className="glass-card p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">Step Into The World</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-scene-foreground">A living Nigeria. Every street. Every city.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            From Ibadan to Lagos, Enugu to Abuja — explore a fully simulated Nigeria. Enter properties, meet live players, stake your claim.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {["7 cities + BS Island", "Real-time multiplayer", "Day/night cycle", "Dynamic weather"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
          <a href="#cities" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3">
            Explore the Map <ArrowRight className="h-4 w-4" />
          </a>
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
            className={i % 3 === 0 ? "fill-primary/60" : i % 3 === 1 ? "fill-secondary/40" : "fill-foreground/15"}
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
    <section id="cities" className="relative z-10 py-28">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-5">
        <Header eyebrow="Your Nigeria" title="Seven cities. One empire." />
        <div className="mb-14 hidden gap-2 sm:flex">
          <button aria-label="Previous" onClick={() => scroll(-1)} className="glass rounded-full p-3 hover:text-primary">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button aria-label="Next" onClick={() => scroll(1)} className="glass rounded-full p-3 hover:text-primary">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]"
      >
        {CITIES.map((c, i) => (
          <div key={c.n} className="glass-card glow-hover w-72 shrink-0 snap-start overflow-hidden">
            <div className="relative h-40 bg-gradient-to-b from-secondary/10 to-primary/5">
              <Skyline seed={i + 1} />
              <span className="glass absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px]">
                {c.l > 1 && <Lock className="h-3 w-3" />} LVL {c.l}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-scene-foreground">{c.n}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
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
    <section id="leaderboard" className="relative z-10 mx-auto max-w-6xl px-5 py-28">
      <Header eyebrow="Top Souls This Week" title="Who's running Nigeria?" />
      <div className="grid items-end gap-5 sm:grid-cols-3">
        {TOP.map((p, i) => (
          <div
            key={p.u}
            className={`animate-float ${p.r === 1 ? "order-first sm:order-none" : ""}`}
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <div className={`glass-card p-7 text-center ${p.r === 1 ? "glow-primary sm:pb-12 sm:pt-10" : ""}`}>
              <div className="relative mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-xl font-semibold text-primary-foreground">
                {p.u.slice(0, 2).toUpperCase()}
                <span className="absolute -bottom-1 -right-1 text-xl">{p.m}</span>
              </div>
              <p className="font-display text-lg font-semibold text-scene-foreground">{p.u}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary">{p.w}</p>
              <div className="mt-4 flex justify-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="glass flex items-center gap-1 rounded-full px-2.5 py-1">
                  <MapPin className="h-3 w-3" />
                  {p.c}
                </span>
                <span className="glass rounded-full px-2.5 py-1">LVL {p.l}</span>
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
      <div className="glass-card relative overflow-hidden p-10 text-center sm:p-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <h2 className="relative text-3xl font-semibold tracking-tight text-scene-foreground sm:text-4xl">Join the Blacklisted Souls</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Soul Life lives in our WhatsApp community. Trade, strategize, and build alliances with other Souls in real time.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:-translate-y-0.5">
            <MessageCircle className="h-4 w-4" /> Join WhatsApp
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-discord px-6 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:-translate-y-0.5">
            <Users className="h-4 w-4" /> Join Discord
          </a>
        </div>
        <p className="relative mt-6 font-mono text-xs text-primary">2,847 Souls already inside</p>
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
    <footer className="relative z-10 border-t border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <FlameMark />
            <span className="font-display text-lg font-semibold">Soul Life</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Live your Soul Life. A grounded Nigerian life sim built by and for the Blacklisted Souls.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{c.h}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#" className="transition-colors hover:text-foreground">{x}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="transition-colors hover:text-foreground">Terms</a></li>
            <li><a href="#" className="transition-colors hover:text-foreground">Privacy</a></li>
            <li>
              <button onClick={onReplay} className="mt-1 text-xs text-muted-foreground transition-colors hover:text-primary">
                Replay Intro
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-border/40 px-5 py-6 text-xs text-muted-foreground">
        <span>© 2026 Soul Life. All rights reserved.</span>
        <span>Made in Nigeria 🇳🇬</span>
      </div>
    </footer>
  );
}
