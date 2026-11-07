import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Check,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantBuy: (product: Product, quantity: number) => void;
  relatedProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onInstantBuy,
  relatedProducts,
  onSelectRelated,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    onInstantBuy(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-6 p-6 bg-[#060709] border-b md:border-b-0 md:border-r border-[#1a1e27] flex flex-col justify-between space-y-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/50 border border-[#1a1e27]">
              <img
                src={product.images[selectedImageIndex] || product.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isSample && (
                <span className="absolute top-3 left-3 text-[10px] font-bold text-slate-300 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 uppercase tracking-wider">
                  Sample Item
                </span>
              )}
            </div>

            {/* Thumbnail Switcher */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-[#087BFF] scale-105' : 'border-[#1a1e27] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Reassurance strip */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1a1e27] text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00D9FF]" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Hardware</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Purchase Module (7 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Brand */}
              <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider">
                <span>{product.category}</span>
                <span className="text-slate-500">·</span>
                <span className="font-semibold text-white">{product.brand}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {product.name}
              </h2>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold font-mono-numbers ml-1">{product.rating}</span>
                </div>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{product.reviewCount} customer reviews</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-medium">
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </div>

              {/* Price Row */}
              <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Price (Cash on Delivery)</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white font-mono-numbers">
                      ${currentPrice}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-slate-500 line-through font-mono-numbers">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <span className="text-xs font-bold text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/30 px-2.5 py-1 rounded">
                    Save ${product.price - product.discountPrice!}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Technical Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Technical Specifications
                  </h4>
                  <div className="rounded-lg border border-[#1a1e27] overflow-hidden text-xs divide-y divide-[#1a1e27]">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 px-3 py-2 bg-[#0c0d12] odd:bg-[#07080a]">
                        <span className="text-slate-400">{key}</span>
                        <span className="text-white font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions & Quantity Stepper */}
            <div className="space-y-4 pt-4 border-t border-[#1a1e27]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-slate-400">Quantity:</span>
                <div className="flex items-center rounded-lg border border-[#1a1e27] bg-[#0c0d12]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-white font-mono-numbers min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`ml-auto p-2.5 rounded-lg border transition-all cursor-pointer ${
                    wishlisted
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-[#0c0d12] text-slate-400 hover:text-white border-[#1a1e27]'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-400' : ''}`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="px-4 py-3 rounded-lg text-xs font-bold text-white bg-[#151922] hover:bg-[#1f2533] border border-[#1a1e27] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  {addedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingCart className="w-4 h-4 text-[#00D9FF]" />}
                  <span>{addedNotice ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="px-4 py-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#087BFF] to-[#0066d6] hover:brightness-110 shadow-lg shadow-[#087BFF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  <span>Buy Now (COD)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Strip */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-[#07080b] border-t border-[#1a1e27]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Related Hardware in {product.category}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="p-2.5 rounded-lg bg-[#0c0d12] border border-[#1a1e27] hover:border-[#087BFF] text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <img
                    src={rel.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
                    alt={rel.name}
                    className="w-full h-24 object-cover rounded mb-2 bg-black/40"
                  />
                  <div>
                    <p className="text-xs font-medium text-white truncate">{rel.name}</p>
                    <p className="text-xs font-bold text-[#00D9FF] font-mono-numbers mt-1">
                      ${rel.discountPrice || rel.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
