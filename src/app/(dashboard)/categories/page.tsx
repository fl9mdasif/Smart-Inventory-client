"use client";

import { useState } from "react";
import { PlusCircle, Loader2, Layers, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { TCategory } from "@/types/common";
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "@/redux/api/categoryApi";
import CategoryFormModal from "./categoryFormModal";
import Image from "next/image";

const statusStyle: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const CategoriesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);

    const { data: categoriesData, isLoading, refetch } = useGetAllCategoriesQuery({});
    const categories: TCategory[] = (categoriesData as any)?.data ?? [];
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const handleOpenCreate = () => { setEditingCategory(null); setIsModalOpen(true); };
    const handleOpenEdit = (category: TCategory) => { setEditingCategory(category); setIsModalOpen(true); };
    const handleClose = () => { setIsModalOpen(false); setEditingCategory(null); };

    const handleSave = async (data: TCategory) => {
        const payload = { ...data };
        delete payload._id;
        delete payload.createdAt;
        delete payload.updatedAt;
        try {
            if (editingCategory?._id) {
                await updateCategory({ id: editingCategory._id, data: payload }).unwrap();
                toast.success("Category updated!");
            } else {
                await createCategory(payload).unwrap();
                toast.success("Category created!");
            }
            handleClose();
            refetch();
        } catch (err: unknown) {
            const apiErr = err as { data?: { message?: string } };
            toast.error(apiErr.data?.message || "Failed to save category.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted.");
            refetch();
        } catch (err: unknown) {
            const apiErr = err as { data?: { message?: string } };
            toast.error(apiErr.data?.message || "Failed to delete category.");
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
                            <Layers className="w-5 h-5 text-teal-400" />
                        </div>
                        Categories
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {categories?.length || 0} categor{categories?.length !== 1 ? "ies" : "y"} total
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/30"
                >
                    <PlusCircle size={16} />
                    Add Category
                </button>
            </div>

            <div className="h-px bg-gradient-to-r from-teal-500/20 via-white/[0.06] to-transparent" />

            {/* Table */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden shadow-2xl">
                {(categories?.length || 0) === 0 ? (
                    <div className="py-16 text-center">
                        <div className="mx-auto w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                            <Layers className="w-6 h-6 text-teal-400" />
                        </div>
                        <p className="text-slate-400 font-medium whitespace-pre-wrap">No categories found.</p>
                        <p className="text-xs text-slate-500 mt-1">Click the Add Category button to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Category</th>
                                    <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Description</th>
                                    <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Status</th>
                                    <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {categories?.map((category: TCategory) => (
                                    <tr key={category._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {category.thumbnail ? (
                                                    <Image src={category.thumbnail} alt={category.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                                        <Layers size={16} className="text-slate-600" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-slate-200">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-slate-400 text-xs truncate max-w-[200px]" title={category.description}>
                                                {category.description || "No description"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${category.isActive ? statusStyle.active : statusStyle.inactive}`}>
                                                {category.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(category)}
                                                    className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-all"
                                                    title="Edit Category"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => category._id && handleDelete(category._id)}
                                                    disabled={isDeleting}
                                                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all disabled:opacity-50"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onSave={handleSave}
                category={editingCategory}
                isLoading={isCreating || isUpdating}
            />
        </div>
    );
};

export default CategoriesPage;
