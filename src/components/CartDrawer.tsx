import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, Gift, Truck, Check, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem, Currency, ShippingOption } from '../types';
import { formatPrice } from '../utils/format';
import { SHIPPING_OPTIONS, BANGLADESH_DISTRICTS } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: Currency;
  selectedShipping: ShippingOption;
  onSelectShipping: (option: ShippingOption) => void;
  shippingDistrict: string;
  onSelectDistrict: (district: string) => void;
  deliveryArea: string;
  onChangeDeliveryArea: (area: string) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: (promoDiscount: number, isGiftWrapped: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  selectedShipping,
  onSelectShipping,
  shippingDistrict,
  onSelectDistrict,
  deliveryArea,
  onChangeDeliveryArea,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent?: number; discountFixed?: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [isShippingSectionOpen, setIsShippingSectionOpen] = useState(true);

  if (!isOpen) return null;

  const rawSubtotalBDT = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  let discountBDT = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountBDT = (rawSubtotalBDT * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountFixed) {
      discountBDT = Math.min(appliedPromo.discountFixed, rawSubtotalBDT);
    }
  }

  const giftWrapFeeBDT = isGiftWrapped ? 150 : 0;
  const effectiveShippingFeeBDT = selectedShipping.costBDT;
  const finalTotalBDT = Math.max(0, rawSubtotalBDT - discountBDT + giftWrapFeeBDT + effectiveShippingFeeBDT);

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'FASSON10') {
      setAppliedPromo({ code, discountPercent: 10 });
    } else if (code === 'FASSON200' || code === 'FIRSTORDER') {
      setAppliedPromo({ code, discountFixed: 200 });
    } else {
      setPromoError('Try FASSON10 or FASSON200');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-screen max-w-lg border-l border-stone-200 bg-white text-stone-900 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="border-b border-stone-200 p-5 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <span className="font-serif-brand text-lg font-bold tracking-wider text-stone-900">
                FASSON BAG
              </span>
              <span className="font-mono text-xs text-stone-500">
                ({cart.reduce((n, i) => n + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Delivery Region Info Bar */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <Truck className="h-3.5 w-3.5 text-amber-800" />
              <span>Bangladesh Home Delivery: Inside Dhaka ৳80 · Outside Dhaka ৳145</span>
            </div>
          </div>

          {/* Cart Items List & Shipping Options */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-stone-400">
                  <X className="h-6 w-6" />
                </div>
                <h4 className="font-serif-brand text-lg font-semibold text-stone-900">Your bag is empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore FASSON wallets, executive travel duffels, automatic timepieces, and titanium neckbands with fast delivery across Bangladesh.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 rounded-lg bg-stone-900 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Itemized product list */}
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      layout
                      key={`${item.product.id}-${item.selectedVariant.id}-${item.selectedSize}-${index}`}
                      className="flex gap-4 border-b border-stone-200 pb-4"
                    >
                      {/* Thumbnail */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(index)}
                              className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 mt-1">
                            <div className="flex items-center gap-1">
                              <span
                                className="h-2.5 w-2.5 rounded-full border border-stone-300 inline-block"
                                style={{ backgroundColor: item.selectedVariant.colorHex }}
                              />
                              <span>{item.selectedVariant.name}</span>
                            </div>

                            {item.selectedSize && (
                              <>
                                <span>·</span>
                                <span className="font-medium bg-stone-100 px-1.5 py-0.5 rounded text-stone-800">
                                  Size: {item.selectedSize}
                                </span>
                              </>
                            )}

                            {item.monogram && (
                              <>
                                <span>·</span>
                                <span className="text-amber-800 font-semibold font-mono">Initials: {item.monogram}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Stepper */}
                          <div className="flex items-center rounded border border-stone-300 bg-white">
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950 cursor-pointer font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-mono text-xs text-stone-900 font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950 cursor-pointer font-bold"
                            >
                              +
                            </button>
                          </div>

                          {/* Price in BDT */}
                          <span className="font-mono text-xs sm:text-sm font-bold text-stone-950 tabular-nums">
                            {formatPrice(item.product.price * item.quantity, currency)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bangladesh Delivery Charge & Location Module */}
                <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-800" />
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                        Bangladesh Delivery Location
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Bangladesh Only
                    </span>
                  </div>

                  {isShippingSectionOpen && (
                    <div className="space-y-3 pt-1">
                      {/* District & Specific Area Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[11px] text-stone-600 block mb-1 font-medium">
                            District / Division (জেলা)
                          </label>
                          <select
                            value={shippingDistrict}
                            onChange={(e) => {
                              const dist = e.target.value;
                              onSelectDistrict(dist);
                              // Auto-switch delivery option based on district
                              if (dist.includes('Dhaka')) {
                                onSelectShipping(SHIPPING_OPTIONS[0]); // Inside Dhaka 80tk
                              } else {
                                onSelectShipping(SHIPPING_OPTIONS[1]); // Outside Dhaka 145tk
                              }
                            }}
                            className="w-full rounded-md border border-stone-300 bg-white p-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none cursor-pointer"
                          >
                            {BANGLADESH_DISTRICTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-600 block mb-1 font-medium">
                            Area / Thana (থানা / এলাকা)
                          </label>
                          <input
                            type="text"
                            value={deliveryArea}
                            onChange={(e) => onChangeDeliveryArea(e.target.value)}
                            placeholder="e.g. Dhanmondi, Mirpur, Uttara"
                            className="w-full rounded-md border border-stone-300 bg-white p-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Explicit Delivery Charge Selector: Inside Dhaka 80tk vs Outside Dhaka 145tk */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-semibold text-stone-700 block">
                          Delivery Zone & Charge (ডেলিভারি চার্জ নির্বাচন করুন):
                        </span>
                        {SHIPPING_OPTIONS.map((option) => {
                          const isSelected = selectedShipping.id === option.id;

                          return (
                            <div
                              key={option.id}
                              onClick={() => onSelectShipping(option)}
                              className={`flex items-start justify-between p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-2xs'
                                  : 'border-stone-200 bg-white hover:border-stone-300'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-stone-900 bg-stone-900' : 'border-stone-300 bg-white'
                                }`}>
                                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                </div>
                                <div>
                                  <div className="font-bold text-stone-950 flex items-center gap-1.5">
                                    <span>{option.name}</span>
                                    <span className="text-[10px] text-stone-500 font-normal">
                                      ({option.carrier})
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-stone-600 mt-0.5">
                                    {option.estimatedDays} · {option.description}
                                  </div>
                                </div>
                              </div>
                              <span className="font-mono text-xs font-bold tabular-nums ml-2 shrink-0 text-stone-950 text-sm">
                                {formatPrice(option.costBDT, currency)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Controls & Summary in BDT */}
          {cart.length > 0 && (
            <div className="border-t border-stone-200 bg-stone-50/70 p-5 space-y-4">
              {/* Gift Wrap Toggle */}
              <label className="flex items-center justify-between text-xs text-stone-800 cursor-pointer p-2.5 rounded-lg border border-stone-200 bg-white hover:border-stone-300 transition-colors shadow-2xs">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-amber-800" />
                  <span>FASSON Premium Gift Box Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-600 font-mono font-medium">+{formatPrice(150, currency)}</span>
                  <input
                    type="checkbox"
                    checked={isGiftWrapped}
                    onChange={(e) => setIsGiftWrapped(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                  />
                </div>
              </label>

              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (FASSON10)"
                    className="w-full rounded-lg border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-xs text-stone-900 uppercase placeholder-stone-400 focus:border-stone-900 focus:outline-none shadow-2xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {promoError && (
                <p className="text-[11px] text-rose-600">{promoError}</p>
              )}
              {appliedPromo && (
                <p className="text-[11px] text-emerald-700 flex items-center justify-between font-medium">
                  <span>Privilege Code {appliedPromo.code} applied!</span>
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoCode('');
                    }}
                    className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </p>
              )}

              {/* Breakdown in BDT */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-stone-900 font-medium tabular-nums">
                    {formatPrice(rawSubtotalBDT, currency)}
                  </span>
                </div>
                {discountBDT > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">
                      -{formatPrice(discountBDT, currency)}
                    </span>
                  </div>
                )}
                {isGiftWrapped && (
                  <div className="flex justify-between">
                    <span>Gift Box</span>
                    <span className="font-mono text-stone-900 font-medium tabular-nums">
                      {formatPrice(giftWrapFeeBDT, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>
                    Delivery Charge ({selectedShipping.name})
                  </span>
                  <span className="font-mono text-stone-900 font-bold tabular-nums">
                    {formatPrice(effectiveShippingFeeBDT, currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-semibold text-stone-900">
                  <span>Total Amount (সর্বমোট)</span>
                  <span className="font-mono text-base font-bold text-stone-950 tabular-nums text-lg">
                    {formatPrice(finalTotalBDT, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCheckout(discountBDT, isGiftWrapped);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-stone-900 hover:bg-amber-800 text-white py-3 text-sm font-bold transition-colors cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout (অর্ডার করুন)</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-800" />
                <span>Cash on Delivery Available Across All Bangladesh Districts</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
