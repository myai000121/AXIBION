import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAuthorizedAdmin,
  computeItemEffectivePrice,
  computeCartSubtotal,
  computeShipping,
  computeOrderTotal,
  generateOrderId,
  VALID_ORDER_STATUSES,
} from './shopLogic';

test('isAuthorizedAdmin correctly verifies the two admin accounts only', () => {
  assert.equal(isAuthorizedAdmin('myai000121@gmail.com'), true);
  assert.equal(isAuthorizedAdmin('fk9175679@gmail.com'), true);
  assert.equal(isAuthorizedAdmin('MYAI000121@GMAIL.COM'), true);
  assert.equal(isAuthorizedAdmin('unauthorized@gmail.com'), false);
  assert.equal(isAuthorizedAdmin(''), false);
  assert.equal(isAuthorizedAdmin(null), false);
  assert.equal(isAuthorizedAdmin(undefined), false);
});

test('computeItemEffectivePrice applies valid discount price', () => {
  assert.equal(computeItemEffectivePrice(100, 80), 80);
  assert.equal(computeItemEffectivePrice(100, 120), 100); // invalid discount higher than price
  assert.equal(computeItemEffectivePrice(100, 0), 100);
  assert.equal(computeItemEffectivePrice(100), 100);
});

test('computeCartSubtotal sums all item prices with quantities', () => {
  const items = [
    { price: 100, discountPrice: 80, quantity: 2 }, // 160
    { price: 50, quantity: 1 }, // 50
  ];
  assert.equal(computeCartSubtotal(items), 210);
});

test('computeShipping applies free shipping at threshold', () => {
  assert.equal(computeShipping(150, 200), 15);
  assert.equal(computeShipping(200, 200), 0);
  assert.equal(computeShipping(350, 200), 0);
  assert.equal(computeShipping(0, 200), 0);
});

test('computeOrderTotal calculates subtotal, shipping and free shipping flag', () => {
  const result = computeOrderTotal([{ price: 150, quantity: 1 }], 200);
  assert.equal(result.subtotal, 150);
  assert.equal(result.shipping, 15);
  assert.equal(result.total, 165);
  assert.equal(result.freeShippingEligible, false);

  const eligibleResult = computeOrderTotal([{ price: 250, quantity: 1 }], 200);
  assert.equal(eligibleResult.subtotal, 250);
  assert.equal(eligibleResult.shipping, 0);
  assert.equal(eligibleResult.total, 250);
  assert.equal(eligibleResult.freeShippingEligible, true);
});

test('generateOrderId creates unique prefix format AXB-XXXXX', () => {
  const id = generateOrderId();
  assert.match(id, /^AXB-[A-Z0-9]+$/);
});

test('VALID_ORDER_STATUSES contains all required order flow steps', () => {
  assert.deepEqual(VALID_ORDER_STATUSES, [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ]);
});
