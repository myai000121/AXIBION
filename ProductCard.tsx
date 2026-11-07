import React from 'react';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useCartWishlist } from '../context/CartWishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const wishlisted = isInWishlist(product.id);

  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-[#0c0d12] border border-[#1a1e27] hover:border-[#087BFF]/60 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#087BFF]/10 flex flex-col cursor-pointer"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-4/3 w-full bg-[#08090c] overflow-hidden">
        <img
          src={product.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {product.isSample && (
            <span className="text-[10px] font-bold text-slate-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
              Sample Item
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-bold text-white bg-[#087BFF] px-2 py-0.5 rounded uppercase tracking-wider">
              Save ${product.price - product.discountPrice!}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            wishlisted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/60 text-slate-300 hover:text-white border border-white/10'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Stock Status Indicator */}
        <div className="absolute bottom-2.5 left-2.5">
          {product.stock > 0 ? (
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
            </span>
          ) : (
            <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-wider mb-1">
            <span className="truncate max-w-[140px]">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-400 shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-mono-numbers text-slate-300 font-medium">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-white group-hover:text-[#00D9FF] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#1a1e27] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-white font-mono-numbers">
              ${currentPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through font-mono-numbers">
                ${product.price}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.stock > 0) {
                addToCart(product, 1);
              }
            }}
            disabled={product.stock <= 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              product.stock > 0
                ? 'bg-[#151922] text-[#00D9FF] hover:bg-[#087BFF] hover:text-white border border-[#1a1e27] hover:border-[#087BFF]'
                : 'bg-[#11141c] text-slate-600 border border-transparent cursor-not-allowed'
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
