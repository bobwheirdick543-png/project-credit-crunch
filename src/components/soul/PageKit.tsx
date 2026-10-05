import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatCard({ label, value, note, Icon }: { label: string; value: string; note: string; Icon: LucideIcon }) {
  return <article className="glass-card p-5"><div className="flex items-start justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="text-primary" /></div><p className="mt-4 font-display text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></article>;
}

export function ActionCard({ title, copy, action = "Open", Icon, onClick }: { title: string; copy: string; action?: string; Icon: LucideIcon; onClick?: () => void }) {
  return <article className="glass-card flex min-h-52 flex-col p-5"><div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon /></div><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-2 flex-1 text-sm text-muted-foreground">{copy}</p><Button className="mt-5 w-full rounded-full" onClick={onClick}>{action}<ArrowRight /></Button></article>;
}

export function PillTabs({ items, active, onChange }: { items: string[]; active: string; onChange: (item: string) => void }) {
  return <div className="glass-pill mb-6 inline-flex max-w-full gap-1 overflow-x-auto p-1">{items.map((item) => <Button key={item} variant={active === item ? "default" : "ghost"} className="rounded-full" onClick={() => onChange(item)}>{item}</Button>)}</div>;
}