import { Link } from '@tanstack/react-router';
import { ArrowLeft, Lock, MapPin } from 'lucide-react';
import { useBank } from '@/lib/DistrictBankContext';
import { Button } from '@/components/ui/button';

export function NightlifePage() {
  const bank = useBank();
  const guest = bank.guest();
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-6xl px-5 pt-28">
        <Link to="/market" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft size={14} /> The District</Link>
        <h1 className="text-3xl font-bold">District Nightlife</h1>
        <p className="mt-1 text-sm text-muted-foreground"><MapPin size={12} className="inline" /> {bank.city} · Status-gated lounges</p>
        <div className="mt-6 glass-card p-6">
          <p className="text-sm">Your Rep: <strong className="text-primary">{guest.rep}</strong></p>
          <p className="mt-2 text-sm text-muted-foreground">VIP lounges and clubs open based on your Street Rep, dress code and daily driver.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {['Velvet Room', 'Sky Lounge', 'After Dark Club', 'BS Island VIP'].map(name => (
              <button key={name} className="glass-card flex items-center justify-between p-4 text-left" onClick={() => bank.enterVenue(name)}>
                <span className="font-semibold">{name}</span>
                {guest.rep < 500 ? <Lock size={16} className="text-muted-foreground" /> : <span className="text-xs text-primary">Open</span>}
              </button>
            ))}
          </div>
          <Button className="mt-6" asChild><Link to="/market">Back to District</Link></Button>
        </div>
      </div>
    </main>
  );
}
