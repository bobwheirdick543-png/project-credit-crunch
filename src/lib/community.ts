import { weekStart } from './commerce';

export type Contribution = { sponsor: string; city: string; amount: number; date: string };
export const rewardPaints = ['Matte Black Obsidian with Gold Flake', 'Liquid Emerald Chameleon'];
export const rewardAttire = 'Imperial Hand-Woven Aso-Oke Agbada with Gold Threading';

export function weeklyReward(contributions: Contribution[], username: string, cityTax: number, previousWeek: string, now = new Date()) {
  const week = weekStart(now);
  if (week === previousWeek) return null;
  const mine = contributions.filter(c => c.sponsor === username && c.date >= previousWeek && c.date < week);
  const total = mine.reduce((s, c) => s + c.amount, 0) + cityTax;
  if (total < 50000) return null;
  return { week, paint: rewardPaints[total >= 250000 ? 1 : 0], attire: total >= 100000 ? rewardAttire : undefined, amount: total };
}

export function lotteryDue(drops: { id: string; ends: string }[], claimed: Record<string, boolean>) {
  return drops.filter(d => !claimed[d.id] && new Date(d.ends) > new Date());
}

export function repGain(kind: 'meal' | 'fleet' | 'treat' | 'vip', amount = 0) {
  if (kind === 'vip') return 50;
  if (kind === 'fleet') return Math.min(200, Math.round(amount / 500000));
  if (kind === 'treat') return Math.min(100, Math.round(amount / 10000));
  return Math.min(40, Math.round(amount / 5000));
}
