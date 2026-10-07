/** Format Naira with Nigerian-style separators */
export function formatNaira(amount: number): string {
  if (amount >= 1_000_000_000) return `₦ ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `₦ ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 10_000) return `₦ ${(amount / 1_000).toFixed(1)}K`;
  return `₦ ${amount.toLocaleString("en-NG")}`;
}

export function formatNairaFull(amount: number): string {
  return `₦ ${amount.toLocaleString("en-NG")}`;
}
