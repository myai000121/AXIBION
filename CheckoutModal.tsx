import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  User as UserIcon,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCartWishlist } from '../context/CartWishlistContext';
import { useStore } from '../context/StoreContext';
import { Product, OrderItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directBuyProduct?: { product: Product; quantity: number } | null;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directBuyProduct,
  onOrderSuccess,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const { cart, clearCart, subtotal: cartSubtotal, shipping: cartShipping, total: cartTotal } = useCartWishlist();
  const { createOrder, settings } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync user info into form when user signs in
  useEffect(() => {
    if (user) {
      setCustomerName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  // Determine items to order (either from directBuy or from cart)
  const itemsToOrder: OrderItem[] = directBuyProduct
    ? [
        {
          productId: directBuyProduct.product.id,
          name: directBuyProduct.product.name,
          price: directBuyProduct.product.discountPrice || directBuyProduct.product.price,
          quantity: directBuyProduct.quantity,
          image: directBuyProduct.product.images[0] || '',
          category: directBuyProduct.product.category,
        },
      ]
    : cart.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        quantity,
        image: product.images[0] || '',
        category: product.category,
      }));

  const subtotal = directBuyProduct
    ? (directBuyProduct.product.discountPrice || directBuyProduct.product.price) * directBuyProduct.quantity
    : cartSubtotal;

  const threshold = settings.freeShippingThreshold || 200;
  const shipping = subtotal >= threshold ? 0 : 15;
  const totalAmount = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('Please sign in with your Google account before placing an order.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }
    if (!address.trim() || !city.trim() || !area.trim() || !postalCode.trim()) {
      setErrorMessage('Please complete all delivery address fields (Street, City, Area, Postal Code).');
      return;
    }

    if (itemsToOrder.length === 0) {
      setErrorMessage('Your order has no items.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        userId: user.uid,
        customerName: customerName.trim() || user.displayName || 'Customer',
        email: user.email || email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        area: area.trim(),
        postalCode: postalCode.trim(),
        notes: notes.trim(),
        items: itemsToOrder,
        totalAmount,
        paymentMethod: 'Cash on Delivery',
        status: 'Order Placed',
      });

      if (!directBuyProduct) {
        clearCart();
      }

      setConfirmedOrderId(orderId);
      onOrderSuccess(orderId);
    } catch (err: unknown) {
      console.error('Failed to submit order:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to place order. Please check inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (confirmedOrderId) {
      navigator.clipboard.writeText(confirmedOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#1a1e27] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              {confirmedOrderId ? 'Order Confirmed!' : 'Complete Your Order'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151922] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Receipt View */}
        {confirmedOrderId ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#00D9FF] uppercase tracking-wider">
                Order Placed Successfully
              </span>
              <h3 className="text-2xl font-extrabold text-white">Thank you for your order!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We have registered your Cash on Delivery order. Our warehouse team is preparing your package for express dispatch.
              </p>
            </div>

            {/* Order ID Box */}
            <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] max-w-md mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">Your Order ID</span>
                <p className="text-sm font-bold text-[#00D9FF] font-mono-numbers">{confirmedOrderId}</p>
              </div>
              <button
                onClick={handleCopyOrderId}
                className="px-3 py-1.5 rounded-lg bg-[#151922] text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 border border-[#1a1e27] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-xl bg-[#07080a] border border-[#1a1e27] max-w-md mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="font-semibold text-white">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Amount Due on Delivery</span>
                <span className="font-bold text-[#00D9FF] font-mono-numbers text-sm">${totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Address</span>
                <span className="text-white text-right truncate max-w-[200px]">{address}, {city}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-all cursor-pointer"
              >
                Continue Browsing Catalog
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Google Authentication Guard */}
            {!user ? (
              <div className="p-4 rounded-xl bg-[#087BFF]/10 border border-[#087BFF]/30 space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#00D9FF] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Google Sign-In Required for Checkout
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      To ensure order security, delivery verification, and tracking, customers must sign in with their Google Gmail account before placing an order.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#087BFF] to-[#0066d6] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#087BFF]/20"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In with Google Gmail</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#087BFF] text-white flex items-center justify-center font-bold">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.displayName || 'Customer'}</p>
                    <p className="text-slate-400 text-[11px]">{user.email}</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-medium text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded">
                  Authenticated
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Delivery Information Fields */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Delivery & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number (for COD Delivery) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-019-2834"
                    className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Street Address & House / Suite <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Seattle"
                    className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Area / District <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Downtown"
                    className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Postal Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 98101"
                    className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring bell at reception, call before delivery"
                  className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#087BFF]"
                />
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Payment Method
              </h3>
              <div className="p-3.5 rounded-xl bg-[#0c0d12] border-2 border-[#00D9FF]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-[#00D9FF] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00D9FF]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-slate-400">
                      Pay cash to the courier when receiving and inspecting your package. No advance payment required.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  GUARANTEED
                </span>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                3. Order Items ({itemsToOrder.length})
              </h3>
              <div className="rounded-xl border border-[#1a1e27] bg-[#0c0d12] p-3 divide-y divide-[#1a1e27] max-h-36 overflow-y-auto">
                {itemsToOrder.map((item, idx) => (
                  <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[320px]">
                      <span className="font-mono-numbers text-slate-400">{item.quantity}x</span>
                      <span className="text-white truncate">{item.name}</span>
                    </div>
                    <span className="font-mono-numbers font-bold text-[#00D9FF] shrink-0">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-2 border-t border-[#1a1e27] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono-numbers font-medium text-white">${subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Express Courier Shipping</span>
                <span className="font-mono-numbers font-medium text-white">
                  {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1a1e27]">
                <span>Total Amount Due on Delivery</span>
                <span className="font-mono-numbers text-[#00D9FF] text-base">${totalAmount}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !user}
              className="w-full py-3.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#087BFF] to-[#0066d6] hover:brightness-110 shadow-lg shadow-[#087BFF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <span>Confirm Cash on Delivery Order (${totalAmount})</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
