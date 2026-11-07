import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Shield,
  Package,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categoryName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenTrack,
  onOpenAdmin,
  onOpenAbout,
  onOpenContact,
  onSelectProduct,
  onSelectCategory,
}) => {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const { cartCount, wishlistCount } = useCartWishlist();
  const { products, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search filtered products
  const matchingProducts = searchQuery.trim().length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#1a1e27]">
      {/* Optional Top Announcement Notice */}
      {settings.notice && (
        <div className="bg-gradient-to-r from-[#087BFF]/20 via-[#00D9FF]/10 to-[#087BFF]/20 border-b border-[#087BFF]/20 px-4 py-1.5 text-center text-xs text-[#00D9FF] flex items-center justify-center gap-2">
          <span className="font-medium tracking-wide">{settings.notice}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onSelectCategory('all');
            }}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
            aria-label="AXIBION Home"
          >
            <img
              src="/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png"
              alt="AXIBION Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              onSelectCategory('all');
            }}
            className="hover:text-[#00D9FF] transition-colors whitespace-nowrap cursor-pointer"
          >
            All Products
          </button>
          <button
            onClick={() => onSelectCategory('Hacking & Cybersecurity Gadgets')}
            className="text-[#00D9FF] hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            Ethical Tech
          </button>
          <button
            onClick={() => onSelectCategory('Mobile Phones')}
            className="hover:text-[#00D9FF] transition-colors whitespace-nowrap cursor-pointer"
          >
            Mobile & Devices
          </button>
          <button
            onClick={onOpenTrack}
            className="hover:text-[#00D9FF] transition-colors whitespace-nowrap cursor-pointer"
          >
            Track Order
          </button>
          <button
            onClick={onOpenAbout}
            className="hover:text-[#00D9FF] transition-colors whitespace-nowrap cursor-pointer"
          >
            About
          </button>
          <button
            onClick={onOpenContact}
            className="hover:text-[#00D9FF] transition-colors whitespace-nowrap cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Search Bar Input (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search gadgets, ethical hacking, phones, audio..."
              className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#087BFF] focus:ring-1 focus:ring-[#087BFF] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {isSearchOpen && matchingProducts.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c0d12] border border-[#1a1e27] rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[11px] font-medium text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                Matching Hardware ({matchingProducts.length})
              </div>
              {matchingProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProductClick(p)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#151922] transition-colors text-left cursor-pointer"
                >
                  <img
                    src={p.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded bg-black/40 border border-[#1a1e27]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{p.category} · {p.brand}</p>
                  </div>
                  <div className="text-xs font-bold text-[#00D9FF] font-mono-numbers">
                    ${p.discountPrice || p.price}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons Zone */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#11141c] transition-colors cursor-pointer"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#087BFF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#11141c] transition-colors flex items-center gap-2 cursor-pointer"
            aria-label="Shopping Cart"
            title="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00D9FF] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth / Profile Dropdown */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-[#1a1e27] hover:border-[#087BFF] transition-all bg-[#0c0d12] cursor-pointer"
                aria-label="Account Menu"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#087BFF] flex items-center justify-center text-xs font-bold text-white">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#0094ff] hover:brightness-110 rounded-lg transition-all shadow-md shadow-[#087BFF]/20 cursor-pointer whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu */}
            {isUserMenuOpen && user && (
              <div
                className="absolute right-0 top-full mt-2 w-56 bg-[#0c0d12] border border-[#1a1e27] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#1a1e27]">
                  <p className="text-xs font-semibold text-white truncate">{user.displayName || 'Customer'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded">
                      ADMINISTRATOR
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={onOpenOrders}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-[#151922] rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    My Orders & History
                  </button>
                  <button
                    onClick={onOpenTrack}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-[#151922] rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <Compass className="w-4 h-4 text-slate-400" />
                    Track Order
                  </button>

                  {isAdmin && (
                    <button
                      onClick={onOpenAdmin}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#00D9FF] hover:bg-[#00D9FF]/10 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <Shield className="w-4 h-4 text-[#00D9FF]" />
                      Admin Control Panel
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-[#1a1e27]">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0b0e] border-b border-[#1a1e27] px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AXIBION tech..."
              className="w-full bg-[#11141c] border border-[#1a1e27] rounded-lg pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>

          {matchingProducts.length > 0 && (
            <div className="bg-[#11141c] rounded-lg p-2 border border-[#1a1e27]">
              {matchingProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProductClick(p)}
                  className="w-full flex items-center justify-between p-2 text-left text-xs text-slate-200 hover:text-[#00D9FF]"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono-numbers text-[#00D9FF] shrink-0 font-bold ml-2">
                    ${p.discountPrice || p.price}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a1e27]">
            <button
              onClick={() => {
                onSelectCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-[#11141c] rounded-lg text-left"
            >
              All Products
            </button>
            <button
              onClick={() => {
                onSelectCategory('Hacking & Cybersecurity Gadgets');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-medium text-[#00D9FF] bg-[#00D9FF]/10 rounded-lg text-left"
            >
              Ethical Tech Lab
            </button>
            <button
              onClick={() => {
                onOpenTrack();
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-[#11141c] rounded-lg text-left"
            >
              Track Order
            </button>
            <button
              onClick={() => {
                onOpenOrders();
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-[#11141c] rounded-lg text-left"
            >
              My Orders
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="col-span-2 px-3 py-2 text-xs font-bold text-[#00D9FF] bg-[#087BFF]/20 rounded-lg text-center"
              >
                Access Admin Panel
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
