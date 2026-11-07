import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { VALID_ORDER_STATUSES } from '../utils/shopLogic';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

const STEP_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
}) => {
  const { orders } = useStore();
  const [searchId, setSearchId] = useState(initialOrderId);
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      const found = orders.find(
        (o) => o.id.toLowerCase().trim() === initialOrderId.toLowerCase().trim()
      );
      setMatchedOrder(found || null);
      setSearched(true);
    }
  }, [initialOrderId, orders]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = orders.find(
      (o) => o.id.toLowerCase().trim() === searchId.toLowerCase().trim()
    );
    setMatchedOrder(found || null);
    setSearched(true);
  };

  const getStepState = (step: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    const currentIndex = STEP_STATUSES.indexOf(currentStatus);
    const stepIndex = STEP_STATUSES.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
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
            <Truck className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-base sm:text-lg font-bold text-white">Track Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151922] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. AXB-8X9Y2)"
                className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#087BFF] font-mono-numbers"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors cursor-pointer shrink-0"
            >
              Lookup
            </button>
          </form>

          {/* Results Display */}
          {matchedOrder ? (
            <div className="space-y-6">
              {/* Order Status Banner */}
              <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Current Status
                  </span>
                  <p className="text-lg font-extrabold text-[#00D9FF] mt-0.5">
                    {matchedOrder.status}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Order ID: <span className="font-mono-numbers text-white">{matchedOrder.id}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Total Due (COD)</span>
                  <span className="text-base font-bold text-white font-mono-numbers">
                    ${matchedOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* Step Timeline */}
              {matchedOrder.status === 'Cancelled' ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <strong className="block text-sm">Order Cancelled</strong>
                    <span>This order was cancelled. If you believe this is an error, please reach our customer support team.</span>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="relative flex justify-between items-start">
                    {/* Progress Connecting Line */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#1a1e27] -z-0" />

                    {STEP_STATUSES.map((step, idx) => {
                      const state = getStepState(step, matchedOrder.status);
                      return (
                        <div key={idx} className="relative z-10 flex flex-col items-center max-w-[80px] text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              state === 'completed'
                                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                                : state === 'active'
                                ? 'bg-[#00D9FF] text-black ring-4 ring-[#00D9FF]/20 shadow-md shadow-[#00D9FF]/30'
                                : 'bg-[#151922] text-slate-500 border border-[#1a1e27]'
                            }`}
                          >
                            {state === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-semibold mt-2 leading-tight ${
                              state === 'active'
                                ? 'text-[#00D9FF]'
                                : state === 'completed'
                                ? 'text-slate-200'
                                : 'text-slate-500'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Destination & Package Details */}
              <div className="p-4 rounded-xl bg-[#07080b] border border-[#1a1e27] space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Delivery Destination</p>
                    <p className="text-slate-400 mt-0.5">
                      {matchedOrder.customerName} · {matchedOrder.phone}
                    </p>
                    <p className="text-slate-300">
                      {matchedOrder.address}, {matchedOrder.area}, {matchedOrder.city} - {matchedOrder.postalCode}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1a1e27] flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Payment: Cash on Delivery</span>
                  <span>Items: {matchedOrder.items.length} unit(s)</span>
                </div>
              </div>
            </div>
          ) : searched ? (
            <div className="text-center py-8 space-y-2">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-xs font-semibold text-white">Order Not Found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active order matches "{searchId}". Please verify the Order ID or check your Account Order History.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] text-xs text-slate-400 space-y-1">
              <p className="text-white font-medium">How order tracking works:</p>
              <p>1. Enter your unique Order ID generated during checkout.</p>
              <p>2. View live dispatch status updated directly by our dispatch administrators.</p>
              <p>3. Pay cash to the courier once your package arrives.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
