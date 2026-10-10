import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ShieldCheck, Check, Package, X } from 'lucide-react';
import { useBank } from '@/lib/DistrictBankContext';
import { money } from '@/lib/commerce';
import { Button } from '@/components/ui/button';
import { TitleCertificate } from './TitleCertificate';

export function ReceiptPage({ category, businessId, refId }: { category: string; businessId: string; refId?: string }) {
  const bank = useBank();
  const [certificate, setCertificate] = useState<string | null>(null);
  const receipt = bank.receipts.find((r) => r.id === refId) ?? bank.receipts[0];
  const assets = receipt ? bank.assets.filter((a) => receipt.assetIds.includes(a.id)) : [];
  if (!receipt) {
    return (
      <main className="min-h-screen px-5 pt-28 text-center">
        <p>Receipt not found.</p>
        <Button className="mt-4" asChild><Link to="/market"><ArrowLeft className="mr-1" size={14}/>Back to The District</Link></Button>
      </main>
    );
  }
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-5 pt-28 text-center">
        <div className="glass-card p-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary"><Check /></div>
          <span className="text-xs font-semibold text-primary">PAYMENT VERIFIED</span>
          <h1 className="text-2xl font-bold mt-2">{receipt.heads ? 'Big heart. Big impact.' : "It's officially yours."}</h1>
          <p className="text-muted-foreground text-sm mt-1">{receipt.business}</p>
          <div className="text-2xl font-bold text-primary mt-4">{money(receipt.totals.total)}</div>
          <p className="font-mono text-xs text-muted-foreground mt-1">{receipt.id}</p>
          <dl className="mt-6 space-y-2 text-left text-sm">
            {receipt.items.map((i) => (
              <div key={i.product.id} className="flex justify-between"><dt>{i.quantity} × {i.product.name}</dt><dd>{money(i.product.price * i.quantity)}</dd></div>
            ))}
            {receipt.heads > 0 && <div className="flex justify-between"><dt>Community sponsorship</dt><dd>{receipt.heads} recipients</dd></div>}
            <div className="flex justify-between"><dt>VAT</dt><dd>{money(receipt.totals.vat)}</dd></div>
            <div className="flex justify-between"><dt>Service</dt><dd>{money(receipt.totals.service)}</dd></div>
            <div className="flex justify-between"><dt>Tip</dt><dd>{money(receipt.totals.tip)}</dd></div>
            <div className="flex justify-between"><dt>Payment</dt><dd>{receipt.payment}</dd></div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border/40"><dt>Remaining balance</dt><dd>{money(receipt.remaining)}</dd></div>
          </dl>
          {assets.filter((a) => a.product.type === 'food').map((a) => (
            <div className="mt-4 text-left glass-card p-3" key={a.id}>
              <h3 className="font-medium text-sm">{a.product.name}</h3>
              {a.status === 'consumed' ? <p className="text-primary text-xs mt-1">Enjoyed or shared ✓</p> : (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button size="sm" onClick={() => bank.consume(a.id)}>Eat Now</Button>
                  <Button size="sm" variant="outline" onClick={() => bank.saveMeal(a.id)}>Save to Vault</Button>
                  <Button size="sm" variant="ghost" onClick={() => bank.share(a.id)}>Share with the Street</Button>
                </div>
              )}
            </div>
          ))}
          {assets.filter((a) => a.title).map((a) => (
            <Button key={a.id} className="w-full mt-4" variant="outline" onClick={() => setCertificate(a.id)}><ShieldCheck size={14} className="mr-1" />View Ownership Certificate</Button>
          ))}
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link to="/profile/assets" search={{ tab: 'garage' }}><Package size={14} className="mr-1" />{assets.some((a) => a.product.type === 'car') ? 'Go to Garage' : 'View My Assets'}</Link>
          </Button>
          <Button variant="link" className="w-full mt-2" asChild>
            <Link to="/market">Back to The District <ArrowRight size={14} className="ml-1" /></Link>
          </Button>
        </div>
      </div>
      {certificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setCertificate(null)}>
          <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={() => setCertificate(null)}><X /></Button>
            {bank.assets.find((a) => a.id === certificate) && <TitleCertificate asset={bank.assets.find((a) => a.id === certificate)!} />}
          </div>
        </div>
      )}
    </main>
  );
}
