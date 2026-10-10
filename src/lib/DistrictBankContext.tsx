import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/data/district/catalog';
import { bill, canPay, createTitle, foodBoost, replenish } from '@/lib/commerce';

export type CartItem = { id: string; name: string; price: number; qty: number; size?: string; type?: string };
export type Asset = {
  id: string;
  product: Product;
  status: 'owned' | 'pawned' | 'equipped';
  title?: ReturnType<typeof createTitle>;
  pawn?: { loan: number; due: string };
  commercial?: boolean;
};
export type Receipt = {
  id: string;
  business: string;
  city: string;
  items: CartItem[];
  total: number;
  timestamp: number;
};

type Progress = {
  balance: number;
  cash: number;
  city: string;
  username: string;
  stamina: number;
  sustenance: number;
  rep: number;
  assets: Asset[];
  receipts: Receipt[];
  transactions: { id: string; label: string; amount: number; ts: number }[];
};

type BankValue = Progress & {
  userId: string | null;
  ready: boolean;
  setCity: (city: string) => void;
  deduct: (amount: number, name?: string) => boolean;
  deposit: (amount: number) => boolean;
  purchase: (input: {
    items: CartItem[];
    business: string;
    city: string;
    tier: 'street' | 'casual' | 'luxury';
    heads: number;
    fleet: number;
    tip: number;
    payment: string;
    owner: string;
    plate: string;
  }) => Receipt | null;
  consume: (id: string) => boolean;
  saveMeal: (id: string) => void;
  equip: (id: string) => void;
  share: (id: string) => void;
  sell: (id: string) => void;
  pawn: (id: string) => void;
  redeem: (id: string) => void;
  toggleCommercial: (id: string) => void;
  service: (id: string) => void;
  guest: () => { rep: number; dressValue: number; carPrice: number; carCondition: number };
  enterVenue: (id: string) => boolean;
  highRoller: (venueId: string, itemId: string) => void;
  vip?: boolean;
  reward?: unknown;
};

const initial: Progress = {
  balance: 525_000_000,
  cash: 2_500_000,
  city: 'Abuja',
  username: 'Chief',
  stamina: 65,
  sustenance: 48,
  rep: 1250,
  assets: [],
  receipts: [],
  transactions: [],
};

const Ctx = createContext<BankValue | null>(null);
const KEY = 'sl-district-bank';

export function DistrictBankProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Progress>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const setCity = (city: string) => setState((s) => ({ ...s, city }));

  const deduct = (amount: number, name = 'Purchase') => {
    if (!canPay(state.balance, amount)) {
      toast.error('Insufficient funds');
      return false;
    }
    setState((s) => ({
      ...s,
      balance: s.balance - amount,
      transactions: [{ id: crypto.randomUUID(), label: name, amount: -amount, ts: Date.now() }, ...s.transactions].slice(0, 40),
    }));
    return true;
  };

  const deposit = (amount: number) => {
    setState((s) => ({ ...s, balance: s.balance + amount }));
    return true;
  };

  const purchase: BankValue['purchase'] = (input) => {
    const sub = input.items.reduce((a, i) => a + i.price * i.qty, 0);
    const b = bill(sub, input.tier, input.tip, input.fleet > 0);
    if (!canPay(state.balance, b.total)) {
      toast.error('Insufficient funds');
      return null;
    }
    const receipt: Receipt = {
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      business: input.business,
      city: input.city,
      items: input.items,
      total: b.total,
      timestamp: Date.now(),
    };
    const newAssets: Asset[] = input.items
      .filter((i) => i.type === 'car' || i.type === 'fashion')
      .map((i) => ({
        id: crypto.randomUUID(),
        product: {
          id: i.id,
          name: i.name,
          price: i.price,
          type: (i.type as Product['type']) || 'general',
          description: '',
        },
        status: 'owned' as const,
        title:
          i.type === 'car'
            ? createTitle(input.city, input.owner || state.username, i.name, i.price, input.plate)
            : undefined,
      }));
    setState((s) => ({
      ...s,
      balance: s.balance - b.total,
      receipts: [receipt, ...s.receipts].slice(0, 30),
      assets: [...newAssets, ...s.assets],
      rep: s.rep + Math.min(50, Math.round(b.total / 20000)),
      transactions: [{ id: receipt.id, label: input.business, amount: -b.total, ts: Date.now() }, ...s.transactions].slice(0, 40),
    }));
    toast.success(`Paid ₦${b.total.toLocaleString()} at ${input.business}`);
    return receipt;
  };

  const consume = (id: string) => {
    const a = state.assets.find((x) => x.id === id);
    if (!a) return false;
    const boost = foodBoost(a.product.price);
    setState((s) => ({
      ...s,
      sustenance: replenish(s.sustenance, boost.sustenance),
      stamina: replenish(s.stamina, boost.stamina),
      assets: s.assets.filter((x) => x.id !== id),
    }));
    return true;
  };

  const value = useMemo<BankValue>(
    () => ({
      ...state,
      userId: null,
      ready: true,
      setCity,
      deduct,
      deposit,
      purchase,
      consume,
      saveMeal: () => {},
      equip: (id) => setState((s) => ({ ...s, assets: s.assets.map((a) => (a.id === id ? { ...a, status: 'equipped' } : a)) })),
      share: () => toast('Shared'),
      sell: (id) => setState((s) => ({ ...s, assets: s.assets.filter((a) => a.id !== id) })),
      pawn: () => {},
      redeem: () => {},
      toggleCommercial: () => {},
      service: () => {},
      guest: () => ({ rep: state.rep, dressValue: 0, carPrice: 0, carCondition: 100 }),
      enterVenue: () => true,
      highRoller: () => {},
      vip: state.rep > 2000,
    }),
    [state]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBank(): BankValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('DistrictBankProvider is required');
  return ctx;
}
