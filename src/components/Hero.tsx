import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { CategoryType } from '../types';

interface HeroProps {
  onSelectCategory: (category: CategoryType) => void;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory, onScrollToCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-stone-200">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pt-8 lg:pb-14">
        {/* Editorial Campaign Hero with Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-900 shadow-xl"
        >
          {/* Background Image with Scrim */}
          <div className="relative aspect-[21/9] min-h-[380px] w-full overflow-hidden">
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              src="/src/assets/images/hero_mens_collection_1790840004139.jpg"
              alt="FASSON Men Accessories Collection"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-transparent hidden md:block" />

            {/* Campaign Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xs uppercase tracking-[0.28em] text-amber-400 font-bold mb-2"
              >
                FASSON · Bangladesh Collection 2026
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-serif-brand text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight"
              >
                Precision Essentials for Men Across Bangladesh
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-3 text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl"
              >
                Handcrafted Tuscan leather wallets, executive luggage, automatic watches, and titanium neckbands. Home delivery across all 64 districts with Cash on Delivery.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onScrollToCatalog}
                  className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-stone-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-md"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectCategory('neckbands');
                    onScrollToCatalog();
                  }}
                  className="rounded-lg border border-stone-300/60 bg-stone-950/50 backdrop-blur-md px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  View Neckbands
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 4 Core Category Fast Access Cards with Hover Motion */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Wallets */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              onSelectCategory('wallets');
              onScrollToCatalog();
            }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-200 bg-stone-50/70 p-4 hover:border-amber-700/60 hover:bg-amber-50/20 transition-all shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">01 · Carry</span>
            <h3 className="font-serif-brand mt-1 text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              Wallets
            </h3>
            <p className="mt-1 text-[11px] text-stone-600 line-clamp-1">
              Bifolds & cardholders
            </p>
          </motion.div>

          {/* Card 2: Bags */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              onSelectCategory('bags');
              onScrollToCatalog();
            }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-200 bg-stone-50/70 p-4 hover:border-amber-700/60 hover:bg-amber-50/20 transition-all shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">02 · Travel</span>
            <h3 className="font-serif-brand mt-1 text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              Bags
            </h3>
            <p className="mt-1 text-[11px] text-stone-600 line-clamp-1">
              Duffels & briefcases
            </p>
          </motion.div>

          {/* Card 3: Watches */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              onSelectCategory('watches');
              onScrollToCatalog();
            }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-200 bg-stone-50/70 p-4 hover:border-amber-700/60 hover:bg-amber-50/20 transition-all shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">03 · Time</span>
            <h3 className="font-serif-brand mt-1 text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              Watches
            </h3>
            <p className="mt-1 text-[11px] text-stone-600 line-clamp-1">
              Mechanical & dress
            </p>
          </motion.div>

          {/* Card 4: Neckbands */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              onSelectCategory('neckbands');
              onScrollToCatalog();
            }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-stone-200 bg-stone-50/70 p-4 hover:border-amber-700/60 hover:bg-amber-50/20 transition-all shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">04 · Jewelry</span>
            <h3 className="font-serif-brand mt-1 text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
              Neckbands
            </h3>
            <p className="mt-1 text-[11px] text-stone-600 line-clamp-1">
              Titanium & leather
            </p>
          </motion.div>
        </div>

        {/* Value Trust Bar with Bangladesh Delivery Charges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-200 pt-6 text-stone-600 text-xs">
          <div className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-amber-800 shrink-0" />
            <span className="font-medium">Inside Dhaka Delivery: <strong>৳80</strong> (24–48 Hours)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-amber-800 shrink-0" />
            <span className="font-medium">Outside Dhaka Delivery: <strong>৳145</strong> (All 64 Districts)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-amber-800 shrink-0" />
            <span className="font-medium">Cash on Delivery & bKash Accepted Across Bangladesh</span>
          </div>
        </div>
      </div>
    </section>
  );
};
