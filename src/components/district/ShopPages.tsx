import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Star, ShoppingBag } from 'lucide-react';
import { categories, cityCatalog, findBusiness } from '@/data/district/catalog';
import { useBank } from '@/lib/DistrictBankContext';
import { money } from '@/lib/commerce';
import { Button } from '@/components/ui/button';
import { Media } from './Media';

export function BusinessListing({ category }: { category: string }) {
  const bank = useBank();
  const cat = categories.find(c => c.id === category);
  const businesses = cityCatalog(bank.city).filter(b => b.category === category);
  return (
    <main className="page-content min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-28">
        <Link to="/market" className="flex items-center gap-1 text-sm text-muted-foreground mb-2"><ArrowLeft size={14}/> The District</Link>
        <h1 className="text-3xl font-bold">{cat?.name ?? category}</h1>
        <p className="text-sm text-muted-foreground"><MapPin size={12} className="inline"/> {bank.city} · {businesses.length} places</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map(b => (
            <Link key={b.id} to="/market/$category/$businessId" params={{ category, businessId: b.id }} className="glass-card overflow-hidden">
              <div className="h-40"><Media src={b.image} alt={b.name} className="h-full w-full object-cover" /></div>
              <div className="p-4">
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-xs text-muted-foreground">{b.area} · {b.tier}</p>
                <p className="text-xs flex items-center gap-1 mt-1"><Star size={12} className="text-primary"/> {b.rating}</p>
              </div>
            </Link>
          ))}
          {businesses.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">No venues in this category for {bank.city} yet.</p>}
        </div>
      </div>
    </main>
  );
}

export function Showroom({ category, businessId }: { category: string; businessId: string }) {
  const bank = useBank();
  const navigate = useNavigate();
  const business = findBusiness(businessId);
  if (!business) return <main className="page-content p-8 pt-28"><p>Business not found</p><Button asChild><Link to="/market">Back</Link></Button></main>;
  return (
    <main className="page-content min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-28">
        <Link to="/market/$category" params={{ category }} className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><ArrowLeft size={14}/> Back</Link>
        <div className="glass-card mb-6 overflow-hidden">
          <Media src={business.image} alt={business.name} className="w-full h-48 object-cover" />
          <div className="p-5">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <p className="text-sm text-muted-foreground">{business.area}, {business.city} · {business.tier}</p>
            <p className="mt-2 text-sm">{business.tag}</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4">Menu / Inventory</h2>
        <div className="space-y-3">
          {business.products.map(p => (
            <div key={p.id} className="glass-card flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-primary">{money(p.price)}</p>
              </div>
              <Button size="sm" onClick={() => {
                const receipt = bank.purchase({
                  items: [{ id: p.id, name: p.name, price: p.price, qty: 1, type: p.type }],
                  business: business.name,
                  city: bank.city,
                  tier: business.tier,
                  heads: 1, fleet: 0, tip: 0, payment: 'balance', owner: bank.username, plate: '',
                });
                if (receipt) void navigate({ to: '/market/$category/$businessId/receipt', params: { category, businessId }, search: { ref: receipt.id } });
              }}><ShoppingBag size={14}/> Buy</Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function Checkout({ category, businessId }: { category: string; businessId: string }) {
  return <Showroom category={category} businessId={businessId} />;
}

export function ReceiptPage({ category, businessId, refId }: { category: string; businessId: string; refId?: string }) {
  const bank = useBank();
  const receipt = bank.receipts.find(r => r.id === refId) ?? bank.receipts[0];
  return (
    <main className="page-content max-w-md mx-auto text-center pt-28 pb-20">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold text-primary">Payment Successful</h1>
        {receipt && (
          <div className="mt-4 text-left text-sm space-y-2">
            <p>{receipt.business} · {receipt.city}</p>
            {receipt.items.map(i => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
            <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{money(receipt.total)}</span></div>
            <p className="text-xs text-muted-foreground">Balance: {money(bank.balance)}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild><Link to="/market/$category/$businessId" params={{ category, businessId }}>Back to business</Link></Button>
          <Button variant="outline" asChild><Link to="/market">Back to District</Link></Button>
        </div>
      </div>
    </main>
  );
}
