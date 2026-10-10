import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, MapPin, Search, UtensilsCrossed, CarFront, Shirt, Gem, Wine, Scissors, Smartphone, BedDouble, Dumbbell, Clapperboard, ShieldCheck, Gift, Compass, X } from 'lucide-react';
import hero from '@/assets/district-abuja.jpg';
import { categories, cityCatalog } from '@/data/district/catalog';
import { useBank } from '@/lib/DistrictBankContext';
import { Button } from '@/components/ui/button';
import { Media } from './Media';

const icons: Record<string, typeof UtensilsCrossed> = { UtensilsCrossed, CarFront, Shirt, Gem, Wine, Scissors, Smartphone, BedDouble, Dumbbell, Clapperboard };

export function Hub() {
  const bank = useBank();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [cityDialog, setCityDialog] = useState(false);
  const businesses = cityCatalog(bank.city);
  const filtered = categories.filter(
    (c) =>
      (c.name + ' ' + c.sub).toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'all' ||
        (filter === 'lifestyle' && !['restaurants', 'bars-lounges'].includes(c.id)) ||
        (filter === 'food' && ['restaurants', 'bars-lounges'].includes(c.id)) ||
        (filter === 'luxury' && ['car-dealerships', 'boutiques', 'jewelry', 'hotels'].includes(c.id)))
  );

  return (
    <main className="min-h-screen pb-20">
      <section className="relative h-80 overflow-hidden">
        <img src={hero} alt="The District" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 pt-24 max-w-6xl mx-auto">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
            <MapPin size={13} />
            {bank.city.toUpperCase()} DISTRICT
          </div>
          <h1 className="text-4xl font-bold">
            The District<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Eat well. Move different. Live a little louder.
            <br />
            The best of {bank.city}, all in your world.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
              <Compass size={16} className="mr-1" />
              Explore the District
            </Button>
            <Button variant="outline" onClick={() => setCityDialog(true)}>
              <MapPin size={16} className="mr-1" />
              Change city
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pt-6">
        <div className="mb-6 flex flex-wrap gap-4 text-sm">
          <span>
            Rep <strong className="text-primary">{bank.rep}</strong>
          </span>
          <span>
            Stamina <strong>{bank.stamina}%</strong>
          </span>
          <span>
            Sustenance <strong>{bank.sustenance}%</strong>
          </span>
          <span className="text-muted-foreground">{bank.username}</span>
        </div>

        <section id="explore">
          <h2 className="text-2xl font-bold mb-2">Where do you want to go?</h2>
          <p className="text-sm text-muted-foreground mb-4">Live in {bank.city}. Everything below is filtered to your city.</p>
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="glass-input pl-10 h-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
              />
            </div>
            {['all', 'food', 'lifestyle', 'luxury'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`glass-pill px-3 py-1.5 text-xs capitalize ${
                  filter === f ? 'border-primary bg-primary/15 text-primary' : ''
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const Icon = icons[c.icon] ?? Compass;
              const count = businesses.filter((b) => b.category === c.id).length;
              return (
                <Link
                  key={c.id}
                  to="/market/$category"
                  params={{ category: c.id }}
                  className="glass-card overflow-hidden transition hover:border-primary/40"
                >
                  <div className="relative h-36">
                    <Media src={c.image} alt={c.name} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/50 p-2 backdrop-blur">
                      <Icon size={18} />
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs bg-black/50 px-2 py-0.5 rounded">
                      {count} destinations
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.sub}</p>
                    </div>
                    <ArrowUpRight size={18} className="text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="glass-card mt-8 flex flex-wrap items-center gap-4 p-5">
          <Gift className="text-primary" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Big heart. Bigger reputation.</p>
            <h3 className="font-bold">Be the reason the street eats today.</h3>
          </div>
          <Button variant="outline" asChild>
            <Link to="/market/$category" params={{ category: 'restaurants' }}>
              Treat the Street <ArrowUpRight size={14} />
            </Link>
          </Button>
        </section>

        <footer className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground pb-8">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} />
            Verified venues. Secure Soul Vault payments.
          </span>
          <span>SOUL LIFE / THE DISTRICT</span>
        </footer>
      </div>

      {cityDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setCityDialog(false)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Where's your next move?</h2>
              <Button variant="ghost" size="icon" onClick={() => setCityDialog(false)}>
                <X />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Abuja', 'Lagos', 'Port Harcourt', 'Enugu', 'Delta', 'Ibadan', 'Kano', 'Benin', 'Calabar', 'BS Island'].map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  className={bank.city === c ? 'border-primary bg-primary/15' : ''}
                  onClick={() => {
                    bank.setCity(c);
                    setCityDialog(false);
                  }}
                >
                  <MapPin size={14} className="mr-1" />
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
