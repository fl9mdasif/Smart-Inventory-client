"use client";

import { useState, useEffect } from "react";
import { Loader2, Package, Edit, Search, AlertTriangle, Eye, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { TProduct } from "@/types/common";
import ProductFormModal from "../products/ProductFormModal";
import ProductViewModal from "../products/ProductViewModal";
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import Image from "next/image";
import Link from "next/link";

const statusStyle: Record<string, string> = {
  out_of_stock: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  low_stock: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const RestockQueuePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<TProduct | null>(null);

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: productsData, refetch, isLoading } = useGetAllProductsQuery({
    search: debouncedSearch
  });

  // FILTERING LOGIC: Only show products needing restock
  const products: TProduct[] = (productsData?.data ?? []).filter((p: TProduct) => 
    (p.stockQuantity ?? 0) <= (p.minStockThreshold ?? 5)
  );

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleOpenDetail = (product: TProduct) => { setViewingProduct(product); setIsDetailModalOpen(true); };
  const handleOpenEdit = (product: TProduct) => { setEditingProduct(product); setIsModalOpen(true); };

  const handleClose = () => { setIsModalOpen(false); setEditingProduct(null); };
  const handleCloseDetail = () => { setIsDetailModalOpen(false); setViewingProduct(null); };

  const handleSave = async (data: Partial<TProduct>) => {
    const payload = { ...data };
    try {
      if ((editingProduct as any)?._id) {
        await updateProduct({ id: (editingProduct as any)._id, data: payload }).unwrap();
        toast.success("Stock updated successfully!");
      }
      handleClose();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data || "Failed to update stock.");
    }
  };

  if (isLoading && !debouncedSearch) {
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
          <div className="flex items-center gap-2 text-teal-500 text-xs font-semibold mb-2 group">
             <Link href="/dashboard" className="flex items-center gap-1 hover:underline">
               <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
               Back to Dashboard
             </Link>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            Restock Queue
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Displaying {products.length} products that are critically low or out of stock.
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-amber-500/20 via-white/[0.06] to-transparent" />

      {/* Search */}
      <div className="p-4 rounded-2xl bg-[#0d1117] border border-white/[0.06] shadow-xl">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search low stock items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden shadow-2xl">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-slate-300 font-medium">Clear Warehouse!</p>
            <p className="text-slate-500 text-sm mt-1">No products currently require restocking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Product</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Category</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Current Stock</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Threshold</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {products.map((product: TProduct) => {
                  const isOutOfStock = (product.stockQuantity ?? 0) === 0;
                  const status = isOutOfStock ? 'out_of_stock' : 'low_stock';

                  return (
                    <tr key={(product as any)._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {product.thumbnail ? (
                            <Image src={product.thumbnail} alt={product.name} width={48} height={48}
                              className="w-10 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-slate-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-200">{product.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{(product as any)?.category?.name || "Product"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-medium">
                        {(product as any)?.category?.name || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-lg font-bold ${isOutOfStock ? 'text-rose-500' : 'text-amber-500'}`}>
                          {product.stockQuantity ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-slate-500 font-medium">
                        {product.minStockThreshold ?? 5}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyle[status]}`}>
                          {status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center gap-2">
                           <button
                            onClick={() => handleOpenDetail(product)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold hover:bg-teal-500/20 transition-all"
                          >
                            <Edit size={14} />
                            Restock
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

      <ProductFormModal
        isLoading={isUpdating}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        product={editingProduct}
      />

      <ProductViewModal 
        isOpen={isDetailModalOpen} 
        onClose={handleCloseDetail} 
        product={viewingProduct} 
      />
    </div>
  );
};

export default RestockQueuePage;
