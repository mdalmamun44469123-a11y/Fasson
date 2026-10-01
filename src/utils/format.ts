import { Currency } from '../types';

export function formatPrice(amountBDT: number, _currency?: Currency): string {
  return `৳${Math.round(amountBDT).toLocaleString('en-IN')}`;
}
