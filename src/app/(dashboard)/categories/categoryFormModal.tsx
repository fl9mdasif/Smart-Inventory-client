"use client";

import { TCategory } from "@/types/common";
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ImageUploader } from "@/services/ImageUploader";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: TCategory) => void;
  category: TCategory | null;
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

const CategoryFormModal = ({
  isOpen,
  onClose,
  onSave,
  category,
  isLoading,
}: CategoryFormModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail: "",
    isActive: true,
    slug: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name,
          slug: category.name.toLowerCase(),
          description: category.description || "",
          thumbnail: category.thumbnail || "",
          isActive: category.isActive ?? true,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          thumbnail: "",
          isActive: true,
          slug: "",

        });
      }
    }
  }, [category, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && !category) {
        next.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return next;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const categoryData: TCategory = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      thumbnail: formData.thumbnail,
      isActive: formData.isActive,
    };
    onSave(categoryData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">
            {category ? "Edit Category" : "Create New Category"}
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
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Category Icon / Image
            </label>
            <ImageUploader
              onUploadSuccess={handleImageUpload}
              initialImageUrl={formData.thumbnail}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Category Name
              </label>
              <Input
                name="name"
                placeholder="e.g. Spices, Oils, Seeds"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Brief description of this category..."
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>



            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded border-white/[0.1] bg-[#161b27] text-teal-600 focus:ring-teal-500/30 transition-all cursor-pointer"
                disabled={isLoading}
              />
              <label
                htmlFor="isActive"
                className="text-sm text-slate-300 cursor-pointer select-none"
              >
                Mark as Active
              </label>
            </div>
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
              disabled={isLoading || !formData.name}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-900/20"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
