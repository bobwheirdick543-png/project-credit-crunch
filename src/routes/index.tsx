import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  Zap, Building2, Users, Crown, Play, ChevronDown, Check, ChevronLeft, ChevronRight, Lock, MessageCircle, Monitor, Sun, Moon, ArrowRight, MapPin,
} from "lucide-react";
import { Intro } from "@/components/soul/Intro";
import { Logo, FlameMark } from "@/components/soul/Logo";
import { useTheme, type ThemePref } from "@/lib/theme";

const HeroScene = lazy(() => import("@/components/soul/HeroScene"));
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
    <div id="top">
      <AnimatePresence>{intro && <Intro onDone={done} />}</AnimatePresence>
      <Nav />
      <Hero />
      <Features />
      <WorldPreview />
      <Cities />
      <Leaderboard />
      <Community />
      <Footer onReplay={replay} />
    </div>
  );
}

const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-semibold tracking-wide text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03] glow-primary";
const btnGhost = "glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-semibold tracking-wide transition-colors hover:text-primary";

function ThemeSwitch() {
  const { pref, setPref } = useTheme();
  const opts: { v: ThemePref; I: typeof Sun; l: string }[] = [
    { v: "system", I: Monitor, l: "System" }, { v: "light", I: Sun, l: "Light" }, { v: "dark", I: Moon, l: "Dark" },
  ];
  return (
    <div className="glass flex rounded-full p-1">
      {opts.map(({ v, I, l }) => (
        <button key={v} aria-label={l} onClick={() => setPref(v)}
          className={`rounded-full p-1.5 transition-colors ${pref === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <I className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-4 pr-2">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <button className="hidden rounded-full px-4 py-2 text-sm font-semibold hover:text-primary sm:block">LOGIN</button>
          <button className="rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-105 sm:px-4 sm:text-sm">
            <span className="sm:hidden">JOIN</span><span className="hidden sm:inline">CREATE ACCOUNT</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

function Ticker() {
  const [n, setN] = useState(247);
  const [ev, setEv] = useState(12);
  useEffect(() => {
    const iv = setInterval(() => { setN((x) => x + Math.round(Math.random() * 6 - 3)); setEv((e) => Math.max(8, e + Math.round(Math.random() * 2 - 1))); }, 3000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="glass inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full px-4 py-2 font-mono text-[11px] text-muted-foreground sm:text-xs">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-whatsapp" />
      <motion.span key={n} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="truncate">
        {n} players online · Top earner: Tunde (₦2.4M) · {ev} events happening now
      </motion.span>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-sky relative flex min-h-[100svh] items-end overflow-hidden pb-20 pt-28 sm:items-center">
      <Suspense fallback={null}><HeroScene /></Suspense>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="relative mx-auto w-full max-w-6xl px-5">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="max-w-2xl">
          <p className="mb-4 font-mono text-xs tracking-[0.35em] text-primary">BLACKLISTED SOULS PRESENTS</p>
          <h1 className="text-hero-gradient text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">LIVE YOUR SOUL LIFE</h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">From the streets to everything. Build your empire across Nigeria.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#features" className={btnPrimary}><Play className="h-4 w-4 fill-current" /> ENTER SOUL EMPIRE</a>
            <button className={btnGhost}><Play className="h-4 w-4" /> WATCH TRAILER</button>
          </div>
          <div className="mt-6"><Ticker /></div>
        </motion.div>
      </div>
      <a href="#features" className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center font-mono text-[10px] tracking-widest text-muted-foreground">
        Scroll to explore
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ChevronDown className="h-5 w-5 text-primary" /></motion.span>
      </a>
    </section>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
      <p className="font-mono text-xs tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-bold sm:text-5xl">{title}</h2>
    </motion.div>
  );
}

const FEATURES = [
  { I: Zap, t: "HUSTLE", d: "Start from nothing. Grind, scramble, survive. Every naira counts." },
  { I: Building2, t: "BUILD", d: "Own businesses. Buy properties. Build an empire from the ground up." },
  { I: Users, t: "CONNECT", d: "Marry, fight, form gangs. Your relationships shape your story." },
  { I: Crown, t: "RULE", d: "Climb the leaderboard. Become a legend. Leave a legacy." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24">
      <Header eyebrow="WHAT YOU CAN DO" title="Everything. This is your life." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ I, t, d }, i) => (
          <motion.div key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="glass glow-hover rounded-3xl p-6">
            <div className="mb-6 inline-flex rounded-2xl bg-primary/15 p-3 text-primary"><I className="h-6 w-6" /></div>
            <h3 className="text-2xl font-bold">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WorldPreview() {
  return (
    <section id="world" className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 lg:grid-cols-5">
      <div className="glass relative h-80 overflow-hidden rounded-3xl sm:h-[440px] lg:col-span-3">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
        <Suspense fallback={null}><StreetScene /></Suspense>
      </div>
      <div className="lg:col-span-2">
        <p className="font-mono text-xs tracking-[0.35em] text-primary">STEP INTO THE WORLD</p>
        <h2 className="mt-3 text-4xl font-bold">A living Nigeria. Every street. Every city.</h2>
        <p className="mt-4 text-muted-foreground">From Ibadan to Lagos, Enugu to Abuja — explore a fully simulated Nigeria. Enter properties, meet live players, stake your claim.</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
          {["7 cities + BS Island", "Real-time multiplayer", "Day/night cycle", "Dynamic weather"].map((b) => (
            <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{b}</li>
          ))}
        </ul>
        <a href="#cities" className="mt-8 inline-flex items-center gap-2 font-display font-semibold text-primary hover:gap-3 transition-all">EXPLORE THE MAP <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  );
}

const CITIES = [
  { n: "IBADAN", l: 1, d: "Ancient wisdom. Slow living." },
  { n: "ENUGU", l: 3, d: "Coal city grit. Red earth." },
  { n: "KANO", l: 5, d: "Trade empire. Ancient walls." },
  { n: "PORT HARCOURT", l: 8, d: "Oil money. Industrial pulse." },
  { n: "ABUJA", l: 12, d: "Power center. Clean streets." },
  { n: "LAGOS", l: 15, d: "Hustle capital. Endless motion." },
  { n: "BS ISLAND", l: 20, d: "Endgame paradise. Private luxury." },
];

function Skyline({ seed }: { seed: number }) {
  return (
    <svg viewBox="0 0 200 90" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
      {Array.from({ length: 9 }).map((_, i) => {
        const h = 20 + ((seed * 13 + i * 29) % 55);
        return <rect key={i} x={i * 22 + 2} y={90 - h} width={18} height={h} className={i % 3 === 0 ? "fill-primary/70" : i % 3 === 1 ? "fill-secondary/50" : "fill-foreground/20"} />;
      })}
    </svg>
  );
}

function Cities() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  return (
    <section id="cities" className="py-24">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-5">
        <Header eyebrow="YOUR NIGERIA" title="Seven cities. One empire." />
        <div className="mb-12 hidden gap-2 sm:flex">
          <button aria-label="Previous" onClick={() => scroll(-1)} className="glass rounded-full p-3 hover:text-primary"><ChevronLeft className="h-5 w-5" /></button>
          <button aria-label="Next" onClick={() => scroll(1)} className="glass rounded-full p-3 hover:text-primary"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
        {CITIES.map((c, i) => (
          <div key={c.n} className="glass glow-hover w-72 shrink-0 snap-start overflow-hidden rounded-3xl">
            <div className="relative h-40 bg-gradient-to-b from-secondary/20 to-primary/10">
              <Skyline seed={i + 1} />
              <span className="glass absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 font-mono text-[11px]">
                {c.l > 1 && <Lock className="h-3 w-3" />} LVL {c.l}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-bold">{c.n}</h3>
              <p className="mt-1 text-muted-foreground">{c.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TOP = [
  { r: 2, m: "🥈", u: "AdaBoss", w: "₦12.7M", c: "Abuja", l: 18 },
  { r: 1, m: "🥇", u: "KingTunde", w: "₦18.4M", c: "Lagos", l: 20 },
  { r: 3, m: "🥉", u: "Zainab_K", w: "₦9.1M", c: "Kano", l: 16 },
];

function Leaderboard() {
  return (
    <section id="leaderboard" className="mx-auto max-w-6xl px-5 py-24">
      <Header eyebrow="TOP SOULS THIS WEEK" title="Who's running Nigeria?" />
      <div className="grid items-end gap-5 sm:grid-cols-3">
        {TOP.map((p, i) => (
          <div key={p.u} className={`animate-float ${p.r === 1 ? "order-first sm:order-none" : ""}`} style={{ animationDelay: `${i * 0.6}s` }}>
            <div className={`glass rounded-3xl p-6 text-center ${p.r === 1 ? "glow-primary sm:pb-14 sm:pt-10" : ""}`}>
              <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-2xl font-bold text-primary-foreground">
                {p.u.slice(0, 2).toUpperCase()}
                <span className="absolute -bottom-1 -right-1 text-2xl">{p.m}</span>
              </div>
              <p className="font-display text-xl font-bold">{p.u}</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary drop-shadow-[0_0_12px_var(--primary)]">{p.w}</p>
              <div className="mt-3 flex justify-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="glass flex items-center gap-1 rounded-full px-2 py-1"><MapPin className="h-3 w-3" />{p.c}</span>
                <span className="glass rounded-full px-2 py-1">LVL {p.l}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a href="#leaderboard" className="mt-10 inline-flex items-center gap-2 font-display font-semibold text-primary">See full leaderboard <ArrowRight className="h-4 w-4" /></a>
    </section>
  );
}

function Community() {
  return (
    <section id="community" className="mx-auto max-w-6xl px-5 py-24">
      <div className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-secondary/40 blur-3xl" />
        <h2 className="relative text-4xl font-bold sm:text-5xl">JOIN THE BLACKLISTED SOULS</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">Soul Life lives in our WhatsApp community. Trade, strategize, and build alliances with other Souls in real time.</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-semibold text-brand-foreground transition-transform hover:-translate-y-0.5"><MessageCircle className="h-5 w-5" /> JOIN WHATSAPP GC</a>
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-discord px-6 py-3 font-semibold text-brand-foreground transition-transform hover:-translate-y-0.5"><Users className="h-5 w-5" /> JOIN DISCORD</a>
        </div>
        <p className="relative mt-6 font-mono text-sm text-primary">2,847 Souls already inside</p>
      </div>
    </section>
  );
}

function Footer({ onReplay }: { onReplay: () => void }) {
  const cols = [
    { h: "GAME", l: ["Features", "Cities", "Leaderboard", "Roadmap"] },
    { h: "COMMUNITY", l: ["WhatsApp GC", "Discord", "Twitter/X", "Instagram"] },
  ];
  return (
    <footer className="border-t border-primary/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2"><FlameMark /><span className="font-display text-lg font-bold">SOUL LIFE</span></div>
          <p className="mt-3 text-sm text-muted-foreground">Live your Soul Life. A grounded Nigerian life sim built by and for the Blacklisted Souls.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="font-mono text-xs tracking-widest text-primary">{c.h}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{c.l.map((x) => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}</ul>
          </div>
        ))}
        <div>
          <p className="font-mono text-xs tracking-widest text-primary">LEGAL & CONTROLS</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Terms</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
            <li><button onClick={onReplay} className="glass mt-1 rounded-full px-4 py-2 text-xs text-foreground hover:text-primary">Replay Intro Animation</button></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t px-5 py-6 text-xs text-muted-foreground">
        <span>© 2026 Soul Life. All rights reserved.</span><span>Made in Nigeria 🇳🇬</span>
      </div>
    </footer>
  );
}
