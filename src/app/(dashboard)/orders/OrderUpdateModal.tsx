"use client";

import { TOrder, TOrderStatus } from "@/types/common";
import { useEffect, useState } from "react";
import { X, Loader2, ClipboardList, CheckCircle2 } from "lucide-react";

interface OrderUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: { orderStatus: TOrderStatus; note?: string }) => void;
  order: TOrder | null;
  isLoading: boolean;
}

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors cursor-pointer"
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors resize-none"
    rows={3}
  />
);

const OrderUpdateModal = ({
  isOpen,
  onClose,
  onSave,
  order,
  isLoading,
}: OrderUpdateModalProps) => {
  const [status, setStatus] = useState<TOrderStatus>("pending");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen && order) {
      setStatus(order.orderStatus || "pending");
      setNote("");
    }
  }, [order, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || isLoading) return;
    if (order._id) {
      onSave(order._id, { orderStatus: status, note });
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ClipboardList size={18} className="text-teal-500" />
            Update Order Status
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-500/10 mb-4">
            <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mb-1">Customer</p>
            <p className="text-sm text-slate-200 font-medium">{order.customerName}</p>
            <p className="text-xs text-slate-500 mt-1">{order.productName} (x{order.quantity})</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Order Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TOrderStatus)}
              disabled={isLoading}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </Select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Update Note (Optional)
            </label>
            <Textarea
              placeholder="e.g. Package ready for pickup, address verified..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.06] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 transition-all shadow-lg shadow-teal-900/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {isLoading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderUpdateModal;
