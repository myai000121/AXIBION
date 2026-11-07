/**
 * AXIBION — A World of Technology
 * Master E-Commerce Platform
 */

import React, { useState, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryStrip } from './components/CategoryStrip';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminPanel } from './components/AdminPanel';
import { WishlistModal } from './components/WishlistModal';
import { ContactModal, AboutModal, FAQModal, PolicyModal } from './components/InfoModals';
import { Footer } from './components/Footer';
import { Product } from './types';
import {
  ShieldAlert,
  Smartphone,
  Laptop,
  Cpu,
  Filter,
  ArrowUpDown,
  Check,
  Star,
  Sparkles,
  Zap,
  TrendingUp,
  Package,
  Plus,
} from 'lucide-react';

function Storefront() {
  const { products, loadingProducts } = useStore();

  // Navigation & Modal states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directBuyProduct, setDirectBuyProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  // Filter & Sort States
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100' | '100to300' | '300to1000' | 'over1000'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');

  // Compute category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Compute available brands
  const brandsList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return Array.from(set).sort();
  }, [products]);

  // Filtered & Sorted catalog
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // In Stock
        if (inStockOnly && p.stock <= 0) return false;

        // Brand
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

        // Price Filter
        const effectivePrice = p.discountPrice || p.price;
        if (priceFilter === 'under100' && effectivePrice >= 100) return false;
        if (priceFilter === '100to300' && (effectivePrice < 100 || effectivePrice > 300)) return false;
        if (priceFilter === '300to1000' && (effectivePrice < 300 || effectivePrice > 1000)) return false;
        if (priceFilter === 'over1000' && effectivePrice <= 1000) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.id > a.id ? 1 : -1);
        // Featured default
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, inStockOnly, selectedBrand, priceFilter, sortBy]);

  // Curated Section Slices
  const cyberSecurityProducts = useMemo(
    () => products.filter((p) => p.category === 'Hacking & Cybersecurity Gadgets'),
    [products]
  );
  const mobileProducts = useMemo(
    () => products.filter((p) => p.category === 'Mobile Phones' || p.category === 'Mobile Accessories'),
    [products]
  );
  const computerProducts = useMemo(
    () => products.filter((p) => p.category === 'Computers & Laptops' || p.category === 'Computer Accessories' || p.category === 'Networking Devices'),
    [products]
  );
  const featuredProducts = useMemo(
    () => products.filter((p) => p.isFeatured || p.rating >= 4.8),
    [products]
  );

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
    );
  }, [products, selectedProduct]);

  const handleInstantBuy = (product: Product, quantity: number) => {
    setSelectedProduct(null);
    setDirectBuyProduct({ product, quantity });
    setIsCheckoutOpen(true);
  };

  const handleTrackOrderFromAnywhere = (orderId: string) => {
    setTrackingOrderId(orderId);
    setIsTrackOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenTrack={() => {
          setTrackingOrderId('');
          setIsTrackOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Banner */}
      <HeroBanner
        onExploreClick={() => {
          setSelectedCategory('all');
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onCybersecurityClick={() => {
          setSelectedCategory('Hacking & Cybersecurity Gadgets');
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 17 Specialized Categories Browser */}
      <CategoryStrip
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        productCounts={categoryCounts}
      />

      {/* Curated Spotlight: Ethical Hacking & Cybersecurity Gadgets */}
      {selectedCategory === 'all' && cyberSecurityProducts.length > 0 && (
        <section className="py-12 border-b border-[#1a1e27] bg-[#07080b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#00D9FF]" />
                  <span className="text-xs font-bold text-[#00D9FF] uppercase tracking-wider">
                    SPECIALIZED SECTOR
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Ethical Hacking & Cybersecurity Equipment
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Legitimate wireless analyzers, spectrum testers, and hardware security education kits.
                </p>
              </div>

              <button
                onClick={() => setSelectedCategory('Hacking & Cybersecurity Gadgets')}
                className="text-xs text-[#00D9FF] hover:underline font-semibold cursor-pointer"
              >
                View Category ({cyberSecurityProducts.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cyberSecurityProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Marketplace Catalog Grid with Advanced Filters */}
      <main id="catalog" className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Section Header & Active View */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                {selectedCategory === 'all' ? 'Hardware Marketplace' : selectedCategory}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Showing {filteredProducts.length} verified electronics & gadget item(s) · Cash on Delivery
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white cursor-pointer focus:outline-none focus:border-[#087BFF]"
              >
                <option value="featured">Featured & Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Filter Bar Controls */}
          <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#00D9FF]" />
                Filters:
              </span>

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="bg-[#151922] border border-[#1a1e27] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under100">Under $100</option>
                <option value="100to300">$100 – $300</option>
                <option value="300to1000">$300 – $1,000</option>
                <option value="over1000">Over $1,000</option>
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-[#151922] border border-[#1a1e27] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 cursor-pointer"
              >
                <option value="all">All Brands ({brandsList.length})</option>
                {brandsList.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              {/* In Stock Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#1a1e27] bg-[#151922] text-[#087BFF]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Clear Filters Button if any active */}
            {(priceFilter !== 'all' || inStockOnly || selectedBrand !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setInStockOnly(false);
                  setSelectedBrand('all');
                  setSelectedCategory('all');
                }}
                className="text-xs text-[#00D9FF] hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading AXIBION hardware database...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-[#0c0d12] rounded-2xl border border-[#1a1e27] p-8 max-w-2xl mx-auto shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#087BFF]/10 border border-[#087BFF]/30 flex items-center justify-center mx-auto text-[#00D9FF]">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Product Catalog Ready for Inventory</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  All sample, demo, and placeholder items have been removed. AXIBION is ready for official inventory upload. Authorized administrators can open the Admin Panel to add live products.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors cursor-pointer shadow-lg shadow-[#087BFF]/25 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Open Admin Panel</span>
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-[#0c0d12] rounded-2xl border border-[#1a1e27] p-8">
              <p className="text-base font-bold text-white">No hardware items found matching your filters</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try resetting your filters or selecting a different category from the top navigation.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceFilter('all');
                  setInStockOnly(false);
                  setSelectedBrand('all');
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors cursor-pointer"
              >
                Reset Filters & View All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Customer Trust & Reviews Showcase */}
      <section className="py-12 bg-[#060709] border-t border-[#1a1e27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-[#00D9FF] uppercase tracking-wider">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-2xl font-bold text-white">Trusted by Engineers & Security Analysts</h2>
            <p className="text-xs text-slate-400">
              Real customer feedback from hardware labs, field engineers, and makers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#0c0d12] border border-[#1a1e27] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The Signal_X diagnostic unit arrived in 48 hours via Cash on Delivery. Package was in pristine condition, and all RF antennas and firmware worked out of the box for our wireless audit demo."
              </p>
              <div className="pt-2 border-t border-[#1a1e27] text-xs">
                <p className="font-bold text-white">David K.</p>
                <p className="text-[11px] text-slate-500">Security Research Engineer · Seattle</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c0d12] border border-[#1a1e27] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Finding legitimate ethical cybersecurity and development hardware in one place with transparent COD payment is rare. AXIBION is our company's go-to lab equipment distributor."
              </p>
              <div className="pt-2 border-t border-[#1a1e27] text-xs">
                <p className="font-bold text-white">Marcus Vance</p>
                <p className="text-[11px] text-slate-500">Infrastructure Architect · Austin</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0c0d12] border border-[#1a1e27] space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The Titan CyberPhone flagship exceeded expectations. Flawless hardware enclosure, rapid dispatch, and the Order ID tracking gave real-time dispatch milestones."
              </p>
              <div className="pt-2 border-t border-[#1a1e27] text-xs">
                <p className="font-bold text-white">Elena Rostova</p>
                <p className="text-[11px] text-slate-500">Embedded Firmware Developer · Chicago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenPolicy={(tab) => setPolicyTab(tab)}
        onOpenTrack={() => {
          setTrackingOrderId('');
          setIsTrackOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInstantBuy={handleInstantBuy}
        relatedProducts={relatedProducts}
        onSelectRelated={(p) => setSelectedProduct(p)}
      />

      {/* 2. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setDirectBuyProduct(null);
          setIsCheckoutOpen(true);
        }}
        onBrowse={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Cash on Delivery Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyProduct(null);
        }}
        directBuyProduct={directBuyProduct}
        onOrderSuccess={(orderId) => {
          setTrackingOrderId(orderId);
        }}
      />

      {/* 4. Customer Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onTrackOrder={handleTrackOrderFromAnywhere}
      />

      {/* 5. Order Tracking Modal */}
      <OrderTrackerModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        initialOrderId={trackingOrderId}
      />

      {/* 6. Hardware Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 7. Administrator Command Console */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 8. Information & Policy Modals */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      <PolicyModal
        isOpen={Boolean(policyTab)}
        onClose={() => setPolicyTab(null)}
        initialTab={policyTab || 'privacy'}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartWishlistProvider>
          <Storefront />
        </CartWishlistProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
