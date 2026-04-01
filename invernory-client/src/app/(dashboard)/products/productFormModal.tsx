"use client";

import { TProduct, TCategory } from "@/types/common";
import { useEffect, useState } from "react";
import { X, Loader2, Package, Tag, Hash, AlertCircle } from "lucide-react";
import { ImageUploader } from "@/services/ImageUploader";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<TProduct>) => void;
  product: TProduct | null;
  isLoading: boolean;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors"
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors resize-none"
    rows={3}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors appearance-none cursor-pointer"
  />
);

const ProductFormModal = ({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading,
}: ProductFormModalProps) => {
  const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoriesQuery({});
  // const categories: 
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    thumbnail: "",
    price: 0,
    stockQuantity: 0,
    minStockThreshold: 5,
    status: "active" as "active" | "out_of_stock" | "low_stock",
  });

  // Handle Initial Data Loading
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          category: (product.category as any)?._id || product.category || "",
          thumbnail: product.thumbnail || "",
          price: product.price || 0,
          stockQuantity: product.stockQuantity ?? 0,
          minStockThreshold: product.minStockThreshold ?? 5,
          status: product.status || "active",
        });
      } else {
        setFormData((prev) => ({
          ...prev,
          // Only set category if it was empty and we now have categories
          category: prev.category || categories[0]?._id || "",
        }));
      }
    }
  }, [product, isOpen, categories]); // Use categories.length as dependency

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,

  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-generate slug from name if creating new product
      if (name === 'name' && !product) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      // Update status based on stock if stock fields change
      if (name === 'stockQuantity' || name === 'minStockThreshold') {
        const stock = name === 'stockQuantity' ? Number(value) : prev.stockQuantity;
        const min = name === 'minStockThreshold' ? Number(value) : prev.minStockThreshold;
        if (stock === 0) newData.status = 'out_of_stock';
        else if (stock <= min) newData.status = 'low_stock';
        else newData.status = 'active';
      }

      return newData;
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    onSave({
      ...formData,
      stockQuantity: Number(formData.stockQuantity),
      minStockThreshold: Number(formData.minStockThreshold),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Package size={18} className="text-teal-500" />
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Thumbnail Upload */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                Product Image
              </label>
              <ImageUploader
                onUploadSuccess={handleImageUpload}
                initialImageUrl={formData.thumbnail}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Product Name
                </label>
                <Input
                  name="name"
                  placeholder="e.g. Premium Basmati Rice"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Slug
                </label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    name="slug"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-400 font-mono text-xs focus:outline-none disabled:opacity-50"
                    placeholder="premium-basmati-rice"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Product specifications and details..."
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="pl-9"
                    required
                    disabled={isLoading || isLoadingCategories}
                  >
                    <option value="" disabled>
                      {isLoadingCategories ? "Loading categories..." : "Select Category"}
                    </option>
                    {categories.map((cat: TCategory) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} {!cat.isActive && "(Inactive)"}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Status
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled
                  className="bg-black/20 text-slate-500 italic"
                >
                  <option value="active">Active</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/[0.04]">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  Unit Price ($)
                  <span className="text-[9px] lowercase font-normal italic opacity-60">sale price per unit</span>
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                  Stock Quantity
                  <span className="text-[9px] lowercase font-normal italic opacity-60">available units</span>
                </label>
                <Input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                Min Stock Threshold
                <span className="text-[9px] lowercase font-normal italic opacity-60 text-amber-500/80 flex items-center gap-1"><AlertCircle size={10} /> trigger alert</span>
              </label>
              <Input
                type="number"
                name="minStockThreshold"
                value={formData.minStockThreshold}
                onChange={handleInputChange}
                min="0"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06]">
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
              disabled={isLoading || !formData.name || !formData.category}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-900/20"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
