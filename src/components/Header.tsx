import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, X, ChevronDown, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Currency, CategoryType } from '../types';
import { CURRENCIES } from '../data/products';

interface HeaderProps {
  currentCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  currency: Currency;
  onChangeCurrency: (curr: Currency) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateToCraft: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  currency,
  onChangeCurrency,
  searchQuery,
  onSearchChange,
  onNavigateToCraft,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Announcement bar: Bangladesh delivery details & Helpline */}
      <div className="bg-stone-900 py-1.5 px-4 text-center text-xs tracking-wider text-stone-200 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="font-medium">
          🇧🇩 Home Delivery Across Bangladesh · Inside Dhaka ৳80 · Outside Dhaka ৳145 · Cash on Delivery
        </span>
        <span className="hidden sm:inline text-stone-500">|</span>
        <span className="text-amber-400 font-semibold flex items-center gap-1">
          <span>Helpline:</span>
          <a href="tel:01712345678" className="underline hover:text-white font-mono">01712-345678</a>
        </span>
      </div>

      {/* Main 3-Zone Top Bar */}
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single element wordmark */}
        <button
          onClick={() => {
            onSelectCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="font-serif-brand text-2xl sm:text-3xl font-bold tracking-[0.28em] text-stone-900 transition-colors group-hover:text-amber-800">
            FASSON
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide">
          <button
            onClick={() => onSelectCategory('all')}
            className={`cursor-pointer transition-colors relative py-1 focus-visible:outline-none ${
              currentCategory === 'all'
                ? 'text-amber-800 font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            All Products
            {currentCategory === 'all' && (
              <motion.span
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800"
              />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('wallets')}
            className={`cursor-pointer transition-colors relative py-1 focus-visible:outline-none ${
              currentCategory === 'wallets'
                ? 'text-amber-800 font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Wallets
            {currentCategory === 'wallets' && (
              <motion.span
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800"
              />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('bags')}
            className={`cursor-pointer transition-colors relative py-1 focus-visible:outline-none ${
              currentCategory === 'bags'
                ? 'text-amber-800 font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Bags
            {currentCategory === 'bags' && (
              <motion.span
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800"
              />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('watches')}
            className={`cursor-pointer transition-colors relative py-1 focus-visible:outline-none ${
              currentCategory === 'watches'
                ? 'text-amber-800 font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Watches
            {currentCategory === 'watches' && (
              <motion.span
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800"
              />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('neckbands')}
            className={`cursor-pointer transition-colors relative py-1 focus-visible:outline-none ${
              currentCategory === 'neckbands'
                ? 'text-amber-800 font-semibold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Neckbands
            {currentCategory === 'neckbands' && (
              <motion.span
                layoutId="navUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-800"
              />
            )}
          </button>
          <button
            onClick={onNavigateToCraft}
            className="cursor-pointer text-stone-500 hover:text-stone-900 transition-colors py-1 focus-visible:outline-none"
          >
            Craftsmanship
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer rounded-lg hover:bg-stone-100 focus-visible:outline-none"
            aria-label="Toggle search bar"
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {/* Currency Display (Strictly BDT / ৳) */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-stone-900 bg-stone-100 border border-stone-300 rounded-md shadow-2xs">
            <span className="text-[10px] text-stone-500 font-semibold">CURRENCY:</span>
            <span>BDT (৳)</span>
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer rounded-lg hover:bg-stone-100 focus-visible:outline-none"
            aria-label="View wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs"
              >
                {wishlistCount}
              </motion.span>
            )}
          </button>

          {/* Cart Trigger */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCart}
            className="relative flex items-center gap-2 rounded-lg bg-stone-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors cursor-pointer focus-visible:outline-none shadow-xs"
            aria-label="View cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-stone-950 tabular-nums">
              {cartCount}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {isSearchOpen && (
        <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-3xl flex items-center relative">
            <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search FASSON wallets, duffels, watches, or titanium neckbands..."
              className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-800 focus:ring-1 focus:ring-amber-800 focus:outline-none shadow-xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Category Tab Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-stone-200 bg-white px-4 py-2 scrollbar-none gap-2">
        {(['all', 'wallets', 'bags', 'watches', 'neckbands'] as CategoryType[]).map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer capitalize ${
              currentCategory === cat
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-950 bg-stone-100'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>
    </header>
  );
};
