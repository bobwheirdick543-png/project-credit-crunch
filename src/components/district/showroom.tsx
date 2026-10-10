import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Star, Search, ShieldCheck, ShoppingBag, Plus, X, Package } from 'lucide-react';
import { categories, findBusiness, type Product } from '@/data/district/catalog';
import { useBank, type CartItem } from '@/lib/DistrictBankContext';
import { money } from '@/lib/commerce';
import { Button } from '@/components/ui/button';
import { Media } from './Media';
import { toast } from 'sonner';
import { NotAvailable } from './listing';

const cartKey = (city: string, id: string) => `sl-cart-${city}-${id}`;

export function Showroom({ category, businessId }: { category: string; businessId: string }) {
  const bank = useBank();
  const b = findBusiness(bank.city, category, businessId);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [size, setSize] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  if (!b) return <NotAvailable />;
  const products = b.products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()));
  const add = (p: Product) => {
    if (p.sizeType && !size) { toast.error('Choose your size first'); return; }
    setCart((prev) => {
      const old = prev.find((i) => i.product.id === p.id && i.size === size);
      return old ? prev.map((i) => (i === old ? { ...i, quantity: i.quantity + 1 } : i)) : [...prev, { product: p, quantity: 1, size: size || undefined }];
    });
    setSelected(null);
    setSize('');
    toast.success(`${p.name} added to your bag`);
  };
  const checkout = () => {
    sessionStorage.setItem(cartKey(bank.city, businessId), JSON.stringify(cart));
    void navigate({ to: '/market/$category/$businessId/checkout', params: { category, businessId } });
  };
  return (
    <main className="min-h-screen pb-20">
      <section className="relative h-64 overflow-hidden">
        <Media src={b.image} alt={b.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-6 max-w-6xl mx-auto">
          <Link to="/market/$category" params={{ category }} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-2 hover:text-primary">
            <ArrowLeft size={14} />{categories.find((c) => c.id === category)?.name}
          </Link>
          <span className="text-xs font-semibold text-primary">{b.tag}</span>
          <h1 className="text-3xl font-bold">{b.name}</h1>
          <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
            <MapPin size={14} />{b.area}, {b.city}<span>·</span><Star size={14} />{b.rating.toFixed(1)}<span>·</span><ShieldCheck size={14} />Verified venue
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm">Welcome to {b.name}, {bank.username}. What can we get you today?</p>
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/profile/assets" search={{ tab: 'garage' }}><Package size={14} className="mr-1" />My Assets</Link></Button>
            {cart.length > 0 && <Button onClick={checkout}><ShoppingBag size={14} className="mr-1" />Checkout ({cart.reduce((s, i) => s + i.quantity, 0)})</Button>}
          </div>
        </div>
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className="glass-input pl-10 h-10 w-full" placeholder="Search menu / inventory" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <button key={p.id} type="button" onClick={() => setSelected(p)} className="glass-card overflow-hidden text-left hover:border-primary/40 transition">
              <div className="h-40"><Media src={p.image} alt={p.name} className="h-full w-full object-cover" /></div>
              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                <p className="text-primary font-semibold mt-2">{money(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="glass-card w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-48"><Media src={selected.image} alt={selected.name} className="h-full w-full object-cover" /><Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => setSelected(null)}><X /></Button></div>
            <div className="p-5">
              <h2 className="text-xl font-bold">{selected.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
              <p className="text-primary text-lg font-semibold mt-3">{money(selected.price)}</p>
              {selected.sizeType && (
                <div className="mt-3">
                  <p className="text-xs mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {(selected.sizeType === 'shoe' ? ['40','41','42','43','44','45'] : ['S','M','L','XL']).map((s) => (
                      <button key={s} type="button" onClick={() => setSize(s)} className={`glass-pill px-3 py-1 text-xs ${size === s ? 'border-primary bg-primary/15 text-primary' : ''}`}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <Button className="w-full mt-4" onClick={() => add(selected)}><Plus size={14} className="mr-1" />Add to bag</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
