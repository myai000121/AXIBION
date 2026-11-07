import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem } from '../types';
import { computeOrderTotal, computeItemEffectivePrice } from '../utils/shopLogic';

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  wishlistCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
}

const CartWishlistContext = createContext<CartWishlistContextType | null>(null);

const CART_STORAGE_KEY = 'axibion_cart_v1';
const WISHLIST_STORAGE_KEY = 'axibion_wishlist_v1';

export const CartWishlistProvider: React.FC<{
  children: React.ReactNode;
  freeShippingThreshold?: number;
}> = ({ children, freeShippingThreshold = 200 }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const computationItems = cart.map((item) => ({
    price: item.product.price,
    discountPrice: item.product.discountPrice,
    quantity: item.quantity,
  }));

  const orderTotals = computeOrderTotal(computationItems, freeShippingThreshold);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        wishlistCount,
        subtotal: orderTotals.subtotal,
        shipping: orderTotals.shipping,
        total: orderTotals.total,
        freeShippingEligible: orderTotals.freeShippingEligible,
        freeShippingThreshold,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};
