import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { getBusinessById } from "@/data/district";
import { formatNairaFull } from "@/lib/currency";
import { isShoe, isClothing, CLOTHING_SIZES, SHOE_SIZES } from "@/lib/sizes";
import { MapPin, Star, Search, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/market/$category/$businessId")({
  ssr: false,
  head: () => ({ meta: [{ title: "Business — The District" }] }),
  component: BusinessDetail,
});

type CartItem = { id: string; name: string; price: number; qty: number; size?: string };

function welcomeLine(category: string, name: string, username: string) {
  const who = username ? `, ${username}` : "";
  switch (category) {
    case "restaurants":
      return `Welcome to ${name}${who}! Hey — welcome to our restaurant. How may we help you today?`;
    case "bars":
      return `Welcome to ${name}${who}! What are you drinking tonight?`;
    case "salons":
      return `Welcome to ${name}${who}! How may we help you look your best today?`;
    case "boutiques":
      return `Welcome to ${name}${who}! These are the pieces we have in stock.`;
    case "jewelry":
      return `Welcome to ${name}${who}! Explore our collection.`;
    case "cars":
      return `Welcome to ${name}${who}! These are the available vehicles on our lot.`;
    case "electronics":
      return `Welcome to ${name}${who}! Latest gadgets ready for you.`;
    case "hotels":
      return `Welcome to ${name}${who}! How long will you be staying?`;
    case "gyms":
      return `Welcome to ${name}${who}! Ready to train?`;
    case "cinemas":
      return `Welcome to ${name}${who}! What's on your list tonight?`;
    default:
      return `Welcome to ${name}${who}! How may we help you today?`;
  }
}

function menuHeading(category: string) {
  switch (category) {
    case "restaurants":
      return "These are the available meals — which do you want?";
    case "bars":
      return "Drinks & bottles available";
    case "salons":
      return "Services available today";
    case "boutiques":
      return "Items in stock";
    case "jewelry":
      return "Pieces available";
    case "cars":
      return "Vehicles available on the lot";
    case "electronics":
      return "Gadgets available";
    case "hotels":
      return "Rooms & packages";
    case "gyms":
      return "Memberships & sessions";
    case "cinemas":
      return "Tickets & experiences";
    default:
      return "Menu";
  }
}

function BusinessDetail() {
  const { category, businessId } = Route.useParams();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sizePicker, setSizePicker] = useState<{ id: string; name: string; price: number } | null>(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  const business = getBusinessById(businessId);
  const username = profile?.username ?? "";

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

  const needsSize = (name: string) =>
    isShoe(name) || isClothing(name, business.category);

  const tryAdd = (item: { id: string; name: string; price: number }) => {
    if (needsSize(item.name)) {
      setSizePicker(item);
      setSelectedSize("");
      return;
    }
    addToCart(item);
  };

  const addToCart = (item: { id: string; name: string; price: number }, size?: string) => {
    const key = size ? `${item.id}-${size}` : item.id;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === key);
      if (existing) {
        return prev.map((c) => (c.id === key ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id: key, name: size ? `${item.name} (${size})` : item.name, price: item.price, qty: 1, size }];
    });
    setSizePicker(null);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)
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

  const sizeOptions = sizePicker
    ? isShoe(sizePicker.name)
      ? SHOE_SIZES.map((s) => ({ label: s, uk: s }))
      : CLOTHING_SIZES
    : [];

  return (
    <div className="aurora-bg min-h-screen pb-28">
      <AppNav />
      <BackButton />

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
        {/* Personalized welcome */}
        <div className="glass-card mb-6 p-4">
          <p className="text-sm leading-relaxed text-scene-foreground">
            {welcomeLine(business.category, business.name, username)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {business.area}, {business.state}
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" /> {business.rating} ({business.visits.toLocaleString()} visits)
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{business.description}</p>

        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input h-11 pl-10"
          />
        </div>

        <div className="mt-6 glass-card p-5">
          <h2 className="mb-4 text-lg font-bold">{menuHeading(business.category)}</h2>
          <div className="space-y-3">
            {filteredMenu.map((item) => {
              const inCart = cart.filter((c) => c.id.startsWith(item.id));
              const qty = inCart.reduce((s, c) => s + c.qty, 0);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.emoji} {item.name}</p>
                    <p className="text-sm font-semibold text-primary">{formatNairaFull(item.price)}</p>
                  </div>
                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(inCart[0].id, -1)} className="glass-pill !p-1.5">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{qty}</span>
                      <button onClick={() => tryAdd(item)} className="glass-pill !p-1.5">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => tryAdd(item)} className="glass-button !px-3 !py-1.5 text-xs">
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

      {sizePicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={() => setSizePicker(null)}>
          <div className="glass-card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{sizePicker.name}</h3>
            <p className="mt-1 text-sm text-primary">{formatNairaFull(sizePicker.price)}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizeOptions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s.label)}
                  className={`glass-pill px-3 py-1.5 text-xs ${
                    selectedSize === s.label ? "border-primary bg-primary/15 text-primary" : ""
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              className="glass-button mt-6 w-full"
              disabled={!selectedSize}
              onClick={() => {
                if (!selectedSize) {
                  toast.error("Select a size first");
                  return;
                }
                addToCart(sizePicker, selectedSize);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

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
