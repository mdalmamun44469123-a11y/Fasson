import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CraftSection } from './components/CraftSection';
import { Footer } from './components/Footer';
import { PRODUCTS, CATEGORIES, SHIPPING_OPTIONS } from './data/products';
import { CategoryType, Product, CartItem, Currency, ProductVariant, ShippingOption } from './types';
import { ArrowUpDown, CheckCircle, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Category & Filter States
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const currency: Currency = 'BDT'; // Strictly BDT only (USD removed)

  // Pagination State: 1 page to 8 products as requested!
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bangladesh Shipping State: Inside Dhaka 80 Tk (default) & Outside Dhaka 145 Tk
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);
  const [shippingDistrict, setShippingDistrict] = useState('Dhaka (ঢাকা)');
  const [deliveryArea, setDeliveryArea] = useState('Dhanmondi');

  // Interactive Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutGiftWrap, setCheckoutGiftWrap] = useState(false);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fasson_bd_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('fasson_bd_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('fasson_bd_cart_v2', JSON.stringify(cart));
    } catch {
      // fallback
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('fasson_bd_wishlist_v2', JSON.stringify(wishlist));
    } catch {
      // fallback
    }
  }, [wishlist]);

  // Reset to page 1 whenever category, search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory, searchQuery, sortBy]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const catalogRef = useRef<HTMLDivElement>(null);
  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCraft = () => {
    const craftEl = document.getElementById('craftsmanship');
    if (craftEl) {
      craftEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedVariant: ProductVariant,
    quantity: number = 1,
    monogram?: string,
    selectedSize?: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant.id === selectedVariant.id &&
          item.selectedSize === selectedSize &&
          item.monogram === monogram
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedVariant, selectedSize, quantity, monogram }];
    });
    showToast(`Added ${product.name} to your bag`);
  };

  const handleQuickAdd = (product: Product, selectedSize?: string) => {
    handleAddToCart(product, product.variants[0], 1, undefined, selectedSize);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
    } else {
      setCart((prev) => {
        const next = [...prev];
        next[index].quantity = quantity;
        return next;
      });
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from saved items`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved ${product.name} to your wishlist`);
        return [...prev, product];
      }
    });
  };

  const handleAddToCartFromWishlist = (product: Product) => {
    handleAddToCart(product, product.variants[0], 1, undefined, product.sizes ? product.sizes[0] : undefined);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
    setIsCartOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory =
        currentCategory === 'all' || item.category === currentCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materials.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [currentCategory, searchQuery, sortBy]);

  // Pagination Calculations (8 products per page)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToCatalog();
  };

  const activeCategoryInfo = CATEGORIES.find((c) => c.id === currentCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      {/* Toast Notification with Motion */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-stone-200 bg-white/95 px-4 py-3 text-xs font-semibold text-stone-900 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar (FASSON 3-Zone Header - Strictly BDT) */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
          scrollToCatalog();
        }}
        cartCount={cart.reduce((n, i) => n + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        currency={currency}
        onChangeCurrency={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigateToCraft={scrollToCraft}
      />

      {/* Hero Campaign Section with Smooth Motion */}
      <Hero
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
          scrollToCatalog();
        }}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Main Catalog Viewport */}
      <main ref={catalogRef} className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Section Header & Segmented Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-800 font-bold mb-1">
              <span>FASSON Bangladesh Catalog</span>
              <span aria-hidden="true">·</span>
              <span>{filteredProducts.length} Crafted Items</span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold tracking-tight text-stone-950">
              {currentCategory === 'all'
                ? 'Curated Essentials for Men'
                : activeCategoryInfo.label}
            </h2>
            {'description' in activeCategoryInfo && activeCategoryInfo.description && (
              <p className="mt-1 text-xs text-stone-600 max-w-lg">
                {activeCategoryInfo.description}
              </p>
            )}
          </motion.div>

          {/* Interactive Filter & Sort Controls with Motion */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Segmented Tabs with Layout Motion */}
            <div className="flex items-center p-1 bg-stone-100 border border-stone-200 rounded-lg shadow-2xs overflow-x-auto">
              {CATEGORIES.map((cat) => {
                const isActive = currentCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentCategory(cat.id as CategoryType);
                      setSearchQuery('');
                    }}
                    className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-stone-950 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    <span>{cat.label} ({cat.count})</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 shadow-2xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="bg-transparent text-stone-800 focus:outline-none cursor-pointer pr-1 font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Search Filter Banner */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center justify-between rounded-lg bg-stone-50 border border-stone-200 px-4 py-2.5 text-xs text-stone-700"
          >
            <span>
              Showing results matching &ldquo;<strong className="text-stone-950">{searchQuery}</strong>&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-stone-500 hover:text-stone-900 underline cursor-pointer"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Product Grid (8 items per page) */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-stone-400">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="font-serif-brand text-lg font-semibold text-stone-900">No pieces match your search</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your query or explore FASSON wallets, duffels, watches, and neckbands.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentCategory('all');
              }}
              className="mt-3 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* 8 Product Grid (4 columns on xl, 3 on lg, 2 on sm) */}
            <motion.div
              key={`${currentCategory}-${currentPage}-${sortBy}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, staggerChildren: 0.05 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isWishlisted={wishlist.some((w) => w.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={(p) => setSelectedProductModal(p)}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </motion.div>

            {/* Pagination Controls (8 Products per Page) */}
            <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 font-medium">
                Showing <span className="font-bold text-stone-900">{startIndex + 1}–{endIndex}</span> of <span className="font-bold text-stone-900">{filteredProducts.length}</span> curated pieces (8 items / page)
              </div>

              {/* Numbered Page Buttons with Motion */}
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <motion.button
                    key={pageNum}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </motion.button>
                ))}

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-2xs"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </div>
          </>
        )}

        {/* Bespoke Services Banner with Subtle Hover Motion */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="mt-16 rounded-2xl border border-stone-200 bg-stone-50 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs"
        >
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">
              FASSON Bangladesh Concierge
            </span>
            <h3 className="font-serif-brand mt-1 text-xl sm:text-2xl font-bold text-stone-950">
              Inside Dhaka ৳80 & Outside Dhaka ৳145
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Fast, insured home delivery to all 64 districts. Full inspection allowed upon Cash on Delivery parcel arrival.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentCategory('neckbands');
              scrollToCatalog();
            }}
            className="shrink-0 rounded-lg bg-stone-900 hover:bg-amber-800 text-white px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Explore Neckbands
          </motion.button>
        </motion.div>
      </main>

      {/* Craftsmanship & Testimonials Section */}
      <CraftSection />

      {/* Footer with Help Helpline */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSearchQuery('');
          scrollToCatalog();
        }}
        onNavigateToCraft={scrollToCraft}
      />

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProductModal && (
          <ProductModal
            product={selectedProductModal}
            currency={currency}
            isWishlisted={wishlist.some((w) => w.id === selectedProductModal.id)}
            onClose={() => setSelectedProductModal(null)}
            onAddToCart={(prod, variant, qty, mono, size) => {
              handleAddToCart(prod, variant, qty, mono, size);
              setSelectedProductModal(null);
              setIsCartOpen(true);
            }}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            currency={currency}
            selectedShipping={selectedShipping}
            onSelectShipping={setSelectedShipping}
            shippingDistrict={shippingDistrict}
            onSelectDistrict={setShippingDistrict}
            deliveryArea={deliveryArea}
            onChangeDeliveryArea={setDeliveryArea}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onOpenCheckout={(discount, isGift) => {
              setCheckoutDiscount(discount);
              setCheckoutGiftWrap(isGift);
              setIsCheckoutOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlist={wishlist}
            currency={currency}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCartFromWishlist={handleAddToCartFromWishlist}
          />
        )}
      </AnimatePresence>

      {/* Checkout Modal with Bangladesh Delivery & COD Advance Charge */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cart={cart}
            currency={currency}
            discountBDT={checkoutDiscount}
            isGiftWrapped={checkoutGiftWrap}
            selectedShipping={selectedShipping}
            shippingDistrict={shippingDistrict}
            deliveryArea={deliveryArea}
            onSelectShipping={setSelectedShipping}
            onOrderSuccess={() => {
              setCart([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
