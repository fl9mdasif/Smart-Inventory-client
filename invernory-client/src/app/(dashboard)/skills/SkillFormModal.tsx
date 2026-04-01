// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { X, Loader2, ImageIcon } from "lucide-react";
// import { TSkill } from "@/types";
// import { ImageUploader } from "@/services/ImageUploader";

// interface SkillFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: TSkill) => void;
//   skill: TSkill | null;
//   isLoading: boolean;
// }

// const inputCls =
//   "w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors";

// const labelCls = "block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5";

// const SkillFormModal = ({ isOpen, onClose, onSave, skill, isLoading }: SkillFormModalProps) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "Frontend",
//     level: 80,
//     image: "",
//     isSelect: false,
//   });

//   useEffect(() => {
//     if (isOpen) {
//       if (skill) {
//         setFormData({
//           name: skill.name,
//           category: skill.category,
//           level: skill.level ?? 80,
//           image: skill.image ?? "",
//           isSelect: skill.isSelect ?? false,
//         });
//       } else {
//         setFormData({ name: "", category: "Frontend", level: 80, image: "", isSelect: false });
//       }
//     }
//   }, [skill, isOpen]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isLoading) return;
//     onSave({ ...formData, level: Number(formData.level) } as TSkill);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
//       <div className="w-full max-w-lg m-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden">
//         {/* Modal Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
//           <h2 className="text-base font-semibold text-white">
//             {skill ? "Edit Skill" : "Add New Skill"}
//           </h2>
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
//           {/* Image Uploader */}
//           <div>
//             <label className={labelCls}>Skill Icon / Image</label>
//             <ImageUploader
//               onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, image: url }))}
//               initialImageUrl={formData.image}
//             />
//             {!formData.image && (
//               <p className="flex items-center gap-1 mt-1 text-amber-500/80 text-xs">
//                 <ImageIcon size={12} /> Image URL is required.
//               </p>
//             )}
//           </div>

//           {/* Name */}
//           <div>
//             <label className={labelCls}>Skill Name</label>
//             <input
//               name="name"
//               placeholder="e.g. React, Node.js, Docker"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//               className={inputCls}
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className={labelCls}>Category</label>
//             <select name="category" value={formData.category} onChange={handleChange} disabled={isLoading} className={inputCls}>
//               <option>Frontend</option>
//               <option>Backend</option>
//               <option>Database</option>
//               <option>DevOps</option>
//               <option>Tools</option>
//               <option>Language</option>
//               <option>AI</option>
//               <option>Other</option>
//             </select>
//           </div>

//           {/* Level */}
//           <div>
//             <label className={labelCls}>
//               Proficiency Level — <span className="text-teal-400">{formData.level}%</span>
//             </label>
//             <input
//               type="range"
//               name="level"
//               min={0}
//               max={100}
//               step={5}
//               value={formData.level}
//               onChange={handleChange}
//               disabled={isLoading}
//               className="w-full accent-teal-500 cursor-pointer"
//             />
//             <div className="flex justify-between text-xs text-slate-600 mt-1">
//               <span>Beginner</span>
//               <span>Intermediate</span>
//               <span>Expert</span>
//             </div>
//           </div>

//           {/* Is Select */}
//           <label className="flex items-center gap-3 cursor-pointer group">
//             <input
//               type="checkbox"
//               name="isSelect"
//               checked={formData.isSelect}
//               onChange={handleChange}
//               disabled={isLoading}
//               className="w-4 h-4 rounded accent-teal-500"
//             />
//             <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
//               Feature on portfolio (highlighted skill)
//             </span>
//           </label>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.06] transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading || !formData.image}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isLoading && <Loader2 size={14} className="animate-spin" />}
//               {isLoading ? (skill ? "Saving..." : "Creating...") : skill ? "Save Changes" : "Add Skill"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SkillFormModal;
