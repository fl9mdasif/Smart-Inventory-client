"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  Loader2, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XSquare, 
  Undo2,
  PackageCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { TOrder, TOrderStatus } from "@/types/common";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/redux/api/orderApi";
import OrderUpdateModal from "./OrderUpdateModal";

const statusStyle: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  returned: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XSquare,
  returned: Undo2,
};

const OrdersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  const { data: ordersData, isLoading, refetch } = useGetAllOrdersQuery({});
  const orders: TOrder[] = ordersData?.data ?? [];

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleOpenUpdate = (order: TOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (id: string, data: { orderStatus: TOrderStatus; note?: string }) => {
    try {
      await updateOrder({ id, data }).unwrap();
      toast.success(`Order marked as ${data.orderStatus}`);
      handleClose();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update order status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this order record?")) return;
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted.");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete order.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <ShoppingCart className="w-5 h-5 text-teal-400" />
            </div>
            Orders
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden shadow-2xl">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-teal-400" />
            </div>
            <p className="text-slate-300 font-medium">No orders yet</p>
            <p className="text-slate-500 text-sm mt-1">Orders will appear here once customers place them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Order ID</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Customer</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Product</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Qty</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Total</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {orders.map((order: TOrder) => {
                  const StatusIcon = statusIcons[order.orderStatus || "pending"];
                  return (
                    <tr key={(order as any)._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 font-mono text-[10px] text-slate-500">
                        #{(order as any)._id?.slice(-8).toUpperCase() || "ORD-001"}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-200">{order.customerName}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{order.shippingAddress.city}, {order.shippingAddress.country || "BD"}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {order.productName || "Product Name"}
                      </td>
                      <td className="px-5 py-4 text-center font-medium text-slate-300">
                        {order.quantity}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyle[order.orderStatus || "pending"]}`}>
                          <StatusIcon size={12} />
                          {order.orderStatus || "pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-teal-400 font-bold">
                          ৳{order.subtotal?.toLocaleString() || "0"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenUpdate(order)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
                            title="Update Status"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => (order as any)._id && handleDelete((order as any)._id)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderUpdateModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleUpdateStatus}
        order={selectedOrder}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default OrdersPage;
