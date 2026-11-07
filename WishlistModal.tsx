import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();
  const { products } = useStore();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-2xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#1a1e27] pb-4">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Your Hardware Wishlist</h2>
            <span className="text-xs text-slate-400 font-mono-numbers">({wishlistedProducts.length})</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">Your wishlist is currently empty</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Save diagnostic tools, flagship mobile devices, and computers by clicking the heart icon on any product.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistedProducts.map((p) => {
              const effectivePrice = p.discountPrice || p.price;
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center justify-between gap-4"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                  >
                    <img
                      src={p.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg bg-black/40 border border-[#1a1e27] shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white truncate hover:text-[#00D9FF]">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{p.brand} · {p.category}</p>
                      <span className="text-xs font-bold text-[#00D9FF] font-mono-numbers mt-0.5 block">
                        ${effectivePrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        toggleWishlist(p);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#087BFF] hover:bg-[#0066d6] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(p)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
