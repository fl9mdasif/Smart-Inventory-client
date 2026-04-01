"use client";

import { useState, useEffect } from "react";
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
  PackageCheck,
  Search,
  Filter,
  Eye,
  type LucideIcon
} from "lucide-react";
import toast from "react-hot-toast";
import { TOrder, TOrderStatus } from "@/types/common";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/redux/api/orderApi";
import OrderUpdateModal from "./OrderUpdateModal";
import OrderViewModal from "./OrderViewModal";

const statusStyle: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  returned: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const statusIcons: Record<string, LucideIcon> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XSquare,
  returned: Undo2,
};

const OrdersPage = () => {
  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<TOrder | null>(null);

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Prepare Query Params
  const queryParams: Record<string, unknown> = {};
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (selectedStatus) queryParams.status = selectedStatus;

  const { data: ordersData, isLoading, refetch } = useGetAllOrdersQuery(queryParams);
  const orders: TOrder[] = ordersData?.data ?? [];

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleOpenUpdate = (order: TOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOpenView = (order: TOrder) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setViewingOrder(null);
  };

  const handleUpdateStatus = async (id: string, data: { orderStatus: TOrderStatus; note?: string }) => {
    try {
      await updateOrder({ id, data }).unwrap();
      toast.success(`Order marked as ${data.orderStatus}`);
      handleClose();
      refetch();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr.data?.message || "Failed to update order status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this order record?")) return;
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted.");
      refetch();
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr.data?.message || "Failed to delete order.");
    }
  };

  if (isLoading && !debouncedSearch && !selectedStatus) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <ShoppingCart className="w-5 h-5 text-teal-400" />
            </div>
            Orders
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#0d1117] border border-white/[0.06] shadow-xl">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by customer name, product, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

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
                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4 font-mono text-[10px] text-slate-500">
                        #{order._id?.slice(-8).toUpperCase() || "ORD-001"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-100">{order.customerName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span>{order.shippingAddress.phone}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{order.shippingAddress.city}</span>
                          </div>
                        </div>
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
                          ৳{order.totalAmount?.toLocaleString() || "0"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenView(order)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenUpdate(order)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                            title="Update Status"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => order._id && handleDelete(order._id)}
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

      <OrderViewModal 
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        order={viewingOrder}
      />
    </div>
  );
};

export default OrdersPage;
