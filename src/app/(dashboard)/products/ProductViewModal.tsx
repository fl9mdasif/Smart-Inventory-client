"use client";

import { TProduct } from "@/types/common";
import { X, Package, Tag, BarChart3, Clock, Layout, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct | null;
}

const DetailItem = ({ icon: Icon, label, value, colorClass = "text-slate-300" }: { icon: any, label: string, value: string | number, colorClass?: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
    <div className="p-2 rounded-lg bg-white/[0.04] text-slate-500">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className={`text-sm font-medium ${colorClass}`}>{value || "—"}</p>
    </div>
  </div>
);

const ProductViewModal = ({ isOpen, onClose, product }: ProductViewModalProps) => {
  if (!isOpen || !product) return null;

  const statusColors: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    low_stock: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    out_of_stock: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const stockPercentage = Math.round(((product.stockQuantity || 0) / ((product.stockQuantity || 0) + (product.minStockThreshold || 5))) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Package size={20} className="text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">Product Details</h2>
              <p className="text-slate-500 text-xs mt-1">Full specifications and inventory status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Image & Badge */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-square rounded-2xl border border-white/[0.08] bg-black/20 overflow-hidden group">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                    <ImageIcon size={48} strokeWidth={1} />
                    <p className="text-xs mt-2">No preview available</p>
                  </div>
                )}
                
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${statusColors[product.status || "active"]}`}>
                  {(product.status || "active").replace("_", " ")}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Stock Level</span>
                  <span className={`text-xs font-bold ${product.stockQuantity === 0 ? "text-rose-400" : "text-teal-400"}`}>
                    {stockPercentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, stockPercentage)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Info Fields */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2 underline decoration-teal-500/30 underline-offset-8 decoration-2">{product.name}</h3>
                <code className="text-[10px] font-mono text-slate-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">SLUG: {product.slug}</code>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <DetailItem icon={Tag} label="Category" value={(product.category as any)?.name || "Uncategorized"} />
                <DetailItem icon={BarChart3} label="Price" value={`৳${(product.price || 0).toLocaleString()}`} colorClass="text-teal-400 font-bold" />
                <DetailItem icon={Layout} label="Stock" value={`${product.stockQuantity || 0} units`} />
                <DetailItem icon={Clock} label="Min. Threshold" value={`${product.minStockThreshold || 0} units`} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <FileText size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Description</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] max-h-48 overflow-y-auto">
                  <p className="text-sm text-slate-400 leading-relaxed italic whitespace-pre-wrap">
                    {product.description || "No description provided for this product."}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-between text-[10px] text-slate-600 border-t border-white/[0.04]">
                <span>LAST UPDATED: {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "Never"}</span>
                <span>ID: {(product as any)._id || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
