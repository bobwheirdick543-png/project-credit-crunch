import type { Product } from '@/data/district/catalog';
export const DAY = 86400000;
export const PAWN_DAYS = 7;
export function buybackCost(loan: number) { return Math.round(loan * 1.15); }
export function fleetIncome(price: number) { return Math.round(price * 0.002); }
export function pawnOffer(price: number) { return Math.round(price * 0.4); }
export function resaleValue(price: number) { return Math.round(price * 0.7); }
export function serviceCost(price: number) { return Math.round(price * 0.02); }
export function upkeepCost(price: number) { return Math.round(price * 0.005); }
export function countdown(ends: string) {
  const ms = new Date(ends).getTime() - Date.now();
  if (ms <= 0) return 'Ended';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}
