import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, Building2, Banknote, Copy, Check, PackageCheck, FileText, Phone, MapPin, User, Smartphone, AlertCircle, Headphones } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem, Currency, ShippingOption } from '../types';
import { formatPrice } from '../utils/format';
import { BANK_ACCOUNTS, MFS_DETAILS, BANGLADESH_DISTRICTS, SHIPPING_OPTIONS, HELP_CONTACTS } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: Currency;
  discountBDT: number;
  isGiftWrapped: boolean;
  selectedShipping: ShippingOption;
  shippingDistrict: string;
  deliveryArea: string;
  onSelectShipping: (opt: ShippingOption) => void;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  discountBDT,
  isGiftWrapped,
  selectedShipping,
  shippingDistrict,
  deliveryArea,
  onSelectShipping,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Payment categories:
  // 'cod' = Cash on Delivery (Advance delivery charge 80tk/145tk via bKash/Nagad/Rocket)
  // 'mfs' = Full payment via bKash / Nagad / Rocket
  // 'bank' = Dutch-Bangla Bank / Sonali Bank / Islami Bank
  const [paymentType, setPaymentType] = useState<'cod' | 'mfs' | 'bank'>('cod');
  
  // Selected sub-methods
  const [selectedMFS, setSelectedMFS] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [selectedBankId, setSelectedBankId] = useState<string>('dbbl');

  // Customer Information fields
  const [formData, setFormData] = useState({
    customerName: 'Tanvir Ahmed',
    customerPhone: '01712-345678',
    customerEmail: 'tanvir.ahmed@example.com',
    district: shippingDistrict || 'Dhaka (ঢাকা)',
    deliveryLocation: deliveryArea ? `${deliveryArea}, House 12, Road 4` : 'House 14, Road 7, Sector 3, Uttara',
    customerNote: 'Cash on delivery: Please call before delivery.',
    // For COD delivery charge advance or MFS payment
    codMfsProvider: 'bkash', // 'bkash' | 'nagad' | 'rocket'
    senderNumber: '017XXXXXXXX',
    trxId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');

  const subtotalBDT = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const giftWrapBDT = isGiftWrapped ? 150 : 0;
  const shippingBDT = selectedShipping.costBDT;
  const finalTotalBDT = Math.max(0, subtotalBDT - discountBDT + giftWrapBDT + shippingBDT);

  // For COD: Advance delivery charge is paid now; Remaining product amount is paid on arrival!
  const codAdvanceDeliveryCharge = shippingBDT; // 80tk or 145tk
  const codRemainingOnDelivery = Math.max(0, subtotalBDT - discountBDT + giftWrapBDT);

  const selectedBank = BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || BANK_ACCOUNTS[0];
  const activeMFS = MFS_DETAILS[selectedMFS];
  const codMFS = MFS_DETAILS[formData.codMfsProvider as keyof typeof MFS_DETAILS] || MFS_DETAILS.bkash;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrderNum = `FSN-BD-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderNumber(generatedOrderNum);
      setIsSubmitting(false);
      setStep('success');
      onOrderSuccess();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white text-stone-900 shadow-2xl my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-3.5 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <span className="font-serif-brand text-lg font-bold tracking-wider text-stone-900">
              {step === 'form' ? 'FASSON CHECKOUT (বাংলাদেশ)' : 'অর্ডার নিশ্চিত হয়েছে'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Helpline Contact Bar */}
        <div className="bg-amber-50 border-b border-amber-200/90 px-6 py-2 flex flex-wrap items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2 font-medium">
            <Headphones className="h-3.5 w-3.5 text-amber-800" />
            <span>অর্ডারে সাহায্যের জন্য কল করুন:</span>
            <a href={`tel:${HELP_CONTACTS.phone}`} className="font-bold underline text-stone-900 hover:text-amber-800 font-mono">
              {HELP_CONTACTS.phoneDisplay}
            </a>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-600">
            <span>হোয়াটসঅ্যাপ:</span>
            <a href={`https://wa.me/8801812345678`} target="_blank" rel="noreferrer" className="font-bold text-emerald-700 hover:underline font-mono">
              {HELP_CONTACTS.whatsappDisplay}
            </a>
          </div>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6">
            {/* Quick Order Overview */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Items: {cart.length} pcs</span>
                <span className="font-bold text-stone-900 font-mono text-sm">
                  Total Order Amount: {formatPrice(finalTotalBDT, currency)}
                </span>
              </div>
              <div className="flex -space-x-2 overflow-hidden py-1">
                {cart.map((item, idx) => (
                  <img
                    key={idx}
                    src={item.product.image}
                    alt={item.product.name}
                    className="inline-block h-10 w-10 rounded-md border-2 border-white object-cover shadow-2xs"
                  />
                ))}
              </div>
              <div className="border-t border-stone-200 pt-2 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-amber-800" />
                  <span>
                    <strong>{selectedShipping.name}</strong> ({selectedShipping.carrier})
                  </span>
                </div>
                <span className="text-[11px] font-bold text-stone-900 font-mono">
                  ডেলিভারি চার্জ: {formatPrice(selectedShipping.costBDT, currency)}
                </span>
              </div>
            </div>

            {/* Delivery Location & Charge Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-900 block mb-2">
                ডেলিভারি এরিয়া নির্বাচন করুন (Delivery Charge):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {SHIPPING_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onSelectShipping(opt);
                      if (opt.id === 'inside-dhaka') {
                        setFormData((prev) => ({ ...prev, district: 'Dhaka (ঢাকা)' }));
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedShipping.id === opt.id
                        ? 'border-stone-900 bg-amber-50/50 ring-1 ring-stone-900 shadow-2xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{opt.name}</span>
                      <span className="font-mono font-bold text-stone-950 text-sm">
                        {formatPrice(opt.costBDT, currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      {opt.estimatedDays} · {opt.carrier}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information (Name, Number, Location, Note) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold text-white">
                  1
                </span>
                <span>Customer Information (কাস্টমার তথ্য ও ঠিকানা)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Customer Name */}
                <div>
                  <label className="text-stone-700 block mb-1 font-semibold flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-stone-500" />
                    <span>Customer Name (আপনার নাম) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                {/* Customer Phone Number */}
                <div>
                  <label className="text-stone-700 block mb-1 font-semibold flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-stone-500" />
                    <span>Mobile Number (মোবাইল নম্বর) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-stone-900 focus:border-stone-900 focus:outline-none font-mono"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="text-stone-700 block mb-1 font-semibold flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-stone-500" />
                    <span>District (জেলা) *</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => {
                      const d = e.target.value;
                      setFormData({ ...formData, district: d });
                      if (d.includes('Dhaka')) {
                        onSelectShipping(SHIPPING_OPTIONS[0]);
                      } else {
                        onSelectShipping(SHIPPING_OPTIONS[1]);
                      }
                    }}
                    className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-stone-900 focus:border-stone-900 focus:outline-none cursor-pointer"
                  >
                    {BANGLADESH_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-stone-700 block mb-1 font-semibold">
                    Email Address (ইমেইল - ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                {/* Delivery Location / Full Address */}
                <div className="sm:col-span-2">
                  <label className="text-stone-700 block mb-1 font-semibold">
                    Delivery Location / Full Address (বাসা/রোড/এলাকার সঠিক ঠিকানা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    placeholder="e.g. House 14, Road 7, Sector 3, Uttara / Mirpur 10"
                    className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-stone-900 focus:border-stone-900 focus:outline-none"
                  />
                </div>

                {/* Customer Note */}
                <div className="sm:col-span-2">
                  <label className="text-stone-700 block mb-1 font-semibold flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-amber-800" />
                    <span>Customer Note (ডেলিভারি নোট / রাইডারের জন্য নির্দেশনা)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.customerNote}
                    onChange={(e) => setFormData({ ...formData, customerNote: e.target.value })}
                    placeholder="e.g. Cash on delivery: Call before delivery, give exact change."
                    className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-stone-900 focus:border-stone-900 focus:outline-none text-xs"
                  />
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    This note will be given directly to the courier delivery person.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selector (COD with Advance Delivery Charge, bKash/Nagad/Rocket, and Bank) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-[11px] font-bold text-white">
                  2
                </span>
                <span>Payment Method (পেমেন্ট পদ্ধতি নির্বাচন করুন)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Method 1: Cash on Delivery with Advance Delivery Charge */}
                <button
                  type="button"
                  onClick={() => setPaymentType('cod')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentType === 'cod'
                      ? 'border-stone-900 bg-amber-50 ring-1 ring-stone-900 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Banknote className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-950 flex items-center gap-1">
                      <span>Cash on Delivery</span>
                      <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-800">
                        জনপ্রিয়
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-0.5">
                      ডেলিভারি চার্জ অগ্রিম দিয়ে অর্ডার কনফার্ম করুন
                    </div>
                  </div>
                </button>

                {/* Method 2: bKash / Nagad / Rocket (Full Payment) */}
                <button
                  type="button"
                  onClick={() => setPaymentType('mfs')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentType === 'mfs'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-950">bKash / Nagad / Rocket</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">
                      সম্পূর্ণ মূল্য বিকাশ/নগদ/রকেটে পরিশোধ
                    </div>
                  </div>
                </button>

                {/* Method 3: Bank Transfer (Dutch-Bangla, Sonali, Islami Bank) */}
                <button
                  type="button"
                  onClick={() => setPaymentType('bank')}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentType === 'bank'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <Building2 className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-950">Bank Transfer</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">
                      DBBL / সোনালী / ইসলামী ব্যাংক
                    </div>
                  </div>
                </button>
              </div>

              {/* DETAILS PANEL 1: CASH ON DELIVERY (Pay First Delivery Charge to get delivery confirmed) */}
              {paymentType === 'cod' && (
                <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/80 p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-800" />
                    <span>ক্যাশ অন ডেলিভারি নিশ্চিত করতে অগ্রিম ডেলিভারি চার্জ পরিশোধ করুন</span>
                  </div>

                  <p className="text-[11px] text-stone-800 leading-relaxed">
                    অর্ডার কনফার্ম করার জন্য শুধুমাত্র ডেলিভারি চার্জ <strong>{formatPrice(codAdvanceDeliveryCharge, currency)}</strong> ({selectedShipping.name}) বিকাশ, নগদ অথবা রকেটে সেন্ড মানি করুন। বাকি <strong>{formatPrice(codRemainingOnDelivery, currency)}</strong> পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে ক্যাশ প্রদান করবেন।
                  </p>

                  <div className="bg-white rounded-lg border border-amber-200 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-stone-100">
                      <span>অগ্রিম প্রদেয় ডেলিভারি চার্জ:</span>
                      <span className="font-mono font-bold text-amber-900 text-sm">{formatPrice(codAdvanceDeliveryCharge, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>পণ্য প্রাপ্তির পর রাইডারকে পরিশোধ করবেন:</span>
                      <span className="font-mono font-bold text-stone-900 text-sm">{formatPrice(codRemainingOnDelivery, currency)}</span>
                    </div>
                  </div>

                  {/* Choose which MFS to pay delivery charge */}
                  <div>
                    <label className="text-[11px] font-semibold text-stone-800 block mb-1.5">
                      ডেলিভারি চার্জ প্রদানের মাধ্যম নির্বাচন করুন:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['bkash', 'nagad', 'rocket'] as const).map((mfsKey) => {
                        const mfs = MFS_DETAILS[mfsKey];
                        const isSelected = formData.codMfsProvider === mfsKey;
                        return (
                          <div
                            key={mfsKey}
                            onClick={() => setFormData({ ...formData, codMfsProvider: mfsKey })}
                            className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                              isSelected
                                ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                                : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                            }`}
                          >
                            <span>{mfs.name.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active MFS number for delivery charge */}
                  <div className="rounded-lg border border-stone-200 bg-white p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-semibold">
                        {codMFS.name} {codMFS.type}
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm">{codMFS.number}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(codMFS.number, 'codMfsNum')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
                    >
                      {copiedField === 'codMfsNum' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedField === 'codMfsNum' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>

                  {/* Sender Number & TrxID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-700 block mb-1 font-medium">
                        যে নম্বর থেকে চার্জ পাঠিয়েছেন (Sender No) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.senderNumber}
                        onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded border border-stone-300 bg-white p-2 font-mono text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-700 block mb-1 font-medium">
                        ট্রানজেকশন আইডি (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.trxId}
                        onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                        placeholder="e.g. 9K20AB87XZ"
                        className="w-full rounded border border-stone-300 bg-white p-2 font-mono uppercase text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS PANEL 2: FULL MFS PAYMENT (bKash, Nagad, Rocket) */}
              {paymentType === 'mfs' && (
                <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3 text-xs">
                  <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                    <span>bKash / Nagad / Rocket পেমেন্ট</span>
                    <span className="font-mono text-sm font-bold text-amber-800">
                      Total: {formatPrice(finalTotalBDT, currency)}
                    </span>
                  </div>

                  {/* Provider Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {(['bkash', 'nagad', 'rocket'] as const).map((mfsKey) => {
                      const mfs = MFS_DETAILS[mfsKey];
                      const isSelected = selectedMFS === mfsKey;
                      return (
                        <div
                          key={mfsKey}
                          onClick={() => setSelectedMFS(mfsKey)}
                          className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <span>{mfs.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-lg border border-stone-200 bg-white p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block uppercase font-semibold">
                        {activeMFS.name} {activeMFS.type}
                      </span>
                      <span className="font-mono font-bold text-stone-900 text-sm">{activeMFS.number}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeMFS.number, 'fullMfsNum')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
                    >
                      {copiedField === 'fullMfsNum' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedField === 'fullMfsNum' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-600">
                    {activeMFS.instruction}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] text-stone-700 block mb-1 font-medium">
                        প্রেরক মোবাইল নম্বর (Sender Number) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.senderNumber}
                        onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded border border-stone-300 bg-white p-2 font-mono text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-700 block mb-1 font-medium">
                        ট্রানজেকশন আইডি (Transaction TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.trxId}
                        onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                        placeholder="e.g. 9K20AB87XZ"
                        className="w-full rounded border border-stone-300 bg-white p-2 font-mono uppercase text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILS PANEL 3: BANK TRANSFER (Dutch-Bangla, Sonali, Islami Bank) */}
              {paymentType === 'bank' && (
                <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3 text-xs">
                  <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5 flex items-center justify-between">
                    <span>ব্যাংক ট্রান্সফার (Dutch-Bangla / Sonali / Islami Bank)</span>
                    <span className="font-mono text-sm font-bold text-amber-800">
                      Total: {formatPrice(finalTotalBDT, currency)}
                    </span>
                  </div>

                  {/* Bank Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {BANK_ACCOUNTS.map((bank) => {
                      const isSelected = selectedBankId === bank.id;
                      return (
                        <div
                          key={bank.id}
                          onClick={() => setSelectedBankId(bank.id)}
                          className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-xs'
                              : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-[11px]">{bank.shortName}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bank Details Table */}
                  <div className="rounded-lg border border-stone-200 bg-white p-3 space-y-1.5 text-[11px] text-stone-700">
                    <div className="flex justify-between border-b border-stone-100 pb-1">
                      <span className="font-semibold text-stone-900">{selectedBank.bankName}</span>
                      <span>Branch: {selectedBank.branch}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Account Name:</span>
                      <span className="font-bold text-stone-900">{selectedBank.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-stone-900 text-sm">{selectedBank.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedBank.accountNumber, 'bankAcc')}
                          className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
                        >
                          {copiedField === 'bankAcc' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Routing Number:</span>
                      <span className="font-mono text-stone-800">{selectedBank.routingNumber}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-700 block mb-1 font-medium">
                      ব্যাংক ডিপোজিট স্লিপ নম্বর / ট্রান্সফার রেফারেন্স নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.trxId}
                      onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
                      placeholder="e.g. Deposit Slip No / BEFTN Ref / NPSB Trx"
                      className="w-full rounded border border-stone-300 bg-white p-2 font-mono uppercase text-xs text-stone-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total & Submit Button in BDT */}
            <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Order Value</span>
                <span className="font-mono text-xl font-bold text-stone-950 tabular-nums">
                  {formatPrice(finalTotalBDT, currency)}
                </span>
                {paymentType === 'cod' && (
                  <span className="text-[10px] text-emerald-800 font-semibold block">
                    (অগ্রিম চার্জ: {formatPrice(codAdvanceDeliveryCharge, currency)} · ক্যাশ অন ডেলিভারি: {formatPrice(codRemainingOnDelivery, currency)})
                  </span>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-stone-900 hover:bg-amber-800 text-white px-6 py-3 text-sm font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>অর্ডার কনফার্ম করুন (Confirm Order)</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center space-y-5 my-auto overflow-y-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Order Confirmed (অর্ডার নিশ্চিত হয়েছে)
              </span>
              <h2 className="font-serif-brand mt-1 text-2xl font-bold text-stone-950">
                ধন্যবাদ, {formData.customerName}
              </h2>
              <p className="mt-1 text-sm text-stone-600 font-mono">
                Order Tracking ID: <strong className="text-stone-950">{confirmedOrderNumber}</strong>
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-stone-800 font-medium">
                <PackageCheck className="h-4 w-4 text-amber-800" />
                <span>আপনার পার্সেলটি {selectedShipping.carrier} এর মাধ্যমে পাঠানো হচ্ছে।</span>
              </div>

              {/* Order details recap */}
              <div className="border-t border-stone-200 pt-2 space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Customer Name:</span>
                  <span className="text-stone-900 font-medium">{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone Number:</span>
                  <span className="text-stone-900 font-medium font-mono">{formData.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="text-stone-900 text-right">{formData.deliveryLocation}, {formData.district}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="text-stone-900 font-medium">{selectedShipping.name} ({formatPrice(shippingBDT, currency)})</span>
                </div>
                {paymentType === 'cod' && (
                  <>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Advance Delivery Charge Paid:</span>
                      <span className="font-mono">{formatPrice(codAdvanceDeliveryCharge, currency)} via {formData.codMfsProvider.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-amber-900 font-bold bg-amber-50 p-1.5 rounded border border-amber-200">
                      <span>ক্যাশ অন ডেলিভারিতে রাইডারকে দেবেন:</span>
                      <span className="font-mono text-sm">{formatPrice(codRemainingOnDelivery, currency)}</span>
                    </div>
                  </>
                )}
                {formData.trxId && (
                  <div className="flex justify-between text-stone-500 font-mono text-[11px]">
                    <span>TrxID / Reference:</span>
                    <span className="text-stone-900 font-bold">{formData.trxId}</span>
                  </div>
                )}
                {formData.customerNote && (
                  <div className="rounded bg-amber-50/80 p-2 border border-amber-200/80 text-amber-900 mt-1">
                    <strong>Courier Note:</strong> {formData.customerNote}
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-stone-200">
                  <span>Payment Mode:</span>
                  <span className="text-stone-900 uppercase font-bold">
                    {paymentType === 'cod'
                      ? 'Cash on Delivery (Advance Charge Paid)'
                      : paymentType === 'mfs'
                      ? `${selectedMFS.toUpperCase()} Full Payment`
                      : `${selectedBank.shortName} Transfer`}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-500">
              যেকোনো প্রয়োজনে আমাদের হেল্পলাইনে যোগাযোগ করুন: <strong className="text-stone-900">{HELP_CONTACTS.phoneDisplay}</strong>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg bg-stone-900 hover:bg-amber-800 text-white px-6 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Continue Shopping (আরও পণ্য দেখুন)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
