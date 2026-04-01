// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { PlusCircle, Loader2, Code2, Edit, Trash2, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import { TSkill } from "@/types";
// import {
//   useGetAllSkillsQuery,
//   useCreateSkillMutation,
//   useUpdateSkillMutation,
//   useDeleteSkillMutation,
// } from "@/redux/api/orderApi";
// import SkillFormModal from "./SkillFormModal";
// import Image from "next/image";

// const categoryColors: Record<string, string> = {
//   Frontend: "bg-teal-500/10 text-teal-400 border-teal-500/20",
//   Backend: "bg-violet-500/10 text-violet-400 border-violet-500/20",
//   Database: "bg-amber-500/10 text-amber-400 border-amber-500/20",
//   DevOps: "bg-blue-500/10 text-blue-400 border-blue-500/20",
//   Tools: "bg-orange-500/10 text-orange-400 border-orange-500/20",
//   Language: "bg-pink-500/10 text-pink-400 border-pink-500/20",
//   AI: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
// };

// const SkillsPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSkill, setEditingSkill] = useState<TSkill | null>(null);

//   const { data: skills, isLoading } = useGetAllSkillsQuery({});


//   const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
//   const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();
//   const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

//   const handleOpenCreate = () => { setEditingSkill(null); setIsModalOpen(true); };
//   const handleOpenEdit = (skill: TSkill) => { setEditingSkill(skill); setIsModalOpen(true); };
//   const handleClose = () => { setIsModalOpen(false); setEditingSkill(null); };

//   const handleSave = async (data: TSkill) => {
//     const payload = { ...data };
//     delete payload._id;
//     delete payload.createdAt;
//     delete payload.updatedAt;
//     try {
//       if (editingSkill?._id) {
//         console.log("Updating skill ID:", editingSkill._id, "payload:", payload);
//         await updateSkill({ id: editingSkill._id, data: payload }).unwrap();
//         toast.success("Skill updated!");
//       } else {
//         await createSkill(payload).unwrap();
//         toast.success("Skill created!");
//       }
//       handleClose();
//     } catch (err: any) {
//       console.error("Update error:", err);
//       toast.error(err?.message ?? err?.data?.message ?? "Failed to save skill.");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Delete this skill?")) return;
//     try {
//       await deleteSkill(id).unwrap();
//       toast.success("Skill deleted.");
//     } catch (err: any) {
//       toast.error(err?.data?.message ?? "Failed to delete skill.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
//             <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
//               <Code2 className="w-5 h-5 text-amber-400" />
//             </div>
//             Skills
//           </h1>
//           <p className="text-slate-500 text-sm mt-1">
//             {skills.length} skill{skills.length !== 1 ? "s" : ""} listed
//           </p>
//         </div>
//         <button
//           onClick={handleOpenCreate}
//           className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/30"
//         >
//           <PlusCircle size={16} />
//           Add Skill
//         </button>
//       </div>

//       <div className="h-px bg-gradient-to-r from-amber-500/20 via-white/[0.06] to-transparent" />

//       {/* Table */}
//       <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
//         {skills.length === 0 ? (
//           <div className="py-16 text-center">
//             <div className="mx-auto w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
//               <Code2 className="w-6 h-6 text-amber-400" />
//             </div>
//             <p className="text-slate-300 font-medium">No skills yet</p>
//             <p className="text-slate-500 text-sm mt-1">Click "Add Skill" to get started.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead>
//                 <tr className="border-b border-white/[0.06]">
//                   <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Skill</th>
//                   <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Category</th>
//                   <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Level</th>
//                   <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold">Featured</th>
//                   <th className="px-5 py-3 text-xs uppercase tracking-widest text-slate-500 font-semibold text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-white/[0.04]">
//                 {skills.map((skill: TSkill) => (
//                   <tr key={skill._id} className="hover:bg-white/[0.02] transition-colors group">
//                     <td className="px-5 py-3.5">
//                       <div className="flex items-center gap-3">
//                         {skill.image ? (
//                           <Image src={skill.image} alt={skill.name} width={32} height={32} className="w-8 h-8 rounded-lg object-cover border border-white/10" />
//                         ) : (
//                           <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
//                             <Code2 size={14} className="text-slate-600" />
//                           </div>
//                         )}
//                         <span className="font-medium text-slate-200">{skill.name}</span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[skill.category] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
//                         {skill.category}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5 w-40">
//                       <div className="flex items-center gap-2">
//                         <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-teal-500"
//                             style={{ width: `${skill.level ?? 0}%` }}
//                           />
//                         </div>
//                         <span className="text-xs text-slate-500 w-8">{skill.level ?? 0}%</span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       {skill.isSelect ? (
//                         <CheckCircle size={16} className="text-teal-400" />
//                       ) : (
//                         <span className="text-slate-700 text-xs">—</span>
//                       )}
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleOpenEdit(skill)}
//                           className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
//                           title="Edit"
//                         >
//                           <Edit size={15} />
//                         </button>
//                         <button
//                           onClick={() => skill._id && handleDelete(skill._id)}
//                           disabled={isDeleting}
//                           className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
//                           title="Delete"
//                         >
//                           <Trash2 size={15} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <SkillFormModal
//         isOpen={isModalOpen}
//         onClose={handleClose}
//         onSave={handleSave}
//         skill={editingSkill}
//         isLoading={isCreating || isUpdating}
//       />
//     </div>
//   );
// };

// export default SkillsPage;
