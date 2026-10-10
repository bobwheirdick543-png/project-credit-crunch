import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/data/district/catalog';
import { bill, canPay, createTitle, foodBoost, replenish, batchCost, money } from '@/lib/commerce';

export type CartItem = { product: Product; quantity: number; size?: string };
export type Asset = {
  id: string;
  product: Product;
  size?: string;
  status: 'owned' | 'pawned' | 'equipped' | 'consumed' | 'saved';
  acquiredAt?: string;
  condition?: number;
  title?: ReturnType<typeof createTitle>;
  pawn?: { loan: number; due: string };
  commercial?: boolean;
};
export type Receipt = {
  id: string;
  business: string;
  city: string;
  items: CartItem[];
  totals: ReturnType<typeof bill>;
  date: string;
  heads: number;
  payment: string;
  assetIds: string[];
  remaining: number;
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
  transactions: { id: string; name: string; amount: number; date: string }[];
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
const KEY = 'sl-district-bank-v2';

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
      transactions: [{ id: crypto.randomUUID(), name, amount: -amount, date: new Date().toISOString() }, ...s.transactions].slice(0, 40),
    }));
    return true;
  };

  const deposit = (amount: number) => {
    setState((s) => ({ ...s, balance: s.balance + amount }));
    return true;
  };

  const purchase: BankValue['purchase'] = (input) => {
    if (!input.items.length && !input.heads) return null;
    const fleet = input.fleet;
    const subtotal = input.heads
      ? batchCost(input.heads, input.tier)
      : input.items.reduce((n, i) => n + i.product.price * i.quantity, 0) * (fleet || 1);
    const totals = bill(subtotal, input.tier, input.tip, fleet === 5);
    if (!canPay(state.balance, totals.total)) {
      toast.error('Insufficient funds');
      return null;
    }
    const now = new Date().toISOString();
    const receiptId = `TXN-SL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const assets: Asset[] =
      input.heads || fleet
        ? []
        : input.items.flatMap((item) =>
            Array.from({ length: item.quantity }, () => ({
              id: crypto.randomUUID(),
              product: item.product,
              size: item.size,
              status: 'owned' as const,
              acquiredAt: now,
              ...(item.product.type === 'car'
                ? { condition: 100, title: createTitle(state.city, input.owner || state.username, item.product.name, item.product.price, input.plate) }
                : {}),
            }))
          );
    const receipt: Receipt = {
      id: receiptId,
      business: input.business,
      city: state.city,
      items: input.items,
      totals,
      date: now,
      heads: input.heads || fleet,
      payment: input.payment,
      assetIds: assets.map((a) => a.id),
      remaining: state.balance - totals.total,
    };
    setState((s) => ({
      ...s,
      balance: s.balance - totals.total,
      assets: [...assets, ...s.assets],
      receipts: [receipt, ...s.receipts].slice(0, 30),
      transactions: [{ id: receiptId, name: input.business, amount: -totals.total, date: now }, ...s.transactions].slice(0, 40),
      rep: s.rep + Math.min(80, Math.round(totals.total / 15000) + (input.heads ? input.heads * 2 : 0)),
    }));
    toast.success(`Payment verified · ${money(totals.total)}`);
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
      assets: s.assets.map((x) => (x.id === id ? { ...x, status: 'consumed' } : x)),
    }));
    toast.success('Enjoyed');
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
      saveMeal: (id) => setState((s) => ({ ...s, assets: s.assets.map((a) => (a.id === id ? { ...a, status: 'saved' } : a)) })),
      equip: (id) => setState((s) => ({ ...s, assets: s.assets.map((a) => (a.id === id ? { ...a, status: 'equipped' } : a)) })),
      share: (id) => {
        setState((s) => ({ ...s, assets: s.assets.filter((a) => a.id !== id), rep: s.rep + 15 }));
        toast.success('Shared with the street');
      },
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
