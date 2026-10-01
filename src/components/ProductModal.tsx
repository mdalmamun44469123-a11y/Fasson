import React, { useState } from 'react';
import { X, Heart, Shield, Truck, RefreshCw, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariant, Currency } from '../types';
import { formatPrice } from '../utils/format';

interface ProductModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number, monogram?: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [monogram, setMonogram] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'warranty'>('specs');

  const handleAdd = () => {
    onAddToCart(
      product,
      selectedVariant,
      quantity,
      monogram.trim() ? monogram.trim().toUpperCase() : undefined,
      selectedSize
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog with Motion Pop-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-2xl my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200 shadow-xs focus-visible:outline-none"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Image Stage */}
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full bg-stone-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-stone-200">
            <motion.img
              key={selectedVariant.id}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[380px] w-full object-contain object-center drop-shadow-md"
            />
            {/* Visual indicators */}
            <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">FASSON Official Stock · Ready for Immediate Dispatch</span>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-widest font-semibold text-amber-800">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-stone-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-semibold text-stone-950">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount} verified reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="font-serif-brand mt-2 text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-stone-950 tabular-nums">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
                {product.badge && (
                  <span className="text-xs text-amber-800 font-semibold ml-2">
                    · {product.badge}
                  </span>
                )}
              </div>

              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Color / Variant Selection */}
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                  Color / Finish: <span className="text-stone-950 font-normal">{selectedVariant.name}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        selectedVariant.id === v.id
                          ? 'border-stone-900 bg-stone-100 text-stone-950 font-semibold ring-1 ring-stone-900 shadow-2xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-950'
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-stone-300"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Select Size: <span className="text-stone-950 font-normal">{selectedSize}</span>
                    </label>
                    <span className="text-[11px] text-amber-800 font-medium">True to fit</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                          selectedSize === sz
                            ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complimentary Monogramming Option */}
              {product.canMonogram && (
                <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-800">
                      Complimentary Initial Embossing
                    </label>
                    <span className="text-[11px] text-amber-800 font-bold">Free</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Up to 3 letters hand-embossed in gold leaf or blind deboss.
                  </p>
                  <input
                    type="text"
                    maxLength={3}
                    value={monogram}
                    onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                    placeholder="e.g. FSN"
                    className="mt-2 w-32 rounded border border-stone-300 bg-white px-2.5 py-1 text-xs tracking-widest text-stone-900 uppercase placeholder-stone-400 focus:border-stone-900 focus:outline-none"
                  />
                </div>
              )}

              {/* Quantity Stepper & Add to Cart */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:text-stone-950 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm text-stone-900 font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-600 hover:text-stone-950 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-5 text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-amber-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to Your Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag · {formatPrice(product.price * quantity, currency)}</span>
                  )}
                </motion.button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-stone-300 bg-white text-stone-600 hover:text-stone-950 hover:border-stone-400'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Micro Tab Details */}
            <div className="border-t border-stone-200 pt-4">
              <div className="flex items-center gap-4 text-xs border-b border-stone-200 pb-2">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'specs'
                      ? 'text-amber-800 font-bold border-b-2 border-amber-800'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'shipping'
                      ? 'text-amber-800 font-bold border-b-2 border-amber-800'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Delivery & COD
                </button>
                <button
                  onClick={() => setActiveTab('warranty')}
                  className={`pb-1 transition-colors cursor-pointer ${
                    activeTab === 'warranty'
                      ? 'text-amber-800 font-bold border-b-2 border-amber-800'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  FASSON Care
                </button>
              </div>

              <div className="pt-3 text-xs text-stone-600 leading-relaxed">
                {activeTab === 'specs' && (
                  <div className="space-y-1.5">
                    <p><strong className="text-stone-900">Materials:</strong> {product.materials}</p>
                    <p><strong className="text-stone-900">Dimensions:</strong> {product.dimensions}</p>
                    <div className="mt-2 space-y-1">
                      {product.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-stone-700">
                          <Check className="h-3 w-3 text-amber-700 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Truck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-900">Dispatched in FASSON Presentation Box</p>
                        <p className="text-stone-500">Ships within 24 hours via DHL / FedEx. Cash on Delivery available at checkout with custom delivery notes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-1">
                      <RefreshCw className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-900">30-Day Risk-Free Returns</p>
                        <p className="text-stone-500">Complimentary return labels included inside every FASSON parcel.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-stone-900">Heirloom Lifetime Guarantee</p>
                      <p className="text-stone-500">All FASSON leather goods, timepieces, and titanium neckbands are warranted against manufacturing defects for life.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
