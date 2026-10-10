export type Venue = { id: string; name: string; kind: 'Lounge' | 'Club'; area: string; rep: number; dress: number; car: number; cover: number; perks: string[]; highRoller: { id: string; name: string; price: number; rep: number }[] };

export const venues: Venue[] = [
  { id: 'skyline-vip', name: 'Skyline VIP Lounge', kind: 'Lounge', area: 'Rooftop', rep: 1000, dress: 90000, car: 20000000, cover: 50000,
    perks: ['+15 Stamina welcome cocktail', '+50 Street Rep per visit'], highRoller: [{ id: 'sky-table', name: 'Skyline Corner Table', price: 450000, rep: 120 }] },
  { id: 'quilux-black', name: 'Quilux Black Room', kind: 'Club', area: 'Members only', rep: 2500, dress: 300000, car: 130000000, cover: 250000,
    perks: ['Skip-the-line wristband', '+150 Street Rep per visit'], highRoller: [{ id: 'quilux-bottle', name: 'Gold Reserve Bottle Parade', price: 2500000, rep: 600 }] },
  { id: 'obsidian-club', name: 'The Obsidian Club', kind: 'Club', area: 'High-roller floor', rep: 5000, dress: 2500000, car: 450000000, cover: 1000000,
    perks: ['Private host & valet', '+400 Street Rep per visit', 'High-roller table access'], highRoller: [{ id: 'obsidian-vault', name: 'Obsidian Vault Table', price: 15000000, rep: 3000 }] },
];

export type Guest = { rep: number; dressValue: number; carPrice: number; carCondition: number };
/** The bouncer checks Rep, equipped wardrobe value, and an equipped daily driver in at least 40% condition. */
export function checkEntry(g: Guest, v: Venue) {
  const reasons: string[] = [];
  if (g.rep < v.rep) reasons.push(`Street Rep ${v.rep.toLocaleString()} required`);
  if (g.dressValue < v.dress) reasons.push('Dress code not met');
  if (g.carPrice < v.car) reasons.push('Your daily driver does not meet the valet standard');
  else if (g.carCondition < 40) reasons.push('Your daily driver needs servicing');
  return { ok: reasons.length === 0, reasons };
}
