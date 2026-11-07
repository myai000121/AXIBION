import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { useCartWishlist } from '../context/CartWishlistContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onBrowse: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onBrowse,
}) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    total,
    freeShippingEligible,
    freeShippingThreshold,
  } = useCartWishlist();

  if (!isOpen) return null;

  const progressPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0b0e] border-l border-[#1a1e27] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#1a1e27] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00D9FF]" />
              <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
              <span className="text-xs text-slate-400 font-mono-numbers">
                ({cart.reduce((a, b) => a + b.quantity, 0)})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151922] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 sm:px-6 py-3 bg-[#0c0d12] border-b border-[#1a1e27]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#00D9FF]" />
                {freeShippingEligible ? (
                  <span className="text-emerald-400 font-semibold">Free Express Shipping Unlocked!</span>
                ) : (
                  <span>Add <strong className="text-[#00D9FF] font-mono-numbers">${remainingForFree.toFixed(0)}</strong> more for Free Shipping</span>
                )}
              </span>
              <span className="text-slate-400 font-mono-numbers text-[11px]">
                Threshold: ${freeShippingThreshold}
              </span>
            </div>
            <div className="w-full bg-[#1a1e27] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#087BFF] to-[#00D9FF] h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#11141c] border border-[#1a1e27] flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Explore our collection of high-tech devices, ethical hacking tools, and mobile gadgets.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onBrowse();
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const effectivePrice = product.discountPrice || product.price;
                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center gap-3.5"
                  >
                    <img
                      src={product.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-black/40 border border-[#1a1e27] shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{product.brand}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-[#00D9FF] font-mono-numbers">
                          ${effectivePrice}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[11px] text-slate-500 line-through font-mono-numbers">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center rounded border border-[#1a1e27] bg-[#07080b]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-[11px] font-bold text-white font-mono-numbers">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-2 py-0.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#07080b] border-t border-[#1a1e27] space-y-4">
              {/* Payment Terms note */}
              <div className="p-2.5 rounded-lg bg-[#0c0d12] border border-[#1a1e27] flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#00D9FF] shrink-0" />
                <span>
                  <strong>Cash on Delivery (COD)</strong> · Zero advance payment required
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers font-medium text-white">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Delivery (COD Express)</span>
                  <span className="font-mono-numbers font-medium text-white">
                    {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${shipping}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-[#1a1e27]">
                  <span>Total Amount Due</span>
                  <span className="font-mono-numbers text-[#00D9FF] text-base">${total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#087BFF] to-[#0066d6] hover:brightness-110 shadow-lg shadow-[#087BFF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
