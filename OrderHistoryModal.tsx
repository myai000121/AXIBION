import React, { useState } from 'react';
import { X, Package, Clock, CheckCircle2, ChevronDown, ChevronUp, MapPin, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

const STATUS_COLOR_MAP: Record<OrderStatus, { bg: string; text: string }> = {
  'Order Placed': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  Confirmed: { bg: 'bg-cyan-500/10', text: 'text-[#00D9FF]' },
  Processing: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  Shipped: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  'Out for Delivery': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  Delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  Cancelled: { bg: 'bg-rose-500/10', text: 'text-rose-400' },
};

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
}) => {
  const { user } = useAuth();
  const { orders, loadingOrders } = useStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-[#0a0b0e] border border-[#1a1e27] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#1a1e27] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#00D9FF]" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">My Orders & Purchase History</h2>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{user?.email}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151922] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Loading your verified orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#11141c] border border-[#1a1e27] flex items-center justify-center mx-auto text-slate-500">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">No orders placed yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Orders placed with your Google account will appear here with live tracking, delivery updates, and COD receipts.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const statusStyle = STATUS_COLOR_MAP[order.status] || {
                bg: 'bg-slate-500/10',
                text: 'text-slate-300',
              };

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-[#1a1e27] bg-[#0c0d12] overflow-hidden transition-all"
                >
                  <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#00D9FF] font-mono-numbers">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Total (COD)</span>
                        <span className="text-sm font-bold text-white font-mono-numbers">
                          ${order.totalAmount}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(order.id);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#00D9FF] bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#151922] transition-colors cursor-pointer"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Items & Address */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#1a1e27] bg-[#07080b] space-y-3">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Items in this Order
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-slate-300">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-mono-numbers text-white font-medium">
                                ${item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1a1e27] text-xs text-slate-400 flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#00D9FF] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-white font-medium">{order.customerName}</span> ({order.phone})
                          <p>{order.address}, {order.area}, {order.city} - {order.postalCode}</p>
                          {order.notes && <p className="italic text-slate-500 mt-1">Note: "{order.notes}"</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
