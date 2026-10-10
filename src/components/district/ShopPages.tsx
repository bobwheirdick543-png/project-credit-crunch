import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Star, Search, ShieldCheck, ShoppingBag, Plus, Minus, X, Gift, Check, Package } from 'lucide-react';
import { categories, cityCatalog, findBusiness, paymentMethods, type Product } from '@/data/district/catalog';
import { useBank, type CartItem } from '@/lib/DistrictBankContext';
import { money, bill, batchCost, canPay } from '@/lib/commerce';
import { Button } from '@/components/ui/button';
import { Media } from './Media';
import { TitleCertificate } from './TitleCertificate';
import { toast } from 'sonner';

const cartKey = (city: string, id: string) => `sl-cart-${city}-${id}`;

export function NotAvailable() {
  return (
    <main className="min-h-screen px-5 pt-28 pb-20 text-center">
      <h1 className="text-2xl font-bold">Not in this district</h1>
      <p className="text-muted-foreground mt-2">This venue is not available in your current city.</p>
      <Button className="mt-6" asChild><Link to="/market"><ArrowLeft className="mr-1" size={14}/>Back to The District</Link></Button>
    </main>
  );
}

export function BusinessListing({ category }: { category: string }) {
  const bank = useBank();
  const [search, setSearch] = useState('');
  const cat = categories.find((c) => c.id === category);
  if (!cat) return <NotAvailable />;
  const stores = cityCatalog(bank.city).filter(
    (b) => b.category === category && `${b.name} ${b.area}`.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-28">
        <Link to="/market" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-primary">
          <ArrowLeft size={14} /> The District
        </Link>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-primary">{bank.city.toUpperCase()} · THE DISTRICT</span>
            <h1 className="text-3xl font-bold mt-1">{cat.name}</h1>
            <p className="text-sm text-muted-foreground">{cat.sub}</p>
          </div>
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className="glass-input pl-10 h-10 w-full" placeholder="Search venues or neighborhoods" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((b) => (
            <Link key={b.id} to="/market/$category/$businessId" params={{ category, businessId: b.id }} className="glass-card overflow-hidden block hover:border-primary/40 transition">
              <div className="h-40"><Media src={b.image} alt={b.name} className="h-full w-full object-cover" /></div>
              <div className="p-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-primary font-semibold">{b.tag}</span>
                  <span className="flex items-center gap-1"><Star size={12} className="text-primary" />{b.rating.toFixed(1)}</span>
                </div>
                <h2 className="font-semibold mt-1">{b.name}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={12} />{b.area}, {b.city}</p>
                <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
                  <span>{b.products.length} {category === 'car-dealerships' ? 'vehicles' : 'items'} · {b.tier}</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {!stores.length && <div className="text-center py-16 text-muted-foreground"><Search className="mx-auto mb-2" /><p>No venues match your search.</p></div>}
      </div>
    </main>
  );
}
