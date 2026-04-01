"use client";

import { TProject } from "@/types"; // Import TProjectStatus too
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react"; // Import Loader2 // Adjust path if needed
import { ImageUploader } from "@/services/ImageUploader";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: TProject) => void;
  project: TProject | null;
  isLoading: boolean; // **[NEW]** Prop to indicate loading state
}

// Reusable UI Components (Keep your Input, Textarea, Select components as they are)
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
    rows={4}
  />
);


const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    children: React.ReactNode;
  },
) => (
  <select
    {...props}
    className="w-full px-3 py-2 rounded-lg bg-[#161b27] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 disabled:opacity-50 transition-colors"
  />
);


const ProjectFormModal = ({
  isOpen,
  onClose,
  onSave,
  project,
  isLoading, // **[NEW]** Destructure isLoading
}: ProjectFormModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    category: "Full Stack",
    image: "", // Initialize image as empty string
    gallery: "",
    status: "In Development", // Use the specific type
    liveUrl: "",
    githubClient: "",
    githubServer: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          technologies: project.technologies.join(", "),
          category: project.category,
          image: project.image || "",
          gallery: project.gallery?.join("\n") || "",
          status: project.status || "In Development",
          liveUrl: project.liveUrl || "",
          githubClient: project.githubClient || "",
          githubServer: project.githubServer || "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          technologies: "",
          category: "Full Stack",
          image: "",
          gallery: "",
          status: "In Development",
          liveUrl: "",
          githubClient: "",
          githubServer: "",
        });
      }
    }
  }, [project, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent submission if already loading

    const projectData: TProject = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: formData.status || "Live",
      image: formData.image,
      liveUrl: formData.liveUrl || undefined, // Send undefined if empty
      githubClient: formData.githubClient || undefined, // Send undefined if empty
      githubServer: formData.githubServer || undefined, // Send undefined if empty
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gallery: formData.gallery
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      createdAt: "",
      updatedAt: "",
    };
    onSave(projectData);
  };

  // **[MODIFIED]** Re-enabled image validation
  // const isFormValid =
  //   formData.title &&
  //   formData.technologies &&
  //   formData.image && // Check if image URL exists
  //   formData.category;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl m-4 rounded-2xl border border-white/[0.08] bg-[#0d1117] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">
            {project ? "Edit Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
              Main Project Image
            </label>

            <ImageUploader
              onUploadSuccess={handleImageUpload}
              initialImageUrl={formData.image}
            />

            {/* Simple validation message */}
            {!formData.image && (
              <p className="text-red-500 text-xs mt-1">Image is required.</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input name="title" placeholder="Project Title" value={formData.title} onChange={handleInputChange} required disabled={isLoading} />
            <Input name="technologies" placeholder="Technologies (comma-separated: Next.js, TypeScript)" value={formData.technologies} onChange={handleInputChange} required disabled={isLoading} />
          </div>
          <Textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleInputChange} required disabled={isLoading} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
              <Select name="category" value={formData.category} onChange={handleInputChange} disabled={isLoading}>
                <option>Full Stack</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Mobile App</option>
                <option>AI</option>
                <option>Tool</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <Select name="status" value={formData.status} onChange={handleInputChange} disabled={isLoading}>
                <option>In Development</option>
                <option>Completed</option>
                <option>Live</option>
                <option>On Hold</option>
              </Select>
            </div>
          </div>

          {/* Image Gallery */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Image Gallery <span className="normal-case text-slate-600">(one URL per line, optional)</span></label>
            <Textarea name="gallery" placeholder="https://.../image1.png" value={formData.gallery} onChange={handleInputChange} rows={3} disabled={isLoading} />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">GitHub Client URL <span className="normal-case text-slate-600">(optional)</span></label>
              <Input name="githubClient" placeholder="https://github.com/..." value={formData.githubClient} onChange={handleInputChange} disabled={isLoading} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">GitHub Server URL <span className="normal-case text-slate-600">(optional)</span></label>
              <Input name="githubServer" placeholder="https://github.com/..." value={formData.githubServer} onChange={handleInputChange} disabled={isLoading} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Live URL <span className="normal-case text-slate-600">(optional)</span></label>
              <Input name="liveUrl" placeholder="https://..." value={formData.liveUrl} onChange={handleInputChange} disabled={isLoading} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button type="button" onClick={onClose} disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.06] transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? (project ? "Saving..." : "Creating...") : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
