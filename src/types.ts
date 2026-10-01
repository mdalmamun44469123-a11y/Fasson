export type CategoryType = 'all' | 'wallets' | 'bags' | 'watches' | 'neckbands';

export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'wallets' | 'bags' | 'watches' | 'neckbands';
  categoryLabel: string;
  price: number; // in BDT (৳)
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  secondaryImage?: string;
  shortDescription: string;
  fullDescription: string;
  materials: string;
  dimensions: string;
  features: string[];
  variants: ProductVariant[];
  sizes?: string[];
  inStock: boolean;
  canMonogram: boolean;
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant;
  selectedSize?: string;
  quantity: number;
  monogram?: string;
}

export type Currency = 'BDT';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  zone: 'inside_dhaka' | 'outside_dhaka';
  description: string;
  costBDT: number;
  estimatedDays: string;
  carrier: string;
}
