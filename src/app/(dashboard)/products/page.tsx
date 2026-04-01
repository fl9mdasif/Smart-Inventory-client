"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Loader2, Package, Edit, Trash2, ShoppingCart, Search, Filter, X, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { TProduct, TOrder, TCategory } from "@/types/common";
import ProductFormModal from "./ProductFormModal";
import OrderCreateModal from "./OrderCreateModal";
import ProductViewModal from "./ProductViewModal";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/redux/api/productApi";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import Image from "next/image";

const statusStyle: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  out_of_stock: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  low_stock: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const ProductsPage = () => {
  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [orderingProduct, setOrderingProduct] = useState<TProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<TProduct | null>(null);

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch Categories for filter
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const categories: TCategory[] = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data ?? [];

  // Prepare Query Params
  const queryParams: Record<string, unknown> = {};
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (selectedCategory) queryParams.category = selectedCategory;
  if (selectedStatus) queryParams.status = selectedStatus;

  const { data: productsData, refetch, isLoading } = useGetAllProductsQuery(queryParams);
  const products: TProduct[] = productsData?.data ?? [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  const handleOpenCreate = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleOpenDetail = (product: TProduct) => { setViewingProduct(product); setIsDetailModalOpen(true); };
  const handleOpenEdit = (product: TProduct) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleOpenOrder = (product: TProduct) => { setOrderingProduct(product); setIsOrderModalOpen(true); };

  const handleClose = () => { setIsModalOpen(false); setEditingProduct(null); };
  const handleCloseOrder = () => { setIsOrderModalOpen(false); setOrderingProduct(null); };
  const handleCloseDetail = () => { setIsDetailModalOpen(false); setViewingProduct(null); };

  const handleSave = async (data: Partial<TProduct>) => {
    const payload = { ...data };
    delete (payload as any)._id;
    delete (payload as any).createdAt;
    delete (payload as any).updatedAt;
    try {
      if ((editingProduct as any)?._id) {
        await updateProduct({ id: (editingProduct as any)._id, data: payload }).unwrap();
        toast.success("Product updated!");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created!");
      }
      handleClose();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data || "Failed to save product.");
    }
  };

  const handlePlaceOrder = async (orderData: TOrder) => {
    try {
      await createOrder(orderData).unwrap();
      toast.success("Order placed successfully!");
      handleCloseOrder();
      refetch(); // Refresh stock levels
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data || "Failed to place order.");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted.");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.data || "Failed to delete product.");
    }
  };

  if (isLoading && !debouncedSearch && !selectedCategory && !selectedStatus) {
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
              <Package className="w-5 h-5 text-teal-400" />
            </div>
            Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/30"
        >
          <PlusCircle size={16} />
          Add Product
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#0d1117] border border-white/[0.06] shadow-xl">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden shadow-2xl">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-teal-400" />
            </div>
            <p className="text-slate-300 font-medium">No products yet</p>
            <p className="text-slate-500 text-sm mt-1">Click "Add Product" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Product</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Category</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Price</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Stock</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {products.map((product: TProduct) => {
                  const isLowStock = (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) <= (product.minStockThreshold ?? 5);
                  const isOutOfStock = (product.stockQuantity ?? 0) === 0;
                  const status = isOutOfStock ? 'out_of_stock' : (isLowStock ? 'low_stock' : 'active');

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
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-400 font-medium">{(product.category as any)?.name || product.category || "—"}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-teal-400 font-bold">${product.price?.toFixed(2) || "0.00"}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`font-bold ${isOutOfStock ? 'text-rose-500' : (isLowStock ? 'text-amber-500' : 'text-slate-300')}`}>
                          {product.stockQuantity ?? 0}
                        </span>
                        <p className="text-[10px] text-slate-600">min: {product.minStockThreshold ?? 5}</p>
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
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenOrder(product)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            title="Place Order"
                          >
                            <ShoppingCart size={16} />
                          </button>
                          <button
                            onClick={() => (product as any)._id && handleDelete((product as any)._id)}
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

      <ProductFormModal
        isLoading={isCreating || isUpdating}
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        product={editingProduct}
      />

      <OrderCreateModal
        isLoading={isPlacingOrder}
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrder}
        onSave={handlePlaceOrder}
        product={orderingProduct}
      />

      <ProductViewModal 
        isOpen={isDetailModalOpen} 
        onClose={handleCloseDetail} 
        product={viewingProduct} 
      />
    </div>
  );
};

export default ProductsPage;
