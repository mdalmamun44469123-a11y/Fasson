import React from 'react';
import { Compass, Hammer, ShieldCheck, Star } from 'lucide-react';
import { REVIEWS } from '../data/products';

export const CraftSection: React.FC = () => {
  return (
    <section id="craftsmanship" className="border-t border-stone-200 bg-stone-50 py-16 sm:py-24 text-stone-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-bold">
            The FASSON Standard
          </span>
          <h2 className="font-serif-brand mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-stone-950">
            Rooted in Material Integrity & Industrial Form
          </h2>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">
            FASSON rejects fast-fashion disposability. Every wallet, luggage piece, mechanical timepiece, and titanium neckband is crafted using traditional artisan methods married with modern metallurgical tolerances.
          </p>
        </div>

        {/* 3 Craft Pillars */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <Hammer className="h-5 w-5" />
            </div>
            <h3 className="font-serif-brand mt-4 text-lg font-bold text-stone-900">
              Tuscan Vegetable Tannery
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our leather is bathed in natural chestnut and mimosa tannins for over 40 days in Santa Croce sull&apos;Arno. No synthetic PU films or top coats—just pure grain that ages with distinctive patina.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-serif-brand mt-4 text-lg font-bold text-stone-900">
              316L Surgical Metallurgy
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              FASSON neckbands and timepiece cases are milled from marine-grade 316L stainless steel and titanium, ensuring corrosion-proof longevity and hypoallergenic comfort against the skin.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-serif-brand mt-4 text-lg font-bold text-stone-900">
              Lifetime Heirloom Promise
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              If a seam ever unravels, a zipper fails, a clasp breaks, or a watch movement loses calibration, return it to the FASSON studio for complimentary restoration or replacement.
            </p>
          </div>
        </div>

        {/* Attributable Client Reviews */}
        <div className="mt-20 border-t border-stone-200 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
                Customer Testimonials
              </span>
              <h3 className="font-serif-brand mt-1 text-xl sm:text-2xl font-bold text-stone-950">
                Trusted by Discerning Gentlemen Worldwide
              </h3>
            </div>
            <div className="text-xs text-stone-500">
              <strong className="text-stone-900 font-mono">4.9 / 5.0</strong> overall rating based on 400+ verified customer reviews
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="rounded-xl border border-stone-200 bg-white p-6 flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100">
                  <div className="text-xs font-bold text-stone-900">{rev.author}</div>
                  <div className="text-[11px] text-stone-500">{rev.role} · {rev.date}</div>
                  <div className="text-[11px] text-amber-800 font-medium mt-0.5 truncate">
                    Purchased: {rev.product}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
