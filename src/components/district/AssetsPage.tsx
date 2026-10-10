import { useBank } from '@/lib/DistrictBankContext';
import { money } from '@/lib/commerce';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function AssetsPage({ initialTab = 'garage' }: { initialTab?: string }) {
  const bank = useBank();
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-28">
        <Link to="/market" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft size={14} /> The District
        </Link>
        <h1 className="text-3xl font-bold">My Assets</h1>
        <p className="mt-1 text-sm text-muted-foreground">Garage · Wardrobe · Vault · Balance {money(bank.balance)}</p>
        <div className="mt-6 glass-card p-6">
          {bank.assets.length === 0 ? (
            <p className="text-muted-foreground">No assets yet. Buy cars, fashion or meals in The District.</p>
          ) : (
            <ul className="space-y-3">
              {bank.assets.map((a) => (
                <li key={a.id} className="flex justify-between border-b border-border/40 pb-2">
                  <span>{a.product.name}</span>
                  <span className="text-xs text-muted-foreground">{a.status}</span>
                </li>
              ))}
            </ul>
          )}
          <Button className="mt-6" asChild><Link to="/market">Back to District</Link></Button>
        </div>
      </div>
    </main>
  );
}
