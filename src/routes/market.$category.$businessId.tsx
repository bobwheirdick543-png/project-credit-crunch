import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { abujaBusinesses } from "@/data/district/abuja";
import { formatNaira, formatNairaFull } from "@/lib/currency";
import { MapPin, Star, Search, Plus, Minus, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/market/$category/$businessId")({
  ssr: false,
  head: () => ({ meta: [{ title: "Business — The District" }] }),
  component: BusinessDetail,
});

type CartItem = { id: string; name: string; price: number; qty: number };

function BusinessDetail() {
  const { category, businessId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  const business = abujaBusinesses.find((b) => b.id === businessId);

  const filteredMenu = useMemo(() => {
    if (!business) return [];
    if (!search.trim()) return business.menu;
    const q = search.toLowerCase();
    return business.menu.filter((m) => m.name.toLowerCase().includes(q));
  }, [business, search]);

  if (!business) {
    return (
      <div className="aurora-bg flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Business not found</p>
      </div>
    );
  }

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const itemCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const goCheckout = () => {
    sessionStorage.setItem("sl-cart", JSON.stringify({ businessId, category, cart }));
    void navigate({
      to: "/market/$category/$businessId/checkout",
      params: { category, businessId },
    });
  };

  return (
    <div className="aurora-bg min-h-screen pb-28">
      <AppNav />
      <BackButton />

      {/* Hero */}
      <div className="relative h-72 w-full">
        <img src={business.imageUrl} alt={business.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <span className="absolute right-4 top-20 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {business.tier}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">{business.name}</h1>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {business.area}, {business.state}
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" /> {business.rating} ({business.visits.toLocaleString()} visits)
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{business.description}</p>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input h-11 pl-10"
          />
        </div>

        {/* Menu */}
        <div className="mt-6 glass-card p-5">
          <h2 className="mb-4 text-lg font-bold">Menu</h2>
          <div className="space-y-3">
            {filteredMenu.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {item.emoji} {item.name}
                    </p>
                    <p className="text-sm font-semibold text-primary">{formatNairaFull(item.price)}</p>
                  </div>
                  {inCart ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="glass-pill !p-1.5">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{inCart.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="glass-pill !p-1.5">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item)} className="glass-button !px-3 !py-1.5 text-xs">
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
            {filteredMenu.length === 0 && (
              <p className="text-sm text-muted-foreground">No matches. Try a different search.</p>
            )}
          </div>
        </div>
      </main>

      {/* Fixed cart bar */}
      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 p-4 backdrop-blur-xl">
          <button onClick={goCheckout} className="glass-button mx-auto flex w-full max-w-lg items-center justify-between !px-5">
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart: {itemCount} items
            </span>
            <span>{formatNairaFull(total)} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
