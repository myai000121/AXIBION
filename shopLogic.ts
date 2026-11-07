/**
 * AXIBION Core E-Commerce & Authorization Logic
 */

export const ADMIN_EMAILS: readonly string[] = [
  'myai000121@gmail.com',
  'fk9175679@gmail.com',
];

export function isAuthorizedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized);
}

export interface CartItemComputation {
  price: number;
  discountPrice?: number;
  quantity: number;
}

export function computeItemEffectivePrice(price: number, discountPrice?: number): number {
  if (discountPrice !== undefined && discountPrice > 0 && discountPrice < price) {
    return discountPrice;
  }
  return price;
}

export function computeCartSubtotal(items: CartItemComputation[]): number {
  return items.reduce((total, item) => {
    const effectivePrice = computeItemEffectivePrice(item.price, item.discountPrice);
    return total + effectivePrice * Math.max(1, item.quantity);
  }, 0);
}

export function computeShipping(subtotal: number, threshold: number = 200): number {
  if (subtotal <= 0) return 0;
  return subtotal >= threshold ? 0 : 15;
}

export function computeOrderTotal(items: CartItemComputation[], threshold: number = 200): {
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingEligible: boolean;
} {
  const subtotal = computeCartSubtotal(items);
  const shipping = computeShipping(subtotal, threshold);
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShippingEligible: subtotal >= threshold,
  };
}

export function generateOrderId(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  const timeHex = Date.now().toString(16).slice(-5).toUpperCase();
  return `AXB-${randomSuffix}${timeHex}`;
}

export const VALID_ORDER_STATUSES = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
] as const;

export type OrderStatus = typeof VALID_ORDER_STATUSES[number];

export function getNextOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = VALID_ORDER_STATUSES.indexOf(current);
  if (idx >= 0 && idx < VALID_ORDER_STATUSES.length - 2) {
    // Deliver is before Cancelled
    return VALID_ORDER_STATUSES[idx + 1];
  }
  return null;
}
