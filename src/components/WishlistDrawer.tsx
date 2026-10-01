import React from 'react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  currency: Currency;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCartFromWishlist: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  currency,
  onRemoveFromWishlist,
  onAddToCartFromWishlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-stone-200 bg-white text-stone-900 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="border-b border-stone-200 p-5 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600 fill-rose-600" />
              <span className="font-serif-brand text-lg font-bold tracking-wider text-stone-900">
                SAVED ITEMS
              </span>
              <span className="font-mono text-xs text-stone-500">
                ({wishlist.length})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-stone-400">
                  <Heart className="h-6 w-6" />
                </div>
                <h4 className="font-serif-brand text-lg font-semibold text-stone-900">Your wishlist is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Save pieces you love by tapping the heart icon on any wallet, travel bag, or watch.
                </p>
              </div>
            ) : (
              wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 border-b border-stone-200 pb-4"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-mono text-xs text-stone-950 font-bold tabular-nums mt-1 block">
                        {formatPrice(product.price, currency)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          onAddToCartFromWishlist(product);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-stone-200 bg-stone-50">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-white border border-stone-300 hover:bg-stone-100 py-2.5 text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
