"use client";

import { TOrder, TStatusHistoryEntry } from "@/types/common";
import { X, ShoppingCart, User, MapPin, Phone, Calendar, Package, Info, CheckCircle2, Clock, Truck, PackageCheck, XSquare, Undo2, LucideIcon } from "lucide-react";

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: TOrder | null;
}

const statusIcons: Record<string, LucideIcon> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XSquare,
  returned: Undo2,
};

const statusColors: Record<string, string> = {
  pending: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  confirmed: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  shipped: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  delivered: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  cancelled: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  returned: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

const OrderViewModal = ({ isOpen, onClose, order }: OrderViewModalProps) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <ShoppingCart size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Order Details</h2>
              <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                Order ID: <span className="font-mono text-slate-300">#{order._id?.slice(-8).toUpperCase() || "N/A"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Summary & Shipping */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Summary Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Package size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ordered Item</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Package size={24} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-100">{order.productName}</p>
                      <p className="text-xs text-slate-500">Quantity: {order.quantity} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Price per unit</p>
                    <p className="font-bold text-teal-400">৳{((order.subtotal || 0) / (order.quantity || 1)).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/[0.04] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-300 font-medium">৳{(order.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discount Applied</span>
                    <span className="text-rose-400 font-medium">-৳{order.discount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t border-white/[0.04]">
                    <span className="font-bold text-slate-200">Total Amount</span>
                    <span className="font-bold text-teal-400">৳{(order.totalAmount || (order.subtotal || 0) - (order.discount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-slate-400 mb-3">
                    <User size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Customer Info</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-1">{order.customerName}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone size={12} />
                    <span>{order.shippingAddress?.phone || "No phone"}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-slate-400 mb-3">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Shipping To</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {order.shippingAddress?.address || "N/A"}, <br />
                    {order.shippingAddress?.city || ""}, {order.shippingAddress?.district || ""}
                  </p>
                </div>
              </div>

              {/* Date Metadata */}
              <div className="flex items-center gap-6 text-[10px] text-slate-600 px-2">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>PLACED: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unknown"}</span>
                </div>
                {order.deliveredAt && (
                   <div className="flex items-center gap-1.5 text-emerald-500/70">
                   <PackageCheck size={12} />
                   <span>DELIVERED: {new Date(order.deliveredAt as unknown as string).toLocaleString()}</span>
                 </div>
                )}
              </div>
            </div>

            {/* Right Column: Status History Timeline */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Status Timeline</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.orderStatus || "pending"]}`}>
                    Current: {order.orderStatus}
                  </span>
                </div>

                <div className="relative flex-1 space-y-8 ml-3 py-2">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/[0.06]" />

                  {order.statusHistory?.map((entry: TStatusHistoryEntry, idx: number) => {
                    const EntryIcon = statusIcons[entry.status] || Info;
                    const isLatest = idx === order.statusHistory.length - 1;
                    
                    return (
                      <div key={idx} className="relative pl-8 group">
                        {/* Dot */}
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-[#0d1117] flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${isLatest ? 'bg-teal-500 text-black border-teal-500/50 shadow-lg shadow-teal-500/20' : 'bg-slate-800 text-slate-500'}`}>
                          <EntryIcon size={12} strokeWidth={3} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isLatest ? 'text-teal-400' : 'text-slate-400'}`}>
                              {entry.status}
                            </span>
                            <span className="text-[9px] text-slate-600 font-medium">
                              {entry.changedAt ? new Date(entry.changedAt).toLocaleString() : "Recently"}
                            </span>
                          </div>
                          {entry.note ? (
                            <p className="text-xs text-slate-500 italic bg-white/[0.03] p-2 rounded-lg border border-white/[0.04] mt-1.5">
                              &quot;{entry.note}&quot;
                            </p>
                          ) : (
                            <p className="text-[10px] text-slate-700 mt-1 italic">No note provided</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {(!order.statusHistory || order.statusHistory.length === 0) && (
                    <div className="text-center py-12 text-slate-600">
                      <Info size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs italic">No history records yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.02] flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-500">
                <Info size={14} />
                <span className="text-[10px]">Changes to orders automatically adjust product stock levels.</span>
            </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
