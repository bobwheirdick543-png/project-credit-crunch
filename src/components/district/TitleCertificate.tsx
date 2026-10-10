import type { Asset } from '@/lib/DistrictBankContext';
import { BrandMark } from '@/components/brands/BrandMark';
import { money } from '@/lib/commerce';
import { ShieldCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TitleCertificate({ asset }: { asset: Asset }) {
  const t = asset.title;
  if (!t) return null;
  return (
    <div className="certificate glass-card p-6">
      <div className="flex items-center justify-between">
        <BrandMark name={asset.product.mark} className="size-14" />
        <ShieldCheck className="size-9 text-primary" />
      </div>
      <p className="text-xs font-semibold text-primary mt-6">SOUL LIFE · DIGITAL REGISTRY</p>
      <h2 className="text-xl font-bold mt-1">Certificate of Ownership</h2>
      <p className="text-muted-foreground text-sm">Verified vehicle title</p>
      <div className="my-4 text-2xl font-bold tracking-widest border border-primary/40 rounded-lg py-3 text-center">{t.plate}</div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Registered owner</dt><dd>{t.owner}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Vehicle</dt><dd>{t.model}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Vehicle VIN</dt><dd className="font-mono text-xs">{t.vin}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Purchase price</dt><dd className="text-primary">{money(t.price)}</dd></div>
        {t.giftedBy && <div className="flex justify-between"><dt className="text-muted-foreground">Gifted by</dt><dd>{t.giftedBy}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted-foreground">Registered</dt><dd>{new Date(t.date).toLocaleDateString()}</dd></div>
      </dl>
      <p className="text-xs text-muted-foreground break-all mt-5">Digital seal · {t.seal}</p>
      <Button
        variant="outline"
        className="w-full mt-5"
        onClick={() => {
          const file = new Blob([JSON.stringify(t, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${t.plate}-title.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        <Download className="mr-1" size={14} /> Download title
      </Button>
    </div>
  );
}
