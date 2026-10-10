import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck, ShoppingBag, Plus, Minus, Gift } from 'lucide-react';
import { findBusiness, paymentMethods } from '@/data/district/catalog';
import { useBank, type CartItem } from '@/lib/DistrictBankContext';
import { money, bill, batchCost, canPay } from '@/lib/commerce';
import { Button } from '@/components/ui/button';
import { Media } from './Media';
import { NotAvailable } from './listing';

const cartKey = (city: string, id: string) => `sl-cart-${city}-${id}`;

export function Checkout({ category, businessId }: { category: string; businessId: string }) {
  const bank = useBank();
  const b = findBusiness(bank.city, category, businessId);
  const [items, setItems] = useState<CartItem[]>([]);
  const [heads, setHeads] = useState(0);
  const [tip, setTip] = useState(0);
  const [payment, setPayment] = useState(paymentMethods[0] ?? 'Soul Vault Direct Debit');
  const [owner, setOwner] = useState('');
  const [plate, setPlate] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    try { setItems(JSON.parse(sessionStorage.getItem(cartKey(bank.city, businessId)) ?? '[]')); } catch { setItems([]); }
  }, [bank.city, businessId]);
  if (!b) return <NotAvailable />;
  const validated = items.filter((i) => b.products.some((p) => p.id === i.product.id));
  const hasCar = validated.some((i) => i.product.type === 'car');
  const hasFood = validated.length > 0 && validated.every((i) => i.product.type === 'food');
  const subtotal = heads ? batchCost(heads, b.tier) : validated.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totals = bill(subtotal, b.tier, tip, false);
  const pay = () => {
    setBusy(true);
    const receipt = bank.purchase({ items: validated, business: b.name, city: bank.city, tier: b.tier, heads, fleet: 0, tip, payment, owner: owner.trim() || bank.username, plate });
    if (receipt) {
      sessionStorage.removeItem(cartKey(bank.city, businessId));
      void navigate({ to: '/market/$category/$businessId/receipt', params: { category, businessId }, search: { ref: receipt.id } });
    }
    setBusy(false);
  };
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-28">
        <Link to="/market/$category/$businessId" params={{ category, businessId }} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-primary">
          <ArrowLeft size={14} /> Back to {b.name}
        </Link>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold text-primary">SOUL VAULT · SECURE CHECKOUT</span>
            <h1 className="text-3xl font-bold mt-1">Make it yours.</h1>
            <p className="text-sm text-muted-foreground">{b.name} · {b.city}</p>
          </div>
          <ShieldCheck className="text-primary size-8" />
        </div>
        {!validated.length && !heads ? (
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto mb-2 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Your bag is empty</h2>
            <Button className="mt-4" asChild><Link to="/market/$category/$businessId" params={{ category, businessId }}>Explore the collection</Link></Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-semibold mb-4">Your bag</h2>
              {validated.map((i, index) => (
                <div key={i.product.id + index} className="glass-card flex gap-3 p-3 mb-3">
                  <Media src={i.product.image} alt={i.product.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{i.product.name}</h3>
                    {i.size && <p className="text-xs text-muted-foreground">Size {i.size}</p>}
                    <p className="text-primary text-sm">{money(i.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setItems((prev) => prev.map((x, xi) => xi === index ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x))}><Minus size={12} /></Button>
                    <span className="text-sm w-4 text-center">{i.quantity}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setItems((prev) => prev.map((x, xi) => xi === index ? { ...x, quantity: x.quantity + 1 } : x))}><Plus size={12} /></Button>
                  </div>
                </div>
              ))}
              {hasFood && (
                <div className="glass-card p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2"><Gift size={16} className="text-primary" /><h3 className="font-semibold text-sm">Treat the street</h3></div>
                  <p className="text-xs text-muted-foreground mb-3">Sponsor meals for people in {bank.city}.</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setHeads((h) => Math.max(0, h - 1))}><Minus size={12} /></Button>
                    <span className="text-sm">{heads} heads</span>
                    <Button size="icon" variant="outline" onClick={() => setHeads((h) => h + 1)}><Plus size={12} /></Button>
                  </div>
                </div>
              )}
              {hasCar && (
                <div className="glass-card p-4 mt-4 space-y-3">
                  <h3 className="font-semibold text-sm">Title details</h3>
                  <input className="glass-input" placeholder="Owner name on title" value={owner} onChange={(e) => setOwner(e.target.value)} />
                  <input className="glass-input" placeholder="Custom plate (optional)" value={plate} onChange={(e) => setPlate(e.target.value)} />
                </div>
              )}
            </div>
            <div className="glass-card p-5 h-fit sticky top-24">
              <h2 className="font-semibold mb-4">Summary</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>VAT (7.5%)</dt><dd>{money(totals.vat)}</dd></div>
                <div className="flex justify-between"><dt>Service</dt><dd>{money(totals.service)}</dd></div>
                <div className="flex justify-between items-center">
                  <dt>Tip</dt>
                  <dd className="flex gap-1">{[0, 500, 1000, 2000].map((t) => <button key={t} type="button" onClick={() => setTip(t)} className={`text-xs px-2 py-1 rounded ${tip === t ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>{t ? money(t) : 'None'}</button>)}</dd>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border/40"><dt>Total</dt><dd className="text-primary">{money(totals.total)}</dd></div>
                <div className="flex justify-between text-xs text-muted-foreground"><dt>Your balance</dt><dd>{money(bank.balance)}</dd></div>
              </dl>
              <label className="block mt-4 text-xs">Payment method
                <select className="glass-input mt-1" value={payment} onChange={(e) => setPayment(e.target.value)}>
                  {paymentMethods.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <Button className="w-full mt-4" disabled={busy || !canPay(bank.balance, totals.total)} onClick={pay}>
                {busy ? 'Processing…' : `Pay ${money(totals.total)}`}
              </Button>
              {!canPay(bank.balance, totals.total) && <p className="text-xs text-destructive mt-2">Insufficient funds</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
