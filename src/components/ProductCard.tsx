import React, { useState } from 'react';
import { Heart, Eye, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, selectedSize?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [imageError, setImageError] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(
      {
        ...product,
        variants: [selectedVariant, ...product.variants.filter((v) => v.id !== selectedVariant.id)],
      },
      selectedSize
    );
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col rounded-xl border border-stone-200 bg-white overflow-hidden transition-shadow duration-300 hover:border-stone-400 hover:shadow-xl cursor-pointer"
    >
      {/* Visual Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-500">
            <span className="text-xs uppercase tracking-wider">{product.name}</span>
          </div>
        )}

        {/* Quiet badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-900 rounded border border-stone-200 shadow-2xs">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-stone-600 hover:text-stone-950 border border-stone-200 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </motion.button>

        {/* Quick View Overlay Button on Desktop Hover */}
        <div
          className={`absolute inset-x-3 bottom-3 flex gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-white/95 backdrop-blur-md py-2 px-3 text-xs font-medium text-stone-800 hover:bg-white hover:text-stone-950 border border-stone-300 transition-colors shadow-sm cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Details</span>
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors shadow-sm cursor-pointer ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-white hover:bg-amber-800'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Unboxed Metadata Line */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="uppercase tracking-wider font-semibold text-amber-800 text-[11px]">
            {product.categoryLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span>★ {product.rating.toFixed(1)}</span>
          <span aria-hidden="true">·</span>
          <span>{product.reviewCount} reviews</span>
        </div>

        {/* Title */}
        <h4 className="mt-1.5 text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
          {product.name}
        </h4>

        {/* Short Description */}
        <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed flex-1">
          {product.shortDescription}
        </p>

        {/* Color Swatch / Variants Selection */}
        {product.variants.length > 0 && (
          <div className="mt-3 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  title={v.name}
                  onClick={() => setSelectedVariant(v)}
                  className={`h-4 w-4 rounded-full border transition-all cursor-pointer ${
                    selectedVariant.id === v.id
                      ? 'ring-2 ring-stone-900 ring-offset-2 ring-offset-white border-white'
                      : 'border-stone-300 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                />
              ))}
            </div>
            <span className="text-[11px] text-stone-600 truncate max-w-[130px]">
              {selectedVariant.name}
            </span>
          </div>
        )}

        {/* Size Selection Chips (if product has sizes) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] uppercase font-semibold text-stone-500 mr-0.5">Size:</span>
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSize === sz
                    ? 'bg-stone-900 text-white font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        )}

        {/* Price & Mobile Add Bar */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Direct Mobile Quick Add */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`md:hidden flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-amber-800 text-white'
            }`}
          >
            {isAddedRecently ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            <span>{isAddedRecently ? 'Added' : 'Add'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
