import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowUpRight, ArrowRight, MapPin, Search, SlidersHorizontal,
  UtensilsCrossed, CarFront, Shirt, Gem, Wine, Scissors, Smartphone,
  BedDouble, Dumbbell, Clapperboard, Sparkles, ShieldCheck, Gift,
  Zap, Flame, Compass, X, Trophy,
} from 'lucide-react';
import hero from '@/assets/district-abuja.jpg';
import { categories, cityCatalog } from '@/data/district/catalog';
import { useBank } from '@/lib/DistrictBankContext';
import { Button } from '@/components/ui/button';
import { Media } from './Media';

const icons: Record<string, typeof UtensilsCrossed> = {
  UtensilsCrossed, CarFront, Shirt, Gem, Wine, Scissors, Smartphone, BedDouble, Dumbbell, Clapperboard,
};

export function Hub() {
  const bank = useBank();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('featured');
  const [nearby, setNearby] = useState('All neighborhoods');
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
  const ordered = sort === 'az' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered;

  const openCategory = (categoryId: string) => {
    void navigate({ to: '/market/$category', params: { category: categoryId } });
  };

  return (
    <main className="hub-main min-h-screen pb-20">
      <section className="district-hero relative h-80 overflow-hidden">
        <img
          src={hero}
          alt="The District"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1024}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-8 pt-24 max-w-6xl mx-auto">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <MapPin size={13} />
            {bank.city.toUpperCase()} DISTRICT · YOUR CITY. YOUR LIFESTYLE.
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
              <ArrowRight size={16} className="ml-1" />
            </Button>
            <Button variant="outline" onClick={() => setCityDialog(true)}>
              <MapPin size={16} className="mr-1" />
              Change city
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 pt-6">
        <section className="glass-card mb-6 flex flex-wrap items-center gap-4 p-4">
          <div className="flex-1">
            <strong>Good to see you, {bank.username}.</strong>
            <p className="text-xs text-muted-foreground">What's the move today?</p>
          </div>
          <div className="flex gap-4 text-sm">
            <span>
              <Zap size={14} className="inline text-primary" /> Stamina <strong>{bank.stamina}%</strong>
            </span>
            <span>
              <Flame size={14} className="inline text-primary" /> Sustenance <strong>{bank.sustenance}%</strong>
            </span>
            <span>
              <Sparkles size={14} className="inline text-primary" /> Rep <strong>{bank.rep.toLocaleString()}</strong>
            </span>
          </div>
          <Link to="/profile/assets" search={{ tab: 'garage' }} className="text-sm text-primary flex items-center gap-1">
            My Assets
            <ArrowUpRight size={14} />
          </Link>
        </section>

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
            <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={14} />
              Filters
            </Button>
            {['all', 'food', 'lifestyle', 'luxury'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`glass-pill px-3 py-1.5 text-xs capitalize ${filter === f ? 'border-primary bg-primary/15 text-primary' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="glass-card mb-4 flex flex-wrap gap-4 p-4 text-sm">
              <label>
                Sort{' '}
                <select className="glass-input ml-2" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="az">A–Z</option>
                </select>
              </label>
              <label>
                Area{' '}
                <select className="glass-input ml-2" value={nearby} onChange={(e) => setNearby(e.target.value)}>
                  <option>All neighborhoods</option>
                  {[...new Set(businesses.map((b) => b.area))].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((c) => {
              const Icon = icons[c.icon] ?? Compass;
              const count = businesses.filter(
                (b) => b.category === c.id && (nearby === 'All neighborhoods' || b.area === nearby)
              ).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openCategory(c.id)}
                  className="glass-card overflow-hidden transition hover:border-primary/40 block text-left w-full cursor-pointer"
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
                </button>
              );
            })}
          </div>

          {ordered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="mx-auto mb-2" />
              <p>No districts found</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </section>

        <section className="glass-card mt-8 flex flex-wrap items-center gap-4 p-5">
          <Gift className="text-primary" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Big heart. Bigger reputation.</p>
            <h3 className="font-bold">Be the reason the street eats today.</h3>
          </div>
          <Button variant="outline" onClick={() => openCategory('restaurants')}>
            Treat the Street <ArrowUpRight size={14} />
          </Button>
        </section>

        <footer className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground pb-8">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} />
            Verified venues. Secure Soul Vault payments.
          </span>
          <span>SOUL LIFE / THE DISTRICT</span>
          <Link to="/leaderboard" className="flex items-center gap-1">
            <Trophy size={14} />
            The giving board
          </Link>
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
