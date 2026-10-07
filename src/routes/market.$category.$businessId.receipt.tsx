import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppNav } from "@/components/soul/AppNav";
import { useAuth } from "@/lib/auth";
import { getBusinessById } from "@/data/district";
import { formatNairaFull } from "@/lib/currency";
import { consumeFood, getSustenance, getStamina } from "@/lib/stamina";
import { CheckCircle, Utensils } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/market/$category/$businessId/receipt")({
  ssr: false,
  head: () => ({ meta: [{ title: "Receipt — The District" }] }),
  component: ReceiptPage,
});

function ReceiptPage() {
  const { category, businessId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<any>(null);
  const [eaten, setEaten] = useState(false);

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/login", replace: true });
    try {
      const stored = JSON.parse(sessionStorage.getItem("sl-receipt") || "null");
      setReceipt(stored);
    } catch {}
  }, [loading, user, navigate]);

  const business = getBusinessById(businessId);
  const isFood = business?.category === "restaurants" || business?.category === "bars";

  if (!receipt || !business) {
    return (
      <div className="aurora-bg flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No receipt found</p>
      </div>
    );
  }

  const handleEat = () => {
    const avgPrice =
      receipt.cart?.length > 0
        ? receipt.cart.reduce((s: number, c: any) => s + c.price * c.qty, 0) /
          receipt.cart.reduce((s: number, c: any) => s + c.qty, 0)
        : 5000;

    const result = consumeFood(avgPrice);
    if (!result.ok) {
      toast.error(result.message, {
        action: {
          label: "Throw Away",
          onClick: () => {
            toast("A hungry Soul picked it up. Karma +1.");
            setEaten(true);
          },
        },
      });
      return;
    }
    toast.success(result.message);
    setEaten(true);
  };

  return (
    <div className="aurora-bg min-h-screen pb-20">
      <AppNav />
      <main className="mx-auto max-w-md px-5 pt-28">
        <div className="glass-card p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold">PAYMENT SUCCESSFUL</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {business.name} · {business.area}
          </p>

          <div className="mt-6 space-y-2 text-left text-sm">
            {receipt.cart?.map((c: any) => (
              <div key={c.id} className="flex justify-between">
                <span>
                  {c.name} × {c.qty}
                </span>
                <span>{formatNairaFull(c.price * c.qty)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatNairaFull(receipt.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT</span>
                <span>{formatNairaFull(receipt.vat)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service</span>
                <span>{formatNairaFull(receipt.service)}</span>
              </div>
              <div className="mt-1 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatNairaFull(receipt.total)}</span>
              </div>
            </div>

            {receipt.payMode === "everyone" && (
              <p className="mt-3 rounded-xl bg-primary/10 p-3 text-center text-xs text-primary">
                You treated {receipt.capacity} Souls today. Legendary.
              </p>
            )}

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>New balance</span>
                <span className="font-semibold text-foreground">{formatNairaFull(receipt.newBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span>{receipt.txId}</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span>{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Eat Now for food */}
          {isFood && !eaten && (
            <button onClick={handleEat} className="glass-button mt-6 w-full">
              <Utensils className="h-4 w-4" /> Eat Now
            </button>
          )}
          {eaten && (
            <p className="mt-4 text-xs text-primary">
              Sustenance {getSustenance()}% · Stamina {getStamina()}%
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/market/$category/$businessId"
              params={{ category, businessId }}
              className="glass-button-ghost w-full text-center"
            >
              Back to Business
            </Link>
            <Link to="/market" className="glass-button-ghost w-full text-center">
              Back to District
            </Link>
            <Link to="/dashboard" className="glass-button w-full text-center">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
