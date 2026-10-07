import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { BackButton } from "@/components/soul/BackButton";
import { useAuth } from "@/lib/auth";
import { useBank } from "@/lib/BankContext";
import { abujaBusinesses } from "@/data/district/abuja";
import { formatNairaFull } from "@/lib/currency";
import { toast } from "sonner";

export const Route = createFileRoute("/market/$category/$businessId/checkout")({
  ssr: false,
  head: () => ({ meta: [{ title: "Checkout — The District" }] }),
  component: CheckoutPage,
});

type CartItem = { id: string; name: string; price: number; qty: number };

function CheckoutPage() {
  const { category, businessId } = Route.useParams();
  const { user, loading } = useAuth();
  const { balance, deduct } = useBank();
  const navigate = useNavigate();
  const [payMode, setPayMode] = useState<"self" | "everyone">("self");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
    try {
      const stored = JSON.parse(sessionStorage.getItem("sl-cart") || "{}");
      if (stored.businessId === businessId && stored.cart) {
        setCart(stored.cart);
      }
    } catch {}
  }, [loading, user, navigate, businessId]);

  const business = abujaBusinesses.find((b) => b.id === businessId);
  if (!business) {
    return <div className="flex min-h-screen items-center justify-center">Business not found</div>;
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const vat = Math.round(subtotal * 0.075);
  const serviceRate = business.tier === "Luxury" ? 0.1 : business.tier === "Premium" ? 0.075 : 0.05;
  const service = Math.round(subtotal * serviceRate);

  const avgSpend =
    business.menu.length > 0
      ? Math.round(business.menu.reduce((s, m) => s + m.price, 0) / business.menu.length)
      : 0;
  const everyoneTotal = business.capacity * avgSpend;

  const total = payMode === "self" ? subtotal + vat + service : everyoneTotal;
  const canPay = balance >= total;

  const pay = () => {
    if (!canPay) {
      toast.error(`Not enough Naira. You need ${formatNairaFull(total - balance)} more.`);
      return;
    }
    const ok = deduct(total, business.name);
    if (!ok) {
      toast.error("Payment failed");
      return;
    }
    sessionStorage.setItem(
      "sl-receipt",
      JSON.stringify({
        businessId,
        category,
        cart,
        payMode,
        subtotal,
        vat,
        service,
        total,
        newBalance: balance - total,
        capacity: business.capacity,
        timestamp: Date.now(),
        txId: crypto.randomUUID().slice(0, 8).toUpperCase(),
      })
    );
    void navigate({
      to: "/market/$category/$businessId/receipt",
      params: { category, businessId },
    });
  };

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <BackButton />
      <main className="mx-auto max-w-lg px-5 pt-28">
        <h1 className="text-2xl font-bold">CHECKOUT</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {business.name} · {business.area}
        </p>

        {/* Itemized bill */}
        <div className="mt-6 glass-card p-5">
          {cart.map((c) => (
            <div key={c.id} className="flex justify-between border-b border-border/40 py-2 text-sm">
              <span>
                {c.name} × {c.qty}
              </span>
              <span className="font-medium">{formatNairaFull(c.price * c.qty)}</span>
            </div>
          ))}
          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatNairaFull(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT (7.5%)</span>
              <span>{formatNairaFull(vat)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service ({(serviceRate * 100).toFixed(0)}%)</span>
              <span>{formatNairaFull(service)}</span>
            </div>
          </div>
        </div>

        {/* Pay mode */}
        <div className="mt-4 glass-card space-y-3 p-5">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="payMode"
              checked={payMode === "self"}
              onChange={() => setPayMode("self")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Pay for Myself</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="payMode"
              checked={payMode === "everyone"}
              onChange={() => setPayMode("everyone")}
              className="accent-primary"
            />
            <div>
              <span className="text-sm font-medium">Pay for Everyone</span>
              <p className="text-xs text-muted-foreground">
                {business.capacity} customers × {formatNairaFull(avgSpend)} avg = {formatNairaFull(everyoneTotal)}
              </p>
            </div>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your balance</span>
          <span className="font-semibold text-primary">{formatNairaFull(balance)}</span>
        </div>

        <button
          onClick={pay}
          disabled={!canPay || cart.length === 0}
          className="glass-button mt-6 w-full"
        >
          Pay {formatNairaFull(total)}
        </button>

        {!canPay && cart.length > 0 && (
          <p className="mt-2 text-center text-xs text-destructive">
            Not enough Naira. You need {formatNairaFull(total - balance)} more.
          </p>
        )}
      </main>
    </div>
  );
}
