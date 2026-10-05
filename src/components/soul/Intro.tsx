import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { FlameMark } from "./Logo";

const TOP = "BLACKLISTED SOULS";

export function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const t0 = setTimeout(() => {
      const iv = setInterval(() => setTyped((n) => (n >= TOP.length ? (clearInterval(iv), n) : n + 1)), 28);
    }, 300);
    const end = setTimeout(onDone, 4000);
    return () => { clearTimeout(t0); clearTimeout(end); };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="dark relative flex flex-col items-center text-foreground"
        animate={reduce ? {} : { x: [0, 0, -2, 2, -1, 1, 0], scale: [1, 1, 1, 1.05, 1] }}
        transition={{ duration: 4, times: [0, 0.75, 0.8, 0.85, 0.88, 0.92, 0.95] }}
      >
        {/* dust */}
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="animate-rise pointer-events-none absolute h-1 w-1 rounded-full bg-primary/70"
            style={{ left: `${(i * 37) % 100 - 50}vw`, top: "60vh", animationDuration: `${3 + (i % 5)}s`, animationDelay: `${(i % 7) * 0.2}s` }}
          />
        ))}
        <motion.div
          className="absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ opacity: [0, 0, 0.8, 0.4, 0.9] }}
          transition={{ duration: 4, times: [0, 0.2, 0.4, 0.6, 0.85] }}
        />
        <p className="relative mb-4 h-5 font-mono text-xs tracking-[0.4em] text-primary sm:text-sm">
          {TOP.slice(0, typed)}
        </p>
        {/* line → brackets */}
        <motion.div
          className="relative h-px w-[min(80vw,520px)] bg-primary shadow-[0_0_12px_var(--primary)]"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1, y: [0, 0, -70] , opacity: [1, 1, 0.5]}}
          transition={{ scaleX: { delay: 0.5, duration: 0.3 }, y: { duration: 1.4, times: [0, 0.6, 1] }, opacity: { duration: 1.4 } }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, type: "spring", stiffness: 200, damping: 14 }}
          className="relative mt-6"
        >
          <FlameMark className="h-14 w-14 drop-shadow-[0_0_20px_var(--primary)]" />
        </motion.div>
        <div className="relative mt-2 flex font-display text-6xl font-bold tracking-tight sm:text-8xl">
          {"SOUL LIFE".split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: -60, opacity: 0, x: reduce ? 0 : (i % 2 ? 6 : -6) }}
              animate={{ y: 0, opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.07, type: "spring", stiffness: 380, damping: 12 }}
              className="inline-block"
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </div>
        <div className="relative mt-5 flex gap-3 font-mono text-sm tracking-[0.3em] sm:text-base">
          {"LIVE YOUR SOUL LIFE".split(" ").map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, textShadow: ["0 0 0px transparent", "0 0 18px var(--primary)", "0 0 0px transparent"] }}
              transition={{ delay: 1.8 + i * 0.22, duration: 0.5 }}
              className="text-primary"
            >
              {w}
            </motion.span>
          ))}
        </div>
        <motion.div
          className="relative mt-3 h-px w-48 bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.7, duration: 0.4 }}
        />
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onDone}
        className="dark absolute bottom-6 right-6 rounded-full border border-border px-4 py-2 font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground"
      >
        SKIP →
      </motion.button>
    </motion.div>
  );
}
