"use client";

import { TProduct, TOrder, TShippingAddress } from "@/types/common";
import { useEffect, useState } from "react";
import { X, Loader2, ShoppingCart, User, MapPin, Phone, Hash, Tag, AlertCircle } from "lucide-react";

interface OrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: any) => void;
  product: TProduct | null;
  isLoading: boolean;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors"
  />
);

const OrderCreateModal = ({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading,
}: OrderCreateModalProps) => {
  const [formData, setFormData] = useState({
    customerName: "",
    quantity: 1,
    discount: 0,
    address: "",
    city: "",
    district: "",
    phone: "",
  });

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (product) {
      const total = (formData.quantity * (product.price || 0)) - formData.discount;
      setSubtotal(Math.max(0, total));
    }
  }, [formData.quantity, formData.discount, product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'discount' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || isLoading) return;

    if (formData.quantity > (product.stockQuantity || 0)) {
        alert("Insufficient stock!");
        return;
    }

    const shippingAddress: TShippingAddress = {
      fullName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      district: formData.district,
    } as any;

    const orderData = {
      productId: (product as any)._id,
      productName: product.name,
      customerName: formData.customerName,
      quantity: formData.quantity,
      discount: formData.discount,
      shippingAddress,
      subtotal: subtotal,
      orderStatus: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order placed from dashboard', changedAt: new Date() }]
    };

    onSave(orderData);
  };

  if (!isOpen || !product) return null;

  const isLowStock = (product.stockQuantity ?? 0) <= (product.minStockThreshold ?? 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-teal-500/5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShoppingCart size={18} className="text-teal-500" />
            Place Order
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Product Summary Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                    <ShoppingCart size={20} className="text-teal-400" />
                </div>
                <div>
                   <h3 className="font-medium text-slate-200">{product.name}</h3>
                   <p className="text-xs text-slate-500">Unit Price: <span className="text-teal-400 font-bold">${product.price?.toFixed(2)}</span></p>
                </div>
             </div>
             <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isLowStock ? 'text-amber-400 border-amber-500/30 bg-amber-500/5' : 'text-slate-500 border-white/10'}`}>
                    {product.stockQuantity} in stock
                </span>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Customer Info */}
             <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> Customer Information
                </h4>
                <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Full Name</label>
                    <Input name="customerName" placeholder="John Doe" value={formData.customerName} onChange={handleInputChange} required disabled={isLoading} />
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-slate-600 mb-1">Phone Number</label>
                    <Input name="phone" placeholder="+1..." value={formData.phone} onChange={handleInputChange} required disabled={isLoading} />
                </div>
             </div>

             {/* Order Specs */}
             <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Hash size={12} /> Order Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Quantity</label>
                        <Input type="number" name="quantity" min="1" max={product.stockQuantity} value={formData.quantity} onChange={handleInputChange} required disabled={isLoading} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Discount ($)</label>
                        <Input type="number" name="discount" min="0" value={formData.discount} onChange={handleInputChange} disabled={isLoading} />
                    </div>
                </div>
             </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-4 pt-2">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} /> Shipping Address
             </h4>
             <Input name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} required disabled={isLoading} />
             <div className="grid grid-cols-2 gap-3">
                <Input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required disabled={isLoading} />
                <Input name="district" placeholder="District" value={formData.district} onChange={handleInputChange} required disabled={isLoading} />
             </div>
          </div>

          {/* Subtotal Footer */}
          <div className="p-4 rounded-xl bg-teal-500/[0.03] border border-teal-500/10 flex items-center justify-between">
            <div className="text-xs text-slate-400">
                Calculation: ({formData.quantity} × ${product.price}) - ${formData.discount}
            </div>
            <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Grand Total</p>
                <p className="text-2xl font-bold text-teal-400">${subtotal.toFixed(2)}</p>
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
              disabled={isLoading || !formData.customerName || formData.quantity <= 0}
              className="flex items-center gap-2 px-8 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-900/40"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Processing..." : "Confirm & Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCreateModal;
