import type { Asset } from '@/lib/DistrictBankContext';
import { money } from '@/lib/commerce';

export function TitleCertificate({ asset }: { asset: Asset }) {
  const t = asset.title;
  if (!t) return null;
  return (
    <div className="title-certificate glass-card p-6">
      <p className="eyebrow text-primary">SOUL LIFE · OWNERSHIP CERTIFICATE</p>
      <h2 className="text-xl font-bold mt-2">{asset.product.name}</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt>Owner</dt><dd>{t.owner}</dd></div>
        <div className="flex justify-between"><dt>VIN</dt><dd className="font-mono text-xs">{t.vin}</dd></div>
        <div className="flex justify-between"><dt>Plate</dt><dd className="font-mono">{t.plate}</dd></div>
        <div className="flex justify-between"><dt>Value</dt><dd className="money">{money(t.price)}</dd></div>
        <div className="flex justify-between"><dt>Date</dt><dd>{new Date(t.date).toLocaleDateString()}</dd></div>
      </dl>
    </div>
  );
}
