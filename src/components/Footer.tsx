import React, { useState } from 'react';
import { Check, Phone, Headphones, MessageCircle, ShieldCheck } from 'lucide-react';
import { CategoryType } from '../types';
import { HELP_CONTACTS } from '../data/products';

interface FooterProps {
  onSelectCategory: (category: CategoryType) => void;
  onNavigateToCraft: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigateToCraft }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="border-t border-stone-200 bg-stone-100 text-stone-600 text-xs">
      {/* Help & Support Banner */}
      <div className="bg-stone-50 border-b border-stone-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-800 shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Need Help with Your Order? (সাহায্য প্রয়োজন?)</h4>
              <p className="text-xs text-stone-500">আমাদের কাস্টমার সাপোর্ট টিম প্রতিদিন সকাল ৯টা থেকে রাত ১১টা পর্যন্ত প্রস্তুত রয়েছে।</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${HELP_CONTACTS.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white font-semibold text-xs hover:bg-amber-800 transition-colors cursor-pointer shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Helpline: {HELP_CONTACTS.phoneDisplay}</span>
            </a>
            <a
              href="https://wa.me/8801812345678"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp: {HELP_CONTACTS.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif-brand text-2xl font-bold tracking-[0.28em] text-stone-900">
              FASSON
            </span>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Artisan leather wallets, executive luggage, precision automatic watches, and titanium neckbands designed with disciplined minimalism for modern men in Bangladesh.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                FASSON VIP Club
              </span>
              <p className="text-xs text-stone-500 mb-2">
                নতুন কালেকশন এবং স্পেশাল ডিসকাউন্ট কোড পেতে আপনার ইমেইল দিন।
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-800">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">ধন্যবাদ! আপনার ১০% ডিসকাউন্ট কোড: <strong>FASSON10</strong></span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors cursor-pointer shadow-2xs"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Catalog Column */}
          <div>
            <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-3">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCategory('wallets')}
                  className="hover:text-stone-950 transition-colors cursor-pointer text-stone-600"
                >
                  Leather Wallets (ওয়ালেট)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bags')}
                  className="hover:text-stone-950 transition-colors cursor-pointer text-stone-600"
                >
                  Bags & Duffels (ব্যাগ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('watches')}
                  className="hover:text-stone-950 transition-colors cursor-pointer text-stone-600"
                >
                  Timepieces (ঘড়ি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('neckbands')}
                  className="hover:text-stone-950 transition-colors cursor-pointer text-stone-600 font-medium text-amber-900"
                >
                  Titanium Neckbands (নেকব্যান্ড)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-stone-950 transition-colors cursor-pointer text-stone-600"
                >
                  All FASSON Goods
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Methods Info */}
          <div>
            <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-3">
              Accepted Payments
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li className="font-semibold text-stone-800">ক্যাশ অন ডেলিভারি (COD)</li>
              <li>bKash (বিকাশ)</li>
              <li>Nagad (নগদ)</li>
              <li>Rocket (রকেট)</li>
              <li>Dutch-Bangla Bank (DBBL)</li>
              <li>Sonali Bank (সোনালী ব্যাংক)</li>
              <li>Islami Bank (ইসলামী ব্যাংক)</li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-stone-600">
              <li>
                <strong className="text-stone-800">Helpline:</strong> {HELP_CONTACTS.phoneDisplay}
              </li>
              <li>
                <strong className="text-stone-800">WhatsApp:</strong> {HELP_CONTACTS.whatsappDisplay}
              </li>
              <li>
                <strong className="text-stone-800">Delivery Inside Dhaka:</strong> ৳80
              </li>
              <li>
                <strong className="text-stone-800">Delivery Outside Dhaka:</strong> ৳145
              </li>
              <li>
                <strong className="text-stone-800">Email:</strong> {HELP_CONTACTS.email}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} FASSON & CO. Handcrafted precision goods for men. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Bangladesh Delivery Policy</span>
            <span>Advance Delivery Charge Terms</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
